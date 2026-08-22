import { useEffect, useState } from "react";
import {
    FaHistory,
    FaPlus,
    FaSignInAlt,
    FaSignOutAlt,
    FaRedo,
} from "react-icons/fa";
import {
    motion,
    AnimatePresence,
    useReducedMotion,
} from "framer-motion";

import { getUserActivities } from "../../api/activity.api";
import socket from "../../socket/socket";

const ActivityTimeline = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response =
                    await getUserActivities();

                if (response.data?.success) {
                    setActivities(
                        response.data.activities || []
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to fetch activities:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();

        const handleActivityUpdate = () => {
            fetchActivities();
        };

        socket.on(
            "profile:activity-updated",
            handleActivityUpdate
        );

        return () => {
            socket.off(
                "profile:activity-updated",
                handleActivityUpdate
            );
        };
    }, []);

    const getActivityDetails = (activity) => {
        const roomName =
            activity.room?.name || "a room";

        switch (activity.type) {
            case "room_created":
                return {
                    text: `Created room "${roomName}"`,
                    icon: FaPlus,
                    accent: "indigo",
                    label: "Created",
                };

            case "room_joined":
                return {
                    text: `Joined room "${roomName}"`,
                    icon: FaSignInAlt,
                    accent: "cyan",
                    label: "Joined",
                };

            case "room_left":
                return {
                    text: `Left room "${roomName}"`,
                    icon: FaSignOutAlt,
                    accent: "red",
                    label: "Left",
                };

            case "room_rejoined":
                return {
                    text: `Rejoined room "${roomName}"`,
                    icon: FaRedo,
                    accent: "violet",
                    label: "Rejoined",
                };

            default:
                return {
                    text: "Performed an activity",
                    icon: FaHistory,
                    accent: "slate",
                    label: "Activity",
                };
        }
    };

    const formatTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    const accentStyles = {
        indigo: {
            icon: "bg-indigo-500/10 text-indigo-300",
            dot: "bg-indigo-400",
            line: "bg-indigo-400/20",
        },
        cyan: {
            icon: "bg-cyan-500/10 text-cyan-300",
            dot: "bg-cyan-400",
            line: "bg-cyan-400/20",
        },
        red: {
            icon: "bg-red-500/10 text-red-300",
            dot: "bg-red-400",
            line: "bg-red-400/20",
        },
        violet: {
            icon: "bg-violet-500/10 text-violet-300",
            dot: "bg-violet-400",
            line: "bg-violet-400/20",
        },
        slate: {
            icon: "bg-slate-800 text-slate-400",
            dot: "bg-slate-500",
            line: "bg-slate-700",
        },
    };

    return (
        <section className="group relative overflow-hidden rounded-[24px] border border-slate-800/80 bg-[#0a0f17] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition-all duration-500 hover:border-slate-700/80 sm:p-6">
            {/* =========================================
                AMBIENT BACKGROUND
            ========================================= */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-indigo-500/[0.055] blur-[75px] transition-all duration-700 group-hover:bg-indigo-500/[0.09]" />

            <div className="pointer-events-none absolute -bottom-28 -left-20 h-44 w-44 rounded-full bg-violet-500/[0.025] blur-[70px]" />

            <div className="pointer-events-none absolute left-10 right-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="relative mb-6 flex items-center justify-between gap-4 sm:mb-7">
                <div className="flex min-w-0 items-center gap-3">
                    <motion.div
                        whileHover={
                            shouldReduceMotion
                                ? undefined
                                : {
                                      scale: 1.06,
                                      rotate: -4,
                                  }
                        }
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                        }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-indigo-400/10 bg-indigo-500/[0.09] text-indigo-300 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                    >
                        <FaHistory className="text-sm" />
                    </motion.div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="truncate text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl">
                                Recent Activity
                            </h2>

                            <span className="hidden h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] sm:block" />
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                            Your latest StudySync activity
                        </p>
                    </div>
                </div>

                {/* Activity count */}
                {!loading &&
                    activities.length > 0 && (
                        <div className="shrink-0 rounded-full border border-slate-800/80 bg-slate-900/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {activities.length}{" "}
                            {activities.length === 1
                                ? "Event"
                                : "Events"}
                        </div>
                    )}
            </div>

            {/* =========================================
                LOADING STATE
            ========================================= */}

            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div
                        key="loading"
                        initial={
                            shouldReduceMotion
                                ? false
                                : {
                                      opacity: 0,
                                  }
                        }
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="relative min-h-[220px] overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4"
                    >
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3"
                                >
                                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-800/70" />

                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-800/70" />

                                        <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-slate-800/50" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* =====================================
                    EMPTY STATE
                ===================================== */}

                {!loading &&
                    activities.length === 0 && (
                        <motion.div
                            key="empty"
                            initial={
                                shouldReduceMotion
                                    ? false
                                    : {
                                          opacity: 0,
                                          y: 10,
                                      }
                            }
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/40"
                        >
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04),transparent_55%)]" />

                            <div className="relative px-6 text-center">
                                <motion.div
                                    animate={
                                        shouldReduceMotion
                                            ? undefined
                                            : {
                                                  y: [
                                                      0,
                                                      -4,
                                                      0,
                                                  ],
                                              }
                                    }
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-600 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                                >
                                    <FaHistory className="text-base" />
                                </motion.div>

                                <p className="text-sm font-semibold text-slate-300">
                                    Your timeline is quiet
                                </p>

                                <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-600">
                                    Create or join a study room and
                                    your activity will appear here.
                                </p>
                            </div>
                        </motion.div>
                    )}

                {/* =====================================
                    ACTIVITY LIST
                ===================================== */}

                {!loading &&
                    activities.length > 0 && (
                        <motion.div
                            key="activities"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren:
                                            shouldReduceMotion
                                                ? 0
                                                : 0.055,
                                    },
                                },
                            }}
                            className="relative max-h-[360px] space-y-2.5 overflow-y-auto pr-1 sm:space-y-3 sm:pr-2"
                        >
                            {activities.map(
                                (
                                    activity,
                                    index
                                ) => {
                                    const {
                                        text,
                                        icon: Icon,
                                        accent,
                                        label,
                                    } =
                                        getActivityDetails(
                                            activity
                                        );

                                    const colors =
                                        accentStyles[
                                            accent
                                        ];

                                    return (
                                        <motion.div
                                            key={
                                                activity._id
                                            }
                                            variants={{
                                                hidden: {
                                                    opacity: 0,
                                                    x: shouldReduceMotion
                                                        ? 0
                                                        : 12,
                                                },
                                                visible: {
                                                    opacity: 1,
                                                    x: 0,
                                                    transition:
                                                        {
                                                            duration: 0.35,
                                                            ease: [
                                                                0.16,
                                                                1,
                                                                0.3,
                                                                1,
                                                            ],
                                                        },
                                                },
                                            }}
                                            className="group/item relative flex min-w-0 items-start gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/35 p-3 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-950/70 sm:gap-4 sm:p-4"
                                        >
                                            {/* Timeline connector */}
                                            {index <
                                                activities.length -
                                                    1 && (
                                                <div
                                                    className={`pointer-events-none absolute left-[29px] top-[57px] hidden h-[calc(100%+12px)] w-px sm:block ${colors.line}`}
                                                />
                                            )}

                                            {/* Activity icon */}
                                            <motion.div
                                                whileHover={
                                                    shouldReduceMotion
                                                        ? undefined
                                                        : {
                                                              scale: 1.08,
                                                          }
                                                }
                                                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.03] shadow-[0_8px_22px_rgba(0,0,0,0.15)] ${colors.icon}`}
                                            >
                                                <Icon className="text-xs" />
                                            </motion.div>

                                            {/* Content */}
                                            <div className="min-w-0 flex-1 pt-0.5">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span
                                                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`}
                                                    />

                                                    <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                                        {label}
                                                    </span>
                                                </div>

                                                <p className="break-words text-[13px] font-medium leading-5 text-slate-200 transition-colors duration-300 group-hover/item:text-white sm:text-sm sm:leading-6">
                                                    {text}
                                                </p>

                                                <p className="mt-1 text-[10px] leading-5 text-slate-600 sm:text-[11px]">
                                                    {formatTime(
                                                        activity.createdAt
                                                    )}
                                                </p>
                                            </div>

                                            {/* Hover indicator */}
                                            <span
                                                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full opacity-0 transition-opacity duration-300 group-hover/item:opacity-70 ${colors.dot}`}
                                            />
                                        </motion.div>
                                    );
                                }
                            )}
                        </motion.div>
                    )}
            </AnimatePresence>

            {/* Bottom border highlight */}
            <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Inner border */}
            <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/[0.025]" />
        </section>
    );
};

export default ActivityTimeline;