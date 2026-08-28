const Room = require("../models/room.model");

const StudySession = require("../models/studySession.model");

const {
    hostSocketId,
    drawingPermission,
} = require("./roomState");

const onlineUsers = new Map();
const currentPdfPages = new Map();

// userId -> socket.id
const connectedUsers = new Map();

// socket.id -> active study session
const activeStudySessions = new Map();

module.exports = (io, socket) => {
    // ===========================
    // Register User Socket
    // ===========================

    socket.on("user:register", ({ userId }) => {
        if (!userId) return;

        socket.data.userId =
            userId.toString();

        connectedUsers.set(
            userId.toString(),
            socket.id
        );
    });

    // ===========================
    // Study Session - Start
    // ===========================

    const startStudySession = (
        roomId,
        userId
    ) => {
        if (!roomId || !userId) {
            return;
        }

        // Prevent duplicate active sessions
        if (activeStudySessions.has(socket.id)) {
            return;
        }

        activeStudySessions.set(socket.id, {
            roomId: roomId.toString(),
            userId: userId.toString(),
            startedAt: new Date(),
        });
    };

    // ===========================
    // Study Session - End
    // ===========================

    const endStudySession = async () => {
        const session =
            activeStudySessions.get(
                socket.id
            );

        if (!session) {
            return;
        }

        activeStudySessions.delete(
            socket.id
        );

        const endedAt = new Date();

        const durationSeconds = Math.max(
            0,
            Math.floor(
                (endedAt.getTime() -
                    session.startedAt.getTime()) /
                    1000
            )
        );

        if (durationSeconds <= 0) {
            return;
        }

        try {
            await StudySession.create({
                user: session.userId,
                room: session.roomId,
                startedAt:
                    session.startedAt,
                endedAt,
                durationSeconds,
            });

            // Tell profile pages to refresh
            io.emit(
                "profile:study-stats-updated",
                {
                    userId:
                        session.userId,
                }
            );
        } catch (error) {
            console.error(
                "Study session save error:",
                error
            );
        }
    };

    // ===========================
    // Study Statistics
    // ===========================

    socket.on(
        "study:stats-request",
        async () => {
            try {
                const userId =
                    socket.data.userId;

                if (!userId) {
                    return;
                }

                const totalResult =
                    await StudySession.aggregate([
                        {
                            $match: {
                                user: userId,
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                totalSeconds: {
                                    $sum: "$durationSeconds",
                                },
                            },
                        },
                    ]);

                // Last 400 days are enough for
                // streak/calendar display.
                const since =
                    new Date();

                since.setDate(
                    since.getDate() - 400
                );

                const sessions =
                    await StudySession.find({
                        user: userId,
                        startedAt: {
                            $gte: since,
                        },
                    })
                        .select(
                            "startedAt endedAt durationSeconds"
                        )
                        .sort({
                            startedAt: 1,
                        })
                        .lean();

                socket.emit(
                    "study:stats",
                    {
                        userId,
                        totalSeconds:
                            totalResult[0]
                                ?.totalSeconds ||
                            0,
                        sessions,
                    }
                );
            } catch (error) {
                console.error(
                    "Study stats error:",
                    error
                );

                socket.emit(
                    "study:stats",
                    {
                        userId:
                            socket.data.userId,
                        totalSeconds: 0,
                        sessions: [],
                    }
                );
            }
        }
    );

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

                const userId =
                    user._id.toString();

                const hostId =
                    room.host.toString();

                const isActualHost =
                    hostId === userId;

                const isMember =
                    room.members.some(
                        (member) =>
                            member.toString() ===
                            userId
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

                        room.members.push(
                            user._id
                        );

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

                if (
                    !onlineUsers.has(
                        roomId
                    )
                ) {
                    onlineUsers.set(
                        roomId,
                        new Map()
                    );
                }

                onlineUsers
                    .get(roomId)
                    .set(
                        socket.id,
                        user
                    );

                if (isActualHost) {
                    hostSocketId.set(
                        roomId,
                        socket.id
                    );
                }

                // ===========================
                // START STUDY SESSION
                // ===========================

                startStudySession(
                    roomId,
                    userId
                );

                // ===========================
                // Default PDF page
                // ===========================

                if (
                    !currentPdfPages.has(
                        roomId
                    )
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

                const permission =
                    drawingPermission.get(
                        roomId
                    ) || {
                        mode: "everyone",
                        allowedUsers: [],
                    };

                socket.emit(
                    "drawing:permission-change",
                    {
                        mode:
                            permission.mode,
                        allowedUsers:
                            permission.allowedUsers,
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
                // Update room members
                // ===========================

                io.to(roomId).emit(
                    "room:members-updated",
                    {
                        roomId,
                        memberId:
                            user._id,
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
                    async (socketId) => {
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

                            // End study session
                            const activeSession =
                                activeStudySessions.get(
                                    socketId
                                );

                            if (
                                activeSession
                            ) {
                                activeStudySessions.delete(
                                    socketId
                                );

                                const endedAt =
                                    new Date();

                                const durationSeconds =
                                    Math.max(
                                        0,
                                        Math.floor(
                                            (endedAt.getTime() -
                                                activeSession.startedAt.getTime()) /
                                                1000
                                        )
                                    );

                                if (
                                    durationSeconds >
                                    0
                                ) {
                                    try {
                                        await StudySession.create(
                                            {
                                                user:
                                                    activeSession.userId,
                                                room:
                                                    activeSession.roomId,
                                                startedAt:
                                                    activeSession.startedAt,
                                                endedAt,
                                                durationSeconds,
                                            }
                                        );

                                        io.emit(
                                            "profile:study-stats-updated",
                                            {
                                                userId:
                                                    activeSession.userId,
                                            }
                                        );
                                    } catch (error) {
                                        console.error(
                                            "Removed member study session error:",
                                            error
                                        );
                                    }
                                }
                            }

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
        async ({ roomId, user }) => {
            // End study session FIRST
            await endStudySession();

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

            if (user) {
                io.to(roomId).emit(
                    "room:user-left",
                    {
                        user,
                        message:
                            `${user.name} left the room.`,
                    }
                );
            }
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

                const room =
                    await Room.findById(
                        roomId
                    );

                if (!room) {
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
                    return;
                }

                currentPdfPages.set(
                    roomId,
                    1
                );

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
    // PDF - PDF Delete Sync
    // ===========================

    socket.on(
        "pdf:deleted",
        async ({ roomId }) => {
            try {
                if (!roomId) return;

                const room =
                    await Room.findById(
                        roomId
                    );

                if (!room) return;

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

                currentPdfPages.set(
                    roomId,
                    1
                );

                socket
                    .to(roomId)
                    .emit(
                        "pdf:deleted",
                        {
                            roomId,
                        }
                    );
            } catch (error) {
                console.error(
                    "PDF delete socket error:",
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
        "drawing:permission-change",
        ({
            roomId,
            mode,
            allowedUsers = [],
        }) => {
            if (!roomId) {
                return;
            }

            if (
                ![
                    "none",
                    "everyone",
                    "selected",
                ].includes(mode)
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

            const safeAllowedUsers =
                mode === "selected"
                    ? allowedUsers
                          .map((id) =>
                              id?.toString()
                          )
                          .filter(Boolean)
                    : [];

            const permission = {
                mode,
                allowedUsers: [
                    ...new Set(
                        safeAllowedUsers
                    ),
                ],
            };

            drawingPermission.set(
                roomId,
                permission
            );

            io.to(roomId).emit(
                "drawing:permission-change",
                permission
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
        async () => {
            // End active study session
            await endStudySession();

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