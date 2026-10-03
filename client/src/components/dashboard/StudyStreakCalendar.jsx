import { useEffect, useMemo, useState } from "react";
import {
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaClock,
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
        if (
            !date ||
            Number.isNaN(date.getTime())
        ) {
            return null;
        }

        return [
            date.getFullYear(),
            String(
                date.getMonth() + 1
            ).padStart(2, "0"),
            String(
                date.getDate()
            ).padStart(2, "0"),
        ].join("-");
    };

    const formatMinutes = (seconds) => {
        const totalMinutes = Math.floor(
            Number(seconds || 0) / 60
        );

        if (totalMinutes < 60) {
            return `${totalMinutes}m`;
        }

        const hours = Math.floor(
            totalMinutes / 60
        );

        const minutes =
            totalMinutes % 60;

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
            if (!session?.startedAt) {
                return;
            }

            const date = new Date(
                session.startedAt
            );

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return;
            }

            const key = makeDateKey(date);

            if (!key) {
                return;
            }

            const duration =
                Number(
                    session.durationSeconds
                ) || 0;

            map.set(
                key,
                (map.get(key) || 0) +
                    duration
            );
        });

        return map;
    }, [sessions]);

    // =========================================
    // CURRENT MONTH DAYS
    // =========================================

    const calendarDays = useMemo(() => {
        const year =
            currentMonth.getFullYear();

        const month =
            currentMonth.getMonth();

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
        let startDay =
            firstDay.getDay();

        startDay =
            startDay === 0
                ? 6
                : startDay - 1;

        const days = [];

        // Empty cells before first day
        for (
            let i = 0;
            i < startDay;
            i++
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

            const key =
                makeDateKey(date);

            days.push({
                date,
                key,
                seconds:
                    activityMap.get(
                        key
                    ) || 0,
            });
        }

        return days;
    }, [
        currentMonth,
        activityMap,
    ]);

    // =========================================
    // MONTH TOTALS
    // =========================================

    const monthStats = useMemo(() => {
        let activeDays = 0;
        let totalSeconds = 0;

        calendarDays.forEach(
            (day) => {
                if (!day) {
                    return;
                }

                if (day.seconds > 0) {
                    activeDays++;
                    totalSeconds +=
                        day.seconds;
                }
            }
        );

        return {
            activeDays,
            totalSeconds,
        };
    }, [calendarDays]);

    // =========================================
    // TODAY
    // =========================================

    const todayKey = useMemo(() => {
        return makeDateKey(
            new Date()
        );
    }, []);

    // =========================================
    // SELECTED DAY
    // =========================================

    const selectedDay = useMemo(() => {
        if (!selectedDate) {
            return null;
        }

        return (
            calendarDays.find(
                (day) =>
                    day &&
                    day.key ===
                        selectedDate
            ) || null
        );
    }, [
        calendarDays,
        selectedDate,
    ]);

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
        setCurrentMonth(
            (previous) => {
                const next =
                    new Date(
                        previous
                    );

                next.setDate(1);

                next.setMonth(
                    previous.getMonth() +
                        direction
                );

                return next;
            }
        );

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

    const getIntensity = (
        seconds
    ) => {
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
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (
            event
        ) => {
            if (
                event.key ===
                "Escape"
            ) {
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
    }, [
        isOpen,
        onClose,
    ]);

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
                duration:
                    shouldReduceMotion
                        ? 0
                        : 0.2,
                ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                ],
            }}
            className="
                relative
                box-border
                w-[min(340px,calc(100vw-24px))]
                max-w-[calc(100vw-24px)]
                overflow-hidden
                rounded-[20px]
                border
                border-slate-800/90
                bg-[#080d15]
                shadow-[0_24px_70px_rgba(0,0,0,0.55)]

                max-h-[calc(100dvh-88px)]
                overflow-y-auto

                sm:w-[340px]
                sm:max-h-[calc(100dvh-32px)]
            "
            onClick={(event) =>
                event.stopPropagation()
            }
        >
            {/* =====================================
                HEADER
            ===================================== */}

            <div className="border-b border-slate-800/70 px-3.5 py-3.5 sm:px-4 sm:py-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-[12px]
                                border
                                border-indigo-400/10
                                bg-indigo-500/[0.09]
                                text-indigo-300
                                sm:h-10
                                sm:w-10
                                sm:rounded-[13px]
                            "
                        >
                            <FaCalendarAlt className="text-xs sm:text-sm" />
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-xs font-bold text-white sm:text-sm">
                                Study Activity
                            </h3>

                            <p className="mt-0.5 truncate text-[9px] text-slate-500 sm:text-[10px]">
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
                        <FaTimes className="text-[9px]" />
                    </button>
                </div>

                {/* =================================
                    MONTH SUMMARY
                ================================= */}

                <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
                    <div
                        className="
                            min-w-0
                            rounded-[12px]
                            border
                            border-slate-800/80
                            bg-[#0b1220]
                            px-2.5
                            py-2
                            sm:rounded-[13px]
                            sm:px-3
                            sm:py-2.5
                        "
                    >
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />

                            <span className="truncate text-[7px] font-semibold uppercase tracking-[0.12em] text-slate-600 sm:text-[8px] sm:tracking-[0.14em]">
                                Active Days
                            </span>
                        </div>

                        <div className="mt-1 text-sm font-bold text-white sm:text-base">
                            {
                                monthStats.activeDays
                            }
                        </div>

                        <p className="text-[7px] text-slate-600 sm:text-[8px]">
                            this month
                        </p>
                    </div>

                    <div
                        className="
                            min-w-0
                            rounded-[12px]
                            border
                            border-slate-800/80
                            bg-[#0b1220]
                            px-2.5
                            py-2
                            sm:rounded-[13px]
                            sm:px-3
                            sm:py-2.5
                        "
                    >
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <FaClock className="shrink-0 text-[7px] text-cyan-400 sm:text-[8px]" />

                            <span className="truncate text-[7px] font-semibold uppercase tracking-[0.12em] text-slate-600 sm:text-[8px] sm:tracking-[0.14em]">
                                Study Time
                            </span>
                        </div>

                        <div className="mt-1 truncate text-sm font-bold text-white sm:text-base">
                            {formatMinutes(
                                monthStats.totalSeconds
                            )}
                        </div>

                        <p className="text-[7px] text-slate-600 sm:text-[8px]">
                            this month
                        </p>
                    </div>
                </div>
            </div>

            {/* =====================================
                CALENDAR CONTENT
            ===================================== */}

            <div className="p-3 sm:p-4">
                {/* MONTH NAVIGATION */}

                <div className="mb-3 flex items-center justify-between sm:mb-4">
                    <button
                        type="button"
                        onClick={() =>
                            changeMonth(-1)
                        }
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
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
                        <FaChevronLeft className="text-[8px]" />
                    </button>

                    <div className="min-w-0 px-2 text-center">
                        <h4 className="truncate text-sm font-bold text-white sm:text-base">
                            {monthName}
                        </h4>

                        <button
                            type="button"
                            onClick={goToToday}
                            className="
                                mt-0.5
                                text-[7px]
                                font-semibold
                                uppercase
                                tracking-[0.13em]
                                text-indigo-400
                                transition
                                hover:text-indigo-300
                                sm:text-[8px]
                                sm:tracking-[0.15em]
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
                            shrink-0
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
                        <FaChevronRight className="text-[8px]" />
                    </button>
                </div>

                {/* WEEK DAYS */}

                <div className="mb-1.5 grid grid-cols-7 gap-1 sm:mb-2">
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
                                key={day}
                                className="
                                    flex
                                    h-5
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    text-[6px]
                                    font-semibold
                                    tracking-wide
                                    text-slate-600
                                    sm:h-6
                                    sm:text-[7px]
                                "
                            >
                                {day}
                            </div>
                        )
                    )}
                </div>

                {/* CALENDAR GRID */}

                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map(
                        (
                            day,
                            index
                        ) => {
                            if (!day) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="aspect-square min-w-0"
                                    />
                                );
                            }

                            const isToday =
                                day.key ===
                                todayKey;

                            const isSelected =
                                day.key ===
                                selectedDate;

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
                                        rounded-[6px]
                                        border
                                        border-white/[0.025]
                                        text-[8px]
                                        font-medium
                                        transition-all
                                        duration-200
                                        sm:rounded-[8px]
                                        sm:text-[9px]

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
                                                bottom-0.5
                                                left-1/2
                                                h-0.5
                                                w-0.5
                                                -translate-x-1/2
                                                rounded-full
                                                bg-white/80
                                                sm:bottom-1
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
                            mt-2.5
                            rounded-[11px]
                            border
                            border-slate-800/80
                            bg-[#0b1220]
                            px-2.5
                            py-2
                            sm:mt-3
                            sm:rounded-[12px]
                            sm:px-3
                            sm:py-2.5
                        "
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-[9px] font-semibold text-white sm:text-[10px]">
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

                                <p className="mt-0.5 text-[7px] text-slate-600 sm:text-[8px]">
                                    Daily study time
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-1.5">
                                <FaClock className="text-[8px] text-cyan-400 sm:text-[9px]" />

                                <span className="text-[10px] font-bold text-white sm:text-xs">
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

                <div className="mt-3 flex items-center justify-between border-t border-slate-800/70 pt-2.5 sm:mt-4 sm:pt-3">
                    <span className="text-[7px] text-slate-600 sm:text-[8px]">
                        Less
                    </span>

                    <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-[3px] bg-slate-800/60 sm:h-2.5 sm:w-2.5" />

                        <span className="h-2 w-2 rounded-[3px] bg-indigo-950 sm:h-2.5 sm:w-2.5" />

                        <span className="h-2 w-2 rounded-[3px] bg-indigo-800/80 sm:h-2.5 sm:w-2.5" />

                        <span className="h-2 w-2 rounded-[3px] bg-indigo-600 sm:h-2.5 sm:w-2.5" />

                        <span className="h-2 w-2 rounded-[3px] bg-indigo-400 sm:h-2.5 sm:w-2.5" />
                    </div>

                    <span className="text-[7px] text-slate-600 sm:text-[8px]">
                        More
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default StudyStreakCalendar;