const Message = require("../models/message.model");
const Room = require("../models/room.model");

module.exports = (io, socket) => {
    // =========================================================
    // Send Message
    // =========================================================

    socket.on("chat:send-message", async (data) => {
        try {
            const {
                roomId,
                message,
                senderId,
            } = data;

            if (!roomId || !senderId || !message?.trim()) {
                return;
            }

            const room = await Room.findById(roomId);

            if (!room) {
                return;
            }

            const isMember = room.members.some(
                (member) =>
                    member.toString() ===
                    senderId.toString()
            );

            const isHost =
                room.host.toString() ===
                senderId.toString();

            if (!isMember && !isHost) {
                return;
            }

            const savedMessage = await Message.create({
                room: roomId,
                sender: senderId,
                message: message.trim(),
            });

            const populatedMessage =
                await Message.findById(
                    savedMessage._id
                ).populate(
                    "sender",
                    "name avatar"
                );

            if (!populatedMessage?.sender) {
                return;
            }

            io.to(roomId).emit(
                "chat:new-message",
                {
                    _id: populatedMessage._id,
                    sender:
                        populatedMessage.sender.name,
                    senderId:
                        populatedMessage.sender._id,
                    avatar:
                        populatedMessage.sender.avatar,
                    message:
                        populatedMessage.message,
                    createdAt:
                        populatedMessage.createdAt,
                    deliveredTo:
                        populatedMessage.deliveredTo || [],
                    seenBy:
                        populatedMessage.seenBy || [],
                }
            );
        } catch (error) {
            console.error(
                "Chat message error:",
                error
            );
        }
    });

    // =========================================================
    // Message Delivered
    // =========================================================

    socket.on(
        "chat:message-delivered",
        async (data) => {
            try {
                const {
                    roomId,
                    messageId,
                    userId,
                } = data;

                if (
                    !roomId ||
                    !messageId ||
                    !userId
                ) {
                    return;
                }

                const room =
                    await Room.findById(roomId);

                if (!room) {
                    return;
                }

                const isMember = room.members.some(
                    (member) =>
                        member.toString() ===
                        userId.toString()
                );

                const isHost =
                    room.host.toString() ===
                    userId.toString();

                if (!isMember && !isHost) {
                    return;
                }

                const message =
                    await Message.findOne({
                        _id: messageId,
                        room: roomId,
                    });

                if (!message) {
                    return;
                }

                // Sender does not need delivery status
                // for their own message.
                if (
                    message.sender.toString() ===
                    userId.toString()
                ) {
                    return;
                }

                const alreadyDelivered =
                    message.deliveredTo.some(
                        (entry) =>
                            entry.user.toString() ===
                            userId.toString()
                    );

                if (!alreadyDelivered) {
                    message.deliveredTo.push({
                        user: userId,
                        at: new Date(),
                    });

                    await message.save();
                }

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
                    "Message delivery status error:",
                    error
                );
            }
        }
    );

    // =========================================================
    // Message Seen
    // =========================================================

    socket.on(
        "chat:message-seen",
        async (data) => {
            try {
                const {
                    roomId,
                    messageId,
                    userId,
                } = data;

                if (
                    !roomId ||
                    !messageId ||
                    !userId
                ) {
                    return;
                }

                const room =
                    await Room.findById(roomId);

                if (!room) {
                    return;
                }

                const isMember = room.members.some(
                    (member) =>
                        member.toString() ===
                        userId.toString()
                );

                const isHost =
                    room.host.toString() ===
                    userId.toString();

                if (!isMember && !isHost) {
                    return;
                }

                const message =
                    await Message.findOne({
                        _id: messageId,
                        room: roomId,
                    });

                if (!message) {
                    return;
                }

                // Sender cannot mark their own message as seen.
                if (
                    message.sender.toString() ===
                    userId.toString()
                ) {
                    return;
                }

                const now = new Date();

                // If the message has not been delivered
                // yet, mark it delivered as well.
                const alreadyDelivered =
                    message.deliveredTo.some(
                        (entry) =>
                            entry.user.toString() ===
                            userId.toString()
                    );

                if (!alreadyDelivered) {
                    message.deliveredTo.push({
                        user: userId,
                        at: now,
                    });
                }

                const alreadySeen =
                    message.seenBy.some(
                        (entry) =>
                            entry.user.toString() ===
                            userId.toString()
                    );

                if (!alreadySeen) {
                    message.seenBy.push({
                        user: userId,
                        at: now,
                    });

                    await message.save();
                } else if (!alreadyDelivered) {
                    await message.save();
                }

                io.to(roomId).emit(
                    "chat:message-status",
                    {
                        messageId,
                        userId,
                        status: "seen",
                    }
                );
            } catch (error) {
                console.error(
                    "Message seen status error:",
                    error
                );
            }
        }
    );

    // =========================================================
    // Delete Message
    // =========================================================

    socket.on(
        "chat:delete-message",
        async (data) => {
            try {
                const {
                    roomId,
                    messageId,
                    senderId,
                } = data;

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

                if (
                    message.room.toString() !==
                    roomId.toString()
                ) {
                    return;
                }

                const isHost =
                    room.host.toString() ===
                    senderId.toString();

                const isMember = room.members.some(
                    (member) =>
                        member.toString() ===
                        senderId.toString()
                );

                if (!isHost && !isMember) {
                    return;
                }

                const isMessageOwner =
                    message.sender.toString() ===
                    senderId.toString();

                if (!isHost && !isMessageOwner) {
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

    // =========================================================
    // Typing Started
    // =========================================================

    socket.on(
        "chat:typing",
        ({ roomId, user, userId }) => {
            socket
                .to(roomId)
                .emit("chat:user-typing", {
                    user,
                    userId,
                });
        }
    );

    // =========================================================
    // Typing Stopped
    // =========================================================

    socket.on(
        "chat:stop-typing",
        ({ roomId, user, userId }) => {
            socket
                .to(roomId)
                .emit("chat:user-stop-typing", {
                    user,
                    userId,
                });
        }
    );
};