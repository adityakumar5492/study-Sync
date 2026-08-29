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

// ============================================================
// HELPERS
// ============================================================

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

/*
 * Return unique online users for a room.
 *
 * onlineUsers internally tracks socket IDs because a user can
 * reconnect and receive a new socket ID.
 *
 * The UI, however, should always see one user only once.
 */
const getUniqueOnlineUsers = (roomId) => {
    const users = onlineUsers.get(
        roomId
    );

    if (!users) {
        return [];
    }

    const uniqueUsers = new Map();

    users.forEach((user) => {
        const userId = normalizeId(
            user?._id
        );

        if (!userId) {
            return;
        }

        /*
         * Last valid socket/user entry wins.
         */
        uniqueUsers.set(
            userId,
            user
        );
    });

    return Array.from(
        uniqueUsers.values()
    );
};

/*
 * Broadcast the current online users.
 */
const emitOnlineUsers = (
    io,
    roomId
) => {
    const users =
        getUniqueOnlineUsers(roomId);

    io.to(roomId).emit(
        "room:online-users",
        {
            users,
        }
    );
};

/*
 * Remove a specific socket from a room's
 * online-user state.
 */
const removeSocketFromRoom = (
    io,
    roomId,
    socketId
) => {
    if (!roomId || !socketId) {
        return;
    }

    const users =
        onlineUsers.get(roomId);

    if (!users) {
        return;
    }

    users.delete(socketId);

    if (users.size === 0) {
        onlineUsers.delete(roomId);
    }

    /*
     * Send the update immediately.
     *
     * This is important for browser Back/navigation.
     */
    emitOnlineUsers(
        io,
        roomId
    );
};

/*
 * Remove every socket belonging to the same
 * user from this room.
 *
 * This prevents duplicate participant entries
 * when the same user reconnects or opens another
 * room socket.
 */
const removeUserSocketsFromRoom = (
    io,
    roomId,
    userId,
    exceptSocketId = null
) => {
    if (!roomId || !userId) {
        return;
    }

    const users =
        onlineUsers.get(roomId);

    if (!users) {
        return;
    }

    const normalizedUserId =
        normalizeId(userId);

    const socketIdsToRemove = [];

    users.forEach(
        (roomUser, socketId) => {
            if (
                socketId ===
                exceptSocketId
            ) {
                return;
            }

            if (
                normalizeId(
                    roomUser?._id
                ) === normalizedUserId
            ) {
                socketIdsToRemove.push(
                    socketId
                );
            }
        }
    );

    socketIdsToRemove.forEach(
        (socketId) => {
            users.delete(
                socketId
            );
        }
    );

    if (users.size === 0) {
        onlineUsers.delete(
            roomId
        );
    }
};

/*
 * Remove a socket from every room where
 * it is currently tracked.
 */
const removeSocketFromAllRooms = (
    io,
    socket
) => {
    if (!socket) {
        return;
    }

    const affectedRooms = [];

    onlineUsers.forEach(
        (users, roomId) => {
            if (
                users.has(
                    socket.id
                )
            ) {
                users.delete(
                    socket.id
                );

                if (users.size === 0) {
                    onlineUsers.delete(
                        roomId
                    );
                }

                affectedRooms.push(
                    roomId
                );
            }
        }
    );

    /*
     * Notify each affected room only once.
     */
    affectedRooms.forEach(
        (roomId) => {
            emitOnlineUsers(
                io,
                roomId
            );
        }
    );
};

/*
 * Remove connectedUsers mapping only when
 * it still points to this exact socket.
 */
const removeConnectedUserSocket = (
    socket
) => {
    const userId =
        socket?.data?.userId;

    if (!userId) {
        return;
    }

    const normalizedUserId =
        normalizeId(userId);

    if (
        connectedUsers.get(
            normalizedUserId
        ) === socket.id
    ) {
        connectedUsers.delete(
            normalizedUserId
        );
    }
};

// ============================================================
// MODULE
// ============================================================

module.exports = (io, socket) => {
    // ===========================
    // Register User Socket
    // ===========================

    socket.on(
        "user:register",
        ({ userId } = {}) => {
            if (!userId) {
                return;
            }

            const normalizedUserId =
                userId.toString();

            socket.data =
                socket.data || {};

            socket.data.userId =
                normalizedUserId;

            /*
             * The latest socket becomes the user's
             * active socket.
             */
            connectedUsers.set(
                normalizedUserId,
                socket.id
            );
        }
    );

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
        if (
            activeStudySessions.has(
                socket.id
            )
        ) {
            return;
        }

        activeStudySessions.set(
            socket.id,
            {
                roomId:
                    roomId.toString(),
                userId:
                    userId.toString(),
                startedAt:
                    new Date(),
            }
        );
    };

    // ===========================
    // Study Session - End
    // ===========================

    const endStudySession =
        async () => {
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

            const endedAt =
                new Date();

            const durationSeconds =
                Math.max(
                    0,
                    Math.floor(
                        (endedAt.getTime() -
                            session.startedAt.getTime()) /
                            1000
                    )
                );

            if (
                durationSeconds <= 0
            ) {
                return;
            }

            try {
                await StudySession.create(
                    {
                        user:
                            session.userId,
                        room:
                            session.roomId,
                        startedAt:
                            session.startedAt,
                        endedAt,
                        durationSeconds,
                    }
                );

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
                    await StudySession.aggregate(
                        [
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
                        ]
                    );

                // Last 400 days are enough for
                // streak/calendar display.
                const since =
                    new Date();

                since.setDate(
                    since.getDate() - 400
                );

                const sessions =
                    await StudySession.find(
                        {
                            user: userId,
                            startedAt: {
                                $gte: since,
                            },
                        }
                    )
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
                            socket.data
                                .userId,
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
        async ({
            roomId,
            user,
            isHost,
        } = {}) => {
            try {
                if (
                    !roomId ||
                    !user?._id
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

                socket.data =
                    socket.data || {};

                socket.data.userId =
                    userId;

                /*
                 * =================================================
                 * IMPORTANT PRESENCE FIX
                 * =================================================
                 *
                 * Before registering this socket, remove any older
                 * socket belonging to the same user in this room.
                 *
                 * This prevents:
                 *
                 * User A
                 * User A
                 *
                 * appearing as two online participants after
                 * reconnect/navigation.
                 */
                removeUserSocketsFromRoom(
                    io,
                    roomId,
                    userId,
                    socket.id
                );

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

                emitOnlineUsers(
                    io,
                    roomId
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
        } = {}) => {
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
                    room.removedMembers.push(
                        {
                            user: memberId,
                            removedAt:
                                new Date(),
                        }
                    );
                }

                await room.save();

                // ===========================
                // Remove active socket(s)
                // ===========================

                const roomUsers =
                    onlineUsers.get(
                        roomId
                    );

                const removedSockets =
                    [];

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

                for (
                    const socketId of
                        removedSockets
                ) {
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

                /*
                 * Remove connected-user mapping if it points
                 * to one of the removed sockets.
                 */
                const connectedSocketId =
                    connectedUsers.get(
                        memberId.toString()
                    );

                if (
                    removedSockets.includes(
                        connectedSocketId
                    )
                ) {
                    connectedUsers.delete(
                        memberId.toString()
                    );
                }

                // ===========================
                // Update online users
                // ===========================

                emitOnlineUsers(
                    io,
                    roomId
                );

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
        async ({
            roomId,
            user,
        } = {}) => {
            if (!roomId) {
                return;
            }

            /*
             * =================================================
             * IMPORTANT
             * =================================================
             *
             * Remove the socket from presence FIRST.
             *
             * Previously study-session saving happened before
             * presence cleanup, which could delay the online-user
             * update.
             *
             * Browser Back/navigation should update immediately.
             */

            const roomUsers =
                onlineUsers.get(
                    roomId
                );

            const leavingUser =
                roomUsers?.get(
                    socket.id
                );

            /*
             * Remove socket from online presence.
             */
            removeSocketFromRoom(
                io,
                roomId,
                socket.id
            );

            /*
             * Remove host socket if this exact
             * socket was the host connection.
             */
            if (
                hostSocketId.get(
                    roomId
                ) === socket.id
            ) {
                hostSocketId.delete(
                    roomId
                );
            }

            /*
             * Remove Socket.IO room membership.
             */
            socket.leave(roomId);

            /*
             * Notify remaining room members.
             */
            if (
                user ||
                leavingUser
            ) {
                const leavingUserData =
                    user ||
                    leavingUser;

                io.to(roomId).emit(
                    "room:user-left",
                    {
                        user:
                            leavingUserData,
                        message:
                            `${leavingUserData.name} left the room.`,
                    }
                );
            }

            /*
             * End study session AFTER presence has already
             * been updated.
             */
            await endStudySession();
        }
    );

    // ===========================
    // PDF - PDF Replacement Sync
    // ===========================

    socket.on(
        "pdf:updated",
        async ({
            roomId,
            pdfUrl,
        } = {}) => {
            try {
                if (
                    !roomId ||
                    !pdfUrl
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
        async ({
            roomId,
        } = {}) => {
            try {
                if (!roomId) {
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
        } = {}) => {
            if (!isHost) {
                return;
            }

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
        ({ roomId } = {}) => {
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
        } = {}) => {
            if (!isHost) {
                return;
            }

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
        } = {}) => {
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
        } = {}) => {
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
        } = {}) => {
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
    // Disconnecting
    // ===========================

    socket.on(
        "disconnecting",
        async () => {
            /*
             * =================================================
             * IMPORTANT PRESENCE CLEANUP
             * =================================================
             *
             * Socket.IO's `disconnecting` event fires while
             * socket.rooms still contains the joined rooms.
             *
             * Remove presence immediately so other participants
             * see the user go offline without waiting for the
             * study-session database operation.
             */

            const rooms = Array.from(
                socket.rooms
            ).filter(
                (roomId) =>
                    roomId !== socket.id
            );

            rooms.forEach(
                (roomId) => {
                    if (
                        hostSocketId.get(
                            roomId
                        ) === socket.id
                    ) {
                        hostSocketId.delete(
                            roomId
                        );
                    }

                    removeSocketFromRoom(
                        io,
                        roomId,
                        socket.id
                    );
                }
            );

            /*
             * Remove global user -> socket mapping only
             * when this socket is still the active socket.
             */
            removeConnectedUserSocket(
                socket
            );

            /*
             * End active study session after
             * presence cleanup.
             */
            await endStudySession();
        }
    );
};

// ============================================================
// Helper
// ============================================================

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