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
 *      -> Receiver's unread messages become Seen
 *      -> Sender sees: ✓✓ Seen
 *      -> Receiver unread count becomes 0
 *
 * 4. Receiver already has ChatPanel OPEN
 *      -> New message becomes Seen immediately
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
 * ADD MESSAGE STATUS SAFELY
 *
 * Prevents duplicate delivered/seen entries for the same user.
 * ============================================================
 */

const addDeliveredStatus = async (
    message,
    userId,
    at = new Date()
) => {
    const normalizedUserId =
        normalizeId(userId);

    if (!normalizedUserId) {
        return false;
    }

    message.deliveredTo =
        message.deliveredTo || [];

    const alreadyDelivered =
        message.deliveredTo.some(
            (entry) =>
                normalizeId(
                    entry?.user?._id ||
                        entry?.user ||
                        entry
                ) === normalizedUserId
        );

    if (alreadyDelivered) {
        return false;
    }

    message.deliveredTo.push({
        user: userId,
        at,
    });

    return true;
};

const addSeenStatus = async (
    message,
    userId,
    at = new Date()
) => {
    const normalizedUserId =
        normalizeId(userId);

    if (!normalizedUserId) {
        return false;
    }

    message.seenBy =
        message.seenBy || [];

    const alreadySeen =
        message.seenBy.some(
            (entry) =>
                normalizeId(
                    entry?.user?._id ||
                        entry?.user ||
                        entry
                ) === normalizedUserId
        );

    if (alreadySeen) {
        return false;
    }

    message.seenBy.push({
        user: userId,
        at,
    });

    return true;
};

/*
 * ============================================================
 * MARK ROOM MESSAGES AS SEEN
 *
 * Called ONLY when ChatPanel is actually open.
 * ============================================================
 */

const markRoomMessagesAsSeen = async (
    io,
    socket,
    roomId,
    userId
) => {
    if (!roomId || !userId || !socket) {
        return;
    }

    /*
     * The socket must have explicitly registered the ChatPanel
     * as open.
     */
    if (
        !isChatOpenForSocket(
            roomId,
            socket.id
        )
    ) {
        return;
    }

    const normalizedUserId =
        normalizeId(userId);

    const unreadMessages =
        await Message.find({
            room: roomId,
            sender: {
                $ne: normalizedUserId,
            },
            "seenBy.user": {
                $ne: normalizedUserId,
            },
        }).select(
            "_id sender deliveredTo seenBy"
        );

    if (unreadMessages.length === 0) {
        await emitUnreadCount(
            socket,
            roomId,
            normalizedUserId
        );

        return;
    }

    const statusUpdates = [];
    const now = new Date();

    for (
        const message of unreadMessages
    ) {
        /*
         * Add delivered status if missing.
         */
        const deliveredAdded =
            await addDeliveredStatus(
                message,
                normalizedUserId,
                now
            );

        /*
         * Add seen status.
         */
        const seenAdded =
            await addSeenStatus(
                message,
                normalizedUserId,
                now
            );

        if (
            deliveredAdded ||
            seenAdded
        ) {
            await message.save();
        }

        /*
         * Notify only if the message actually
         * became seen.
         */
        if (seenAdded) {
            statusUpdates.push(
                message._id
            );
        }
    }

    /*
     * Notify everyone in the room.
     */
    for (
        const messageId of statusUpdates
    ) {
        io.to(roomId).emit(
            "chat:message-status",
            {
                messageId,
                userId: normalizedUserId,
                status: "seen",
            }
        );
    }

    /*
     * Chat is now caught up.
     */
    await emitUnreadCount(
        socket,
        roomId,
        normalizedUserId
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

                const normalizedUserId =
                    normalizeId(userId);

                /*
                 * Store authenticated user on socket.
                 */
                socket.data =
                    socket.data || {};

                socket.data.userId =
                    normalizedUserId;

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
                 * Opening ChatPanel means all unread
                 * messages are seen.
                 */
                await markRoomMessagesAsSeen(
                    io,
                    socket,
                    roomId,
                    normalizedUserId
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

                const normalizedSenderId =
                    normalizeId(senderId);

                if (
                    !isRoomUser(
                        room,
                        normalizedSenderId
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
                    normalizedSenderId;

                /*
                 * New messages ALWAYS begin as Sent.
                 *
                 * Only an actual receiver socket with ChatPanel
                 * open can immediately move it to Seen.
                 */
                const savedMessage =
                    await Message.create({
                        room: roomId,
                        sender: normalizedSenderId,
                        message:
                            message.trim(),
                        deliveredTo: [],
                        seenBy: [],
                    });

                /*
                 * =================================================
                 * FIND USERS WITH CHAT PANEL OPEN
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
                     * Never treat sender as receiver.
                     */
                    if (
                        recipientUserId ===
                        normalizedSenderId
                    ) {
                        continue;
                    }

                    /*
                     * Verify room membership.
                     */
                    if (
                        !isRoomUser(
                            room,
                            recipientUserId
                        )
                    ) {
                        continue;
                    }

                    /*
                     * Confirm ChatPanel is still open.
                     *
                     * This protects against stale socket
                     * registrations.
                     */
                    if (
                        !isChatOpenForSocket(
                            roomId,
                            socketId
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
                 * MARK MESSAGE SEEN FOR OPEN RECIPIENTS
                 * =================================================
                 */

                const now = new Date();

                for (
                    const userId of
                        seenUserIds
                ) {
                    await addDeliveredStatus(
                        savedMessage,
                        userId,
                        now
                    );

                    await addSeenStatus(
                        savedMessage,
                        userId,
                        now
                    );
                }

                if (
                    seenUserIds.size > 0
                ) {
                    await savedMessage.save();
                }

                /*
                 * Populate sender AFTER status changes.
                 */
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
                 * BUILD STATUS ARRAYS FROM DATABASE STATE
                 *
                 * Do NOT create separate new Date() values here.
                 * The client should receive the actual stored state.
                 * =================================================
                 */

                const deliveredTo =
                    (
                        populatedMessage
                            .deliveredTo || []
                    ).map(
                        (entry) => ({
                            user:
                                normalizeId(
                                    entry?.user?._id ||
                                        entry?.user
                                ),
                            at: entry?.at,
                        })
                    );

                const seenBy =
                    (
                        populatedMessage
                            .seenBy || []
                    ).map(
                        (entry) => ({
                            user:
                                normalizeId(
                                    entry?.user?._id ||
                                        entry?.user
                                ),
                            at: entry?.at,
                        })
                    );

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

                        deliveredTo,

                        seenBy,
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

                            status: "seen",
                        }
                    );
                }

                /*
                 * =================================================
                 * UPDATE UNREAD COUNTS
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
                         * Sender does not receive unread count.
                         */
                        if (
                            recipientUserId ===
                            normalizedSenderId
                        ) {
                            continue;
                        }

                        /*
                         * Open ChatPanel means message was seen.
                         */
                        if (
                            isChatOpenForSocket(
                                roomId,
                                socketId
                            )
                        ) {
                            await emitUnreadCount(
                                recipientSocket,
                                roomId,
                                recipientUserId
                            );

                            continue;
                        }

                        /*
                         * Closed ChatPanel -> update unread count.
                         */
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
     * Compatibility event.
     *
     * ChatPanel closed:
     *      -> ignore
     *
     * ChatPanel open:
     *      -> message becomes Seen
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
                 * Must have ChatPanel open.
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

                const normalizedUserId =
                    normalizeId(userId);

                /*
                 * Security:
                 * userId must belong to this socket.
                 */
                if (
                    socket.data?.userId &&
                    normalizeId(
                        socket.data.userId
                    ) !== normalizedUserId
                ) {
                    return;
                }

                if (
                    !isRoomUser(
                        room,
                        normalizedUserId
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
                 * Sender cannot mark own message.
                 */
                if (
                    normalizeId(
                        message.sender
                    ) ===
                    normalizedUserId
                ) {
                    return;
                }

                /*
                 * Since ChatPanel is open, immediately mark Seen.
                 */
                const now = new Date();

                const deliveredAdded =
                    await addDeliveredStatus(
                        message,
                        normalizedUserId,
                        now
                    );

                const seenAdded =
                    await addSeenStatus(
                        message,
                        normalizedUserId,
                        now
                    );

                if (
                    deliveredAdded ||
                    seenAdded
                ) {
                    await message.save();
                }

                if (seenAdded) {
                    io.to(roomId).emit(
                        "chat:message-status",
                        {
                            messageId,
                            userId:
                                normalizedUserId,
                            status: "seen",
                        }
                    );
                }

                await emitUnreadCount(
                    socket,
                    roomId,
                    normalizedUserId
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
                 * ChatPanel must actually be open.
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

                const normalizedUserId =
                    normalizeId(userId);

                /*
                 * Security:
                 * userId must belong to this socket.
                 */
                if (
                    socket.data?.userId &&
                    normalizeId(
                        socket.data.userId
                    ) !== normalizedUserId
                ) {
                    return;
                }

                if (
                    !isRoomUser(
                        room,
                        normalizedUserId
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
                    normalizedUserId
                ) {
                    return;
                }

                const now = new Date();

                /*
                 * Delivered first.
                 */
                const deliveredAdded =
                    await addDeliveredStatus(
                        message,
                        normalizedUserId,
                        now
                    );

                /*
                 * Then Seen.
                 */
                const seenAdded =
                    await addSeenStatus(
                        message,
                        normalizedUserId,
                        now
                    );

                if (
                    deliveredAdded ||
                    seenAdded
                ) {
                    await message.save();
                }

                /*
                 * Only emit when state actually changed.
                 */
                if (seenAdded) {
                    io.to(roomId).emit(
                        "chat:message-status",
                        {
                            messageId,
                            userId:
                                normalizedUserId,
                            status: "seen",
                        }
                    );
                }

                /*
                 * Synchronize unread count.
                 */
                await emitUnreadCount(
                    socket,
                    roomId,
                    normalizedUserId
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

                await Message.findByIdAndDelete(
                    messageId
                );

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