import {
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
} from "react-icons/fa";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const StudyStreakCalendar = ({
    isOpen,
    onClose,
    sessions = [],
}) => {
    const shouldReduceMotion = useReducedMotion();

    const [currentMonth, setCurrentMonth] =
        useState(() => new Date());

    // =========================================
    // RESET TO CURRENT MONTH WHEN OPENING
    // =========================================

    useEffect(() => {
        if (isOpen) {
            setCurrentMonth(new Date());
        }
    }, [isOpen]);

    // =========================================
    // ACTIVITY MAP
    // =========================================

    const activityMap = useMemo(() => {
        const map = new Map();

        sessions.forEach((session) => {
            if (!session?.startedAt) return;

            const date = new Date(session.startedAt);

            if (Number.isNaN(date.getTime())) return;

            const key = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(
                    2,
                    "0"
                ),
                String(date.getDate()).padStart(
                    2,
                    "0"
                ),
            ].join("-");

            const duration =
                Number(session.durationSeconds) || 0;

            map.set(
                key,
                (map.get(key) || 0) + duration
            );
        });

        return map;
    }, [sessions]);

    // =========================================
    // CURRENT MONTH DAYS
    // =========================================

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(
            year,
            month,
            1
        );

        const lastDay = new Date(
            year,
            month + 1,
            0
        );

        const daysInMonth =
            lastDay.getDate();

        // Monday = 0 ... Sunday = 6
        let startDay = firstDay.getDay();

        startDay =
            startDay === 0
                ? 6
                : startDay - 1;

        const days = [];

        // Empty cells before month starts
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Actual month days
        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {
            const date = new Date(
                year,
                month,
                day
            );

            const key = [
                date.getFullYear(),
                String(
                    date.getMonth() + 1
                ).padStart(2, "0"),
                String(
                    date.getDate()
                ).padStart(2, "0"),
            ].join("-");

            days.push({
                date,
                key,
                seconds:
                    activityMap.get(key) || 0,
            });
        }

        return days;
    }, [currentMonth, activityMap]);

    // =========================================
    // MONTH NAME
    // =========================================

    const monthName =
        currentMonth.toLocaleDateString(
            undefined,
            {
                month: "long",
                year: "numeric",
            }
        );

    // =========================================
    // MONTH NAVIGATION
    // =========================================

    const changeMonth = (direction) => {
        setCurrentMonth((previous) => {
            const next = new Date(previous);

            next.setDate(1);

            next.setMonth(
                previous.getMonth() + direction
            );

            return next;
        });
    };

    // =========================================
    // TODAY
    // =========================================

    const todayKey = useMemo(() => {
        const today = new Date();

        return [
            today.getFullYear(),
            String(
                today.getMonth() + 1
            ).padStart(2, "0"),
            String(
                today.getDate()
            ).padStart(2, "0"),
        ].join("-");
    }, []);

    // =========================================
    // MONTH STATISTICS
    // =========================================

    const monthStats = useMemo(() => {
        let activeDays = 0;
        let totalSeconds = 0;

        calendarDays.forEach((day) => {
            if (!day) return;

            if (day.seconds > 0) {
                activeDays++;
            }

            totalSeconds += day.seconds;
        });

        return {
            activeDays,
            totalSeconds,
        };
    }, [calendarDays]);

    // =========================================
    // FORMAT HOURS
    // =========================================

    const formatStudyTime = (seconds) => {
        if (!seconds) return "0m";

        const hours = Math.floor(
            seconds / 3600
        );

        const minutes = Math.floor(
            (seconds % 3600) / 60
        );

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }

        return `${minutes}m`;
    };

    // =========================================
    // ACTIVITY INTENSITY
    // =========================================

    const getIntensity = (seconds) => {
        if (!seconds) {
            return "bg-slate-800/60 text-slate-600";
        }

        if (seconds < 1800) {
            return "bg-indigo-950 text-indigo-300";
        }

        if (seconds < 3600) {
            return "bg-indigo-800 text-indigo-200";
        }

        if (seconds < 7200) {
            return "bg-indigo-600 text-white";
        }

        return "bg-indigo-400 text-white";
    };

    // =========================================
    // PREVIOUS / NEXT MONTH DISABLED LOGIC
    // =========================================

    const isCurrentMonth =
        currentMonth.getFullYear() ===
            new Date().getFullYear() &&
        currentMonth.getMonth() ===
            new Date().getMonth();

    // =========================================
    // CLOSE
    // =========================================

    if (!isOpen) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={
                    shouldReduceMotion
                        ? false
                        : {
                              opacity: 0,
                              y: -8,
                              scale: 0.97,
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
                              y: -8,
                              scale: 0.97,
                          }
                }
                transition={{
                    duration: 0.22,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className="
                    absolute
                    left-1/2
                    top-full
                    z-[100]
                    mt-3
                    w-[calc(100vw-24px)]
                    max-w-[390px]
                    -translate-x-1/2
                    sm:left-auto
                    sm:right-0
                    sm:w-[390px]
                    sm:translate-x-0
                "
            >
                <div className="overflow-hidden rounded-[20px] border border-slate-800/90 bg-[#080d15] shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.025]">
                    {/* =================================
                        HEADER
                    ================================= */}

                    <div className="border-b border-slate-800/70 p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/[0.10] text-indigo-300">
                                    <FaCalendarAlt className="text-sm" />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-white">
                                        Study Activity
                                    </h3>

                                    <p className="mt-0.5 text-[10px] text-slate-500">
                                        Track your daily study sessions
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-500
                                    transition-all
                                    duration-200
                                    hover:bg-slate-800/70
                                    hover:text-white
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-indigo-500/30
                                "
                                aria-label="Close study activity calendar"
                            >
                                <FaTimes className="text-[10px]" />
                            </button>
                        </div>

                        {/* Monthly summary */}

                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-2.5">
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                                    Active Days
                                </p>

                                <p className="mt-1 text-sm font-bold text-white">
                                    {monthStats.activeDays}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-2.5">
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                                    Study Time
                                </p>

                                <p className="mt-1 text-sm font-bold text-white">
                                    {formatStudyTime(
                                        monthStats.totalSeconds
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =================================
                        CALENDAR BODY
                    ================================= */}

                    <div className="p-4 sm:p-5">
                        {/* Month navigation */}

                        <div className="mb-4 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() =>
                                    changeMonth(-1)
                                }
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-500
                                    transition-colors
                                    hover:bg-slate-800/70
                                    hover:text-white
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-indigo-500/30
                                "
                                aria-label="Previous month"
                            >
                                <FaChevronLeft className="text-[9px]" />
                            </button>

                            <div className="text-center">
                                <p className="text-sm font-semibold text-white">
                                    {monthName}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentMonth(
                                            new Date()
                                        )
                                    }
                                    disabled={
                                        isCurrentMonth
                                    }
                                    className="
                                        mt-0.5
                                        text-[9px]
                                        font-medium
                                        text-indigo-400
                                        transition-colors
                                        hover:text-indigo-300
                                        disabled:pointer-events-none
                                        disabled:opacity-0
                                    "
                                >
                                    Today
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    changeMonth(1)
                                }
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-500
                                    transition-colors
                                    hover:bg-slate-800/70
                                    hover:text-white
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-indigo-500/30
                                "
                                aria-label="Next month"
                            >
                                <FaChevronRight className="text-[9px]" />
                            </button>
                        </div>

                        {/* Week days */}

                        <div className="mb-2 grid grid-cols-7 gap-1.5">
                            {[
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                                "Sun",
                            ].map((day) => (
                                <div
                                    key={day}
                                    className="flex h-7 items-center justify-center text-[8px] font-semibold uppercase tracking-wide text-slate-600"
                                >
                                    <span className="hidden sm:inline">
                                        {day}
                                    </span>

                                    <span className="sm:hidden">
                                        {day.charAt(
                                            0
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}

                        <div className="grid grid-cols-7 gap-1.5">
                            {calendarDays.map(
                                (day, index) => {
                                    if (!day) {
                                        return (
                                            <div
                                                key={`empty-${index}`}
                                                className="aspect-square"
                                            />
                                        );
                                    }

                                    const isToday =
                                        day.key ===
                                        todayKey;

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
                                                duration: 0.16,
                                                delay: shouldReduceMotion
                                                    ? 0
                                                    : index *
                                                      0.008,
                                            }}
                                            title={`${day.date.toLocaleDateString(
                                                undefined,
                                                {
                                                    weekday:
                                                        "long",
                                                    month:
                                                        "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                }
                                            )} • ${formatStudyTime(
                                                day.seconds
                                            )}`}
                                            className={`
                                                relative
                                                flex
                                                aspect-square
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-white/[0.025]
                                                text-[10px]
                                                font-medium
                                                transition-all
                                                duration-200
                                                hover:scale-105
                                                hover:border-white/10
                                                hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                                                ${getIntensity(
                                                    day.seconds
                                                )}
                                                ${
                                                    isToday
                                                        ? "ring-2 ring-indigo-400/70 ring-offset-1 ring-offset-[#080d15]"
                                                        : ""
                                                }
                                            `}
                                        >
                                            {day.date.getDate()}

                                            {day.seconds >
                                                0 && (
                                                <span className="absolute bottom-1 h-0.5 w-0.5 rounded-full bg-white/70" />
                                            )}
                                        </motion.div>
                                    );
                                }
                            )}
                        </div>

                        {/* =================================
                            LEGEND
                        ================================= */}

                        <div className="mt-5 border-t border-slate-800/60 pt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-medium text-slate-600">
                                    Less
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-[3px] bg-slate-800/60" />

                                    <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-950" />

                                    <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-800" />

                                    <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-600" />

                                    <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-400" />
                                </div>

                                <span className="text-[9px] font-medium text-slate-600">
                                    More
                                </span>
                            </div>

                            <p className="mt-3 text-center text-[9px] text-slate-600">
                                Hover a day to see study time
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default StudyStreakCalendar;