import { useMemo, useState } from "react";

import {
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
} from "react-icons/fa";

const StudyStreakCalendar = ({
    studyDates = [],
    onClose,
}) => {
    const [currentMonth, setCurrentMonth] =
        useState(() => {
            const now = new Date();

            return new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );
        });

    const studiedDates = useMemo(
        () => new Set(studyDates),
        [studyDates]
    );

    const monthName =
        currentMonth.toLocaleDateString(
            undefined,
            {
                month: "long",
                year: "numeric",
            }
        );

    const previousMonth = () => {
        setCurrentMonth(
            (current) =>
                new Date(
                    current.getFullYear(),
                    current.getMonth() - 1,
                    1
                )
        );
    };

    const nextMonth = () => {
        setCurrentMonth(
            (current) =>
                new Date(
                    current.getFullYear(),
                    current.getMonth() + 1,
                    1
                )
        );
    };

    const calendarDays = useMemo(() => {
        const year =
            currentMonth.getFullYear();

        const month =
            currentMonth.getMonth();

        const firstDay =
            new Date(
                year,
                month,
                1
            ).getDay();

        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();

        const previousMonthDays =
            new Date(
                year,
                month,
                0
            ).getDate();

        const days = [];

        // Sunday based calendar
        for (
            let i = firstDay - 1;
            i >= 0;
            i--
        ) {
            days.push({
                date: new Date(
                    year,
                    month - 1,
                    previousMonthDays - i
                ),
                currentMonth: false,
            });
        }

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {
            days.push({
                date: new Date(
                    year,
                    month,
                    day
                ),
                currentMonth: true,
            });
        }

        let nextDay = 1;

        while (days.length < 42) {
            days.push({
                date: new Date(
                    year,
                    month + 1,
                    nextDay++
                ),
                currentMonth: false,
            });
        }

        return days;
    }, [currentMonth]);

    const getDateKey = (date) => {
        const year =
            date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const todayKey = getDateKey(
        new Date()
    );

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#0a0f17] shadow-[0_25px_100px_rgba(0,0,0,0.65)]"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4">
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-indigo-400">
                            Study activity
                        </p>

                        <h2 className="mt-1 text-base font-semibold text-white">
                            Study Streak
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
                        aria-label="Close calendar"
                    >
                        <FaTimes className="text-xs" />
                    </button>
                </div>

                {/* Month navigation */}

                <div className="flex items-center justify-between px-5 py-4">
                    <button
                        type="button"
                        onClick={previousMonth}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                        aria-label="Previous month"
                    >
                        <FaChevronLeft className="text-[10px]" />
                    </button>

                    <h3 className="text-sm font-semibold text-white">
                        {monthName}
                    </h3>

                    <button
                        type="button"
                        onClick={nextMonth}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                        aria-label="Next month"
                    >
                        <FaChevronRight className="text-[10px]" />
                    </button>
                </div>

                {/* Calendar */}

                <div className="px-4 pb-5 sm:px-5">
                    <div className="grid grid-cols-7 gap-1.5">
                        {[
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                        ].map((day) => (
                            <div
                                key={day}
                                className="flex h-8 items-center justify-center text-[9px] font-semibold uppercase tracking-wider text-slate-600"
                            >
                                {day}
                            </div>
                        ))}

                        {calendarDays.map(
                            ({
                                date,
                                currentMonth:
                                    isCurrentMonth,
                            }) => {
                                const key =
                                    getDateKey(
                                        date
                                    );

                                const studied =
                                    studiedDates.has(
                                        key
                                    );

                                const isToday =
                                    key ===
                                    todayKey;

                                return (
                                    <div
                                        key={key}
                                        className={`
                                            relative
                                            flex
                                            aspect-square
                                            min-h-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            text-[11px]
                                            font-medium
                                            transition
                                            sm:min-h-9
                                            ${
                                                isCurrentMonth
                                                    ? "text-slate-300"
                                                    : "text-slate-700"
                                            }
                                            ${
                                                studied
                                                    ? "bg-green-500/20 text-green-300 ring-1 ring-inset ring-green-400/20"
                                                    : "bg-slate-900/40"
                                            }
                                            ${
                                                isToday
                                                    ? "ring-1 ring-indigo-400/60"
                                                    : ""
                                            }
                                        `}
                                    >
                                        {date.getDate()}

                                        {studied && (
                                            <span className="absolute bottom-1 h-1 w-1 rounded-full bg-green-400" />
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>

                    {/* Legend */}

                    <div className="mt-5 flex items-center justify-center gap-2 text-[9px] text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-green-400" />

                        Studied

                        <span className="ml-3 h-2 w-2 rounded-full border border-indigo-400/60" />

                        Today
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyStreakCalendar;