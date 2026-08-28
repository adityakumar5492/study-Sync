import {
    FaUsers,
    FaClock,
    FaFire,
    FaCalendarAlt,
} from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { useAppSelector } from "../../redux/hooks";
import socket from "../../socket";

const StatsSection = () => {
    const shouldReduceMotion = useReducedMotion();

    const { rooms } = useAppSelector((state) => state.room);

    const [studyStats, setStudyStats] = useState({
        totalSeconds: 0,
        sessions: [],
    });

    useEffect(() => {
        const handleStats = (data) => {
            setStudyStats({
                totalSeconds: data?.totalSeconds || 0,
                sessions: data?.sessions || [],
            });
        };

        const requestStats = () => {
            socket.emit("study:stats-request");
        };

        const handleStatsUpdated = () => {
            requestStats();
        };

        socket.on("study:stats", handleStats);
        socket.on(
            "profile:study-stats-updated",
            handleStatsUpdated
        );

        if (socket.connected) {
            requestStats();
        } else {
            socket.connect();
        }

        return () => {
            socket.off("study:stats", handleStats);
            socket.off(
                "profile:study-stats-updated",
                handleStatsUpdated
            );
        };
    }, []);

    const totalHours = Math.floor(
        studyStats.totalSeconds / 3600
    );

    const calculateCurrentStreak = () => {
        const sessions = studyStats.sessions || [];

        if (!sessions.length) return 0;

        const studyDays = new Set(
            sessions.map((session) => {
                const date = new Date(session.startedAt);

                return `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    date.getDate()
                ).padStart(2, "0")}`;
            })
        );

        let streak = 0;
        const currentDate = new Date();

        while (true) {
            const key = `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
            ).padStart(2, "0")}-${String(
                currentDate.getDate()
            ).padStart(2, "0")}`;

            if (!studyDays.has(key)) break;

            streak++;
            currentDate.setDate(
                currentDate.getDate() - 1
            );
        }

        return streak;
    };

    const currentStreak = calculateCurrentStreak();

    const activityDays = new Set(
        (studyStats.sessions || []).map((session) => {
            const date = new Date(session.startedAt);

            return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        })
    ).size;

    const stats = [
        {
            id: "rooms",
            title: "Rooms Joined",
            value: rooms?.length || 0,
            icon: FaUsers,
            accent: "indigo",
        },
        {
            id: "hours",
            title: "Study Hours",
            value: totalHours,
            icon: FaClock,
            accent: "cyan",
        },
        {
            id: "streak",
            title: "Current Streak",
            value: currentStreak,
            icon: FaFire,
            accent: "orange",
        },
        {
            id: "activity",
            title: "Study Activity",
            value: activityDays,
            icon: FaCalendarAlt,
            accent: "violet",
        },
    ];

    const accentStyles = {
        indigo: {
            icon: "text-indigo-300",
            bg: "bg-indigo-500/[0.09]",
            border: "group-hover:border-indigo-500/20",
            glow: "bg-indigo-500",
            dot: "bg-indigo-400",
        },
        cyan: {
            icon: "text-cyan-300",
            bg: "bg-cyan-500/[0.09]",
            border: "group-hover:border-cyan-500/20",
            glow: "bg-cyan-500",
            dot: "bg-cyan-400",
        },
        orange: {
            icon: "text-orange-300",
            bg: "bg-orange-500/[0.09]",
            border: "group-hover:border-orange-500/20",
            glow: "bg-orange-500",
            dot: "bg-orange-400",
        },
        violet: {
            icon: "text-violet-300",
            bg: "bg-violet-500/[0.09]",
            border: "group-hover:border-violet-500/20",
            glow: "bg-violet-500",
            dot: "bg-violet-400",
        },
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.06,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 14,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <section className="relative">
            <motion.div
                initial={
                    shouldReduceMotion
                        ? false
                        : { opacity: 0, y: 8 }
                }
                animate={
                    shouldReduceMotion
                        ? undefined
                        : { opacity: 1, y: 0 }
                }
                transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className="mb-5 flex items-end justify-between gap-4 sm:mb-6"
            >
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/40" />
                            <span className="relative h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        </span>

                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400/80">
                            Overview
                        </span>
                    </div>

                    <h2 className="text-xl font-bold tracking-[-0.035em] text-white sm:text-2xl">
                        Your Statistics
                    </h2>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                        A quick overview of your study activity.
                    </p>
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
            >
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const colors = accentStyles[stat.accent];

                    return (
                        <motion.div
                            key={stat.id}
                            variants={itemVariants}
                            whileHover={
                                shouldReduceMotion
                                    ? undefined
                                    : { y: -4 }
                            }
                            className={`group relative min-w-0 overflow-hidden rounded-[20px] border border-slate-800/80 bg-[#0a0f17] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-[border-color,background-color,box-shadow] duration-500 hover:bg-[#0c121c] hover:shadow-[0_18px_48px_rgba(0,0,0,0.22)] sm:p-5 ${colors.border}`}
                        >
                            <div className={`pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full opacity-[0.035] blur-[45px] transition-all duration-700 group-hover:scale-125 group-hover:opacity-[0.12] ${colors.glow}`} />

                            <div className={`pointer-events-none absolute left-6 right-6 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-70 ${colors.dot}`} />

                            <div className="relative flex items-center justify-between">
                                <motion.div
                                    whileHover={
                                        shouldReduceMotion
                                            ? undefined
                                            : {
                                                  scale: 1.06,
                                                  rotate: -3,
                                              }
                                    }
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 20,
                                    }}
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border border-white/[0.035] shadow-[0_8px_22px_rgba(0,0,0,0.16)] sm:h-11 sm:w-11 ${colors.bg} ${colors.icon}`}
                                >
                                    <Icon className="text-[15px] sm:text-base" />
                                </motion.div>

                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-slate-800/80 bg-slate-900/70 px-1.5 text-[8px] font-semibold tracking-wider text-slate-600 transition-colors duration-300 group-hover:text-slate-400">
                                    0{index + 1}
                                </span>
                            </div>

                            <div className="relative mt-5">
                                <motion.div
                                    key={String(stat.value)}
                                    initial={
                                        shouldReduceMotion
                                            ? false
                                            : { opacity: 0, y: 5 }
                                    }
                                    animate={
                                        shouldReduceMotion
                                            ? undefined
                                            : { opacity: 1, y: 0 }
                                    }
                                    transition={{ duration: 0.3 }}
                                    className="truncate text-[25px] font-bold leading-none tracking-[-0.045em] text-white sm:text-[29px]"
                                >
                                    {stat.value}
                                </motion.div>

                                <p className="mt-2 truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500 sm:text-[11px]">
                                    {stat.title}
                                </p>
                            </div>

                            <div className="relative mt-4 flex items-center gap-2">
                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_8px_currentColor] ${colors.dot}`} />

                                <span className="truncate text-[9px] font-medium text-slate-600 transition-colors duration-300 group-hover:text-slate-500">
                                    Study activity
                                </span>
                            </div>

                            <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/[0.025] transition-all duration-500 group-hover:ring-white/[0.06]" />
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};

export default StatsSection;