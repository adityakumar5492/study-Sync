import {
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaClock,
    FaTimes,
    FaFire,
} from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

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
    // HELPERS
    // =========================================

    const getDateKey = (date) => {
        if (!(date instanceof Date)) return "";

        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");
    };

    const formatTime = (seconds = 0) => {
        const totalSeconds = Math.max(
            0,
            Number(seconds) || 0
        );

        const hours = Math.floor(totalSeconds / 3600);

        const minutes = Math.floor(
            (totalSeconds % 3600) / 60
        );

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }

        return `${minutes}m`;
    };

    const formatLongDate = (date) => {
        return date.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    // =========================================
    // ACTIVITY DATA
    //
    // One entry per calendar day.
    //
    // {
    //   seconds: total study time,
    //   sessions: number of sessions
    // }
    // =========================================

    const activityMap = useMemo(() => {
        const map = new Map();

        if (!Array.isArray(sessions)) {
            return map;
        }

        sessions.forEach((session) => {
            if (!session?.startedAt) return;

            const date = new Date(session.startedAt);

            if (Number.isNaN(date.getTime())) {
                return;
            }

            const key = getDateKey(date);

            const previous = map.get(key) || {
                seconds: 0,
                sessions: 0,
            };

            map.set(key, {
                seconds:
                    previous.seconds +
                    Math.max(
                        0,
                        Number(
                            session.durationSeconds
                        ) || 0
                    ),

                sessions: previous.sessions + 1,
            });
        });

        return map;
    }, [sessions]);

    // =========================================
    // CURRENT MONTH CALENDAR
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

        // Monday = first day
        let startOffset = firstDay.getDay();

        startOffset =
            startOffset === 0
                ? 6
                : startOffset - 1;

        const days = [];

        // Empty cells before first day
        for (
            let index = 0;
            index < startOffset;
            index++
        ) {
            days.push(null);
        }

        // Actual days
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

            const activity =
                activityMap.get(key) || {
                    seconds: 0,
                    sessions: 0,
                };

            days.push({
                date,
                key,
                seconds: activity.seconds,
                sessions: activity.sessions,
            });
        }

        return days;
    }, [currentMonth, activityMap]);

    // =========================================
    // MONTH STATISTICS
    // =========================================

    const monthStats = useMemo(() => {
        let totalSeconds = 0;
        let activeDays = 0;
        let totalSessions = 0;

        calendarDays.forEach((day) => {
            if (!day) return;

            if (day.seconds > 0) {
                activeDays++;
            }

            totalSeconds += day.seconds;
            totalSessions += day.sessions;
        });

        return {
            totalSeconds,
            activeDays,
            totalSessions,
        };
    }, [calendarDays]);

    // =========================================
    // SELECTED DAY DATA
    // =========================================

    const selectedActivity = useMemo(() => {
        if (!selectedDate) {
            return {
                seconds: 0,
                sessions: 0,
            };
        }

        return (
            activityMap.get(
                getDateKey(selectedDate)
            ) || {
                seconds: 0,
                sessions: 0,
            }
        );
    }, [selectedDate, activityMap]);

    // =========================================
    // TODAY
    // =========================================

    const todayKey = useMemo(
        () => getDateKey(new Date()),
        []
    );

    // =========================================
    // MONTH NAME
    // =========================================

    const monthName = currentMonth.toLocaleDateString(
        undefined,
        {
            month: "long",
            year: "numeric",
        }
    );

    // =========================================
    // CHANGE MONTH
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
    // ESCAPE
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
    // BODY SCROLL LOCK
    //
    // Prevents the page behind the calendar
    // from scrolling on smaller screens.
    // =========================================

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow =
                originalOverflow;
        };
    }, [isOpen]);

    // =========================================
    // ACTIVITY INTENSITY
    // =========================================

    const getIntensity = (seconds) => {
        if (!seconds) {
            return {
                background:
                    "bg-slate-800/55",
                border:
                    "border-slate-800/70",
                text: "text-slate-600",
                glow: "",
            };
        }

        // < 30 minutes
        if (seconds < 1800) {
            return {
                background:
                    "bg-indigo-950/80",
                border:
                    "border-indigo-900/60",
                text: "text-indigo-300",
                glow: "shadow-[0_0_14px_rgba(99,102,241,0.08)]",
            };
        }

        // 30 - 60 minutes
        if (seconds < 3600) {
            return {
                background:
                    "bg-indigo-800/80",
                border:
                    "border-indigo-700/60",
                text: "text-indigo-200",
                glow: "shadow-[0_0_16px_rgba(99,102,241,0.12)]",
            };
        }

        // 1 - 2 hours
        if (seconds < 7200) {
            return {
                background:
                    "bg-indigo-600/80",
                border:
                    "border-indigo-500/60",
                text: "text-white",
                glow: "shadow-[0_0_18px_rgba(99,102,241,0.18)]",
            };
        }

        // 2+ hours
        return {
            background:
                "bg-indigo-500",
            border:
                "border-indigo-400/70",
            text: "text-white",
            glow: "shadow-[0_0_22px_rgba(99,102,241,0.24)]",
        };
    };

    // =========================================
    // SELECT DAY
    // =========================================

    const handleSelectDay = (day) => {
        setSelectedDate(day.date);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <>
            {/* =========================================
                MOBILE BACKDROP

                Only visible below lg.
                Clicking it closes the calendar.
            ========================================= */}

            <motion.div
                initial={
                    shouldReduceMotion
                        ? false
                        : {
                              opacity: 0,
                          }
                }
                animate={
                    shouldReduceMotion
                        ? undefined
                        : {
                              opacity: 1,
                          }
                }
                className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-[2px] lg:hidden"
                onMouseDown={onClose}
                aria-hidden="true"
            />

            {/* =========================================
                CALENDAR PANEL

                DESKTOP:
                Opens to the LEFT of Study Activity card.

                MOBILE:
                Fixed side panel so it never pushes
                the dashboard downward.
            ========================================= */}

            <motion.div
                initial={
                    shouldReduceMotion
                        ? false
                        : {
                              opacity: 0,
                              x: 14,
                              scale: 0.98,
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
                              x: 14,
                              scale: 0.98,
                          }
                }
                transition={{
                    duration: shouldReduceMotion
                        ? 0
                        : 0.22,
                    ease: [0.16, 1, 0.3, 1],
                }}
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
                className="
                    fixed
                    right-3
                    top-20
                    bottom-3
                    z-[100]
                    w-[min(410px,calc(100vw-24px))]
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-slate-800/90
                    bg-[#080d15]
                    shadow-[0_25px_90px_rgba(0,0,0,0.58)]

                    lg:absolute
                    lg:right-[calc(100%+16px)]
                    lg:top-1/2
                    lg:bottom-auto
                    lg:w-[410px]
                    lg:-translate-y-1/2
                "
            >
                <div className="flex h-full min-h-0 flex-col">
                    {/* =================================
                        HEADER
                    ================================= */}

                    <div className="shrink-0 border-b border-slate-800/70 p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-indigo-400/10 bg-indigo-500/[0.10] text-indigo-300 shadow-[0_8px_25px_rgba(79,70,229,0.10)]">
                                    <FaCalendarAlt className="text-base" />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate text-[15px] font-bold tracking-[-0.02em] text-white">
                                        Study Activity
                                    </h3>

                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                        Track your daily study sessions
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-all duration-200 hover:bg-slate-800/70 hover:text-white"
                                aria-label="Close study activity"
                            >
                                <FaTimes className="text-[11px]" />
                            </button>
                        </div>

                        {/* =================================
                            MONTH SUMMARY
                        ================================= */}

                        <div className="mt-5 grid grid-cols-2 gap-2.5">
                            <div className="rounded-[14px] border border-slate-800/80 bg-[#0b111c] px-3.5 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

                                    <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                        Active Days
                                    </span>
                                </div>

                                <div className="mt-2 text-lg font-bold leading-none text-white">
                                    {
                                        monthStats.activeDays
                                    }
                                </div>

                                <p className="mt-1 text-[9px] text-slate-600">
                                    this month
                                </p>
                            </div>

                            <div className="rounded-[14px] border border-slate-800/80 bg-[#0b111c] px-3.5 py-3">
                                <div className="flex items-center gap-2">
                                    <FaClock className="text-[9px] text-cyan-400" />

                                    <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                        Study Time
                                    </span>
                                </div>

                                <div className="mt-2 text-lg font-bold leading-none text-white">
                                    {formatTime(
                                        monthStats.totalSeconds
                                    )}
                                </div>

                                <p className="mt-1 text-[9px] text-slate-600">
                                    this month
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =================================
                        SCROLLABLE CALENDAR CONTENT

                        Only this area can scroll.
                        Dashboard itself will not move.
                    ================================= */}

                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 [scrollbar-color:#1e293b_transparent] [scrollbar-width:thin]">
                        {/* =================================
                            MONTH NAVIGATION
                        ================================= */}

                        <div className="mb-5 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() =>
                                    changeMonth(-1)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-slate-800/80 bg-[#0b111c] text-slate-500 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/70 hover:text-white"
                                aria-label="Previous month"
                            >
                                <FaChevronLeft className="text-[10px]" />
                            </button>

                            <div className="text-center">
                                <h4 className="text-[17px] font-bold tracking-[-0.025em] text-white">
                                    {monthName}
                                </h4>

                                <button
                                    type="button"
                                    onClick={goToToday}
                                    className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-indigo-400 transition-colors hover:text-indigo-300"
                                >
                                    Go to today
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    changeMonth(1)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-slate-800/80 bg-[#0b111c] text-slate-500 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/70 hover:text-white"
                                aria-label="Next month"
                            >
                                <FaChevronRight className="text-[10px]" />
                            </button>
                        </div>

                        {/* =================================
                            WEEK DAYS
                        ================================= */}

                        <div className="mb-2 grid grid-cols-7 gap-1.5">
                            {[
                                "MON",
                                "TUE",
                                "WED",
                                "THU",
                                "FRI",
                                "SAT",
                                "SUN",
                            ].map(
                                (day) => (
                                    <div
                                        key={
                                            day
                                        }
                                        className="flex h-7 items-center justify-center text-[8px] font-bold tracking-[0.08em] text-slate-600"
                                    >
                                        {day}
                                    </div>
                                )
                            )}
                        </div>

                        {/* =================================
                            CALENDAR GRID
                        ================================= */}

                        <div className="grid grid-cols-7 gap-1.5">
                            {calendarDays.map(
                                (
                                    day,
                                    index
                                ) => {
                                    if (
                                        !day
                                    ) {
                                        return (
                                            <div
                                                key={`empty-${index}`}
                                                className="aspect-square"
                                            />
                                        );
                                    }

                                    const intensity =
                                        getIntensity(
                                            day.seconds
                                        );

                                    const isToday =
                                        day.key ===
                                        todayKey;

                                    const isSelected =
                                        selectedDate &&
                                        getDateKey(
                                            selectedDate
                                        ) ===
                                            day.key;

                                    return (
                                        <motion.button
                                            key={
                                                day.key
                                            }
                                            type="button"
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
                                            whileHover={
                                                shouldReduceMotion
                                                    ? undefined
                                                    : {
                                                          y: -2,
                                                          scale: 1.03,
                                                      }
                                            }
                                            onClick={() =>
                                                handleSelectDay(
                                                    day
                                                )
                                            }
                                            className={`
                                                relative
                                                flex
                                                aspect-square
                                                min-w-0
                                                items-center
                                                justify-center
                                                rounded-[10px]
                                                border
                                                text-[10px]
                                                font-semibold
                                                transition-all
                                                duration-200
                                                ${intensity.background}
                                                ${intensity.border}
                                                ${intensity.text}
                                                ${intensity.glow}

                                                ${
                                                    isSelected
                                                        ? "ring-2 ring-indigo-400/80 ring-offset-2 ring-offset-[#080d15]"
                                                        : ""
                                                }

                                                ${
                                                    isToday
                                                        ? "before:absolute before:bottom-1.5 before:h-1 before:w-1 before:rounded-full before:bg-white"
                                                        : ""
                                                }

                                                hover:border-indigo-400/40
                                            `}
                                            title={`${formatLongDate(
                                                day.date
                                            )} • ${formatTime(
                                                day.seconds
                                            )} • ${
                                                day.sessions
                                            } ${
                                                day.sessions ===
                                                1
                                                    ? "session"
                                                    : "sessions"
                                            }`}
                                            aria-label={`${formatLongDate(
                                                day.date
                                            )}, ${formatTime(
                                                day.seconds
                                            )}, ${
                                                day.sessions
                                            } sessions`}
                                        >
                                            {day.date.getDate()}

                                            {/* Activity dot */}
                                            {day.seconds >
                                                0 && (
                                                <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-white/60" />
                                            )}
                                        </motion.button>
                                    );
                                }
                            )}
                        </div>

                        {/* =================================
                            SELECTED DAY DETAILS
                        ================================= */}

                        <motion.div
                            key={getDateKey(
                                selectedDate
                            )}
                            initial={
                                shouldReduceMotion
                                    ? false
                                    : {
                                          opacity: 0,
                                          y: 5,
                                      }
                            }
                            animate={
                                shouldReduceMotion
                                    ? undefined
                                    : {
                                          opacity: 1,
                                          y: 0,
                                      }
                            }
                            transition={{
                                duration: 0.2,
                            }}
                            className="mt-5 overflow-hidden rounded-[16px] border border-slate-800/80 bg-[#0b111c]"
                        >
                            <div className="border-b border-slate-800/70 px-4 py-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-[11px] font-semibold text-white">
                                            {formatLongDate(
                                                selectedDate
                                            )}
                                        </p>

                                        <p className="mt-0.5 text-[9px] text-slate-600">
                                            {selectedActivity.sessions ===
                                            0
                                                ? "No study activity"
                                                : `${
                                                      selectedActivity.sessions
                                                  } ${
                                                      selectedActivity.sessions ===
                                                      1
                                                          ? "study session"
                                                          : "study sessions"
                                                  }`}
                                        </p>
                                    </div>

                                    {getDateKey(
                                        selectedDate
                                    ) ===
                                        todayKey && (
                                        <span className="shrink-0 rounded-full border border-indigo-400/15 bg-indigo-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-indigo-300">
                                            Today
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-px bg-slate-800/60">
                                <div className="bg-[#0b111c] px-4 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <FaClock className="text-[10px] text-cyan-400" />

                                        <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                                            Study Time
                                        </span>
                                    </div>

                                    <p className="mt-2 text-base font-bold text-white">
                                        {formatTime(
                                            selectedActivity.seconds
                                        )}
                                    </p>
                                </div>

                                <div className="bg-[#0b111c] px-4 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <FaFire className="text-[10px] text-orange-400" />

                                        <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                                            Sessions
                                        </span>
                                    </div>

                                    <p className="mt-2 text-base font-bold text-white">
                                        {
                                            selectedActivity.sessions
                                        }
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* =================================
                            LEGEND
                        ================================= */}

                        <div className="mt-5 border-t border-slate-800/60 pt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-slate-600">
                                    Less
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-[4px] border border-slate-800 bg-slate-800/55" />

                                    <span className="h-2.5 w-2.5 rounded-[4px] border border-indigo-900/60 bg-indigo-950/80" />

                                    <span className="h-2.5 w-2.5 rounded-[4px] border border-indigo-700/60 bg-indigo-800/80" />

                                    <span className="h-2.5 w-2.5 rounded-[4px] border border-indigo-500/60 bg-indigo-600/80" />

                                    <span className="h-2.5 w-2.5 rounded-[4px] border border-indigo-400/70 bg-indigo-500" />
                                </div>

                                <span className="text-[9px] text-slate-600">
                                    More
                                </span>
                            </div>

                            <p className="mt-2 text-center text-[8px] text-slate-700">
                                Color intensity represents
                                daily study time
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default StudyStreakCalendar;