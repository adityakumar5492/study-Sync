import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";

import socket from "../../socket/socket";

const StudyStreakCalendar = () => {
    const shouldReduceMotion = useReducedMotion();

    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const handleStats = (data) => {
            setSessions(data?.sessions || []);
        };

        const requestStats = () => {
            socket.emit("study:stats-request");
        };

        socket.on("study:stats", handleStats);

        if (socket.connected) {
            requestStats();
        } else {
            socket.connect();
        }

        return () => {
            socket.off("study:stats", handleStats);
        };
    }, []);

    const activityMap = useMemo(() => {
        const map = new Map();

        sessions.forEach((session) => {
            const date = new Date(session.startedAt);

            const key = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0"),
            ].join("-");

            map.set(
                key,
                (map.get(key) || 0) +
                    (session.durationSeconds || 0)
            );
        });

        return map;
    }, [sessions]);

    const calendarDays = useMemo(() => {
        const days = [];
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        // Last 12 weeks
        const start = new Date(today);
        start.setDate(today.getDate() - 83);

        for (let i = 0; i < 84; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);

            const key = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0"),
            ].join("-");

            days.push({
                date,
                key,
                seconds: activityMap.get(key) || 0,
            });
        }

        return days;
    }, [activityMap]);

    const getIntensity = (seconds) => {
        if (!seconds) return "bg-slate-800/70";
        if (seconds < 1800) return "bg-indigo-900";
        if (seconds < 3600) return "bg-indigo-700";
        if (seconds < 7200) return "bg-indigo-500";

        return "bg-indigo-400";
    };

    const totalActiveDays = useMemo(() => {
        return calendarDays.filter(
            (day) => day.seconds > 0
        ).length;
    }, [calendarDays]);

    return (
        <section className="mt-6 relative">
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
                className="mb-5 flex items-end justify-between gap-4"
            >
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/40" />
                            <span className="relative h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        </span>

                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400/80">
                            Activity
                        </span>
                    </div>

                    <h2 className="text-xl font-bold tracking-[-0.035em] text-white sm:text-2xl">
                        Study Activity
                    </h2>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                        Your study activity over the last 12 weeks.
                    </p>
                </div>

                <div className="hidden items-center gap-2 rounded-xl border border-slate-800/80 bg-[#0a0f17] px-3 py-2 sm:flex">
                    <FaCalendarAlt className="text-xs text-indigo-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {totalActiveDays} active days
                    </span>
                </div>
            </motion.div>

            <motion.div
                initial={
                    shouldReduceMotion
                        ? false
                        : { opacity: 0, y: 12 }
                }
                animate={
                    shouldReduceMotion
                        ? undefined
                        : { opacity: 1, y: 0 }
                }
                transition={{
                    duration: 0.5,
                    delay: shouldReduceMotion ? 0 : 0.08,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className="overflow-x-auto rounded-[20px] border border-slate-800/80 bg-[#0a0f17] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.14)] sm:p-5"
            >
                <div className="min-w-[620px]">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                            Less
                        </span>

                        <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-[3px] bg-slate-800/70" />
                            <span className="h-3 w-3 rounded-[3px] bg-indigo-900" />
                            <span className="h-3 w-3 rounded-[3px] bg-indigo-700" />
                            <span className="h-3 w-3 rounded-[3px] bg-indigo-500" />
                            <span className="h-3 w-3 rounded-[3px] bg-indigo-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-1.5">
                        {calendarDays.map((day, index) => (
                            <motion.div
                                key={day.key}
                                initial={
                                    shouldReduceMotion
                                        ? false
                                        : {
                                              opacity: 0,
                                              scale: 0.85,
                                          }
                                }
                                animate={
                                    shouldReduceMotion
                                        ? undefined
                                        : {
                                              opacity: 1,
                                              scale: 1,
                                          }
                                }
                                transition={{
                                    duration: 0.2,
                                    delay: shouldReduceMotion
                                        ? 0
                                        : index * 0.008,
                                }}
                                title={`${day.date.toLocaleDateString(
                                    undefined,
                                    {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    }
                                )} • ${Math.floor(
                                    day.seconds / 60
                                )} minutes`}
                                className={`aspect-square rounded-[4px] border border-white/[0.025] ${getIntensity(
                                    day.seconds
                                )} transition-all duration-200 hover:scale-110 hover:border-white/10`}
                            />
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3">
                        <span className="text-[10px] text-slate-600">
                            Last 12 weeks
                        </span>

                        <span className="text-[10px] font-medium text-slate-600">
                            More
                        </span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default StudyStreakCalendar;