import { useEffect, useMemo, useState } from "react";
import {
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaClock,
    FaFire,
} from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";

const StudyStreakCalendar = ({
    isOpen,
    onClose,
    sessions = [],
}) => {
    const shouldReduceMotion = useReducedMotion();

    const [currentMonth, setCurrentMonth] = useState(
        new Date()
    );

    const [selectedDate, setSelectedDate] = useState(
        new Date()
    );

    // =========================================
    // DATE HELPERS
    // =========================================

    const getDateKey = (date) => {
        if (!date) return "";

        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");
    };

    const todayKey = getDateKey(new Date());

    // =========================================
    // NORMALIZE SESSIONS
    // =========================================

    const normalizedSessions = useMemo(() => {
        return (Array.isArray(sessions) ? sessions : [])
            .map((session) => {
                if (!session?.startedAt) return null;

                const date = new Date(session.startedAt);

                if (Number.isNaN(date.getTime())) {
                    return null;
                }

                const duration = Number(
                    session.durationSeconds
                );

                return {
                    date,
                    key: getDateKey(date),
                    seconds:
                        Number.isFinite(duration) &&
                        duration > 0
                            ? duration
                            : 0,
                };
            })
            .filter(Boolean);
    }, [sessions]);

    // =========================================
    // ACTIVITY MAP
    //
    // One date can contain multiple sessions.
    // We add all session durations for that date.
    // =========================================

    const activityMap = useMemo(() => {
        const map = new Map();

        normalizedSessions.forEach((session) => {
            map.set(
                session.key,
                (map.get(session.key) || 0) +
                    session.seconds
            );
        });

        return map;
    }, [normalizedSessions]);

    // =========================================
    // CURRENT MONTH DATA
    // =========================================

    const monthStats = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        let activeDays = 0;
        let totalSeconds = 0;

        normalizedSessions.forEach((session) => {
            if (
                session.date.getFullYear() === year &&
                session.date.getMonth() === month
            ) {
                if (session.seconds > 0) {
                    activeDays += activityMap.has(
                        session.key
                    )
                        ? 0
                        : 0;
                }
            }
        });

        // Count unique active days.
        const uniqueDays = new Set();

        normalizedSessions.forEach((session) => {
            if (
                session.date.getFullYear() === year &&
                session.date.getMonth() === month &&
                session.seconds > 0
            ) {
                uniqueDays.add(session.key);

                totalSeconds += session.seconds;
            }
        });

        activeDays = uniqueDays.size;

        return {
            activeDays,
            totalSeconds,
        };
    }, [currentMonth, normalizedSessions, activityMap]);

    // =========================================
    // CALENDAR DAYS
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

        const daysInMonth = lastDay.getDate();

        // Monday = first day.
        let startingDay = firstDay.getDay();

        startingDay =
            startingDay === 0
                ? 6
                : startingDay - 1;

        const days = [];

        // Empty cells before first day.
        for (
            let index = 0;
            index < startingDay;
            index++
        ) {
            days.push(null);
        }

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

            const key = getDateKey(date);

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
    // SELECTED DAY
    // =========================================

    const selectedDateKey = getDateKey(
        selectedDate
    );

    const selectedDaySeconds =
        activityMap.get(selectedDateKey) || 0;

    const selectedDayLabel =
        selectedDate.toLocaleDateString(
            undefined,
            {
                weekday: "short",
                month: "short",
                day: "numeric",
            }
        );

    // =========================================
    // MONTH LABEL
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

        setSelectedDate((previous) => {
            const next = new Date(previous);

            next.setDate(1);
            next.setMonth(
                previous.getMonth() + direction
            );

            return next;
        });
    };

    // =========================================
    // GO TO TODAY
    // =========================================

    const goToToday = () => {
        const today = new Date();

        setCurrentMonth(today);
        setSelectedDate(today);
    };

    // =========================================
    // SELECT DATE
    // =========================================

    const handleDateClick = (day) => {
        if (!day) return;

        setSelectedDate(day.date);
    };

    // =========================================
    // FORMAT TIME
    // =========================================

    const formatDuration = (seconds) => {
        if (!seconds || seconds <= 0) {
            return "0m";
        }

        const totalMinutes = Math.floor(
            seconds / 60
        );

        const hours = Math.floor(
            totalMinutes / 60
        );

        const minutes = totalMinutes % 60;

        if (hours > 0 && minutes > 0) {
            return `${hours}h ${minutes}m`;
        }

        if (hours > 0) {
            return `${hours}h`;
        }

        return `${minutes}m`;
    };

    // =========================================
    // ACTIVITY INTENSITY
    // =========================================

    const getIntensity = (seconds) => {
        if (!seconds || seconds <= 0) {
            return "bg-slate-900/80 border-slate-800/80";
        }

        if (seconds < 1800) {
            return "bg-indigo-950 border-indigo-900/70";
        }

        if (seconds < 3600) {
            return "bg-indigo-800/80 border-indigo-700/70";
        }

        if (seconds < 7200) {
            return "bg-indigo-600/80 border-indigo-500/70";
        }

        return "bg-indigo-500 border-indigo-400/70";
    };

    // =========================================
    // ESCAPE KEY
    // =========================================

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isOpen, onClose]);

    // =========================================
    // CLOSE ON OUTSIDE CLICK
    //
    // This component itself is positioned by the
    // parent, so we intentionally don't use a
    // document-wide click listener here.
    // StatsSection handles the outside click.
    // =========================================

    if (!isOpen) {
        return null;
    }

    // =========================================
    // RENDER
    // =========================================

    return (
        <motion.div
            initial={
                shouldReduceMotion
                    ? false
                    : {
                          opacity: 0,
                          x: 10,
                          scale: 0.97,
                      }
            }
            animate={
                shouldReduceMotion
                    ? undefined
                    : {
                          opacity: 1,
                          x: 0,
                          scale: 1,
                      }
            }
            exit={
                shouldReduceMotion
                    ? undefined
                    : {
                          opacity: 0,
                          x: 10,
                          scale: 0.97,
                      }
            }
            transition={{
                duration: shouldReduceMotion
                    ? 0
                    : 0.2,
                ease: [0.16, 1, 0.3, 1],
            }}
            role="dialog"
            aria-label="Study activity calendar"
            className="
                absolute
                right-full
                top-0
                z-[100]
                mr-4
                w-[min(360px,calc(100vw-32px))]
                overflow-hidden
                rounded-[22px]
                border
                border-slate-800/90
                bg-[#080d15]
                shadow-[0_24px_80px_rgba(0,0,0,0.55)]
            "
        >
            {/* =====================================
                TOP ACCENT
            ===================================== */}

            <div className="pointer-events-none absolute left-10 right-10 top-0 h-px bg-violet-400/70" />

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="border-b border-slate-800/70 px-4 pb-4 pt-5 sm:px-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border border-indigo-400/10 bg-indigo-500/[0.09] text-indigo-300">
                            <FaCalendarAlt className="text-sm" />
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold tracking-[-0.02em] text-white">
                                Study Activity
                            </h3>

                            <p className="mt-0.5 truncate text-[10px] text-slate-500">
                                Track your daily study sessions
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-600
                            transition-all
                            duration-200
                            hover:bg-slate-800/70
                            hover:text-slate-300
                        "
                        aria-label="Close calendar"
                    >
                        ×
                    </button>
                </div>

                {/* =================================
                    MONTH SUMMARY
                ================================= */}

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <div className="rounded-[14px] border border-slate-800/80 bg-[#0b111c] px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                            <FaFire className="text-[8px] text-violet-400" />

                            <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                                Active Days
                            </span>
                        </div>

                        <div className="mt-1 text-lg font-bold leading-none text-white">
                            {monthStats.activeDays}
                        </div>

                        <p className="mt-1 text-[8px] text-slate-600">
                            this month
                        </p>
                    </div>

                    <div className="rounded-[14px] border border-slate-800/80 bg-[#0b111c] px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                            <FaClock className="text-[8px] text-cyan-400" />

                            <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                                Study Time
                            </span>
                        </div>

                        <div className="mt-1 text-lg font-bold leading-none text-white">
                            {formatDuration(
                                monthStats.totalSeconds
                            )}
                        </div>

                        <p className="mt-1 text-[8px] text-slate-600">
                            this month
                        </p>
                    </div>
                </div>
            </div>

            {/* =====================================
                CALENDAR BODY
            ===================================== */}

            <div className="px-4 py-4 sm:px-5">
                {/* MONTH NAVIGATION */}

                <div className="flex items-center justify-between">
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
                            rounded-[10px]
                            border
                            border-slate-800/80
                            bg-[#0b111b]
                            text-slate-500
                            transition-all
                            duration-200
                            hover:border-slate-700
                            hover:bg-slate-800/70
                            hover:text-white
                        "
                        aria-label="Previous month"
                    >
                        <FaChevronLeft className="text-[9px]" />
                    </button>

                    <div className="text-center">
                        <h4 className="text-base font-bold tracking-[-0.025em] text-white">
                            {monthName}
                        </h4>

                        <button
                            type="button"
                            onClick={goToToday}
                            className="
                                mt-1
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.16em]
                                text-indigo-400
                                transition-colors
                                hover:text-indigo-300
                            "
                        >
                            Go to today
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
                            rounded-[10px]
                            border
                            border-slate-800/80
                            bg-[#0b111b]
                            text-slate-500
                            transition-all
                            duration-200
                            hover:border-slate-700
                            hover:bg-slate-800/70
                            hover:text-white
                        "
                        aria-label="Next month"
                    >
                        <FaChevronRight className="text-[9px]" />
                    </button>
                </div>

                {/* WEEK DAYS */}

                <div className="mt-4 grid grid-cols-7 gap-1.5">
                    {[
                        "MON",
                        "TUE",
                        "WED",
                        "THU",
                        "FRI",
                        "SAT",
                        "SUN",
                    ].map((day) => (
                        <div
                            key={day}
                            className="
                                flex
                                h-5
                                items-center
                                justify-center
                                text-[7px]
                                font-semibold
                                tracking-[0.08em]
                                text-slate-600
                            "
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* CALENDAR GRID */}

                <div className="mt-1.5 grid grid-cols-7 gap-1.5">
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

                            const isSelected =
                                day.key ===
                                selectedDateKey;

                            const hasActivity =
                                day.seconds > 0;

                            return (
                                <motion.button
                                    key={day.key}
                                    type="button"
                                    initial={
                                        shouldReduceMotion
                                            ? false
                                            : {
                                                  opacity: 0,
                                                  scale: 0.92,
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
                                        duration: 0.14,
                                        delay:
                                            shouldReduceMotion
                                                ? 0
                                                : index *
                                                  0.008,
                                    }}
                                    onClick={() =>
                                        handleDateClick(
                                            day
                                        )
                                    }
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
                                    )} • ${formatDuration(
                                        day.seconds
                                    )}`}
                                    className={`
                                        relative
                                        aspect-square
                                        min-w-0
                                        rounded-[9px]
                                        border
                                        text-[9px]
                                        font-semibold
                                        transition-all
                                        duration-200
                                        hover:scale-[1.04]
                                        hover:border-slate-600
                                        ${getIntensity(
                                            day.seconds
                                        )}
                                        ${
                                            isSelected
                                                ? "ring-2 ring-indigo-400/80 ring-offset-1 ring-offset-[#080d15]"
                                                : ""
                                        }
                                        ${
                                            isToday
                                                ? "shadow-[0_0_0_1px_rgba(129,140,248,0.45)]"
                                                : ""
                                        }
                                    `}
                                >
                                    <span
                                        className={
                                            hasActivity
                                                ? "text-white"
                                                : "text-slate-600"
                                        }
                                    >
                                        {day.date.getDate()}
                                    </span>

                                    {/* Today dot */}

                                    {isToday && (
                                        <span className="absolute bottom-1 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-indigo-300" />
                                    )}

                                    {/* Activity indicator */}

                                    {hasActivity && (
                                        <span className="absolute right-1 top-1 h-1 w-1 rounded-full bg-white/60" />
                                    )}
                                </motion.button>
                            );
                        }
                    )}
                </div>

                {/* =================================
                    SELECTED DAY DETAILS
                ================================= */}

                <div className="mt-4 rounded-[14px] border border-slate-800/80 bg-[#0b111b] px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                                Selected day
                            </p>

                            <p className="mt-1 truncate text-[11px] font-semibold text-slate-300">
                                {selectedDayLabel}
                            </p>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                                Study time
                            </p>

                            <p className="mt-1 text-sm font-bold text-white">
                                {formatDuration(
                                    selectedDaySeconds
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* =================================
                    LEGEND
                ================================= */}

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-[8px] text-slate-600">
                        Less
                    </span>

                    <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-[3px] border border-slate-800 bg-slate-900/80" />

                        <span className="h-2.5 w-2.5 rounded-[3px] border border-indigo-900/70 bg-indigo-950" />

                        <span className="h-2.5 w-2.5 rounded-[3px] border border-indigo-700/70 bg-indigo-800/80" />

                        <span className="h-2.5 w-2.5 rounded-[3px] border border-indigo-500/70 bg-indigo-600/80" />

                        <span className="h-2.5 w-2.5 rounded-[3px] border border-indigo-400/70 bg-indigo-500" />
                    </div>

                    <span className="text-[8px] text-slate-600">
                        More
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default StudyStreakCalendar;