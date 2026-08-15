const voiceParticipants = new Map();
// roomId -> Map(userId, user)

module.exports = (io, socket) => {
    // ===========================
    // Join Voice
    // ===========================

    socket.on(
    "voice:join",
    ({ roomId, user }) => {
        if (!roomId || !user?._id) {
            return;
        }

        const userId =
            user._id.toString();

        if (!voiceParticipants.has(roomId)) {
            voiceParticipants.set(
                roomId,
                new Map()
            );
        }

        const participants =
            voiceParticipants.get(roomId);

        participants.set(userId, {
            _id: userId,
            name: user.name,
            avatar: user.avatar,
            socketId: socket.id,
            muted: false,
        });

        // Send updated participant list to EVERYONE
        io.to(roomId).emit(
            "voice:participants",
            {
                participants: Array.from(
                    participants.values()
                ).map((participant) => ({
                    _id: participant._id,
                    name: participant.name,
                    avatar: participant.avatar,
                    muted: participant.muted,
                })),
            }
        );

        // Tell existing participants to start WebRTC connection
        socket.to(roomId).emit(
            "voice:user-joined",
            {
                userId,
                user: {
                    _id: userId,
                    name: user.name,
                    avatar: user.avatar,
                },
            }
        );
    }
);

    // ===========================
    // WebRTC Offer
    // ===========================

    socket.on(
        "voice:offer",
        ({
            roomId,
            targetUserId,
            offer,
        }) => {
            if (
                !roomId ||
                !targetUserId ||
                !offer
            ) {
                return;
            }

            const targetSocket =
                findUserSocket(
                    io,
                    roomId,
                    targetUserId
                );

            if (!targetSocket) {
                return;
            }

            targetSocket.emit(
                "voice:offer",
                {
                    userId:
                        getSocketUserId(
                            socket,
                            roomId
                        ),
                    offer,
                }
            );
        }
    );

    // ===========================
    // WebRTC Answer
    // ===========================

    socket.on(
        "voice:answer",
        ({
            roomId,
            targetUserId,
            answer,
        }) => {
            if (
                !roomId ||
                !targetUserId ||
                !answer
            ) {
                return;
            }

            const targetSocket =
                findUserSocket(
                    io,
                    roomId,
                    targetUserId
                );

            if (!targetSocket) {
                return;
            }

            targetSocket.emit(
                "voice:answer",
                {
                    userId:
                        getSocketUserId(
                            socket,
                            roomId
                        ),
                    answer,
                }
            );
        }
    );

    // ===========================
    // ICE Candidate
    // ===========================

    socket.on(
        "voice:ice-candidate",
        ({
            roomId,
            targetUserId,
            candidate,
        }) => {
            if (
                !roomId ||
                !targetUserId ||
                !candidate
            ) {
                return;
            }

            const targetSocket =
                findUserSocket(
                    io,
                    roomId,
                    targetUserId
                );

            if (!targetSocket) {
                return;
            }

            targetSocket.emit(
                "voice:ice-candidate",
                {
                    userId:
                        getSocketUserId(
                            socket,
                            roomId
                        ),
                    candidate,
                }
            );
        }
    );

    // ===========================
    // Mute / Unmute
    // ===========================

    socket.on(
    "voice:mute",
    ({
        roomId,
        userId,
        muted,
    }) => {
        if (
            !roomId ||
            !userId
        ) {
            return;
        }

        const participants =
            voiceParticipants.get(
                roomId
            );

        const participant =
            participants?.get(
                userId.toString()
            );

        if (participant) {
            participant.muted =
                Boolean(muted);
        }

        socket.to(roomId).emit(
            "voice:user-muted",
            {
                userId:
                    userId.toString(),
                muted: Boolean(muted),
            }
        );
    }
);

    // ===========================
    // Leave Voice
    // ===========================

    socket.on(
        "voice:leave",
        ({
            roomId,
            userId,
        }) => {
            removeVoiceParticipant(
                io,
                socket,
                roomId,
                userId
            );
        }
    );

    // ===========================
    // Disconnect
    // ===========================

    socket.on(
        "disconnecting",
        () => {
            voiceParticipants.forEach(
                (participants, roomId) => {
                    const userId =
                        Array.from(
                            participants.entries()
                        ).find(
                            ([, user]) =>
                                user?.socketId ===
                                socket.id
                        )?.[0];

                    if (!userId) {
                        return;
                    }

                    participants.delete(
                        userId
                    );

                    socket.to(roomId).emit(
                        "voice:user-left",
                        {
                            userId,
                        }
                    );

                    if (
                        participants.size ===
                        0
                    ) {
                        voiceParticipants.delete(
                            roomId
                        );
                    }
                }
            );
        }
    );
};

// ===========================
// Find User Socket
// ===========================

const findUserSocket = (
    io,
    roomId,
    userId
) => {
    const participants =
        voiceParticipants.get(roomId);

    if (!participants) {
        return null;
    }

    const participant =
        participants.get(
            userId.toString()
        );

    if (!participant?.socketId) {
        return null;
    }

    return (
        io.sockets.sockets.get(
            participant.socketId
        ) || null
    );
};

// ===========================
// Get Socket User ID
// ===========================

const getSocketUserId = (
    socket,
    roomId
) => {
    const participants =
        voiceParticipants.get(roomId);

    if (!participants) {
        return null;
    }

    for (
        const [userId, user] of
        participants.entries()
    ) {
        if (
            user.socketId ===
            socket.id
        ) {
            return userId;
        }
    }

    return null;
};

// ===========================
// Remove Voice Participant
// ===========================

const removeVoiceParticipant = (
    io,
    socket,
    roomId,
    userId
) => {
    if (!roomId || !userId) {
        return;
    }

    const participants =
        voiceParticipants.get(roomId);

    if (!participants) {
        return;
    }

    const normalizedUserId =
        userId.toString();

    participants.delete(
        normalizedUserId
    );

    socket.to(roomId).emit(
        "voice:user-left",
        {
            userId:
                normalizedUserId,
        }
    );

    if (participants.size === 0) {
        voiceParticipants.delete(
            roomId
        );
    }
};