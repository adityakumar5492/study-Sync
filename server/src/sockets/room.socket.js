const Room = require("../models/room.model");

const {
    hostSocketId,
    drawingAllowed,
} = require("./roomState");


const onlineUsers = new Map();
const currentPdfPages = new Map();

// userId -> socket.id
const connectedUsers = new Map();

module.exports = (io, socket) => {
    // ===========================
// Register User Socket
// ===========================

socket.on("user:register", ({ userId }) => {
    if (!userId) return;

    connectedUsers.set(
        userId.toString(),
        socket.id
    );
});
    // ===========================
    // Join Room
    // ===========================
socket.on(
    "room:join",
    async ({ roomId, user, isHost }) => {
        try {
            if (!roomId || !user?._id) {
                return;
            }

            const room = await Room.findById(roomId);

            if (!room) {
                socket.emit(
                    "room:error",
                    "Room not found."
                );
                return;
            }

            const userId = user._id.toString();

            const hostId = room.host.toString();

            const isActualHost =
                hostId === userId;

            const isMember =
                room.members.some(
                    (member) =>
                        member.toString() === userId
                );

            // ===========================
            // Public room
            // ===========================

            if (!room.isPrivate) {
                if (
                    !isActualHost &&
                    !isMember
                ) {
                    if (
                        room.members.length >=
                        room.maxMembers
                    ) {
                        socket.emit(
                            "room:error",
                            "Room is full."
                        );
                        return;
                    }

                    room.members.push(user._id);

                    await room.save();
                }
            }

            // ===========================
            // Private room
            // ===========================

            if (
                room.isPrivate &&
                !isActualHost &&
                !isMember
            ) {
                socket.emit(
                    "room:error",
                    "You must join this room first."
                );
                return;
            }

            // ===========================
            // Join Socket.IO room
            // ===========================

            socket.join(roomId);

            connectedUsers.set(
                userId,
                socket.id
            );

            if (!onlineUsers.has(roomId)) {
                onlineUsers.set(
                    roomId,
                    new Map()
                );
            }

            onlineUsers
                .get(roomId)
                .set(socket.id, user);

            if (isActualHost) {
                hostSocketId.set(
                    roomId,
                    socket.id
                );
            }

            // ===========================
            // Default PDF page
            // ===========================

            if (
                !currentPdfPages.has(roomId)
            ) {
                currentPdfPages.set(
                    roomId,
                    1
                );
            }

            socket.emit(
                "pdf:current-page",
                {
                    pageNumber:
                        currentPdfPages.get(
                            roomId
                        ),
                }
            );

            // ===========================
            // Drawing permission
            // ===========================

            socket.emit(
                "drawing:permission-change",
                {
                    allowed:
                        drawingAllowed.get(
                            roomId
                        ) ?? true,
                }
            );

            // ===========================
            // Online users
            // ===========================

            io.to(roomId).emit(
                "room:online-users",
                {
                    users: Array.from(
                        onlineUsers
                            .get(roomId)
                            .values()
                    ),
                }
            );

            // ===========================
            // User joined
            // ===========================

            io.to(roomId).emit(
                "room:user-joined",
                {
                    user,
                    message:
                        `${user.name} joined the room.`,
                }
            );

            // ===========================
            // IMPORTANT:
            // Update room members
            // ===========================

            io.to(roomId).emit(
                "room:members-updated",
                {
                    roomId,
                    memberId: user._id,
                }
            );

        } catch (error) {
            console.error(
                "Join room error:",
                error
            );

            socket.emit(
                "room:error",
                "Failed to join room."
            );
        }
    }
);

    // ===========================
    // Remove Member
    // ===========================

    socket.on(
        "room:remove-member",
        async ({
            roomId,
            memberId,
        }) => {
            try {
                if (
                    !roomId ||
                    !memberId
                ) {
                    return;
                }

                const room =
                    await Room.findById(
                        roomId
                    );

                if (!room) {
                    socket.emit(
                        "room:error",
                        "Room not found."
                    );

                    return;
                }

                const hostUserId =
                    getUserIdFromSocket(
                        roomId,
                        socket
                    );

                if (
                    !hostUserId ||
                    room.host.toString() !==
                        hostUserId
                ) {
                    socket.emit(
                        "room:error",
                        "Only the host can remove members."
                    );

                    return;
                }

                if (
                    room.host.toString() ===
                    memberId.toString()
                ) {
                    socket.emit(
                        "room:error",
                        "The host cannot be removed."
                    );

                    return;
                }

                const isMember =
                    room.members.some(
                        (member) =>
                            member.toString() ===
                            memberId.toString()
                    );

                if (!isMember) {
                    socket.emit(
                        "room:error",
                        "User is not a member of this room."
                    );

                    return;
                }

                // Remove active member
                room.members =
                    room.members.filter(
                        (member) =>
                            member.toString() !==
                            memberId.toString()
                    );

                // Add removed history only once
                const alreadyRemoved =
                    room.removedMembers?.some(
                        (entry) =>
                            entry.user.toString() ===
                            memberId.toString()
                    );

                if (!alreadyRemoved) {
                    room.removedMembers.push({
                        user: memberId,
                        removedAt:
                            new Date(),
                    });
                }

                await room.save();

                // ===========================
                // Remove active socket(s)
                // ===========================

                const roomUsers =
                    onlineUsers.get(
                        roomId
                    );

                const removedSockets = [];

                if (roomUsers) {
                    roomUsers.forEach(
                        (
                            roomUser,
                            socketId
                        ) => {
                            if (
                                roomUser?._id
                                    ?.toString() ===
                                memberId.toString()
                            ) {
                                removedSockets.push(
                                    socketId
                                );
                            }
                        }
                    );
                }

                removedSockets.forEach(
                    (socketId) => {
                        const targetSocket =
                            io.sockets.sockets.get(
                                socketId
                            );

                        if (
                            targetSocket
                        ) {
                            targetSocket.emit(
                                "room:removed",
                                {
                                    roomId,
                                    message:
                                        "You have been removed from this room by the host.",
                                }
                            );

                            targetSocket.leave(
                                roomId
                            );
                        }

                        roomUsers?.delete(
                            socketId
                        );
                    }
                );

                // ===========================
                // Update online users
                // ===========================

                if (roomUsers) {
                    io.to(roomId).emit(
                        "room:online-users",
                        {
                            users: Array.from(
                                roomUsers.values()
                            ),
                        }
                    );
                }

                // ===========================
                // Update members
                // ===========================

                io.to(roomId).emit(
                    "room:members-updated",
                    {
                        memberId,
                    }
                );
            } catch (error) {
                console.error(
                    "Remove member error:",
                    error
                );

                socket.emit(
                    "room:error",
                    "Failed to remove member."
                );
            }
        }
    );

    // ===========================
    // Leave Room
    // ===========================

    socket.on(
        "room:leave",
        ({ roomId, user }) => {
            socket.leave(roomId);

            if (
                hostSocketId.get(
                    roomId
                ) === socket.id
            ) {
                hostSocketId.delete(
                    roomId
                );
            }

            if (
                onlineUsers.has(roomId)
            ) {
                const users =
                    onlineUsers.get(
                        roomId
                    );

                users.delete(
                    socket.id
                );

                if (users.size === 0) {
                    onlineUsers.delete(
                        roomId
                    );
                } else {
                    io.to(roomId).emit(
                        "room:online-users",
                        {
                            users: Array.from(
                                users.values()
                            ),
                        }
                    );
                }
            }

            io.to(roomId).emit(
                "room:user-left",
                {
                    user,
                    message: `${user.name} left the room.`,
                }
            );
        }
    );

    // ===========================
// PDF - PDF Replacement Sync
// ===========================

socket.on(
    "pdf:updated",
    async ({ roomId, pdfUrl }) => {
        try {
            if (!roomId || !pdfUrl) {
                return;
            }

            const room = await Room.findById(roomId);

            if (!room) {
                return;
            }

            // Only the actual host can replace the PDF
            const hostUserId = getUserIdFromSocket(
                roomId,
                socket
            );

            if (
                !hostUserId ||
                room.host.toString() !== hostUserId
            ) {
                return;
            }

            // Reset synchronized page for the new PDF
            currentPdfPages.set(roomId, 1);

            // Send the new PDF to everyone in the room
            io.to(roomId).emit(
                "pdf:updated",
                {
                    pdfUrl,
                }
            );
        } catch (error) {
            console.error(
                "PDF update socket error:",
                error
            );
        }
    }
);
    // ===========================
    // PDF - Host Page Change
    // ===========================

    socket.on(
        "pdf:page-change",
        ({
            roomId,
            pageNumber,
            isHost,
        }) => {
            if (!isHost) return;

            currentPdfPages.set(
                roomId,
                pageNumber
            );

            socket
                .to(roomId)
                .emit(
                    "pdf:host-page-change",
                    {
                        pageNumber,
                    }
                );
        }
    );

    // ===========================
    // PDF - Request Current Host Page
    // ===========================

    socket.on(
        "pdf:request-current-page",
        ({ roomId }) => {
            const currentPage =
                currentPdfPages.get(
                    roomId
                ) || 1;

            socket.emit(
                "pdf:current-page",
                {
                    pageNumber:
                        currentPage,
                }
            );
        }
    );

    // ===========================
    // PDF - Host Scroll Sync
    // ===========================

    socket.on(
        "pdf:host-scroll",
        ({
            roomId,
            scrollPercent,
            isHost,
        }) => {
            if (!isHost) return;

            if (
                typeof scrollPercent !==
                "number"
            ) {
                return;
            }

            socket
                .to(roomId)
                .emit(
                    "pdf:host-scroll-change",
                    {
                        scrollPercent,
                    }
                );
        }
    );

    // ===========================
    // Drawing Permission
    // ===========================

    socket.on(
        "drawing:toggle",
        ({
            roomId,
            allowed,
            isHost,
        }) => {
            if (
                !roomId ||
                !isHost
            ) {
                return;
            }

            if (
                hostSocketId.get(
                    roomId
                ) !== socket.id
            ) {
                return;
            }

            drawingAllowed.set(
                roomId,
                Boolean(allowed)
            );

            io.to(roomId).emit(
                "drawing:permission-change",
                {
                    allowed:
                        Boolean(
                            allowed
                        ),
                }
            );
        }
    );

    // ===========================
    // Rejoin Request Notification
    // ===========================

    socket.on(
        "room:rejoin-request",
        async ({
            roomId,
            userId,
        }) => {
            try {
                if (
                    !roomId ||
                    !userId
                ) {
                    return;
                }

                // Verify request exists
                const room =
                    await Room.findById(
                        roomId
                    ).populate(
                        "rejoinRequests.user",
                        "name avatar"
                    );

                if (!room) {
                    return;
                }

                const request =
                    room.rejoinRequests?.find(
                        (item) => {
                            const requestUserId =
                                item.user?._id?.toString();

                            return (
                                requestUserId ===
                                    userId.toString() &&
                                item.status ===
                                    "pending"
                            );
                        }
                    );

                if (!request) {
                    return;
                }

                // Notify host/current room users
                io.to(roomId).emit(
                    "room:rejoin-request",
                    {
                        roomId,
                        user:
                            request.user,
                        requestedAt:
                            request.requestedAt,
                    }
                );
            } catch (error) {
                console.error(
                    "Rejoin request notification error:",
                    error
                );
            }
        }
    );

    // ===========================
    // Rejoin Approved
    // ===========================

    socket.on(
        "room:rejoin-approved",
        async ({
            roomId,
            userId,
        }) => {
            try {
                if (
                    !roomId ||
                    !userId
                ) {
                    return;
                }

                const room =
                    await Room.findById(
                        roomId
                    );

                if (!room) {
                    return;
                }

                // Only the actual host
                // can approve/release this event.
                const hostUserId =
                    getUserIdFromSocket(
                        roomId,
                        socket
                    );

                if (
                    !hostUserId ||
                    room.host.toString() !==
                        hostUserId
                ) {
                    return;
                }

                // Make sure user is actually
                // a member after approval.
                const isMember =
                    room.members.some(
                        (member) =>
                            member.toString() ===
                            userId.toString()
                    );

                if (!isMember) {
                    return;
                }

                const targetSocketId =
                    connectedUsers.get(
                        userId.toString()
                    );

                if (!targetSocketId) {
                    console.log(
                        "Approved user is offline:",
                        userId
                    );

                    return;
                }

                io.to(
                    targetSocketId
                ).emit(
                    "room:rejoin-approved",
                    {
                        roomId,
                        message:
                            "Your request to rejoin was approved.",
                    }
                );
            } catch (error) {
                console.error(
                    "Rejoin approval socket error:",
                    error
                );
            }
        }
    );

    // ===========================
    // Disconnect
    // ===========================

    socket.on(
        "disconnecting",
        () => {
            // Remove this socket from
            // connectedUsers only if it is
            // still the user's active socket.
            for (const [
                userId,
                socketId,
            ] of connectedUsers.entries()) {
                if (
                    socketId === socket.id
                ) {
                    connectedUsers.delete(
                        userId
                    );

                    break;
                }
            }

            socket.rooms.forEach(
                (roomId) => {
                    if (
                        roomId ===
                        socket.id
                    ) {
                        return;
                    }

                    if (
                        hostSocketId.get(
                            roomId
                        ) === socket.id
                    ) {
                        hostSocketId.delete(
                            roomId
                        );
                    }

                    if (
                        onlineUsers.has(
                            roomId
                        )
                    ) {
                        const users =
                            onlineUsers.get(
                                roomId
                            );

                        users.delete(
                            socket.id
                        );

                        if (
                            users.size ===
                            0
                        ) {
                            onlineUsers.delete(
                                roomId
                            );
                        } else {
                            io.to(
                                roomId
                            ).emit(
                                "room:online-users",
                                {
                                    users: Array.from(
                                        users.values()
                                    ),
                                }
                            );
                        }
                    }
                }
            );
        }
    );
};

// ===========================
// Helper
// ===========================

const getUserIdFromSocket = (
    roomId,
    socket
) => {
    const users =
        onlineUsers.get(roomId);

    if (!users) {
        return null;
    }

    const user =
        users.get(socket.id);

    return (
        user?._id?.toString() ||
        null
    );
};