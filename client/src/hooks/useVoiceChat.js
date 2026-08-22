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

    // NEW: tracks users who are currently speaking
    const [speakingUsers, setSpeakingUsers] =
        useState({});

    const localStreamRef =
        useRef(null);

    const peerConnectionsRef =
        useRef(new Map());

    const remoteAudioRefs =
        useRef(new Map());

    // NEW: audio analysers
    const audioAnalyserRefs =
        useRef(new Map());

    const speakingAnimationRefs =
        useRef(new Map());

    const audioContextRef =
        useRef(null);

    const isJoinedRef =
        useRef(false);

    const roomIdRef =
        useRef(roomId);

    const userRef =
        useRef(user);

    useEffect(() => {
        roomIdRef.current = roomId;
        userRef.current = user;
    }, [roomId, user]);

    // ===========================
    // Audio Speaking Detection
    // ===========================

    const stopSpeakingDetection = useCallback(
        (userId) => {
            const animation =
                speakingAnimationRefs.current.get(
                    userId
                );

            if (animation) {
                cancelAnimationFrame(animation);
                speakingAnimationRefs.current.delete(
                    userId
                );
            }

            audioAnalyserRefs.current.delete(
                userId
            );

            setSpeakingUsers((current) => {
                if (!current[userId]) {
                    return current;
                }

                const next = {
                    ...current,
                };

                delete next[userId];

                return next;
            });
        },
        []
    );

    const startSpeakingDetection = useCallback(
        (userId, stream) => {
            if (!stream) {
                return;
            }

            if (
                audioAnalyserRefs.current.has(
                    userId
                )
            ) {
                return;
            }

            try {
                if (!audioContextRef.current) {
                    audioContextRef.current =
                        new (
                            window.AudioContext ||
                            window.webkitAudioContext
                        )();
                }

                const audioContext =
                    audioContextRef.current;

                if (
                    audioContext.state ===
                    "suspended"
                ) {
                    audioContext.resume().catch(
                        () => {}
                    );
                }

                const analyser =
                    audioContext.createAnalyser();

                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.75;

                const source =
                    audioContext.createMediaStreamSource(
                        stream
                    );

                source.connect(analyser);

                const dataArray =
                    new Uint8Array(
                        analyser.frequencyBinCount
                    );

                audioAnalyserRefs.current.set(
                    userId,
                    {
                        analyser,
                        source,
                        dataArray,
                    }
                );

                const detect = () => {
                    const analyserData =
                        audioAnalyserRefs.current.get(
                            userId
                        );

                    if (!analyserData) {
                        return;
                    }

                    const {
                        analyser,
                        dataArray,
                    } = analyserData;

                    analyser.getByteTimeDomainData(
                        dataArray
                    );

                    let sum = 0;

                    for (
                        let i = 0;
                        i < dataArray.length;
                        i++
                    ) {
                        const normalized =
                            (dataArray[i] - 128) /
                            128;

                        sum +=
                            normalized *
                            normalized;
                    }

                    const rms = Math.sqrt(
                        sum / dataArray.length
                    );

                    // Speaking threshold.
                    // Small background noise is ignored.
                    const speaking =
                        rms > 0.035;

                    setSpeakingUsers((current) => {
                        if (
                            current[userId] ===
                            speaking
                        ) {
                            return current;
                        }

                        return {
                            ...current,
                            [userId]: speaking,
                        };
                    });

                    const animationFrame =
                        requestAnimationFrame(
                            detect
                        );

                    speakingAnimationRefs.current.set(
                        userId,
                        animationFrame
                    );
                };

                detect();
            } catch (error) {
                console.error(
                    "Speaking detection error:",
                    error
                );
            }
        },
        []
    );

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

                    // NEW: detect remote speaking
                    startSpeakingDetection(
                        userId,
                        remoteStream
                    );
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
            [startSpeakingDetection]
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

                    // NEW: detect local speaking
                    startSpeakingDetection(
                        currentUser._id.toString(),
                        stream
                    );
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
        [startSpeakingDetection]
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

        // NEW: stop all speaking detection
        speakingAnimationRefs.current.forEach(
            (animation) => {
                cancelAnimationFrame(animation);
            }
        );

        speakingAnimationRefs.current.clear();

        audioAnalyserRefs.current.clear();

        setSpeakingUsers({});

        if (localStreamRef.current) {
            localStreamRef.current
                .getTracks()
                .forEach((track) => {
                    track.stop();
                });

            localStreamRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current
                .close()
                .catch(() => {});

            audioContextRef.current = null;
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

        if (muted) {
            setSpeakingUsers((current) => ({
                ...current,
                [currentUser._id.toString()]:
                    false,
            }));
        }

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

            stopSpeakingDetection(
                userId
            );

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

                if (muted) {
                    setSpeakingUsers(
                        (current) => ({
                            ...current,
                            [userId.toString()]:
                                false,
                        })
                    );
                }
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
        stopSpeakingDetection,
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

                speakingAnimationRefs.current.forEach(
                    (animation) => {
                        cancelAnimationFrame(
                            animation
                        );
                    }
                );

                speakingAnimationRefs.current.clear();

                audioAnalyserRefs.current.clear();

                if (
                    audioContextRef.current
                ) {
                    audioContextRef.current
                        .close()
                        .catch(() => {});

                    audioContextRef.current = null;
                }

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
        speakingUsers,
        joinVoice,
        leaveVoice,
        toggleMute,
    };
};

export default useVoiceChat;