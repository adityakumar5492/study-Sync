import {
    computed,
    createUserId,
    Tldraw,
    UserRecordType,
} from "tldraw";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    FaUsers,
    FaCircle,
    FaBolt,
    FaPen,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";

import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";

import { getCollaboratorColor } from "./collaboratorColors";

const Whiteboard = ({ roomId }) => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const users = useMemo(() => {
        const currentUser = computed(
            "currentUser",
            () =>
                UserRecordType.create({
                    id: createUserId(
                        user?._id?.toString() ||
                            "anonymous"
                    ),
                    name:
                        user?.name ||
                        "Anonymous",
                    color: getCollaboratorColor(
                        user?._id
                    ),
                })
        );

        return {
            currentUser,
        };
    }, [user?._id, user?.name]);

    const store = useSyncDemo({
        roomId: `studysync-${roomId}`,
        users,
    });

    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.985,
            }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            transition={{
                duration: 0.45,
                ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                ],
            }}
            className="relative h-full w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#050509] shadow-[0_30px_100px_rgba(0,0,0,.35)]"
        >
            {/* =====================================================
                PREMIUM AMBIENT BACKGROUND
            ====================================================== */}

            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

                <motion.div
                    animate={{
                        x: [
                            "-15%",
                            "25%",
                            "-15%",
                        ],
                        y: [
                            "0%",
                            "8%",
                            "0%",
                        ],
                        scale: [
                            1,
                            1.15,
                            1,
                        ],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/[0.035] blur-[120px]"
                />

                <motion.div
                    animate={{
                        x: [
                            "10%",
                            "-20%",
                            "10%",
                        ],
                        y: [
                            "0%",
                            "-8%",
                            "0%",
                        ],
                        scale: [
                            1,
                            0.92,
                            1.08,
                            1,
                        ],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-cyan-500/[0.03] blur-[120px]"
                />

                <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
                        backgroundSize:
                            "28px 28px",
                    }}
                />
            </div>

            {/* =====================================================
                TL DRAW
            ====================================================== */}

            <div className="absolute inset-0 z-10">
                <Tldraw
                    store={store}
                    users={users}
                />
            </div>

            {/* =====================================================
                TOP FLOATING STATUS
            ====================================================== */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: -12,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    delay: 0.2,
                    duration: 0.4,
                }}
                className="pointer-events-none absolute left-3 right-3 top-3 z-30 flex items-center justify-between sm:left-4 sm:right-4 sm:top-4"
            >
                {/* Left status */}

                <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#08080d]/85 px-3 py-2 shadow-[0_15px_50px_rgba(0,0,0,.3)] backdrop-blur-2xl">

                    <motion.div
                        animate={{
                            y: [
                                0,
                                -2,
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
                            ease: "easeInOut",
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/15 to-cyan-400/10"
                    >
                        <FaPen className="text-[9px] text-violet-300" />
                    </motion.div>

                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-white">
                                Live Whiteboard
                            </span>

                            <span className="flex items-center gap-1 rounded-full border border-emerald-400/10 bg-emerald-500/[0.06] px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wider text-emerald-300">
                                <motion.span
                                    animate={{
                                        scale: [
                                            1,
                                            1.7,
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
                                    className="h-1 w-1 rounded-full bg-emerald-400"
                                />

                                Live
                            </span>
                        </div>

                        <p className="mt-0.5 hidden text-[7px] text-zinc-600 sm:block">
                            Draw, explain and learn together
                        </p>
                    </div>
                </div>

                {/* Right status */}

                <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#08080d]/85 px-3 py-2 shadow-[0_15px_50px_rgba(0,0,0,.3)] backdrop-blur-2xl">

                    <FaUsers className="text-[9px] text-cyan-300" />

                    <div className="hidden sm:block">
                        <p className="text-[7px] uppercase tracking-[0.15em] text-zinc-700">
                            Collaboration
                        </p>

                        <p className="text-[8px] font-bold text-zinc-400">
                            Real-time sync
                        </p>
                    </div>

                    <span className="relative flex h-2 w-2">
                        <motion.span
                            animate={{
                                scale: [
                                    1,
                                    1.8,
                                    1,
                                ],
                                opacity: [
                                    0.6,
                                    0,
                                    0.6,
                                ],
                            }}
                            transition={{
                                duration: 2.2,
                                repeat: Infinity,
                            }}
                            className="absolute inset-0 rounded-full bg-cyan-400"
                        />

                        <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
                    </span>
                </div>
            </motion.div>

            {/* =====================================================
                CURRENT USER FLOATING CARD
            ====================================================== */}

            <motion.div
                initial={{
                    opacity: 0,
                    x: -15,
                }}
                animate={{
                    opacity: 1,
                    x: 0,
                }}
                transition={{
                    delay: 0.35,
                    duration: 0.4,
                }}
                className="pointer-events-none absolute bottom-3 left-3 z-30 hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-[#08080d]/80 px-3 py-2 shadow-xl backdrop-blur-xl sm:flex"
            >
                <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-400/20 text-[7px] font-bold text-white">
                    {(
                        user?.name ||
                        "A"
                    )
                        .charAt(0)
                        .toUpperCase()}

                    <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full border border-[#08080d] bg-emerald-400" />
                </span>

                <div>
                    <p className="text-[8px] font-bold text-zinc-400">
                        {user?.name ||
                            "Anonymous"}
                    </p>

                    <div className="flex items-center gap-1">
                        <FaCircle className="text-[3px] text-emerald-400" />

                        <span className="text-[6px] text-zinc-700">
                            You're editing
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* =====================================================
                COLLABORATION PULSE
            ====================================================== */}

            <motion.div
                animate={{
                    opacity: [
                        0.15,
                        0.4,
                        0.15,
                    ],
                    scaleX: [
                        0.8,
                        1,
                        0.8,
                    ],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="pointer-events-none absolute bottom-0 left-1/2 z-30 h-px w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-400/50 to-transparent blur-sm"
            />

            {/* =====================================================
                CORNER DECORATION
            ====================================================== */}

            <div className="pointer-events-none absolute bottom-3 right-3 z-30 hidden items-center gap-1.5 rounded-full border border-white/[0.05] bg-black/30 px-2.5 py-1.5 backdrop-blur-md md:flex">
                <FaBolt className="text-[6px] text-violet-400/60" />

                <span className="text-[6px] font-semibold uppercase tracking-[0.15em] text-zinc-700">
                    StudySync Canvas
                </span>
            </div>
        </motion.div>
    );
};

export default Whiteboard;