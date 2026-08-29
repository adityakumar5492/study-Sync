import {
    FaUserCircle,
    FaCrown,
    FaUserMinus,
    FaCheck,
    FaTimes,
    FaUsers,
    FaCircle,
    FaBolt,
} from "react-icons/fa";

import { BsLightningChargeFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

import toast from "react-hot-toast";
import { getCollaboratorColor } from "./collaboratorColors";

import {
    approveRoomRejoin,
    rejectRoomRejoin,
} from "../../api/room.api";

import socket from "../../socket/socket";

import {
    useAppDispatch,
    useAppSelector,
} from "../../redux/hooks";

import {
    getRoomThunk,
} from "../../redux/room/roomThunk";

const Participants = ({
    room,
    roomId,
    participants = [],
    onlineUsers = [],
    onRemoveMember,
}) => {
    const dispatch = useAppDispatch();

    const { user } = useAppSelector(
        (state) => state.auth
    );

    // ===========================
    // NORMALIZE ID
    // ===========================

    const getUserId = (value) => {
        if (!value) {
            return null;
        }

        if (typeof value === "string") {
            return value.toString();
        }

        if (typeof value === "object") {
            return (
                value._id?.toString() ||
                value.id?.toString() ||
                value.userId?.toString() ||
                null
            );
        }

        return value?.toString() || null;
    };

    // ===========================
    // HOST / CURRENT USER
    // ===========================

    const hostId = getUserId(room?.host);

    const currentUserId = getUserId(user);

    const isCurrentUserHost =
        hostId === currentUserId;

    // ===========================
    // UNIQUE PARTICIPANTS
    // ===========================

    const uniqueParticipants = (() => {
        const map = new Map();

        (Array.isArray(participants)
            ? participants
            : []
        ).forEach((participant) => {
            const id = getUserId(participant);

            if (!id || map.has(id)) {
                return;
            }

            map.set(id, participant);
        });

        return Array.from(map.values());
    })();

    // ===========================
    // UNIQUE ONLINE USERS
    // ===========================

    const uniqueOnlineUsers = (() => {
        const map = new Map();

        (Array.isArray(onlineUsers)
            ? onlineUsers
            : []
        ).forEach((onlineUser) => {
            const id = getUserId(onlineUser);

            if (!id || map.has(id)) {
                return;
            }

            map.set(id, onlineUser);
        });

        return Array.from(map.values());
    })();

    // ===========================
    // ONLINE CHECK
    // ===========================

    const isOnline = (participantId) => {
        const normalizedId =
            getUserId(participantId);

        if (!normalizedId) {
            return false;
        }

        return uniqueOnlineUsers.some(
            (onlineUser) =>
                getUserId(onlineUser) ===
                normalizedId
        );
    };

    // ===========================
    // APPROVE REJOIN
    // ===========================

    const handleApproveRejoin = async (
        userId
    ) => {
        if (!userId) {
            return;
        }

        try {
            await approveRoomRejoin(
                roomId,
                userId
            );

            socket.emit(
                "room:rejoin-approved",
                {
                    roomId,
                    userId,
                }
            );

            toast.success(
                "Rejoin request approved."
            );

            dispatch(
                getRoomThunk(roomId)
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to approve request."
            );
        }
    };

    // ===========================
    // REJECT REJOIN
    // ===========================

    const handleRejectRejoin = async (
        userId
    ) => {
        if (!userId) {
            return;
        }

        try {
            await rejectRoomRejoin(
                roomId,
                userId
            );

            toast.success(
                "Rejoin request rejected."
            );

            dispatch(
                getRoomThunk(roomId)
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to reject request."
            );
        }
    };

    // ===========================
    // ACTIVE PARTICIPANTS
    // ===========================

    const activeParticipants =
        uniqueParticipants.map(
            (participant) => ({
                ...participant,
                previouslyRemoved: false,
            })
        );

    // ===========================
    // PREVIOUSLY REMOVED
    // ===========================

    const removedParticipants = (
        Array.isArray(room?.removedMembers)
            ? room.removedMembers
            : []
    )
        .filter((entry) => entry?.user)
        .map((entry) => ({
            ...entry.user,
            previouslyRemoved: true,
            removedAt: entry.removedAt,
        }));

    // ===========================
    // DISPLAYED PARTICIPANTS
    // ===========================

    const displayedParticipants = [
        ...activeParticipants,
        ...removedParticipants.filter(
            (removed) => {
                const removedId =
                    getUserId(removed);

                return !activeParticipants.some(
                    (active) =>
                        getUserId(active) ===
                        removedId
                );
            }
        ),
    ];

    // ===========================
    // PENDING REJOIN REQUESTS
    // ===========================

    const pendingRequests = (
        Array.isArray(room?.rejoinRequests)
            ? room.rejoinRequests
            : []
    ).filter(
        (request) =>
            request?.status === "pending" &&
            request?.user
    );

    // ===========================
    // COUNTS
    // ===========================

    const totalParticipants =
        uniqueParticipants.length;

    const totalOnline =
        uniqueOnlineUsers.length;

    return (
        <div className="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-b border-white/[0.07] bg-[#07070c] p-3 text-white sm:p-4">

            {/* ==========================================
                AMBIENT BACKGROUND
            ========================================== */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 25, -15, 0],
                        y: [0, -20, 15, 0],
                        scale: [1, 1.08, 0.96, 1],
                    }}
                    transition={{
                        duration: 17,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/[0.07] blur-[90px]"
                />

                <motion.div
                    animate={{
                        x: [0, -20, 20, 0],
                        y: [0, 20, -15, 0],
                    }}
                    transition={{
                        duration: 19,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-500/[0.045] blur-[90px]"
                />

                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
                        backgroundSize: "38px 38px",
                    }}
                />
            </div>

            {/* ==========================================
                HEADER
            ========================================== */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: -12,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="relative z-10 mb-3 flex min-w-0 shrink-0 items-center justify-between gap-2 sm:mb-5 sm:gap-3"
            >
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <motion.div
                        whileHover={{
                            scale: 1.08,
                            rotate: 4,
                        }}
                        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-cyan-400/10 shadow-[0_0_35px_rgba(139,92,246,.1)] sm:h-11 sm:w-11 sm:rounded-2xl"
                    >
                        <FaUsers className="text-xs text-violet-300 sm:text-sm" />

                        <motion.span
                            animate={{
                                scale: [1, 1.35, 1],
                                opacity: [0.6, 0, 0.6],
                            }}
                            transition={{
                                duration: 2.4,
                                repeat: Infinity,
                            }}
                            className="absolute inset-0 rounded-xl border border-violet-400/20 sm:rounded-2xl"
                        />
                    </motion.div>

                    <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                            <h3 className="truncate text-xs font-bold tracking-tight text-white sm:text-sm">
                                Participants
                            </h3>

                            <motion.span
                                animate={{
                                    opacity: [0.45, 1, 0.45],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
                            />
                        </div>

                        <p className="mt-1 truncate text-[8px] text-zinc-500 sm:text-[9px]">
                            {totalParticipants}{" "}
                            {totalParticipants === 1
                                ? "participant"
                                : "participants"}{" "}
                            in room
                        </p>
                    </div>
                </div>

                {/* ONLINE COUNTER */}

                <motion.div
                    animate={{
                        y: [0, -2, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                    }}
                    className="relative shrink-0 overflow-hidden rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2 py-1 sm:px-3 sm:py-1.5"
                >
                    <motion.span
                        animate={{
                            x: ["-100%", "150%"],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute inset-y-0 w-5 bg-white/10 blur-md"
                    />

                    <span className="relative flex items-center gap-1 text-[8px] font-bold text-emerald-300 sm:gap-1.5 sm:text-[9px]">
                        <span className="relative flex h-2 w-2 items-center justify-center">
                            <motion.span
                                animate={{
                                    scale: [1, 1.7, 1],
                                    opacity: [0.8, 0, 0.8],
                                }}
                                transition={{
                                    duration: 1.7,
                                    repeat: Infinity,
                                }}
                                className="absolute h-full w-full rounded-full bg-emerald-400"
                            />

                            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>

                        {totalOnline} /{" "}
                        {totalParticipants} Online
                    </span>
                </motion.div>
            </motion.div>

            {/* ==========================================
                MINI PRESENCE BAR
            ========================================== */}

            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.97,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                }}
                className="relative z-10 mb-3 shrink-0 overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5 backdrop-blur-xl sm:mb-4 sm:rounded-2xl sm:p-3"
            >
                <div className="flex min-w-0 items-center justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-[7px] font-black uppercase tracking-[.18em] text-zinc-600 sm:text-[8px]">
                            Live presence
                        </p>

                        <p className="mt-1 truncate text-[9px] text-zinc-400 sm:text-[10px]">
                            {totalOnline > 0
                                ? totalOnline === 1
                                    ? "Your group is active"
                                    : "Your group is active"
                                : "Waiting for your group"}
                        </p>
                    </div>

                    <div className="flex shrink-0 -space-x-1.5 sm:-space-x-2">
                        {uniqueOnlineUsers
                            .slice(0, 5)
                            .map(
                                (
                                    onlineUser,
                                    index
                                ) => {
                                    const userId =
                                        getUserId(
                                            onlineUser
                                        );

                                    const color =
                                        getCollaboratorColor(
                                            userId
                                        );

                                    return (
                                        <motion.div
                                            key={
                                                userId ||
                                                index
                                            }
                                            initial={{
                                                opacity: 0,
                                                scale: 0.5,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            transition={{
                                                delay:
                                                    index *
                                                    0.08,
                                            }}
                                            whileHover={{
                                                y: -4,
                                                scale: 1.12,
                                            }}
                                            className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#09090f] text-[7px] font-black text-white sm:h-8 sm:w-8 sm:text-[8px]"
                                            style={{
                                                backgroundColor:
                                                    color,
                                            }}
                                        >
                                            {onlineUser?.name?.[0]?.toUpperCase() ||
                                                onlineUser?.username?.[0]?.toUpperCase() ||
                                                "U"}

                                            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-[#09090f] bg-emerald-400 sm:h-2.5 sm:w-2.5" />
                                        </motion.div>
                                    );
                                }
                            )}

                        {totalOnline > 5 && (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#09090f] bg-zinc-800 text-[7px] font-bold text-zinc-400 sm:h-8 sm:w-8 sm:text-[8px]">
                                +{totalOnline - 5}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-2.5 h-px overflow-hidden bg-white/[0.05] sm:mt-3">
                    <motion.div
                        animate={{
                            x: [
                                "-100%",
                                "100%",
                            ],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="h-full w-1/3 bg-gradient-to-r from-transparent via-violet-400/70 to-transparent"
                    />
                </div>
            </motion.div>

            {/* ==========================================
                REJOIN REQUESTS
            ========================================== */}

            <AnimatePresence>
                {isCurrentUserHost &&
                    pendingRequests.length >
                        0 && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            height: 0,
                            y: -10,
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto",
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                        }}
                        className="relative z-10 mb-3 shrink-0 overflow-hidden rounded-xl border border-orange-400/15 bg-orange-400/[0.045] p-2.5 shadow-[0_10px_40px_rgba(249,115,22,.05)] sm:mb-4 sm:rounded-2xl sm:p-3"
                    >
                        <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <motion.div
                                    animate={{
                                        rotate: [
                                            -5,
                                            5,
                                            -5,
                                        ],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-300 sm:h-8 sm:w-8 sm:rounded-xl"
                                >
                                    <FaBolt className="text-[10px] sm:text-xs" />
                                </motion.div>

                                <div className="min-w-0">
                                    <p className="truncate text-[9px] font-bold text-orange-300 sm:text-[10px]">
                                        Rejoin Requests
                                    </p>

                                    <p className="mt-0.5 hidden text-[8px] text-orange-300/40 sm:block">
                                        Requires your approval
                                    </p>
                                </div>
                            </div>

                            <span className="shrink-0 rounded-full bg-orange-400/10 px-1.5 py-0.5 text-[7px] font-bold text-orange-300 sm:px-2 sm:py-1 sm:text-[8px]">
                                {pendingRequests.length}{" "}
                                pending
                            </span>
                        </div>

                        <div className="max-h-32 space-y-1.5 overflow-y-auto overscroll-contain pr-1 sm:max-h-40 sm:space-y-2">
                            {pendingRequests.map(
                                (
                                    request,
                                    index
                                ) => {
                                    const requestUserId =
                                        getUserId(
                                            request.user
                                        );

                                    return (
                                        <motion.div
                                            key={
                                                requestUserId ||
                                                index
                                            }
                                            initial={{
                                                opacity: 0,
                                                x: -15,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            transition={{
                                                delay:
                                                    index *
                                                    0.08,
                                            }}
                                            className="group flex min-w-0 items-center gap-1.5 rounded-lg border border-white/[0.05] bg-black/20 p-1.5 sm:gap-2 sm:rounded-xl sm:p-2"
                                        >
                                            <motion.div
                                                whileHover={{
                                                    scale: 1.08,
                                                }}
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 sm:h-9 sm:w-9 sm:rounded-xl"
                                            >
                                                <FaUserCircle className="text-lg text-red-400 sm:text-xl" />
                                            </motion.div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[9px] font-semibold text-white sm:text-[10px]">
                                                    {request
                                                        .user
                                                        ?.name ||
                                                        request
                                                            .user
                                                            ?.username ||
                                                        "User"}
                                                </p>

                                                <p className="mt-0.5 text-[7px] text-red-400/80 sm:text-[8px]">
                                                    Previously removed
                                                </p>
                                            </div>

                                            <motion.button
                                                type="button"
                                                whileHover={{
                                                    scale: 1.1,
                                                    y: -2,
                                                }}
                                                whileTap={{
                                                    scale: 0.9,
                                                }}
                                                onClick={() =>
                                                    handleApproveRejoin(
                                                        requestUserId
                                                    )
                                                }
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500/20 sm:h-8 sm:w-8 sm:rounded-xl"
                                                title="Allow"
                                                aria-label={`Approve rejoin request from ${
                                                    request
                                                        .user
                                                        ?.name ||
                                                    "user"
                                                }`}
                                            >
                                                <FaCheck className="text-[9px] sm:text-[10px]" />
                                            </motion.button>

                                            <motion.button
                                                type="button"
                                                whileHover={{
                                                    scale: 1.1,
                                                    y: -2,
                                                }}
                                                whileTap={{
                                                    scale: 0.9,
                                                }}
                                                onClick={() =>
                                                    handleRejectRejoin(
                                                        requestUserId
                                                    )
                                                }
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500/20 sm:h-8 sm:w-8 sm:rounded-xl"
                                                title="Reject"
                                                aria-label={`Reject rejoin request from ${
                                                    request
                                                        .user
                                                        ?.name ||
                                                    "user"
                                                }`}
                                            >
                                                <FaTimes className="text-[9px] sm:text-[10px]" />
                                            </motion.button>
                                        </motion.div>
                                    );
                                }
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ==========================================
                PARTICIPANTS LIST
            ========================================== */}

            <div className="relative z-10 min-h-0 min-w-0 flex-1 space-y-2 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {displayedParticipants.length ===
                0 ? (
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-8 text-center sm:rounded-2xl sm:py-10"
                    >
                        <motion.div
                            animate={{
                                y: [0, -6, 0],
                                rotate: [
                                    0,
                                    2,
                                    -2,
                                    0,
                                ],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                            }}
                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] text-zinc-700 sm:h-14 sm:w-14 sm:rounded-2xl"
                        >
                            <FaUsers />
                        </motion.div>

                        <p className="mt-3 text-[11px] font-semibold text-zinc-500 sm:mt-4 sm:text-xs">
                            No participants found.
                        </p>

                        <p className="mt-1 text-[8px] text-zinc-700 sm:text-[9px]">
                            Invite people to start studying.
                        </p>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {displayedParticipants.map(
                            (
                                participant,
                                index
                            ) => {
                                const participantId =
                                    getUserId(
                                        participant
                                    );

                                if (!participantId) {
                                    return null;
                                }

                                const online =
                                    isOnline(
                                        participantId
                                    );

                                const collaboratorColor =
                                    getCollaboratorColor(
                                        participantId
                                    );

                                const isHost =
                                    participantId ===
                                    hostId;

                                const isYou =
                                    participantId ===
                                    currentUserId;

                                const wasRemoved =
                                    participant.previouslyRemoved;

                                const participantName =
                                    participant.name ||
                                    participant.username ||
                                    participant.email ||
                                    "User";

                                return (
                                    <motion.div
                                        key={
                                            participantId
                                        }
                                        initial={{
                                            opacity: 0,
                                            x: -20,
                                            scale: 0.96,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            x: 20,
                                            scale: 0.95,
                                        }}
                                        transition={{
                                            duration:
                                                0.4,
                                            delay:
                                                index *
                                                0.04,
                                            ease: [
                                                0.22,
                                                1,
                                                0.36,
                                                1,
                                            ],
                                        }}
                                        whileHover={{
                                            x: 4,
                                        }}
                                        className={`group relative overflow-hidden rounded-xl border p-2.5 transition-all sm:rounded-2xl sm:p-3 ${
                                            wasRemoved
                                                ? "border-red-500/10 bg-red-500/[0.035]"
                                                : isYou
                                                  ? "border-violet-400/15 bg-violet-500/[0.055]"
                                                  : "border-white/[0.055] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]"
                                        }`}
                                    >
                                        {!wasRemoved && (
                                            <motion.div
                                                initial={{
                                                    x: "-120%",
                                                }}
                                                whileHover={{
                                                    x: "120%",
                                                }}
                                                transition={{
                                                    duration:
                                                        0.7,
                                                }}
                                                className="pointer-events-none absolute inset-y-0 w-20 rotate-12 bg-white/[0.025] blur-md"
                                            />
                                        )}

                                        <div className="relative flex min-w-0 items-center gap-2 sm:gap-3">
                                            {/* AVATAR */}

                                            <motion.div
                                                whileHover={{
                                                    scale: 1.08,
                                                    y: -2,
                                                }}
                                                className="relative shrink-0"
                                            >
                                                <div
                                                    className={`relative flex h-9 w-9 items-center justify-center rounded-lg border sm:h-10 sm:w-10 sm:rounded-xl ${
                                                        wasRemoved
                                                            ? "border-red-400/15 bg-red-500/10"
                                                            : "border-white/10"
                                                    }`}
                                                    style={
                                                        !wasRemoved &&
                                                        online
                                                            ? {
                                                                  backgroundColor:
                                                                      `${collaboratorColor}22`,
                                                                  borderColor:
                                                                      `${collaboratorColor}55`,
                                                              }
                                                            : undefined
                                                    }
                                                >
                                                    <FaUserCircle
                                                        className={`text-xl sm:text-2xl ${
                                                            wasRemoved
                                                                ? "text-red-400"
                                                                : "text-zinc-500"
                                                        }`}
                                                        style={
                                                            !wasRemoved &&
                                                            online
                                                                ? {
                                                                      color: collaboratorColor,
                                                                  }
                                                                : undefined
                                                        }
                                                    />
                                                </div>

                                                <AnimatePresence>
                                                    {online &&
                                                        !wasRemoved && (
                                                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#09090f] bg-emerald-400" />
                                                        )}

                                                    {wasRemoved && (
                                                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#09090f] bg-red-500" />
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>

                                            {/* USER DETAILS */}

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`flex min-w-0 items-center gap-1.5 truncate text-[10px] font-bold sm:text-[11px] ${
                                                        wasRemoved
                                                            ? "text-red-400"
                                                            : "text-white"
                                                    }`}
                                                >
                                                    <span className="min-w-0 truncate">
                                                        {
                                                            participantName
                                                        }
                                                    </span>

                                                    {isHost &&
                                                        !wasRemoved && (
                                                            <motion.span
                                                                animate={{
                                                                    rotate: [
                                                                        -5,
                                                                        5,
                                                                        -5,
                                                                    ],
                                                                    y: [
                                                                        0,
                                                                        -1,
                                                                        0,
                                                                    ],
                                                                }}
                                                                transition={{
                                                                    duration:
                                                                        2.5,
                                                                    repeat: Infinity,
                                                                }}
                                                            >
                                                                <FaCrown className="shrink-0 text-[8px] text-yellow-400 sm:text-[9px]" />
                                                            </motion.span>
                                                        )}

                                                    {isYou &&
                                                        !wasRemoved && (
                                                            <span className="shrink-0 rounded-full bg-violet-400/10 px-1 py-0.5 text-[6px] font-bold text-violet-300 sm:px-1.5 sm:text-[7px]">
                                                                YOU
                                                            </span>
                                                        )}
                                                </p>

                                                <div className="mt-1 flex min-w-0 items-center gap-1.5">
                                                    <span
                                                        className={`truncate text-[8px] sm:text-[9px] ${
                                                            wasRemoved
                                                                ? "text-red-400/70"
                                                                : online
                                                                  ? "text-emerald-400/80"
                                                                  : "text-zinc-600"
                                                        }`}
                                                    >
                                                        {wasRemoved
                                                            ? "Previously removed"
                                                            : online
                                                              ? "Online"
                                                              : "Offline"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* HOST BADGE */}

                                            {isHost &&
                                                !wasRemoved && (
                                                    <span className="hidden shrink-0 rounded-full border border-yellow-400/10 bg-yellow-400/[0.05] px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-yellow-400/70 sm:block">
                                                        Host
                                                    </span>
                                                )}

                                            {/* REMOVE MEMBER */}

                                            {isCurrentUserHost &&
                                                !isHost &&
                                                !isYou &&
                                                !wasRemoved && (
                                                    <motion.button
                                                        type="button"
                                                        whileHover={{
                                                            scale: 1.1,
                                                            rotate: -5,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                            onRemoveMember?.(
                                                                participantId
                                                            )
                                                        }
                                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-transparent text-zinc-600 opacity-100 transition-all hover:border-red-500/10 hover:bg-red-500/10 hover:text-red-400 sm:h-8 sm:w-8 sm:rounded-xl sm:opacity-0 sm:group-hover:opacity-100"
                                                        title="Remove member"
                                                        aria-label={`Remove ${participantName}`}
                                                    >
                                                        <FaUserMinus className="text-[9px] sm:text-[10px]" />
                                                    </motion.button>
                                                )}
                                        </div>

                                        {/* ACTIVE PROGRESS LINE */}

                                        {online &&
                                            !wasRemoved && (
                                                <div className="mt-2 h-px overflow-hidden bg-white/[0.04] sm:mt-3">
                                                    <motion.div
                                                        animate={{
                                                            x: [
                                                                "-100%",
                                                                "100%",
                                                            ],
                                                        }}
                                                        transition={{
                                                            duration:
                                                                3 +
                                                                index *
                                                                    0.3,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                            delay:
                                                                index *
                                                                0.15,
                                                        }}
                                                        className="h-full w-1/4"
                                                        style={{
                                                            backgroundColor:
                                                                collaboratorColor,
                                                        }}
                                                    />
                                                </div>
                                            )}
                                    </motion.div>
                                );
                            }
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Participants;