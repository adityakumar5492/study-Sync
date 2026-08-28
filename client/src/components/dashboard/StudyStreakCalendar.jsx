import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";

import socket from "../../socket/socket";

const StudyStreakCalendar = ({ isOpen, onClose }) => {
    const shouldReduceMotion = useReducedMotion();

    const [sessions, setSessions] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

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
            if (!session?.startedAt) return;

            const date = new Date(session.startedAt);

            if (Number.isNaN(date.getTime())) return;

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
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();

        let startDay = firstDay.getDay();

        // Monday as first day of week
        startDay = startDay === 0 ? 6 : startDay - 1;

        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);

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
    }, [currentMonth, activityMap]);

    const monthName = currentMonth.toLocaleDateString(
        undefined,
        {
            month: "long",
            year: "numeric",
        }
    );

    const changeMonth = (direction) => {
        setCurrentMonth((previous) => {
            const next = new Date(previous);

            next.setMonth(
                previous.getMonth() + direction
            );

            return next;
        });
    };

    const getIntensity = (seconds) => {
        if (!seconds) return "bg-slate-800/70";
        if (seconds < 1800) return "bg-indigo-900";
        if (seconds < 3600) return "bg-indigo-700";
        if (seconds < 7200) return "bg-indigo-500";

        return "bg-indigo-400";
    };

    const totalActiveDays = useMemo(() => {
        return calendarDays.filter(
            (day) => day && day.seconds > 0
        ).length;
    }, [calendarDays]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={
                shouldReduceMotion
                    ? false
                    : {
                          opacity: 0,
                          y: 8,
                          scale: 0.98,
                      }
            }
            animate={
                shouldReduceMotion
                    ? undefined
                    : {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                      }
            }
            exit={
                shouldReduceMotion
                    ? undefined
                    : {
                          opacity: 0,
                          y: 8,
                          scale: 0.98,
                      }
            }
            transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute right-0 top-full z-50 mt-3 w-[calc(100vw-24px)] max-w-[360px] overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0a0f17] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:w-[360px]"
        >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/[0.09] text-indigo-300">
                        <FaCalendarAlt className="text-xs" />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            Study Activity
                        </h3>

                        <p className="text-[9px] font-medium uppercase tracking-wider text-slate-600">
                            {totalActiveDays} active days
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-slate-800/60 hover:text-slate-300"
                    aria-label="Close calendar"
                >
                    ×
                </button>
            </div>

            {/* Month Navigation */}
            <div className="mb-3 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-slate-800/60 hover:text-white"
                    aria-label="Previous month"
                >
                    <FaChevronLeft className="text-[9px]" />
                </button>

                <span className="text-xs font-semibold text-slate-300">
                    {monthName}
                </span>

                <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-slate-800/60 hover:text-white"
                    aria-label="Next month"
                >
                    <FaChevronRight className="text-[9px]" />
                </button>
            </div>

            {/* Week Days */}
            <div className="mb-2 grid grid-cols-7 gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map(
                    (day, index) => (
                        <div
                            key={`${day}-${index}`}
                            className="flex h-7 items-center justify-center text-[9px] font-semibold uppercase text-slate-600"
                        >
                            {day}
                        </div>
                    )
                )}
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                    if (!day) {
                        return (
                            <div
                                key={`empty-${index}`}
                                className="aspect-square"
                            />
                        );
                    }

                    return (
                        <motion.div
                            key={day.key}
                            initial={
                                shouldReduceMotion
                                    ? false
                                    : {
                                          opacity: 0,
                                          scale: 0.9,
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
                                duration: 0.15,
                                delay: shouldReduceMotion
                                    ? 0
                                    : index * 0.01,
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
                            className={`flex aspect-square cursor-default items-center justify-center rounded-md border border-white/[0.025] text-[9px] font-medium text-slate-400 transition-all duration-200 hover:scale-105 hover:border-white/10 ${getIntensity(
                                day.seconds
                            )}`}
                        >
                            {day.date.getDate()}
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3">
                <span className="text-[9px] text-slate-600">
                    Less
                </span>

                <div className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-slate-800/70" />
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-900" />
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-700" />
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-500" />
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-400" />
                </div>

                <span className="text-[9px] text-slate-600">
                    More
                </span>
            </div>
        </motion.div>
    );
};

export default StudyStreakCalendar;