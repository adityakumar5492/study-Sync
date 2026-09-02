import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import socket from "../socket/socket";
import toast from "react-hot-toast";

const ICE_SERVERS = [
    {
        urls: "stun:stun.l.google.com:19302",
    },
];

const useVoiceChat = ({ roomId, user }) => {
    const [isJoined, setIsJoined] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [speakingUsers, setSpeakingUsers] = useState({});
    const [connectionStates, setConnectionStates] = useState({});
    const [audioPlaybackBlocked, setAudioPlaybackBlocked] =
        useState(false);

    const localStreamRef = useRef(null);
    const peerConnectionsRef = useRef(new Map());
    const remoteAudioRefs = useRef(new Map());
    const pendingIceCandidatesRef = useRef(new Map());

    const audioAnalyserRefs = useRef(new Map());
    const speakingAnimationRefs = useRef(new Map());
    const audioContextRef = useRef(null);

    const isJoinedRef = useRef(false);
    const isJoiningRef = useRef(false);

    const roomIdRef = useRef(roomId);
    const userRef = useRef(user);

    useEffect(() => {
        roomIdRef.current = roomId;
        userRef.current = user;
    }, [roomId, user]);

    // ===========================
    // Connection State
    // ===========================

    const setConnectionState = useCallback((userId, state) => {
        const normalizedId = userId?.toString();

        if (!normalizedId) {
            return;
        }

        setConnectionStates((current) => {
            if (current[normalizedId] === state) {
                return current;
            }

            return {
                ...current,
                [normalizedId]: state,
            };
        });
    }, []);

    const clearConnectionState = useCallback((userId) => {
        const normalizedId = userId?.toString();

        if (!normalizedId) {
            return;
        }

        setConnectionStates((current) => {
            if (!current[normalizedId]) {
                return current;
            }

            const next = {
                ...current,
            };

            delete next[normalizedId];

            return next;
        });
    }, []);

    // ===========================
    // Speaking Detection
    // ===========================

    const stopSpeakingDetection = useCallback((userId) => {
        const normalizedId = userId?.toString();

        if (!normalizedId) {
            return;
        }

        const animation =
            speakingAnimationRefs.current.get(
                normalizedId
            );

        if (animation) {
            cancelAnimationFrame(animation);

            speakingAnimationRefs.current.delete(
                normalizedId
            );
        }

        const analyserData =
            audioAnalyserRefs.current.get(
                normalizedId
            );

        if (analyserData?.source) {
            try {
                analyserData.source.disconnect();
            } catch {
                // Already disconnected.
            }
        }

        audioAnalyserRefs.current.delete(
            normalizedId
        );

        setSpeakingUsers((current) => {
            if (!current[normalizedId]) {
                return current;
            }

            const next = {
                ...current,
            };

            delete next[normalizedId];

            return next;
        });
    }, []);

    const startSpeakingDetection = useCallback(
        (userId, stream) => {
            const normalizedId =
                userId?.toString();

            if (!normalizedId || !stream) {
                return;
            }

            if (
                audioAnalyserRefs.current.has(
                    normalizedId
                )
            ) {
                return;
            }

            try {
                if (!audioContextRef.current) {
                    const AudioContext =
                        window.AudioContext ||
                        window.webkitAudioContext;

                    if (!AudioContext) {
                        return;
                    }

                    audioContextRef.current =
                        new AudioContext();
                }

                const audioContext =
                    audioContextRef.current;

                if (
                    audioContext.state ===
                    "suspended"
                ) {
                    audioContext
                        .resume()
                        .catch(() => {});
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
                    normalizedId,
                    {
                        analyser,
                        source,
                        dataArray,
                    }
                );

                const detect = () => {
                    const analyserData =
                        audioAnalyserRefs.current.get(
                            normalizedId
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
                        i += 1
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

                    const speaking =
                        rms > 0.035;

                    setSpeakingUsers((current) => {
                        if (
                            current[
                                normalizedId
                            ] === speaking
                        ) {
                            return current;
                        }

                        return {
                            ...current,
                            [normalizedId]:
                                speaking,
                        };
                    });

                    const animationFrame =
                        requestAnimationFrame(
                            detect
                        );

                    speakingAnimationRefs.current.set(
                        normalizedId,
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
    // Pending ICE Candidates
    // ===========================

    const flushPendingIceCandidates =
        useCallback(
            async (
                userId,
                peerConnection
            ) => {
                const normalizedId =
                    userId?.toString();

                if (
                    !normalizedId ||
                    !peerConnection.remoteDescription
                ) {
                    return;
                }

                const pending =
                    pendingIceCandidatesRef.current.get(
                        normalizedId
                    );

                if (!pending?.length) {
                    return;
                }

                pendingIceCandidatesRef.current.delete(
                    normalizedId
                );

                for (const candidate of pending) {
                    try {
                        await peerConnection.addIceCandidate(
                            candidate
                        );
                    } catch (error) {
                        console.error(
                            "Pending ICE candidate error:",
                            error
                        );
                    }
                }
            },
            []
        );

    // ===========================
    // Remote Audio
    // ===========================

    const removeRemoteAudio = useCallback(
        (userId) => {
            const normalizedId =
                userId?.toString();

            if (!normalizedId) {
                return;
            }

            const audio =
                remoteAudioRefs.current.get(
                    normalizedId
                );

            if (audio) {
                audio.pause();
                audio.srcObject = null;
                audio.remove();

                remoteAudioRefs.current.delete(
                    normalizedId
                );
            }
        },
        []
    );

    // ===========================
    // Close Peer Connection
    // ===========================

    const closePeerConnection =
        useCallback(
            (userId) => {
                const normalizedId =
                    userId?.toString();

                if (!normalizedId) {
                    return;
                }

                const peerConnection =
                    peerConnectionsRef.current.get(
                        normalizedId
                    );

                if (peerConnection) {
                    peerConnection.ontrack =
                        null;

                    peerConnection.onicecandidate =
                        null;

                    peerConnection.onconnectionstatechange =
                        null;

                    peerConnection.oniceconnectionstatechange =
                        null;

                    peerConnection.close();

                    peerConnectionsRef.current.delete(
                        normalizedId
                    );
                }

                pendingIceCandidatesRef.current.delete(
                    normalizedId
                );

                removeRemoteAudio(
                    normalizedId
                );

                stopSpeakingDetection(
                    normalizedId
                );

                clearConnectionState(
                    normalizedId
                );
            },
            [
                clearConnectionState,
                removeRemoteAudio,
                stopSpeakingDetection,
            ]
        );

    // ===========================
    // Create Peer Connection
    // ===========================

    const createPeerConnection =
        useCallback(
            (userId) => {
                const normalizedId =
                    userId?.toString();

                if (!normalizedId) {
                    return null;
                }

                const existing =
                    peerConnectionsRef.current.get(
                        normalizedId
                    );

                if (
                    existing &&
                    existing.connectionState !==
                        "closed"
                ) {
                    return existing;
                }

                const peerConnection =
                    new RTCPeerConnection({
                        iceServers:
                            ICE_SERVERS,
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

                // Connection state
                peerConnection.onconnectionstatechange =
                    () => {
                        const state =
                            peerConnection.connectionState;

                        if (
                            state ===
                            "connected"
                        ) {
                            setConnectionState(
                                normalizedId,
                                "connected"
                            );
                        } else if (
                            state ===
                            "connecting"
                        ) {
                            setConnectionState(
                                normalizedId,
                                "connecting"
                            );
                        } else if (
                            state ===
                            "failed"
                        ) {
                            setConnectionState(
                                normalizedId,
                                "failed"
                            );
                        } else if (
                            state ===
                            "disconnected"
                        ) {
                            setConnectionState(
                                normalizedId,
                                "disconnected"
                            );
                        }
                    };

                peerConnection.oniceconnectionstatechange =
                    () => {
                        if (
                            peerConnection.iceConnectionState ===
                            "failed"
                        ) {
                            setConnectionState(
                                normalizedId,
                                "failed"
                            );
                        }
                    };

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
                            normalizedId
                        );

                    if (!audio) {
                        audio =
                            document.createElement(
                                "audio"
                            );

                        audio.autoplay = true;
                        audio.playsInline = true;
                        audio.controls = false;
                        audio.setAttribute(
                            "aria-hidden",
                            "true"
                        );

                        audio.className =
                            "hidden";

                        audio.dataset.voiceParticipantId =
                            normalizedId;

                        document.body.appendChild(
                            audio
                        );

                        remoteAudioRefs.current.set(
                            normalizedId,
                            audio
                        );
                    }

                    audio.srcObject =
                        remoteStream;

                    const playRemoteAudio =
                        async () => {
                            try {
                                await audio.play();

                                setAudioPlaybackBlocked(
                                    false
                                );
                            } catch (error) {
                                console.warn(
                                    "Remote audio playback was blocked:",
                                    error
                                );

                                setAudioPlaybackBlocked(
                                    true
                                );
                            }
                        };

                    playRemoteAudio();

                    startSpeakingDetection(
                        normalizedId,
                        remoteStream
                    );
                };

                // ICE
                peerConnection.onicecandidate =
                    (event) => {
                        if (
                            !event.candidate
                        ) {
                            return;
                        }

                        socket.emit(
                            "voice:ice-candidate",
                            {
                                roomId:
                                    roomIdRef.current,
                                targetUserId:
                                    normalizedId,
                                candidate:
                                    event.candidate,
                            }
                        );
                    };

                peerConnectionsRef.current.set(
                    normalizedId,
                    peerConnection
                );

                setConnectionState(
                    normalizedId,
                    "connecting"
                );

                return peerConnection;
            },
            [
                setConnectionState,
                startSpeakingDetection,
            ]
        );

    // ===========================
    // Cleanup
    // ===========================

    const cleanupVoice = useCallback(
        ({ notifyServer = true } = {}) => {
            const currentRoomId =
                roomIdRef.current;

            const currentUser =
                userRef.current;

            if (
                notifyServer &&
                currentRoomId &&
                currentUser?._id &&
                isJoinedRef.current
            ) {
                socket.emit(
                    "voice:leave",
                    {
                        roomId:
                            currentRoomId,
                        userId:
                            currentUser._id,
                    }
                );
            }

            peerConnectionsRef.current.forEach(
                (peerConnection) => {
                    peerConnection.ontrack =
                        null;

                    peerConnection.onicecandidate =
                        null;

                    peerConnection.onconnectionstatechange =
                        null;

                    peerConnection.oniceconnectionstatechange =
                        null;

                    peerConnection.close();
                }
            );

            peerConnectionsRef.current.clear();

            pendingIceCandidatesRef.current.clear();

            remoteAudioRefs.current.forEach(
                (audio) => {
                    audio.pause();
                    audio.srcObject = null;
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

            audioAnalyserRefs.current.forEach(
                ({ source }) => {
                    try {
                        source.disconnect();
                    } catch {
                        // Already disconnected.
                    }
                }
            );

            audioAnalyserRefs.current.clear();

            if (audioContextRef.current) {
                audioContextRef.current
                    .close()
                    .catch(() => {});

                audioContextRef.current =
                    null;
            }

            if (localStreamRef.current) {
                localStreamRef.current
                    .getTracks()
                    .forEach((track) => {
                        track.stop();
                    });

                localStreamRef.current =
                    null;
            }

            isJoinedRef.current = false;
            isJoiningRef.current = false;

            setIsJoined(false);
            setIsJoining(false);
            setIsMuted(false);
            setParticipants([]);
            setSpeakingUsers({});
            setConnectionStates({});
            setAudioPlaybackBlocked(false);
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
                isJoinedRef.current ||
                isJoiningRef.current
            ) {
                return;
            }

            isJoiningRef.current = true;
            setIsJoining(true);

            try {
                if (
                    !navigator.mediaDevices
                        ?.getUserMedia
                ) {
                    throw new Error(
                        "MEDIA_DEVICES_UNAVAILABLE"
                    );
                }

                const stream =
                    await navigator.mediaDevices.getUserMedia(
                        {
                            audio: {
                                echoCancellation:
                                    true,
                                noiseSuppression:
                                    true,
                                autoGainControl:
                                    true,
                            },
                            video: false,
                        }
                    );

                localStreamRef.current =
                    stream;

                const audioTrack =
                    stream.getAudioTracks()[0];

                if (!audioTrack) {
                    throw new Error(
                        "NO_AUDIO_TRACK"
                    );
                }

                audioTrack.enabled = true;

                startSpeakingDetection(
                    currentUser._id.toString(),
                    stream
                );

                isJoinedRef.current =
                    true;

                setIsJoined(true);
                setIsMuted(false);

                socket.emit(
                    "voice:join",
                    {
                        roomId:
                            currentRoomId,
                        user: {
                            _id:
                                currentUser._id,
                            name:
                                currentUser.name,
                            avatar:
                                currentUser.avatar,
                        },
                    }
                );
            } catch (error) {
                console.error(
                    "Microphone access error:",
                    error
                );

                if (
                    localStreamRef.current
                ) {
                    localStreamRef.current
                        .getTracks()
                        .forEach((track) => {
                            track.stop();
                        });

                    localStreamRef.current =
                        null;
                }

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
                } else if (
                    error?.message ===
                    "MEDIA_DEVICES_UNAVAILABLE"
                ) {
                    toast.error(
                        "Voice is not supported in this browser."
                    );
                } else {
                    toast.error(
                        "Unable to access microphone."
                    );
                }
            } finally {
                isJoiningRef.current =
                    false;

                setIsJoining(false);
            }
        },
        [startSpeakingDetection]
    );

    // ===========================
    // Leave Voice
    // ===========================

    const leaveVoice = useCallback(() => {
        if (!isJoinedRef.current) {
            return;
        }

        cleanupVoice({
            notifyServer: true,
        });
    }, [cleanupVoice]);

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
            !currentUser?._id ||
            !isJoinedRef.current
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

        const currentUserId =
            currentUser._id.toString();

        setSpeakingUsers((current) => ({
            ...current,
            [currentUserId]: false,
        }));

        setParticipants((current) =>
            current.map((participant) =>
                participant._id?.toString() ===
                currentUserId
                    ? {
                          ...participant,
                          muted,
                      }
                    : participant
            )
        );

        socket.emit(
            "voice:mute",
            {
                roomId:
                    currentRoomId,
                userId:
                    currentUser._id,
                muted,
            }
        );
    }, []);

    // ===========================
    // Resume Remote Audio
    // ===========================

    const resumeRemoteAudio =
        useCallback(async () => {
            let blocked = false;

            for (const audio of remoteAudioRefs.current.values()) {
                try {
                    await audio.play();
                } catch (error) {
                    blocked = true;

                    console.warn(
                        "Unable to resume remote audio:",
                        error
                    );
                }
            }

            if (!blocked) {
                setAudioPlaybackBlocked(
                    false
                );
            }
        }, []);

    // ===========================
    // Socket Events
    // ===========================

    useEffect(() => {
        if (!roomId || !user?._id) {
            return undefined;
        }

        const handleParticipants = ({
            participants:
                nextParticipants,
        }) => {
            setParticipants(
                nextParticipants || []
            );
        };

        const handleUserJoined = async ({
            userId,
        }) => {
            const normalizedId =
                userId?.toString();

            if (
                !isJoinedRef.current ||
                !normalizedId ||
                normalizedId ===
                    userRef.current?._id?.toString()
            ) {
                return;
            }

            try {
                const peerConnection =
                    createPeerConnection(
                        normalizedId
                    );

                if (!peerConnection) {
                    return;
                }

                const offer =
                    await peerConnection.createOffer();

                await peerConnection.setLocalDescription(
                    offer
                );

                socket.emit(
                    "voice:offer",
                    {
                        roomId:
                            roomIdRef.current,
                        targetUserId:
                            normalizedId,
                        offer,
                    }
                );
            } catch (error) {
                console.error(
                    "Voice offer error:",
                    error
                );

                setConnectionState(
                    normalizedId,
                    "failed"
                );
            }
        };

        const handleOffer = async ({
            userId,
            offer,
        }) => {
            const normalizedId =
                userId?.toString();

            if (
                !isJoinedRef.current ||
                !normalizedId ||
                !offer
            ) {
                return;
            }

            try {
                const peerConnection =
                    createPeerConnection(
                        normalizedId
                    );

                if (!peerConnection) {
                    return;
                }

                await peerConnection.setRemoteDescription(
                    new RTCSessionDescription(
                        offer
                    )
                );

                await flushPendingIceCandidates(
                    normalizedId,
                    peerConnection
                );

                const answer =
                    await peerConnection.createAnswer();

                await peerConnection.setLocalDescription(
                    answer
                );

                socket.emit(
                    "voice:answer",
                    {
                        roomId:
                            roomIdRef.current,
                        targetUserId:
                            normalizedId,
                        answer,
                    }
                );
            } catch (error) {
                console.error(
                    "Voice answer error:",
                    error
                );

                setConnectionState(
                    normalizedId,
                    "failed"
                );
            }
        };

        const handleAnswer = async ({
            userId,
            answer,
        }) => {
            const normalizedId =
                userId?.toString();

            const peerConnection =
                peerConnectionsRef.current.get(
                    normalizedId
                );

            if (
                !peerConnection ||
                !answer
            ) {
                return;
            }

            try {
                await peerConnection.setRemoteDescription(
                    new RTCSessionDescription(
                        answer
                    )
                );

                await flushPendingIceCandidates(
                    normalizedId,
                    peerConnection
                );
            } catch (error) {
                console.error(
                    "Voice remote description error:",
                    error
                );

                setConnectionState(
                    normalizedId,
                    "failed"
                );
            }
        };

        const handleIceCandidate =
            async ({
                userId,
                candidate,
            }) => {
                const normalizedId =
                    userId?.toString();

                if (
                    !normalizedId ||
                    !candidate
                ) {
                    return;
                }

                const peerConnection =
                    peerConnectionsRef.current.get(
                        normalizedId
                    );

                const iceCandidate =
                    new RTCIceCandidate(
                        candidate
                    );

                if (!peerConnection) {
                    const pending =
                        pendingIceCandidatesRef.current.get(
                            normalizedId
                        ) || [];

                    pending.push(
                        iceCandidate
                    );

                    pendingIceCandidatesRef.current.set(
                        normalizedId,
                        pending
                    );

                    return;
                }

                if (
                    !peerConnection.remoteDescription
                ) {
                    const pending =
                        pendingIceCandidatesRef.current.get(
                            normalizedId
                        ) || [];

                    pending.push(
                        iceCandidate
                    );

                    pendingIceCandidatesRef.current.set(
                        normalizedId,
                        pending
                    );

                    return;
                }

                try {
                    await peerConnection.addIceCandidate(
                        iceCandidate
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
            closePeerConnection(
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
            const normalizedId =
                userId?.toString();

            setParticipants((current) =>
                current.map((participant) =>
                    participant._id?.toString() ===
                    normalizedId
                        ? {
                              ...participant,
                              muted: Boolean(
                                  muted
                              ),
                          }
                        : participant
                )
            );

            if (
                normalizedId ===
                userRef.current?._id?.toString()
            ) {
                setIsMuted(
                    Boolean(muted)
                );

                if (muted) {
                    setSpeakingUsers(
                        (current) => ({
                            ...current,
                            [normalizedId]:
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
        closePeerConnection,
        createPeerConnection,
        flushPendingIceCandidates,
        setConnectionState,
    ]);

    // ===========================
    // Socket Reconnect
    // ===========================

    useEffect(() => {
        const handleReconnect = () => {
            if (
                !isJoinedRef.current ||
                !roomIdRef.current ||
                !userRef.current?._id
            ) {
                return;
            }

            peerConnectionsRef.current.forEach(
                (peerConnection) => {
                    peerConnection.close();
                }
            );

            peerConnectionsRef.current.clear();

            pendingIceCandidatesRef.current.clear();

            setConnectionStates({});

            socket.emit(
                "voice:join",
                {
                    roomId:
                        roomIdRef.current,
                    user: {
                        _id:
                            userRef.current
                                ._id,
                        name:
                            userRef.current
                                .name,
                        avatar:
                            userRef.current
                                .avatar,
                    },
                }
            );
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
            cleanupVoice({
                notifyServer:
                    isJoinedRef.current,
            });
        };
    }, [cleanupVoice]);

    return {
        isJoined,
        isJoining,
        isMuted,
        participants,
        speakingUsers,
        connectionStates,
        audioPlaybackBlocked,
        joinVoice,
        leaveVoice,
        toggleMute,
        resumeRemoteAudio,
    };
};

export default useVoiceChat;