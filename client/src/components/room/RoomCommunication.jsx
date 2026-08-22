import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    FaUsers,
    FaComments,
    FaMicrophone,
    FaPen,
    FaCheck,
    FaCircle,
    FaLock,
    FaGlobe,
    FaUserFriends,
    FaBookOpen,
    
} from "react-icons/fa";

import Participants from "./Participants";
import ChatPanel from "./ChatPanel";
import VoicePanel from "./voice/VoicePanel";

const RoomCommunication = ({
    room,
    roomId,
    currentUser,
    onlineUsers,
    isHost,
    isMember,
    onRemoveMember,

    // Drawing permission
    drawingPermission,
    onDrawingPermissionChange,
}) => {
    const [activePanel, setActivePanel] =
        useState("participants");

    // ===========================
    // Check Current User
    // ===========================

    const currentUserId =
        currentUser?._id?.toString();

    const canDraw =
        isHost ||
        drawingPermission.mode ===
            "everyone" ||
        (
            drawingPermission.mode ===
                "selected" &&
            drawingPermission.allowedUsers.includes(
                currentUserId
            )
        );

    // ===========================
    // Tabs
    // ===========================

    const tabs = [
        {
            id: "participants",
            label: "People",
            desktopLabel: "Participants",
            icon: FaUsers,
            description:
                "See who's studying",
        },
        {
            id: "chat",
            label: "Chat",
            desktopLabel: "Live Chat",
            icon: FaComments,
            description:
                "Discuss together",
        },
        {
            id: "voice",
            label: "Voice",
            desktopLabel: "Voice",
            icon: FaMicrophone,
            description:
                "Talk with your team",
        },
        {
            id: "drawing",
            label: "Draw",
            desktopLabel: "Drawing",
            icon: FaPen,
            description:
                "Collaborate on PDF",
        },
    ];

    const selectedUsers =
        drawingPermission?.allowedUsers ||
        [];

    return (
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#050509] text-white">

            {/* =====================================================
                PREMIUM AMBIENT BACKGROUND
            ====================================================== */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 35, -20, 0],
                        y: [0, -25, 15, 0],
                        scale: [
                            1,
                            1.12,
                            0.96,
                            1,
                        ],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-violet-600/[0.045] blur-[110px]"
                />

                <motion.div
                    animate={{
                        x: [0, -25, 20, 0],
                        y: [0, 20, -15, 0],
                        scale: [
                            1,
                            0.94,
                            1.1,
                            1,
                        ],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-cyan-500/[0.035] blur-[110px]"
                />

                <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
                        backgroundSize:
                            "26px 26px",
                    }}
                />
            </div>

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="relative z-20 shrink-0 border-b border-white/[0.06] bg-[#08080d]/90 px-3 pb-3 pt-3 backdrop-blur-2xl sm:px-4">

                <div className="mb-3 flex items-center justify-between">

                    <div className="flex min-w-0 items-center gap-3">
                        <motion.div
                            whileHover={{
                                rotate: 5,
                                scale: 1.05,
                            }}
                            className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-400/10 bg-gradient-to-br from-violet-500/15 to-cyan-400/10"
                        >
                            <motion.div
                                animate={{
                                    scale: [
                                        1,
                                        1.5,
                                        1,
                                    ],
                                    opacity: [
                                        0.2,
                                        0.45,
                                        0.2,
                                    ],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                }}
                                className="absolute inset-0 rounded-xl bg-violet-500/10 blur-md"
                            />

                            <FaUserFriends className="relative text-xs text-violet-300" />
                        </motion.div>

                        <div className="min-w-0">
                            <h2 className="truncate text-xs font-black tracking-tight text-white sm:text-sm">
                                Study Together
                            </h2>

                            <div className="mt-0.5 flex items-center gap-1.5">
                                <motion.span
                                    animate={{
                                        scale: [
                                            1,
                                            1.5,
                                            1,
                                        ],
                                        opacity: [
                                            0.6,
                                            0,
                                            0.6,
                                        ],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="absolute h-1.5 w-1.5 rounded-full bg-emerald-400"
                                />

                                <span className="ml-2 text-[8px] font-medium text-zinc-600">
                                    Real-time collaboration
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Online indicator */}

                    <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-2.5 py-1.5">
                        <span className="relative flex h-1.5 w-1.5">
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
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="absolute inset-0 rounded-full bg-emerald-400"
                            />

                            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>

                        <span className="text-[8px] font-semibold text-zinc-500">
                            Live
                        </span>
                    </div>
                </div>

                {/* =================================================
                    COMMUNICATION TABS
                ================================================== */}

                <div className="relative grid grid-cols-4 gap-1 rounded-2xl border border-white/[0.06] bg-black/20 p-1">

                    {tabs.map((tab) => {
                        const Icon =
                            tab.icon;

                        const active =
                            activePanel ===
                            tab.id;

                        return (
                            <motion.button
                                key={tab.id}
                                type="button"
                                onClick={() =>
                                    setActivePanel(
                                        tab.id
                                    )
                                }
                                whileTap={{
                                    scale: 0.96,
                                }}
                                className={`group relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 transition-all duration-300 sm:flex-row sm:gap-1.5 ${
                                    active
                                        ? "text-white"
                                        : "text-zinc-600 hover:text-zinc-300"
                                }`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="communication-active-tab"
                                        transition={{
                                            type: "spring",
                                            stiffness: 380,
                                            damping: 30,
                                        }}
                                        className="absolute inset-0 rounded-xl border border-white/[0.08] bg-white/[0.06] shadow-[0_8px_30px_rgba(0,0,0,.2)]"
                                    />
                                )}

                                <span
                                    className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-lg transition-all ${
                                        active
                                            ? "bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-violet-300"
                                            : "bg-transparent text-zinc-600 group-hover:text-zinc-300"
                                    }`}
                                >
                                    <Icon className="text-[10px]" />
                                </span>

                                <span className="relative z-10 hidden truncate text-[9px] font-bold sm:block">
                                    {
                                        tab.desktopLabel
                                    }
                                </span>

                                <span className="relative z-10 text-[8px] font-bold sm:hidden">
                                    {
                                        tab.label
                                    }
                                </span>

                                {active && (
                                    <motion.span
                                        layoutId="communication-dot"
                                        className="absolute bottom-1 h-0.5 w-3 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 shadow-[0_0_8px_rgba(139,92,246,.7)]"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* =====================================================
                ACTIVE PANEL
            ====================================================== */}

            <div className="relative z-10 min-h-0 flex-1 overflow-hidden bg-[#07070b]">

                {/* subtle panel transition glow */}

                <motion.div
                    animate={{
                        opacity: [
                            0.15,
                            0.3,
                            0.15,
                        ],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                    }}
                    className="pointer-events-none absolute left-1/2 top-0 z-20 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent blur-sm"
                />

                <AnimatePresence
                    mode="wait"
                >
                    {/* =================================================
                        PARTICIPANTS
                    ================================================== */}

                    {activePanel ===
                        "participants" && (
                        <motion.div
                            key="participants"
                            initial={{
                                opacity: 0,
                                x: 15,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{
                                opacity: 0,
                                x: -15,
                            }}
                            transition={{
                                duration: 0.22,
                            }}
                            className="h-full min-h-0"
                        >
                            <Participants
                                room={room}
                                roomId={roomId}
                                participants={
                                    room.members ||
                                    []
                                }
                                onlineUsers={
                                    onlineUsers
                                }
                                onRemoveMember={
                                    onRemoveMember
                                }
                            />
                        </motion.div>
                    )}

                    {/* =================================================
                        CHAT
                    ================================================== */}

                    {activePanel ===
                        "chat" && (
                        <motion.div
                            key="chat"
                            initial={{
                                opacity: 0,
                                x: 15,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{
                                opacity: 0,
                                x: -15,
                            }}
                            transition={{
                                duration: 0.22,
                            }}
                            className="h-full min-h-0"
                        >
                            <ChatPanel
                                roomId={
                                    roomId
                                }
                                isHost={
                                    isHost
                                }
                                isMember={
                                    isMember
                                }
                            />
                        </motion.div>
                    )}

                    {/* =================================================
                        VOICE
                    ================================================== */}

                    {activePanel ===
                        "voice" && (
                        <motion.div
                            key="voice"
                            initial={{
                                opacity: 0,
                                x: 15,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{
                                opacity: 0,
                                x: -15,
                            }}
                            transition={{
                                duration: 0.22,
                            }}
                            className="h-full min-h-0"
                        >
                            <VoicePanel
                                roomId={
                                    roomId
                                }
                                currentUser={
                                    currentUser
                                }
                            />
                        </motion.div>
                    )}

                    {/* =================================================
                        DRAWING
                    ================================================== */}

                    {activePanel ===
                        "drawing" && (
                        <motion.div
                            key="drawing"
                            initial={{
                                opacity: 0,
                                x: 15,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{
                                opacity: 0,
                                x: -15,
                            }}
                            transition={{
                                duration: 0.22,
                            }}
                            className="h-full overflow-y-auto"
                        >
                            <div className="relative p-3 sm:p-4 lg:p-5">

                                {/* =================================================
                                    DRAWING HERO
                                ================================================== */}

                                <div className="relative mb-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.07] via-white/[0.02] to-cyan-400/[0.04] p-4 sm:p-5">

                                    <motion.div
                                        animate={{
                                            x: [
                                                -30,
                                                50,
                                                -30,
                                            ],
                                            y: [
                                                0,
                                                -10,
                                                0,
                                            ],
                                        }}
                                        transition={{
                                            duration: 10,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/[0.08] blur-[70px]"
                                    />

                                    <div className="relative flex items-start gap-3">

                                        <motion.div
                                            animate={{
                                                y: [
                                                    0,
                                                    -4,
                                                    0,
                                                ],
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
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.08] text-violet-300"
                                        >
                                            <FaPen className="text-sm" />
                                        </motion.div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-black tracking-tight text-white">
                                                    Drawing Access
                                                </h3>

                                                <span className="rounded-full border border-violet-400/10 bg-violet-500/[0.06] px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-violet-300/70">
                                                    Live
                                                </span>
                                            </div>

                                            <p className="mt-1 text-[10px] leading-5 text-zinc-600">
                                                Control who can annotate the shared PDF in real time.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* =================================================
                                    HOST CONTROLS
                                ================================================== */}

                                {isHost && (
                                    <div className="space-y-2">

                                        <div className="mb-2 flex items-center justify-between px-1">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                                                Permissions
                                            </span>

                                            <span className="text-[8px] text-zinc-700">
                                                Host controls
                                            </span>
                                        </div>

                                        {/* Host Only */}

                                        <motion.button
                                            type="button"
                                            whileHover={{
                                                y: -1,
                                            }}
                                            whileTap={{
                                                scale: 0.985,
                                            }}
                                            onClick={() =>
                                                onDrawingPermissionChange(
                                                    {
                                                        mode: "none",
                                                        allowedUsers:
                                                            [],
                                                    }
                                                )
                                            }
                                            className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all ${
                                                drawingPermission.mode ===
                                                "none"
                                                    ? "border-violet-400/20 bg-violet-500/[0.08]"
                                                    : "border-white/[0.06] bg-white/[0.025] hover:border-white/[0.1] hover:bg-white/[0.04]"
                                            }`}
                                        >
                                            {drawingPermission.mode ===
                                                "none" && (
                                                <motion.div
                                                    layoutId="permission-active"
                                                    className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.05] to-transparent"
                                                />
                                            )}

                                            <span
                                                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                                    drawingPermission.mode ===
                                                    "none"
                                                        ? "bg-violet-500/10 text-violet-300"
                                                        : "bg-white/[0.03] text-zinc-600"
                                                }`}
                                            >
                                                <FaLock className="text-[11px]" />
                                            </span>

                                            <span className="relative min-w-0 flex-1">
                                                <span className="block text-[11px] font-bold text-zinc-300">
                                                    Host Only
                                                </span>

                                                <span className="mt-0.5 block text-[8px] text-zinc-600">
                                                    Only you can annotate
                                                </span>
                                            </span>

                                            <span
                                                className={`relative flex h-5 w-5 items-center justify-center rounded-full border ${
                                                    drawingPermission.mode ===
                                                    "none"
                                                        ? "border-violet-400 bg-violet-500"
                                                        : "border-white/[0.12]"
                                                }`}
                                            >
                                                {drawingPermission.mode ===
                                                    "none" && (
                                                    <FaCheck className="text-[8px] text-white" />
                                                )}
                                            </span>
                                        </motion.button>

                                        {/* Everyone */}

                                        <motion.button
                                            type="button"
                                            whileHover={{
                                                y: -1,
                                            }}
                                            whileTap={{
                                                scale: 0.985,
                                            }}
                                            onClick={() =>
                                                onDrawingPermissionChange(
                                                    {
                                                        mode: "everyone",
                                                        allowedUsers:
                                                            [],
                                                    }
                                                )
                                            }
                                            className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all ${
                                                drawingPermission.mode ===
                                                "everyone"
                                                    ? "border-emerald-400/20 bg-emerald-500/[0.07]"
                                                    : "border-white/[0.06] bg-white/[0.025] hover:border-white/[0.1] hover:bg-white/[0.04]"
                                            }`}
                                        >
                                            {drawingPermission.mode ===
                                                "everyone" && (
                                                <motion.div
                                                    layoutId="permission-active"
                                                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.05] to-transparent"
                                                />
                                            )}

                                            <span
                                                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                                    drawingPermission.mode ===
                                                    "everyone"
                                                        ? "bg-emerald-500/10 text-emerald-300"
                                                        : "bg-white/[0.03] text-zinc-600"
                                                }`}
                                            >
                                                <FaGlobe className="text-[11px]" />
                                            </span>

                                            <span className="relative min-w-0 flex-1">
                                                <span className="block text-[11px] font-bold text-zinc-300">
                                                    Everyone
                                                </span>

                                                <span className="mt-0.5 block text-[8px] text-zinc-600">
                                                    Everyone in the room can draw
                                                </span>
                                            </span>

                                            <span
                                                className={`relative flex h-5 w-5 items-center justify-center rounded-full border ${
                                                    drawingPermission.mode ===
                                                    "everyone"
                                                        ? "border-emerald-400 bg-emerald-500"
                                                        : "border-white/[0.12]"
                                                }`}
                                            >
                                                {drawingPermission.mode ===
                                                    "everyone" && (
                                                    <FaCheck className="text-[8px] text-white" />
                                                )}
                                            </span>
                                        </motion.button>

                                        {/* Selected */}

                                        <motion.button
                                            type="button"
                                            whileHover={{
                                                y: -1,
                                            }}
                                            whileTap={{
                                                scale: 0.985,
                                            }}
                                            onClick={() =>
                                                onDrawingPermissionChange(
                                                    {
                                                        mode: "selected",
                                                        allowedUsers:
                                                            drawingPermission.allowedUsers ||
                                                            [],
                                                    }
                                                )
                                            }
                                            className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all ${
                                                drawingPermission.mode ===
                                                "selected"
                                                    ? "border-cyan-400/20 bg-cyan-500/[0.07]"
                                                    : "border-white/[0.06] bg-white/[0.025] hover:border-white/[0.1] hover:bg-white/[0.04]"
                                            }`}
                                        >
                                            {drawingPermission.mode ===
                                                "selected" && (
                                                <motion.div
                                                    layoutId="permission-active"
                                                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.05] to-transparent"
                                                />
                                            )}

                                            <span
                                                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                                    drawingPermission.mode ===
                                                    "selected"
                                                        ? "bg-cyan-500/10 text-cyan-300"
                                                        : "bg-white/[0.03] text-zinc-600"
                                                }`}
                                            >
                                                <FaUserFriends className="text-[11px]" />
                                            </span>

                                            <span className="relative min-w-0 flex-1">
                                                <span className="block text-[11px] font-bold text-zinc-300">
                                                    Selected Users
                                                </span>

                                                <span className="mt-0.5 block text-[8px] text-zinc-600">
                                                    Choose exactly who can draw
                                                </span>
                                            </span>

                                            <span
                                                className={`relative flex h-5 w-5 items-center justify-center rounded-full border ${
                                                    drawingPermission.mode ===
                                                    "selected"
                                                        ? "border-cyan-400 bg-cyan-500"
                                                        : "border-white/[0.12]"
                                                }`}
                                            >
                                                {drawingPermission.mode ===
                                                    "selected" && (
                                                    <FaCheck className="text-[8px] text-white" />
                                                )}
                                            </span>
                                        </motion.button>

                                        {/* =================================================
                                            SELECTED USERS
                                        ================================================== */}

                                        <AnimatePresence>
                                            {drawingPermission.mode ===
                                                "selected" && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: "auto",
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-2 rounded-2xl border border-white/[0.06] bg-black/20 p-3">

                                                        <div className="mb-3 flex items-center justify-between">
                                                            <div>
                                                                <p className="text-[10px] font-bold text-zinc-300">
                                                                    Select users
                                                                </p>

                                                                <p className="mt-0.5 text-[8px] text-zinc-700">
                                                                    Give annotation access
                                                                </p>
                                                            </div>

                                                            <span className="rounded-full border border-cyan-400/10 bg-cyan-500/[0.06] px-2 py-1 text-[8px] font-bold text-cyan-300">
                                                                {
                                                                    selectedUsers.length
                                                                }{" "}
                                                                selected
                                                            </span>
                                                        </div>

                                                        <div className="max-h-[min(18rem,45vh)] space-y-1 overflow-y-auto pr-1">
                                                            {(
                                                                room?.members ||
                                                                []
                                                            ).map(
                                                                (
                                                                    member
                                                                ) => {
                                                                    const userId =
                                                                        member?._id?.toString();

                                                                    if (
                                                                        !userId
                                                                    ) {
                                                                        return null;
                                                                    }

                                                                    const selected =
                                                                        selectedUsers.includes(
                                                                            userId
                                                                        );

                                                                    const name =
                                                                        member.name ||
                                                                        member.username ||
                                                                        member.email ||
                                                                        "User";

                                                                    return (
                                                                        <motion.button
                                                                            key={
                                                                                userId
                                                                            }
                                                                            type="button"
                                                                            whileHover={{
                                                                                x: 2,
                                                                            }}
                                                                            whileTap={{
                                                                                scale: 0.985,
                                                                            }}
                                                                            onClick={() => {
                                                                                const current =
                                                                                    drawingPermission.allowedUsers ||
                                                                                    [];

                                                                                const next =
                                                                                    selected
                                                                                        ? current.filter(
                                                                                              (
                                                                                                  id
                                                                                              ) =>
                                                                                                  id !==
                                                                                                  userId
                                                                                          )
                                                                                        : [
                                                                                              ...current,
                                                                                              userId,
                                                                                          ];

                                                                                onDrawingPermissionChange(
                                                                                    {
                                                                                        mode: "selected",
                                                                                        allowedUsers:
                                                                                            next,
                                                                                    }
                                                                                );
                                                                            }}
                                                                            className={`group flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all ${
                                                                                selected
                                                                                    ? "border-cyan-400/10 bg-cyan-500/[0.06]"
                                                                                    : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.03]"
                                                                            }`}
                                                                        >
                                                                            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-[10px] font-bold text-zinc-400">
                                                                                {member.avatar ? (
                                                                                    <img
                                                                                        src={
                                                                                            member.avatar.startsWith(
                                                                                                "http"
                                                                                            )
                                                                                                ? member.avatar
                                                                                                : `http://localhost:5000${member.avatar}`
                                                                                        }
                                                                                        alt=""
                                                                                        className="h-full w-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    name
                                                                                        .charAt(
                                                                                            0
                                                                                        )
                                                                                        .toUpperCase()
                                                                                )}

                                                                                {selected && (
                                                                                    <span className="absolute inset-0 flex items-center justify-center bg-cyan-500/80">
                                                                                        <FaCheck className="text-[9px] text-white" />
                                                                                    </span>
                                                                                )}
                                                                            </div>

                                                                            <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-zinc-400 group-hover:text-white">
                                                                                {
                                                                                    name
                                                                                }
                                                                            </span>

                                                                            <span className="relative flex h-2 w-2">
                                                                                <span
                                                                                    className={`h-2 w-2 rounded-full ${
                                                                                        selected
                                                                                            ? "bg-cyan-400"
                                                                                            : "bg-zinc-800"
                                                                                    }`}
                                                                                />
                                                                            </span>
                                                                        </motion.button>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* =================================================
                                    MEMBER STATUS
                                ================================================== */}

                                {!isHost && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 shadow-xl backdrop-blur-xl sm:p-5"
                                    >
                                        <motion.div
                                            animate={{
                                                x: [
                                                    "-20%",
                                                    "120%",
                                                ],
                                            }}
                                            transition={{
                                                duration: 7,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent"
                                        />

                                        <div className="flex items-start gap-3">

                                            <motion.div
                                                animate={{
                                                    y: [
                                                        0,
                                                        -4,
                                                        0,
                                                    ],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                }}
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                    canDraw
                                                        ? "border border-emerald-400/10 bg-emerald-500/[0.08] text-emerald-300"
                                                        : "border border-white/[0.06] bg-white/[0.03] text-zinc-600"
                                                }`}
                                            >
                                                <FaPen className="text-xs" />
                                            </motion.div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-black text-white">
                                                        {canDraw
                                                            ? "Drawing allowed"
                                                            : "Drawing restricted"}
                                                    </p>

                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            canDraw
                                                                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]"
                                                                : "bg-zinc-700"
                                                        }`}
                                                    />
                                                </div>

                                                <p className="mt-1 text-[9px] leading-5 text-zinc-600">
                                                    {canDraw
                                                        ? "The host has allowed you to annotate the shared PDF."
                                                        : "The host has not allowed you to annotate the shared PDF."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.05] bg-black/20 px-3 py-2">
                                            <FaCircle
                                                className={`text-[5px] ${
                                                    canDraw
                                                        ? "text-emerald-400"
                                                        : "text-zinc-700"
                                                }`}
                                            />

                                            <span className="text-[8px] text-zinc-600">
                                                {canDraw
                                                    ? "You can draw, highlight and annotate in real time."
                                                    : "Ask the host to enable drawing access."}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* =====================================================
                BOTTOM LIVE STATUS
            ====================================================== */}

            <div className="pointer-events-none relative z-30 flex h-7 shrink-0 items-center justify-between border-t border-white/[0.05] bg-[#08080d]/90 px-3 backdrop-blur-xl">

                <div className="flex items-center gap-2">
                    <motion.span
                        animate={{
                            opacity: [
                                0.4,
                                1,
                                0.4,
                            ],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                        className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.5)]"
                    />

                    <span className="text-[7px] font-semibold uppercase tracking-[0.15em] text-zinc-700">
                        Connected
                    </span>
                </div>

                <div className="flex items-center gap-1.5 text-[7px] text-zinc-700">
                    <FaBookOpen

                     className="text-[6px] text-violet-400/60" />
                    StudySync collaboration
                </div>
            </div>
        </div>
    );
};

export default RoomCommunication;