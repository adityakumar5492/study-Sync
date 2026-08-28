import { useEffect, useMemo, useState } from "react";
import {
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaClock,
    FaFire,
    FaTimes,
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

    const [selectedDate, setSelectedDate] =
        useState(null);

    // =========================================
    // DATE HELPERS
    // =========================================

    const makeDateKey = (date) => {
        if (!date || Number.isNaN(date.getTime())) {
            return null;
        }

        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");
    };

    const formatMinutes = (seconds) => {
        const totalMinutes = Math.floor(
            Number(seconds || 0) / 60
        );

        if (totalMinutes < 60) {
            return `${totalMinutes}m`;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (!minutes) {
            return `${hours}h`;
        }

        return `${hours}h ${minutes}m`;
    };

    // =========================================
    // ACTIVITY MAP
    // =========================================

    const activityMap = useMemo(() => {
        const map = new Map();

        sessions.forEach((session) => {
            if (!session?.startedAt) return;

            const date = new Date(session.startedAt);

            if (Number.isNaN(date.getTime())) return;

            const key = makeDateKey(date);

            if (!key) return;

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

        // Monday = 0
        let startDay = firstDay.getDay();

        startDay =
            startDay === 0
                ? 6
                : startDay - 1;

        const days = [];

        // Empty cells before first day
        for (let i = 0; i < startDay; i++) {
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

            const key = makeDateKey(date);

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
    // MONTH TOTALS
    // =========================================

    const monthStats = useMemo(() => {
        let activeDays = 0;
        let totalSeconds = 0;

        calendarDays.forEach((day) => {
            if (!day) return;

            if (day.seconds > 0) {
                activeDays++;
                totalSeconds += day.seconds;
            }
        });

        return {
            activeDays,
            totalSeconds,
        };
    }, [calendarDays]);

    // =========================================
    // TODAY
    // =========================================

    const todayKey = useMemo(() => {
        return makeDateKey(new Date());
    }, []);

    // =========================================
    // SELECTED DAY
    // =========================================

    const selectedDay = useMemo(() => {
        if (!selectedDate) return null;

        return (
            calendarDays.find(
                (day) =>
                    day &&
                    day.key === selectedDate
            ) || null
        );
    }, [calendarDays, selectedDate]);

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

        setSelectedDate(null);
    };

    const goToToday = () => {
        const today = new Date();

        setCurrentMonth(today);
        setSelectedDate(todayKey);
    };

    // =========================================
    // INTENSITY
    // =========================================

    const getIntensity = (seconds) => {
        if (!seconds) {
            return "bg-slate-800/60 text-slate-500";
        }

        if (seconds < 1800) {
            return "bg-indigo-950 text-indigo-300";
        }

        if (seconds < 3600) {
            return "bg-indigo-800/80 text-indigo-200";
        }

        if (seconds < 7200) {
            return "bg-indigo-600 text-white";
        }

        return "bg-indigo-400 text-white";
    };

    // =========================================
    // CLOSE WITH ESCAPE
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
    // RESET SELECTED DATE
    // =========================================

    useEffect(() => {
        if (!isOpen) {
            setSelectedDate(null);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <motion.div
            initial={
                shouldReduceMotion
                    ? false
                    : {
                          opacity: 0,
                          y: 8,
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
                          y: 8,
                          scale: 0.97,
                      }
            }
            transition={{
                duration: shouldReduceMotion
                    ? 0
                    : 0.2,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="
                absolute
                z-[100]

                /* DESKTOP */
                top-full
                right-0
                mt-3
                w-[340px]

                /* MOBILE */
                max-w-[calc(100vw-24px)]

                overflow-hidden
                rounded-[20px]
                border
                border-slate-800/90
                bg-[#080d15]
                shadow-[0_24px_70px_rgba(0,0,0,0.55)]

                /* Prevent horizontal overflow */
                box-sizing-border-box

                /* Don't become taller than viewport */
                max-h-[calc(100vh-24px)]
            "
            onClick={(event) =>
                event.stopPropagation()
            }
        >
            {/* =====================================
                HEADER
            ===================================== */}

            <div className="border-b border-slate-800/70 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-[13px]
                                border
                                border-indigo-400/10
                                bg-indigo-500/[0.09]
                                text-indigo-300
                            "
                        >
                            <FaCalendarAlt className="text-sm" />
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-white">
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
                            text-slate-500
                            transition
                            hover:bg-slate-800/70
                            hover:text-white
                        "
                        aria-label="Close study activity"
                    >
                        <FaTimes className="text-[10px]" />
                    </button>
                </div>

                {/* =================================
                    MONTH SUMMARY
                ================================= */}

                <div className="mt-4 grid grid-cols-2 gap-2">
                    <div
                        className="
                            rounded-[13px]
                            border
                            border-slate-800/80
                            bg-[#0b1220]
                            px-3
                            py-2.5
                        "
                    >
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

                            <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                                Active Days
                            </span>
                        </div>

                        <div className="mt-1 text-base font-bold text-white">
                            {monthStats.activeDays}
                        </div>

                        <p className="text-[8px] text-slate-600">
                            this month
                        </p>
                    </div>

                    <div
                        className="
                            rounded-[13px]
                            border
                            border-slate-800/80
                            bg-[#0b1220]
                            px-3
                            py-2.5
                        "
                    >
                        <div className="flex items-center gap-2">
                            <FaClock className="text-[8px] text-cyan-400" />

                            <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                                Study Time
                            </span>
                        </div>

                        <div className="mt-1 text-base font-bold text-white">
                            {formatMinutes(
                                monthStats.totalSeconds
                            )}
                        </div>

                        <p className="text-[8px] text-slate-600">
                            this month
                        </p>
                    </div>
                </div>
            </div>

            {/* =====================================
                CALENDAR CONTENT
            ===================================== */}

            <div className="p-4">
                {/* MONTH NAVIGATION */}

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
                            rounded-[10px]
                            border
                            border-slate-800
                            bg-slate-900/40
                            text-slate-500
                            transition
                            hover:border-slate-700
                            hover:bg-slate-800/70
                            hover:text-white
                        "
                        aria-label="Previous month"
                    >
                        <FaChevronLeft className="text-[9px]" />
                    </button>

                    <div className="text-center">
                        <h4 className="text-base font-bold text-white">
                            {monthName}
                        </h4>

                        <button
                            type="button"
                            onClick={goToToday}
                            className="
                                mt-0.5
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-indigo-400
                                transition
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
                            border-slate-800
                            bg-slate-900/40
                            text-slate-500
                            transition
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

                <div className="mb-2 grid grid-cols-7 gap-1">
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
                                h-6
                                items-center
                                justify-center
                                text-[7px]
                                font-semibold
                                tracking-wide
                                text-slate-600
                            "
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* CALENDAR GRID */}

                <div className="grid grid-cols-7 gap-1">
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
                                day.key === todayKey;

                            const isSelected =
                                day.key ===
                                selectedDate;

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
                                        duration: 0.12,
                                        delay:
                                            shouldReduceMotion
                                                ? 0
                                                : index *
                                                  0.008,
                                    }}
                                    onClick={() =>
                                        setSelectedDate(
                                            day.key
                                        )
                                    }
                                    className={`
                                        relative
                                        aspect-square
                                        min-w-0
                                        rounded-[8px]
                                        border
                                        border-white/[0.025]
                                        text-[9px]
                                        font-medium
                                        transition-all
                                        duration-200

                                        hover:scale-[1.04]
                                        hover:border-indigo-400/30

                                        ${getIntensity(
                                            day.seconds
                                        )}

                                        ${
                                            isToday
                                                ? "ring-1 ring-indigo-400"
                                                : ""
                                        }

                                        ${
                                            isSelected
                                                ? "ring-2 ring-violet-400 ring-offset-1 ring-offset-[#080d15]"
                                                : ""
                                        }
                                    `}
                                    aria-label={`${day.date.toLocaleDateString(
                                        undefined,
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}, ${formatMinutes(
                                        day.seconds
                                    )}`}
                                >
                                    {day.date.getDate()}

                                    {day.seconds >
                                        0 && (
                                        <span
                                            className="
                                                absolute
                                                bottom-1
                                                left-1/2
                                                h-0.5
                                                w-0.5
                                                -translate-x-1/2
                                                rounded-full
                                                bg-white/80
                                            "
                                        />
                                    )}
                                </motion.button>
                            );
                        }
                    )}
                </div>

                {/* =================================
                    SELECTED DAY DETAILS
                ================================= */}

                {selectedDay && (
                    <motion.div
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
                        className="
                            mt-3
                            rounded-[12px]
                            border
                            border-slate-800/80
                            bg-[#0b1220]
                            px-3
                            py-2.5
                        "
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-semibold text-white">
                                    {selectedDay.date.toLocaleDateString(
                                        undefined,
                                        {
                                            weekday:
                                                "short",
                                            month:
                                                "short",
                                            day: "numeric",
                                        }
                                    )}
                                </p>

                                <p className="mt-0.5 text-[8px] text-slate-600">
                                    Daily study time
                                </p>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <FaClock className="text-[9px] text-cyan-400" />

                                <span className="text-xs font-bold text-white">
                                    {formatMinutes(
                                        selectedDay.seconds
                                    )}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* =================================
                    LEGEND
                ================================= */}

                <div className="mt-4 flex items-center justify-between border-t border-slate-800/70 pt-3">
                    <span className="text-[8px] text-slate-600">
                        Less
                    </span>

                    <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-[3px] bg-slate-800/60" />

                        <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-950" />

                        <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-800/80" />

                        <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-600" />

                        <span className="h-2.5 w-2.5 rounded-[3px] bg-indigo-400" />
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