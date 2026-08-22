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

    const { user } =
        useAppSelector(
            (state) => state.auth
        );

    const hostId =
        typeof room?.host === "object"
            ? room.host?._id?.toString()
            : room?.host?.toString();

    const currentUserId =
        user?._id?.toString();

    const isCurrentUserHost =
        hostId === currentUserId;

    const isOnline = (participantId) =>
        onlineUsers.some(
            (u) =>
                u._id?.toString() ===
                participantId?.toString()
        );

    // ===========================
    // Approve Rejoin
    // ===========================

    const handleApproveRejoin = async (
        userId
    ) => {
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
    // Reject Rejoin
    // ===========================

    const handleRejectRejoin = async (
        userId
    ) => {
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
    // Active Participants
    // ===========================

    const activeParticipants =
        participants.map(
            (participant) => ({
                ...participant,
                previouslyRemoved: false,
            })
        );

    // ===========================
    // Previously Removed
    // ===========================

    const removedParticipants =
        (room?.removedMembers || [])
            .filter(
                (entry) => entry.user
            )
            .map((entry) => ({
                ...entry.user,
                previouslyRemoved: true,
                removedAt:
                    entry.removedAt,
            }));

    const displayedParticipants = [
        ...activeParticipants,
        ...removedParticipants.filter(
            (removed) =>
                !activeParticipants.some(
                    (active) =>
                        active._id?.toString() ===
                        removed._id?.toString()
                )
        ),
    ];

    const pendingRequests =
        room?.rejoinRequests?.filter(
            (request) =>
                request.status === "pending"
        ) || [];

    return (
        <div className="relative overflow-hidden border-b border-white/[0.07] bg-[#07070c] p-4 text-white">

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
                className="relative z-10 mb-5 flex min-w-0 items-center justify-between gap-3"
            >
                <div className="flex min-w-0 items-center gap-3">

                    <motion.div
                        whileHover={{
                            scale: 1.08,
                            rotate: 4,
                        }}
                        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-cyan-400/10 shadow-[0_0_35px_rgba(139,92,246,.1)]"
                    >
                        <FaUsers className="text-sm text-violet-300" />

                        <motion.span
                            animate={{
                                scale: [1, 1.35, 1],
                                opacity: [0.6, 0, 0.6],
                            }}
                            transition={{
                                duration: 2.4,
                                repeat: Infinity,
                            }}
                            className="absolute inset-0 rounded-2xl border border-violet-400/20"
                        />
                    </motion.div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-bold tracking-tight text-white">
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
                                className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
                            />
                        </div>

                        <p className="mt-1 truncate text-[9px] text-zinc-600">
                            Room ID: {roomId}
                        </p>
                    </div>
                </div>

                {/* Online counter */}

                <motion.div
                    animate={{
                        y: [0, -2, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                    }}
                    className="relative shrink-0 overflow-hidden rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5"
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

                    <span className="relative flex items-center gap-1.5 text-[9px] font-bold text-emerald-300">
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

                        {onlineUsers.length} Online
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
                className="relative z-10 mb-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 backdrop-blur-xl"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-[.18em] text-zinc-600">
                            Live presence
                        </p>

                        <p className="mt-1 text-[10px] text-zinc-400">
                            {onlineUsers.length > 0
                                ? "Your study group is active"
                                : "Waiting for your group"}
                        </p>
                    </div>

                    <div className="flex -space-x-2">
                        {onlineUsers
                            .slice(0, 5)
                            .map(
                                (
                                    onlineUser,
                                    index
                                ) => {
                                    const color =
                                        getCollaboratorColor(
                                            onlineUser._id?.toString()
                                        );

                                    return (
                                        <motion.div
                                            key={
                                                onlineUser._id ||
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
                                            className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#09090f] text-[8px] font-black text-white"
                                            style={{
                                                backgroundColor:
                                                    color,
                                            }}
                                        >
                                            {onlineUser.name?.[0]?.toUpperCase() ||
                                                "U"}

                                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#09090f] bg-emerald-400" />
                                        </motion.div>
                                    );
                                }
                            )}

                        {onlineUsers.length > 5 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#09090f] bg-zinc-800 text-[8px] font-bold text-zinc-400">
                                +{onlineUsers.length - 5}
                            </div>
                        )}
                    </div>
                </div>

                {/* animated activity line */}

                <div className="mt-3 h-px overflow-hidden bg-white/[0.05]">
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
                            className="relative z-10 mb-4 overflow-hidden rounded-2xl border border-orange-400/15 bg-orange-400/[0.045] p-3 shadow-[0_10px_40px_rgba(249,115,22,.05)]"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
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
                                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300"
                                    >
                                        <FaBolt />
                                    </motion.div>

                                    <div>
                                        <p className="text-[10px] font-bold text-orange-300">
                                            Rejoin Requests
                                        </p>
                                        <p className="mt-0.5 text-[8px] text-orange-300/40">
                                            Requires your approval
                                        </p>
                                    </div>
                                </div>

                                <span className="rounded-full bg-orange-400/10 px-2 py-1 text-[8px] font-bold text-orange-300">
                                    {pendingRequests.length}{" "}
                                    pending
                                </span>
                            </div>

                            <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                                {pendingRequests.map(
                                    (request, index) => (
                                        <motion.div
                                            key={
                                                request
                                                    .user
                                                    ?._id
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
                                            className="group flex items-center gap-2 rounded-xl border border-white/[0.05] bg-black/20 p-2"
                                        >
                                            <motion.div
                                                whileHover={{
                                                    scale: 1.08,
                                                }}
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10"
                                            >
                                                <FaUserCircle className="text-xl text-red-400" />
                                            </motion.div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[10px] font-semibold text-white">
                                                    {
                                                        request
                                                            .user
                                                            ?.name
                                                    }
                                                </p>

                                                <p className="mt-0.5 text-[8px] text-red-400/80">
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
                                                        request
                                                            .user
                                                            ?._id
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500/20"
                                                title="Allow"
                                            >
                                                <FaCheck className="text-[10px]" />
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
                                                        request
                                                            .user
                                                            ?._id
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                                                title="Reject"
                                            >
                                                <FaTimes className="text-[10px]" />
                                            </motion.button>
                                        </motion.div>
                                    )
                                )}
                            </div>
                        </motion.div>
                    )}
            </AnimatePresence>

            {/* ==========================================
                PARTICIPANTS LIST
            ========================================== */}

            <div className="relative z-10 max-h-72 space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

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
                        className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] py-10 text-center"
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
                            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] text-zinc-700"
                        >
                            <FaUsers />
                        </motion.div>

                        <p className="mt-4 text-xs font-semibold text-zinc-500">
                            No participants found.
                        </p>

                        <p className="mt-1 text-[9px] text-zinc-700">
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
                                const online =
                                    isOnline(
                                        participant._id
                                    );

                                const participantId =
                                    participant._id?.toString();

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

                                return (
                                    <motion.div
                                        key={
                                            participant._id
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
                                        className={`group relative overflow-hidden rounded-2xl border p-3 transition-all ${
                                            wasRemoved
                                                ? "border-red-500/10 bg-red-500/[0.035]"
                                                : isYou
                                                  ? "border-violet-400/15 bg-violet-500/[0.055]"
                                                  : "border-white/[0.055] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]"
                                        }`}
                                    >
                                        {/* Hover sweep */}

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

                                        <div className="relative flex items-center gap-3">

                                            {/* Avatar */}

                                            <motion.div
                                                whileHover={{
                                                    scale: 1.08,
                                                    y: -2,
                                                }}
                                                className="relative shrink-0"
                                            >
                                                <div
                                                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl border ${
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
                                                        className={`text-2xl ${
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

                                                {/* Online pulse */}

                                                <AnimatePresence>
                                                    {online &&
                                                        !wasRemoved && (
                                                            <>
                                                                <motion.span
                                                                    animate={{
                                                                        scale: [
                                                                            1,
                                                                            1.8,
                                                                            1,
                                                                        ],
                                                                        opacity: [
                                                                            0.7,
                                                                            0,
                                                                            0.7,
                                                                        ],
                                                                    }}
                                                                    transition={{
                                                                        duration:
                                                                            2,
                                                                        repeat: Infinity,
                                                                    }}
                                                                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400"
                                                                />

                                                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#09090f] bg-emerald-400" />
                                                            </>
                                                        )}

                                                    {wasRemoved && (
                                                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#09090f] bg-red-500" />
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>

                                            {/* User details */}

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`flex items-center gap-1.5 truncate text-[11px] font-bold ${
                                                        wasRemoved
                                                            ? "text-red-400"
                                                            : "text-white"
                                                    }`}
                                                >
                                                    <span className="truncate">
                                                        {
                                                            participant.name
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
                                                                <FaCrown className="shrink-0 text-[9px] text-yellow-400" />
                                                            </motion.span>
                                                        )}

                                                    {isYou &&
                                                        !wasRemoved && (
                                                            <span className="shrink-0 rounded-full bg-violet-400/10 px-1.5 py-0.5 text-[7px] font-bold text-violet-300">
                                                                YOU
                                                            </span>
                                                        )}
                                                </p>

                                                <div className="mt-1 flex items-center gap-1.5">
                                                    <span
                                                        className={`text-[9px] ${
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

                                                    {online &&
                                                        !wasRemoved && (
                                                            <motion.div
                                                                className="flex items-center gap-[2px]"
                                                                aria-hidden="true"
                                                            >
                                                                {[
                                                                    0,
                                                                    1,
                                                                    2,
                                                                    3,
                                                                ].map(
                                                                    (
                                                                        bar
                                                                    ) => (
                                                                        <motion.span
                                                                            key={
                                                                                bar
                                                                            }
                                                                            animate={{
                                                                                height: [
                                                                                    3,
                                                                                    5 +
                                                                                        bar *
                                                                                            2,
                                                                                    3,
                                                                                ],
                                                                            }}
                                                                            transition={{
                                                                                duration:
                                                                                    0.7 +
                                                                                    bar *
                                                                                        0.08,
                                                                                repeat: Infinity,
                                                                                delay:
                                                                                    bar *
                                                                                    0.08,
                                                                            }}
                                                                            className="w-[2px] rounded-full bg-emerald-400/70"
                                                                        />
                                                                    )
                                                                )}
                                                            </motion.div>
                                                        )}
                                                </div>
                                            </div>

                                            {/* Host badge */}

                                            {isHost &&
                                                !wasRemoved && (
                                                    <span className="hidden rounded-full border border-yellow-400/10 bg-yellow-400/[0.05] px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-yellow-400/70 sm:block">
                                                        Host
                                                    </span>
                                                )}

                                            {/* Remove active member */}

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
                                                                participant._id
                                                            )
                                                        }
                                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-transparent text-zinc-600 opacity-0 transition-all hover:border-red-500/10 hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                                                        title="Remove member"
                                                        aria-label={`Remove ${participant.name}`}
                                                    >
                                                        <FaUserMinus className="text-[10px]" />
                                                    </motion.button>
                                                )}
                                        </div>

                                        {/* Tiny active progress line */}

                                        {online &&
                                            !wasRemoved && (
                                                <div className="mt-3 h-px overflow-hidden bg-white/[0.04]">
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

            {/* ==========================================
                FOOTER ACTIVITY
            ========================================== */}

            {displayedParticipants.length >
                0 && (
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="relative z-10 mt-4 flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2"
                >
                    <div className="flex items-center gap-2">
                        <motion.span
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="text-[9px] text-violet-400"
                        >
                            <BsLightningChargeFill />
                        </motion.span>

                        <span className="text-[8px] text-zinc-600">
                            Real-time presence synced
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <FaCircle className="text-[4px] text-emerald-400" />
                        <span className="text-[8px] text-zinc-700">
                            Live
                        </span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Participants;