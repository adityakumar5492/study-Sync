const Message = require("../models/message.model");
const Room = require("../models/room.model");

module.exports = (io, socket) => {
    // Send Message
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

            const savedMessage =
                await Message.create({
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
                }
            );
        } catch (error) {
            console.error(
                "Chat message error:",
                error
            );
        }
    });

    // Delete Message
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

                // Find room
                const room =
                    await Room.findById(roomId);

                if (!room) {
                    return;
                }

                // Find message
                const message =
                    await Message.findById(
                        messageId
                    );

                if (!message) {
                    return;
                }

                // Make sure the message
                // actually belongs to this room
                if (
                    message.room.toString() !==
                    roomId.toString()
                ) {
                    return;
                }

                // Check whether requester is host
                const isHost =
                    room.host.toString() ===
                    senderId.toString();

                // Check whether requester is
                // currently a room member
                const isMember = room.members.some(
                    (member) =>
                        member.toString() ===
                        senderId.toString()
                );

                // Requester must be host or member
                if (!isHost && !isMember) {
                    return;
                }

                // Member can only delete
                // their own message.
                const isMessageOwner =
                    message.sender.toString() ===
                    senderId.toString();

                if (!isHost && !isMessageOwner) {
                    return;
                }

                // Delete message from database
                await Message.findByIdAndDelete(
                    messageId
                );

                // Tell everyone in the room
                // that this message was deleted
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

    // Typing Started
    socket.on(
        "chat:typing",
        ({ roomId, user }) => {
            socket
                .to(roomId)
                .emit("chat:user-typing", {
                    user,
                });
        }
    );

    // Typing Stopped
    socket.on(
        "chat:stop-typing",
        ({ roomId, user }) => {
            socket
                .to(roomId)
                .emit("chat:user-stop-typing", {
                    user,
                });
        }
    );
};