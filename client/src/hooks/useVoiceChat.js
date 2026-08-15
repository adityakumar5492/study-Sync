import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import socket from "../socket/socket";
import toast from "react-hot-toast";

const useVoiceChat = ({
    roomId,
    user,
}) => {
    const [isJoined, setIsJoined] =
        useState(false);

    const [isMuted, setIsMuted] =
        useState(false);

    const [participants, setParticipants] =
        useState([]);

    const localStreamRef =
        useRef(null);

    const peerConnectionsRef =
        useRef(new Map());

    const remoteAudioRefs =
        useRef(new Map());

    const isJoinedRef =
        useRef(false);

    const roomIdRef =
        useRef(roomId);

    const userRef =
        useRef(user);

    // ===========================
    // Keep Refs Updated
    // ===========================

    useEffect(() => {
        roomIdRef.current = roomId;
        userRef.current = user;
    }, [roomId, user]);

    // ===========================
    // Create Peer Connection
    // ===========================

    const createPeerConnection =
        useCallback(
            (userId) => {
                const existing =
                    peerConnectionsRef.current.get(
                        userId
                    );

                if (existing) {
                    return existing;
                }

                const peerConnection =
                    new RTCPeerConnection({
                        iceServers: [
                            {
                                urls:
                                    "stun:stun.l.google.com:19302",
                            },
                        ],
                    });

                // Local audio
                if (
                    localStreamRef.current
                ) {
                    localStreamRef.current
                        .getTracks()
                        .forEach((track) => {
                            peerConnection.addTrack(
                                track,
                                localStreamRef.current
                            );
                        });
                }

                // Remote audio
                peerConnection.ontrack = (
                    event
                ) => {
                    const remoteStream =
                        event.streams?.[0];

                    if (!remoteStream) {
                        return;
                    }

                    let audio =
                        remoteAudioRefs.current.get(
                            userId
                        );

                    if (!audio) {
                        audio =
                            document.createElement(
                                "audio"
                            );

                        audio.autoplay = true;
                        audio.playsInline = true;

                        document.body.appendChild(
                            audio
                        );

                        remoteAudioRefs.current.set(
                            userId,
                            audio
                        );
                    }

                    audio.srcObject =
                        remoteStream;

                    audio.play().catch(() => {});
                };

                // ICE
                peerConnection.onicecandidate = (
                    event
                ) => {
                    if (!event.candidate) {
                        return;
                    }

                    socket.emit(
                        "voice:ice-candidate",
                        {
                            roomId:
                                roomIdRef.current,
                            targetUserId:
                                userId,
                            candidate:
                                event.candidate,
                        }
                    );
                };

                peerConnectionsRef.current.set(
                    userId,
                    peerConnection
                );

                return peerConnection;
            },
            []
        );

    // ===========================
    // Join Voice
    // ===========================

    const joinVoice = useCallback(
        async () => {
            const currentRoomId =
                roomIdRef.current;

            const currentUser =
                userRef.current;

            if (
                !currentRoomId ||
                !currentUser?._id ||
                isJoinedRef.current
            ) {
                return;
            }

            try {
                if (
                    !localStreamRef.current
                ) {
                    const stream =
                        await navigator.mediaDevices.getUserMedia(
                            {
                                audio: true,
                                video: false,
                            }
                        );

                    localStreamRef.current =
                        stream;
                }

                isJoinedRef.current = true;

                setIsJoined(true);

                socket.emit("voice:join", {
                    roomId: currentRoomId,
                    user: {
                        _id:
                            currentUser._id,
                        name:
                            currentUser.name,
                        avatar:
                            currentUser.avatar,
                    },
                });
            } catch (error) {
                console.error(
                    "Microphone access error:",
                    error
                );

                if (
                    error?.name ===
                    "NotAllowedError"
                ) {
                    toast.error(
                        "Microphone permission was denied."
                    );
                } else if (
                    error?.name ===
                    "NotFoundError"
                ) {
                    toast.error(
                        "No microphone was found."
                    );
                } else {
                    toast.error(
                        "Unable to access microphone."
                    );
                }
            }
        },
        []
    );

    // ===========================
    // Leave Voice
    // ===========================

    const leaveVoice = useCallback(() => {
        const currentRoomId =
            roomIdRef.current;

        const currentUser =
            userRef.current;

        if (
            !currentRoomId ||
            !currentUser?._id ||
            !isJoinedRef.current
        ) {
            return;
        }

        socket.emit("voice:leave", {
            roomId: currentRoomId,
            userId: currentUser._id,
        });

        peerConnectionsRef.current.forEach(
            (peerConnection) => {
                peerConnection.close();
            }
        );

        peerConnectionsRef.current.clear();

        remoteAudioRefs.current.forEach(
            (audio) => {
                audio.pause();
                audio.srcObject = null;
                audio.remove();
            }
        );

        remoteAudioRefs.current.clear();

        if (localStreamRef.current) {
            localStreamRef.current
                .getTracks()
                .forEach((track) => {
                    track.stop();
                });

            localStreamRef.current = null;
        }

        isJoinedRef.current = false;

        setIsJoined(false);
        setIsMuted(false);
        setParticipants([]);
    }, []);

    // ===========================
    // Toggle Mute
    // ===========================

    const toggleMute = useCallback(() => {
        const currentRoomId =
            roomIdRef.current;

        const currentUser =
            userRef.current;

        const stream =
            localStreamRef.current;

        if (
            !stream ||
            !currentUser?._id
        ) {
            return;
        }

        const audioTrack =
            stream.getAudioTracks()[0];

        if (!audioTrack) {
            return;
        }

        audioTrack.enabled =
            !audioTrack.enabled;

        const muted =
            !audioTrack.enabled;

        setIsMuted(muted);

        socket.emit("voice:mute", {
            roomId: currentRoomId,
            userId: currentUser._id,
            muted,
        });

        setParticipants((current) =>
            current.map((participant) =>
                participant._id?.toString() ===
                currentUser._id?.toString()
                    ? {
                          ...participant,
                          muted,
                      }
                    : participant
            )
        );
    }, []);

    // ===========================
    // Socket Events
    // ===========================

    useEffect(() => {
        if (
            !roomId ||
            !user?._id
        ) {
            return;
        }

        const handleParticipants = ({
            participants,
        }) => {
            setParticipants(
                participants || []
            );
        };

        const handleUserJoined = async ({
            userId,
        }) => {
            if (
                !isJoinedRef.current ||
                userId?.toString() ===
                    userRef.current?._id?.toString()
            ) {
                return;
            }

            const peerConnection =
                createPeerConnection(
                    userId
                );

            const offer =
                await peerConnection.createOffer();

            await peerConnection.setLocalDescription(
                offer
            );

            socket.emit("voice:offer", {
                roomId:
                    roomIdRef.current,
                targetUserId:
                    userId,
                offer,
            });
        };

        const handleOffer = async ({
            userId,
            offer,
        }) => {
            if (
                !isJoinedRef.current
            ) {
                return;
            }

            const peerConnection =
                createPeerConnection(
                    userId
                );

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(
                    offer
                )
            );

            const answer =
                await peerConnection.createAnswer();

            await peerConnection.setLocalDescription(
                answer
            );

            socket.emit("voice:answer", {
                roomId:
                    roomIdRef.current,
                targetUserId:
                    userId,
                answer,
            });
        };

        const handleAnswer = async ({
            userId,
            answer,
        }) => {
            const peerConnection =
                peerConnectionsRef.current.get(
                    userId
                );

            if (!peerConnection) {
                return;
            }

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(
                    answer
                )
            );
        };

        const handleIceCandidate = async ({
            userId,
            candidate,
        }) => {
            const peerConnection =
                peerConnectionsRef.current.get(
                    userId
                );

            if (
                !peerConnection ||
                !candidate
            ) {
                return;
            }

            try {
                await peerConnection.addIceCandidate(
                    new RTCIceCandidate(
                        candidate
                    )
                );
            } catch (error) {
                console.error(
                    "ICE candidate error:",
                    error
                );
            }
        };

        const handleUserLeft = ({
            userId,
        }) => {
            const peerConnection =
                peerConnectionsRef.current.get(
                    userId
                );

            if (peerConnection) {
                peerConnection.close();

                peerConnectionsRef.current.delete(
                    userId
                );
            }

            const audio =
                remoteAudioRefs.current.get(
                    userId
                );

            if (audio) {
                audio.pause();
                audio.srcObject = null;
                audio.remove();

                remoteAudioRefs.current.delete(
                    userId
                );
            }

            setParticipants((current) =>
                current.filter(
                    (participant) =>
                        participant._id?.toString() !==
                        userId?.toString()
                )
            );
        };

        const handleUserMuted = ({
            userId,
            muted,
        }) => {
            setParticipants((current) =>
                current.map((participant) =>
                    participant._id?.toString() ===
                    userId?.toString()
                        ? {
                              ...participant,
                              muted,
                          }
                        : participant
                )
            );

            if (
                userId?.toString() ===
                userRef.current?._id?.toString()
            ) {
                setIsMuted(
                    Boolean(muted)
                );
            }
        };

        socket.on(
            "voice:participants",
            handleParticipants
        );

        socket.on(
            "voice:user-joined",
            handleUserJoined
        );

        socket.on(
            "voice:offer",
            handleOffer
        );

        socket.on(
            "voice:answer",
            handleAnswer
        );

        socket.on(
            "voice:ice-candidate",
            handleIceCandidate
        );

        socket.on(
            "voice:user-left",
            handleUserLeft
        );

        socket.on(
            "voice:user-muted",
            handleUserMuted
        );

        return () => {
            socket.off(
                "voice:participants",
                handleParticipants
            );

            socket.off(
                "voice:user-joined",
                handleUserJoined
            );

            socket.off(
                "voice:offer",
                handleOffer
            );

            socket.off(
                "voice:answer",
                handleAnswer
            );

            socket.off(
                "voice:ice-candidate",
                handleIceCandidate
            );

            socket.off(
                "voice:user-left",
                handleUserLeft
            );

            socket.off(
                "voice:user-muted",
                handleUserMuted
            );
        };
    }, [
        roomId,
        user?._id,
        createPeerConnection,
    ]);

    // ===========================
    // Socket Reconnect
    // ===========================

    useEffect(() => {
        const handleReconnect = () => {
            if (
                isJoinedRef.current &&
                roomIdRef.current &&
                userRef.current?._id
            ) {
                socket.emit("voice:join", {
                    roomId:
                        roomIdRef.current,
                    user: {
                        _id:
                            userRef.current._id,
                        name:
                            userRef.current.name,
                        avatar:
                            userRef.current.avatar,
                    },
                });
            }
        };

        socket.on(
            "connect",
            handleReconnect
        );

        return () => {
            socket.off(
                "connect",
                handleReconnect
            );
        };
    }, []);

    // ===========================
    // Cleanup
    // ===========================

    useEffect(() => {
        return () => {
            if (
                isJoinedRef.current
            ) {
                const currentRoomId =
                    roomIdRef.current;

                const currentUser =
                    userRef.current;

                socket.emit("voice:leave", {
                    roomId:
                        currentRoomId,
                    userId:
                        currentUser?._id,
                });

                peerConnectionsRef.current.forEach(
                    (peerConnection) => {
                        peerConnection.close();
                    }
                );

                peerConnectionsRef.current.clear();

                remoteAudioRefs.current.forEach(
                    (audio) => {
                        audio.pause();
                        audio.srcObject =
                            null;
                        audio.remove();
                    }
                );

                remoteAudioRefs.current.clear();

                if (
                    localStreamRef.current
                ) {
                    localStreamRef.current
                        .getTracks()
                        .forEach(
                            (track) =>
                                track.stop()
                        );

                    localStreamRef.current =
                        null;
                }

                isJoinedRef.current =
                    false;
            }
        };
    }, []);

    return {
        isJoined,
        isMuted,
        participants,
        joinVoice,
        leaveVoice,
        toggleMute,
    };
};

export default useVoiceChat;