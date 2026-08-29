const Message = require("../models/message.model");
const Room = require("../models/room.model");

/*
 * ============================================================
 * CHAT SOCKET HANDLER
 *
 * Message status behaviour:
 *
 * 1. Message sent
 *      -> Sender sees: ✓ Sent
 *
 * 2. Receiver is inside the room but ChatPanel is CLOSED
 *      -> Sender remains: ✓ Sent
 *      -> Receiver gets unread message count
 *
 * 3. Receiver OPENS ChatPanel
 *      -> Receiver's unread messages become seen
 *      -> Sender sees: ✓✓ Seen
 *      -> Receiver unread count becomes 0
 *
 * 4. Receiver already has ChatPanel OPEN
 *      -> New message becomes seen immediately
 *
 * IMPORTANT:
 * Being inside the room does NOT mean the chat is open.
 * Only an explicitly registered ChatPanel is considered open.
 * ============================================================
 */

/*
 * roomId -> Set(socketId)
 *
 * Only sockets whose ChatPanel is currently open are stored.
 */
const openChatSockets = new Map();

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

const normalizeId = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === "object") {
        return (
            value?._id?.toString() ||
            value?.id?.toString() ||
            value?.userId?.toString() ||
            value?.toString() ||
            null
        );
    }

    return value.toString();
};

const getRoomKey = (roomId) => {
    return normalizeId(roomId);
};

const getRoomOpenSockets = (roomId) => {
    const key = getRoomKey(roomId);

    if (!key) {
        return new Set();
    }

    if (!openChatSockets.has(key)) {
        openChatSockets.set(key, new Set());
    }

    return openChatSockets.get(key);
};

const addOpenChatSocket = (roomId, socketId) => {
    const key = getRoomKey(roomId);

    if (!key || !socketId) {
        return;
    }

    const sockets = getRoomOpenSockets(key);

    sockets.add(socketId);
};

const removeOpenChatSocket = (roomId, socketId) => {
    const key = getRoomKey(roomId);

    if (!key || !socketId) {
        return;
    }

    const sockets = openChatSockets.get(key);

    if (!sockets) {
        return;
    }

    sockets.delete(socketId);

    if (sockets.size === 0) {
        openChatSockets.delete(key);
    }
};

const isChatOpenForSocket = (roomId, socketId) => {
    const key = getRoomKey(roomId);

    if (!key || !socketId) {
        return false;
    }

    const sockets = openChatSockets.get(key);

    return sockets?.has(socketId) || false;
};

const removeSocketFromAllOpenChats = (socketId) => {
    if (!socketId) {
        return;
    }

    for (const [roomId, sockets] of openChatSockets.entries()) {
        sockets.delete(socketId);

        if (sockets.size === 0) {
            openChatSockets.delete(roomId);
        }
    }
};

/*
 * Check whether a user belongs to a room.
 */
const isRoomUser = (room, userId) => {
    const normalizedUserId = normalizeId(userId);

    if (!room || !normalizedUserId) {
        return false;
    }

    const isMember = room.members?.some(
        (member) =>
            normalizeId(member) ===
            normalizedUserId
    );

    const isHost =
        normalizeId(room.host) ===
        normalizedUserId;

    return Boolean(isMember || isHost);
};

/*
 * ============================================================
 * GET UNREAD COUNT
 *
 * Count messages sent by other users that this user has not
 * seen yet.
 * ============================================================
 */

const getUnreadCount = async (
    roomId,
    userId
) => {
    if (!roomId || !userId) {
        return 0;
    }

    return Message.countDocuments({
        room: roomId,
        sender: {
            $ne: userId,
        },
        "seenBy.user": {
            $ne: userId,
        },
    });
};

/*
 * Send current unread count to one socket.
 */
const emitUnreadCount = async (
    socket,
    roomId,
    userId
) => {
    try {
        if (!socket || !roomId || !userId) {
            return;
        }

        const count = await getUnreadCount(
            roomId,
            userId
        );

        socket.emit(
            "chat:unread-count",
            {
                roomId,
                count,
            }
        );
    } catch (error) {
        console.error(
            "Unread count error:",
            error
        );
    }
};

/*
 * ============================================================
 * MARK MESSAGES AS SEEN
 *
 * This function is ONLY called when ChatPanel is actually open.
 * ============================================================
 */

const markRoomMessagesAsSeen = async (
    io,
    socket,
    roomId,
    userId
) => {
    if (!roomId || !userId) {
        return;
    }

    /*
     * Security check:
     *
     * This socket must actually have ChatPanel open.
     */
    if (
        !isChatOpenForSocket(
            roomId,
            socket.id
        )
    ) {
        return;
    }

    const unreadMessages =
        await Message.find({
            room: roomId,
            sender: {
                $ne: userId,
            },
            "seenBy.user": {
                $ne: userId,
            },
        }).select("_id sender");

    if (unreadMessages.length === 0) {
        await emitUnreadCount(
            socket,
            roomId,
            userId
        );

        return;
    }

    /*
     * Add delivered + seen entries.
     *
     * Since the ChatPanel is open, the message is considered
     * delivered and seen.
     */
    const now = new Date();

    await Message.updateMany(
        {
            _id: {
                $in: unreadMessages.map(
                    (message) =>
                        message._id
                ),
            },
        },
        {
            $push: {
                deliveredTo: {
                    user: userId,
                    at: now,
                },

                seenBy: {
                    user: userId,
                    at: now,
                },
            },
        }
    );

    /*
     * Notify everyone in the room about seen status.
     */
    for (
        const message of unreadMessages
    ) {
        io.to(roomId).emit(
            "chat:message-status",
            {
                messageId:
                    message._id,
                userId,
                status: "seen",
            }
        );
    }

    /*
     * Chat is now completely caught up.
     */
    socket.emit(
        "chat:unread-count",
        {
            roomId,
            count: 0,
        }
    );
};

/*
 * ============================================================
 * MODULE
 * ============================================================
 */

module.exports = (io, socket) => {
    /*
     * ============================================================
     * OPEN CHAT
     * ============================================================
     */

    socket.on(
        "chat:open",
        async ({ roomId, userId } = {}) => {
            try {
                if (!roomId || !userId) {
                    return;
                }

                const room =
                    await Room.findById(roomId);

                if (!room) {
                    return;
                }

                if (
                    !isRoomUser(
                        room,
                        userId
                    )
                ) {
                    return;
                }

                /*
                 * Store authenticated user information on socket
                 * when available.
                 *
                 * This is also used when a new message is sent.
                 */
                socket.data =
                    socket.data || {};

                socket.data.userId =
                    normalizeId(userId);

                /*
                 * Register ChatPanel as OPEN.
                 */
                addOpenChatSocket(
                    roomId,
                    socket.id
                );

                socket.data.chatOpenRooms =
                    socket.data.chatOpenRooms ||
                    new Set();

                socket.data.chatOpenRooms.add(
                    roomId.toString()
                );

                /*
                 * Opening ChatPanel means all unread messages
                 * currently in this room are now seen.
                 */
                await markRoomMessagesAsSeen(
                    io,
                    socket,
                    roomId,
                    userId
                );
            } catch (error) {
                console.error(
                    "Chat open error:",
                    error
                );
            }
        }
    );

    /*
     * ============================================================
     * CLOSE CHAT
     * ============================================================
     */

    socket.on(
        "chat:close",
        ({ roomId } = {}) => {
            if (!roomId) {
                return;
            }

            /*
             * ChatPanel is no longer open.
             *
             * Future messages must NOT automatically become seen.
             */
            removeOpenChatSocket(
                roomId,
                socket.id
            );

            socket.data?.chatOpenRooms?.delete(
                roomId.toString()
            );
        }
    );

    /*
     * ============================================================
     * SEND MESSAGE
     * ============================================================
     */

    socket.on(
        "chat:send-message",
        async (data) => {
            try {
                const {
                    roomId,
                    message,
                    senderId,
                } = data || {};

                if (
                    !roomId ||
                    !senderId ||
                    !message?.trim()
                ) {
                    return;
                }

                const room =
                    await Room.findById(roomId);

                if (!room) {
                    return;
                }

                if (
                    !isRoomUser(
                        room,
                        senderId
                    )
                ) {
                    return;
                }

                /*
                 * Store user on socket.
                 */
                socket.data =
                    socket.data || {};

                socket.data.userId =
                    normalizeId(senderId);

                /*
                 * IMPORTANT:
                 *
                 * New messages start with NO delivered/seen
                 * recipients.
                 *
                 * Therefore sender initially sees only:
                 *
                 *       ✓
                 *
                 * until the receiver actually opens ChatPanel.
                 */
                const savedMessage =
                    await Message.create({
                        room: roomId,
                        sender: senderId,
                        message: message.trim(),
                        deliveredTo: [],
                        seenBy: [],
                    });

                const populatedMessage =
                    await Message.findById(
                        savedMessage._id
                    ).populate(
                        "sender",
                        "name avatar"
                    );

                if (!populatedMessage) {
                    return;
                }

                /*
                 * =================================================
                 * FIND RECIPIENTS WHO CURRENTLY HAVE CHAT OPEN
                 * =================================================
                 */

                const roomOpenSockets =
                    getRoomOpenSockets(
                        roomId
                    );

                const recipientOpenSockets =
                    Array.from(
                        roomOpenSockets
                    ).filter(
                        (socketId) =>
                            socketId !==
                            socket.id
                    );

                const seenUserIds =
                    new Set();

                for (
                    const socketId of
                        recipientOpenSockets
                ) {
                    const recipientSocket =
                        io.sockets.sockets.get(
                            socketId
                        );

                    if (
                        !recipientSocket
                            ?.data?.userId
                    ) {
                        continue;
                    }

                    const recipientUserId =
                        normalizeId(
                            recipientSocket
                                .data
                                .userId
                        );

                    /*
                     * Never treat sender as recipient.
                     */
                    if (
                        recipientUserId ===
                        normalizeId(
                            senderId
                        )
                    ) {
                        continue;
                    }

                    /*
                     * Make sure the socket's user is actually
                     * a member/host of this room.
                     */
                    if (
                        !isRoomUser(
                            room,
                            recipientUserId
                        )
                    ) {
                        continue;
                    }

                    seenUserIds.add(
                        recipientUserId
                    );
                }

                /*
                 * =================================================
                 * IMMEDIATELY SEEN ONLY FOR OPEN CHAT
                 * =================================================
                 */

                if (
                    seenUserIds.size > 0
                ) {
                    const now =
                        new Date();

                    const statusEntries =
                        Array.from(
                            seenUserIds
                        ).map(
                            (userId) => ({
                                user: userId,
                                at: now,
                            })
                        );

                    await Message.findByIdAndUpdate(
                        savedMessage._id,
                        {
                            $push: {
                                deliveredTo: {
                                    $each:
                                        statusEntries,
                                },

                                seenBy: {
                                    $each:
                                        statusEntries,
                                },
                            },
                        }
                    );
                }

                /*
                 * =================================================
                 * EMIT NEW MESSAGE
                 * =================================================
                 */

                io.to(roomId).emit(
                    "chat:new-message",
                    {
                        _id:
                            populatedMessage._id,

                        sender:
                            populatedMessage
                                .sender
                                .name,

                        senderId:
                            populatedMessage
                                .sender
                                ._id,

                        avatar:
                            populatedMessage
                                .sender
                                .avatar,

                        message:
                            populatedMessage
                                .message,

                        createdAt:
                            populatedMessage
                                .createdAt,

                        deliveredTo:
                            seenUserIds.size > 0
                                ? Array.from(
                                      seenUserIds
                                  ).map(
                                      (userId) => ({
                                          user:
                                              userId,
                                          at:
                                              new Date(),
                                      })
                                  )
                                : [],

                        seenBy:
                            seenUserIds.size > 0
                                ? Array.from(
                                      seenUserIds
                                  ).map(
                                      (userId) => ({
                                          user:
                                              userId,
                                          at:
                                              new Date(),
                                      })
                                  )
                                : [],
                    }
                );

                /*
                 * =================================================
                 * SEND SEEN STATUS
                 *
                 * Only users with ChatPanel open are included.
                 * =================================================
                 */

                for (
                    const userId of
                        seenUserIds
                ) {
                    io.to(roomId).emit(
                        "chat:message-status",
                        {
                            messageId:
                                populatedMessage
                                    ._id,

                            userId,

                            status:
                                "seen",
                        }
                    );
                }

                /*
                 * =================================================
                 * UPDATE UNREAD COUNTS
                 *
                 * Every recipient whose ChatPanel is CLOSED
                 * should receive an updated unread count.
                 * =================================================
                 */

                const roomSockets =
                    io.sockets.adapter.rooms.get(
                        roomId.toString()
                    );

                if (roomSockets) {
                    for (
                        const socketId of
                            roomSockets
                    ) {
                        const recipientSocket =
                            io.sockets.sockets.get(
                                socketId
                            );

                        if (
                            !recipientSocket
                                ?.data?.userId
                        ) {
                            continue;
                        }

                        const recipientUserId =
                            normalizeId(
                                recipientSocket
                                    .data
                                    .userId
                            );

                        /*
                         * Do not send unread count to sender.
                         */
                        if (
                            recipientUserId ===
                            normalizeId(
                                senderId
                            )
                        ) {
                            continue;
                        }

                        /*
                         * If ChatPanel is open, the message was
                         * already seen, so no unread badge.
                         */
                        if (
                            isChatOpenForSocket(
                                roomId,
                                socketId
                            )
                        ) {
                            continue;
                        }

                        await emitUnreadCount(
                            recipientSocket,
                            roomId,
                            recipientUserId
                        );
                    }
                }
            } catch (error) {
                console.error(
                    "Chat message error:",
                    error
                );
            }
        }
    );

    /*
     * ============================================================
     * MESSAGE DELIVERED
     *
     * Kept for compatibility with the existing ChatPanel.
     *
     * IMPORTANT:
     *
     * Delivered does NOT mean seen.
     *
     * However, for the requested WhatsApp-like behaviour,
     * a message is not marked delivered merely because the
     * receiver is somewhere inside the room.
     *
     * If ChatPanel is closed, it stays Sent.
     *
     * If ChatPanel is open, the message is immediately seen.
     * ============================================================
     */

    socket.on(
        "chat:message-delivered",
        async (data) => {
            try {
                const {
                    roomId,
                    messageId,
                    userId,
                } = data || {};

                if (
                    !roomId ||
                    !messageId ||
                    !userId
                ) {
                    return;
                }

                /*
                 * Delivered event is only accepted when ChatPanel
                 * is actually open.
                 *
                 * This prevents room presence from turning
                 * Sent into Delivered.
                 */
                if (
                    !isChatOpenForSocket(
                        roomId,
                        socket.id
                    )
                ) {
                    return;
                }

                const room =
                    await Room.findById(roomId);

                if (!room) {
                    return;
                }

                if (
                    !isRoomUser(
                        room,
                        userId
                    )
                ) {
                    return;
                }

                const message =
                    await Message.findById(
                        messageId
                    );

                if (!message) {
                    return;
                }

                if (
                    normalizeId(
                        message.room
                    ) !==
                    normalizeId(roomId)
                ) {
                    return;
                }

                /*
                 * Sender cannot mark own message delivered.
                 */
                if (
                    normalizeId(
                        message.sender
                    ) ===
                    normalizeId(userId)
                ) {
                    return;
                }

                /*
                 * If ChatPanel is open, this message should be
                 * seen rather than merely delivered.
                 *
                 * The dedicated message-seen event handles it.
                 *
                 * We therefore keep this event as a compatibility
                 * event and only add Delivered if it is genuinely
                 * missing.
                 */
                const alreadyDelivered =
                    message.deliveredTo?.some(
                        (entry) =>
                            normalizeId(
                                entry?.user?._id ||
                                    entry?.user ||
                                    entry
                            ) ===
                            normalizeId(userId)
                    );

                if (
                    alreadyDelivered
                ) {
                    return;
                }

                message.deliveredTo =
                    message.deliveredTo ||
                    [];

                message.deliveredTo.push({
                    user: userId,
                    at: new Date(),
                });

                await message.save();

                io.to(roomId).emit(
                    "chat:message-status",
                    {
                        messageId,
                        userId,
                        status: "delivered",
                    }
                );
            } catch (error) {
                console.error(
                    "Message delivered error:",
                    error
                );
            }
        }
    );

    /*
     * ============================================================
     * MESSAGE SEEN
     *
     * Only valid when ChatPanel is actually open.
     * ============================================================
     */

    socket.on(
        "chat:message-seen",
        async (data) => {
            try {
                const {
                    roomId,
                    messageId,
                    userId,
                } = data || {};

                if (
                    !roomId ||
                    !messageId ||
                    !userId
                ) {
                    return;
                }

                /*
                 * The socket must have ChatPanel open.
                 */
                if (
                    !isChatOpenForSocket(
                        roomId,
                        socket.id
                    )
                ) {
                    return;
                }

                const room =
                    await Room.findById(roomId);

                if (!room) {
                    return;
                }

                if (
                    !isRoomUser(
                        room,
                        userId
                    )
                ) {
                    return;
                }

                const message =
                    await Message.findById(
                        messageId
                    );

                if (!message) {
                    return;
                }

                if (
                    normalizeId(
                        message.room
                    ) !==
                    normalizeId(roomId)
                ) {
                    return;
                }

                /*
                 * Sender cannot see own message.
                 */
                if (
                    normalizeId(
                        message.sender
                    ) ===
                    normalizeId(userId)
                ) {
                    return;
                }

                const alreadySeen =
                    message.seenBy?.some(
                        (entry) =>
                            normalizeId(
                                entry?.user?._id ||
                                    entry?.user ||
                                    entry
                            ) ===
                            normalizeId(userId)
                    );

                if (
                    alreadySeen
                ) {
                    return;
                }

                message.deliveredTo =
                    message.deliveredTo ||
                    [];

                message.seenBy =
                    message.seenBy ||
                    [];

                /*
                 * If delivered status does not exist,
                 * add it first.
                 */
                const alreadyDelivered =
                    message.deliveredTo.some(
                        (entry) =>
                            normalizeId(
                                entry?.user?._id ||
                                    entry?.user ||
                                    entry
                            ) ===
                            normalizeId(userId)
                    );

                const now =
                    new Date();

                if (
                    !alreadyDelivered
                ) {
                    message.deliveredTo.push({
                        user: userId,
                        at: now,
                    });
                }

                message.seenBy.push({
                    user: userId,
                    at: now,
                });

                await message.save();

                /*
                 * Tell everyone in room that this message
                 * has been seen.
                 */
                io.to(roomId).emit(
                    "chat:message-status",
                    {
                        messageId,
                        userId,
                        status: "seen",
                    }
                );

                /*
                 * Keep receiver unread badge synchronized.
                 */
                socket.emit(
                    "chat:unread-count",
                    {
                        roomId,
                        count:
                            await getUnreadCount(
                                roomId,
                                userId
                            ),
                    }
                );
            } catch (error) {
                console.error(
                    "Message seen error:",
                    error
                );
            }
        }
    );

    /*
     * ============================================================
     * DELETE MESSAGE
     * ============================================================
     */

    socket.on(
        "chat:delete-message",
        async (data) => {
            try {
                const {
                    roomId,
                    messageId,
                    senderId,
                } = data || {};

                if (
                    !roomId ||
                    !messageId ||
                    !senderId
                ) {
                    return;
                }

                const room =
                    await Room.findById(roomId);

                if (!room) {
                    return;
                }

                const message =
                    await Message.findById(
                        messageId
                    );

                if (!message) {
                    return;
                }

                /*
                 * Message must belong to this room.
                 */
                if (
                    normalizeId(
                        message.room
                    ) !==
                    normalizeId(roomId)
                ) {
                    return;
                }

                /*
                 * Check host.
                 */
                const isHost =
                    normalizeId(room.host) ===
                    normalizeId(senderId);

                /*
                 * Check member.
                 */
                const isMember =
                    room.members?.some(
                        (member) =>
                            normalizeId(
                                member
                            ) ===
                            normalizeId(
                                senderId
                            )
                    );

                /*
                 * Requester must be host or member.
                 */
                if (
                    !isHost &&
                    !isMember
                ) {
                    return;
                }

                /*
                 * Member can only delete their own message.
                 */
                const isMessageOwner =
                    normalizeId(
                        message.sender
                    ) ===
                    normalizeId(senderId);

                if (
                    !isHost &&
                    !isMessageOwner
                ) {
                    return;
                }

                /*
                 * Delete from database.
                 */
                await Message.findByIdAndDelete(
                    messageId
                );

                /*
                 * Notify everyone.
                 */
                io.to(roomId).emit(
                    "chat:message-deleted",
                    {
                        messageId,
                    }
                );
            } catch (error) {
                console.error(
                    "Delete chat message error:",
                    error
                );
            }
        }
    );

    /*
     * ============================================================
     * TYPING STARTED
     * ============================================================
     */

    socket.on(
        "chat:typing",
        ({
            roomId,
            user,
            userId,
        } = {}) => {
            if (!roomId) {
                return;
            }

            socket
                .to(roomId)
                .emit(
                    "chat:user-typing",
                    {
                        user,
                        userId,
                    }
                );
        }
    );

    /*
     * ============================================================
     * TYPING STOPPED
     * ============================================================
     */

    socket.on(
        "chat:stop-typing",
        ({
            roomId,
            user,
            userId,
        } = {}) => {
            if (!roomId) {
                return;
            }

            socket
                .to(roomId)
                .emit(
                    "chat:user-stop-typing",
                    {
                        user,
                        userId,
                    }
                );
        }
    );

    /*
     * ============================================================
     * SOCKET DISCONNECT
     * ============================================================
     *
     * A disconnected socket must NEVER remain registered as
     * having ChatPanel open.
     * ============================================================
     */

    socket.on(
        "disconnect",
        () => {
            removeSocketFromAllOpenChats(
                socket.id
            );

            if (
                socket.data?.chatOpenRooms
            ) {
                socket.data.chatOpenRooms.clear();
            }
        }
    );
};