import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FaUsers,
    FaDoorOpen,
    FaFire,
    FaCheckCircle,
} from "react-icons/fa";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import { useAppSelector } from "../../redux/hooks";

import socket from "../../socket/socket";

import StudyStreakCalendar from "./StudyStreakCalendar";

const ProfileStats = () => {
    const shouldReduceMotion =
        useReducedMotion();

    const { user } = useAppSelector(
        (state) => state.auth
    );

    const { rooms = [] } =
        useAppSelector(
            (state) => state.room
        );

    const [
        studyStats,
        setStudyStats,
    ] = useState({
        totalSeconds: 0,
        sessions: [],
    });

    const [
        calendarOpen,
        setCalendarOpen,
    ] = useState(false);

    const currentUserId =
        user?._id?.toString();

    // ===========================
    // Request Study Statistics
    // ===========================

    useEffect(() => {
        if (!currentUserId) {
            return;
        }

        const handleStudyStats = (
            data
        ) => {
            if (
                data?.userId?.toString() !==
                currentUserId
            ) {
                return;
            }

            setStudyStats({
                totalSeconds:
                    data.totalSeconds ||
                    0,
                sessions:
                    data.sessions || [],
            });
        };

        const handleStatsUpdated = (
            data
        ) => {
            if (
                data?.userId?.toString() !==
                currentUserId
            ) {
                return;
            }

            socket.emit(
                "study:stats-request"
            );
        };

        socket.on(
            "study:stats",
            handleStudyStats
        );

        socket.on(
            "profile:study-stats-updated",
            handleStatsUpdated
        );

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("user:register", {
            userId: currentUserId,
        });

        socket.emit(
            "study:stats-request"
        );

        return () => {
            socket.off(
                "study:stats",
                handleStudyStats
            );

            socket.off(
                "profile:study-stats-updated",
                handleStatsUpdated
            );
        };
    }, [currentUserId]);

    // ===========================
    // Local Date Helper
    // ===========================

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

    // ===========================
    // Study Dates
    // ===========================

    const studyDates = useMemo(() => {
        const dates = new Set();

        studyStats.sessions.forEach(
            (session) => {
                if (
                    !session?.startedAt ||
                    !session?.endedAt
                ) {
                    return;
                }

                const start =
                    new Date(
                        session.startedAt
                    );

                const end =
                    new Date(
                        session.endedAt
                    );

                if (
                    Number.isNaN(
                        start.getTime()
                    ) ||
                    Number.isNaN(
                        end.getTime()
                    )
                ) {
                    return;
                }

                /*
                 * Mark every calendar date touched
                 * by an actual study session.
                 *
                 * Normally this is just one date.
                 */
                const current =
                    new Date(start);

                current.setHours(
                    0,
                    0,
                    0,
                    0
                );

                const last =
                    new Date(end);

                last.setHours(
                    0,
                    0,
                    0,
                    0
                );

                while (
                    current <= last
                ) {
                    dates.add(
                        getDateKey(
                            current
                        )
                    );

                    current.setDate(
                        current.getDate() +
                            1
                    );
                }
            }
        );

        return Array.from(dates);
    }, [studyStats.sessions]);

    // ===========================
    // Current Streak
    // ===========================

    const currentStreak = useMemo(() => {
        const dates = new Set(
            studyDates
        );

        if (dates.size === 0) {
            return 0;
        }

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        const todayKey =
            getDateKey(today);

        let currentDate =
            new Date(today);

        /*
         * If today has not been completed,
         * continue counting from yesterday.
         */
        if (!dates.has(todayKey)) {
            currentDate.setDate(
                currentDate.getDate() -
                    1
            );
        }

        let streak = 0;

        while (
            dates.has(
                getDateKey(
                    currentDate
                )
            )
        ) {
            streak++;

            currentDate.setDate(
                currentDate.getDate() -
                    1
            );
        }

        return streak;
    }, [studyDates]);

    // ===========================
    // Study Hours
    // ===========================

    const studyHours = useMemo(() => {
        const hours =
            studyStats.totalSeconds /
            3600;

        if (hours <= 0) {
            return "0h";
        }

        if (hours < 10) {
            return `${hours.toFixed(1)}h`;
        }

        return `${Math.round(hours)}h`;
    }, [studyStats.totalSeconds]);

    // ===========================
    // Rooms
    // ===========================

    const roomsJoined =
        rooms.filter((room) =>
            room.members?.some(
                (member) => {
                    const memberId =
                        typeof member ===
                        "object"
                            ? member?._id?.toString()
                            : member?.toString();

                    return (
                        memberId ===
                        currentUserId
                    );
                }
            )
        ).length;

    const roomsCreated =
        rooms.filter((room) => {
            const hostId =
                typeof room.host ===
                "object"
                    ? room.host?._id?.toString()
                    : room.host?.toString();

            return (
                hostId ===
                currentUserId
            );
        }).length;

    const profileComplete =
        Boolean(
            user?.name &&
                user?.email &&
                user?.bio &&
                user?.avatar
        );

    // ===========================
    // Stats
    // ===========================

    const stats = [
        {
            id: "joined",
            title: "Rooms Joined",
            value: roomsJoined,
            icon: FaUsers,
            accent: "indigo",
        },
        {
            id: "hours",
            title: "Study Hours",
            value: studyHours,
            icon: FaDoorOpen,
            accent: "cyan",
        },
        {
            id: "streak",
            title: "Current Streak",
            value: `${currentStreak} ${
                currentStreak === 1
                    ? "day"
                    : "days"
            }`,
            icon: FaFire,
            accent: "amber",
            clickable: true,
        },
        {
            id: "profile",
            title: "Profile",
            value: profileComplete
                ? "Complete"
                : "Incomplete",
            icon: FaCheckCircle,
            accent: profileComplete
                ? "emerald"
                : "amber",
        },
    ];

    // ===========================
    // Accent Styles
    // ===========================

    const accentStyles = {
        indigo: {
            icon: "bg-indigo-500/10 text-indigo-300",
            glow: "bg-indigo-500",
            dot: "bg-indigo-400",
            border:
                "group-hover/item:border-indigo-500/20",
        },

        cyan: {
            icon: "bg-cyan-500/10 text-cyan-300",
            glow: "bg-cyan-500",
            dot: "bg-cyan-400",
            border:
                "group-hover/item:border-cyan-500/20",
        },

        violet: {
            icon: "bg-violet-500/10 text-violet-300",
            glow: "bg-violet-500",
            dot: "bg-violet-400",
            border:
                "group-hover/item:border-violet-500/20",
        },

        emerald: {
            icon: "bg-emerald-500/10 text-emerald-300",
            glow: "bg-emerald-500",
            dot: "bg-emerald-400",
            border:
                "group-hover/item:border-emerald-500/20",
        },

        amber: {
            icon: "bg-amber-500/10 text-amber-300",
            glow: "bg-amber-500",
            dot: "bg-amber-400",
            border:
                "group-hover/item:border-amber-500/20",
        },
    };

    // ===========================
    // Animations
    // ===========================

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren:
                    shouldReduceMotion
                        ? 0
                        : 0.06,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion
                ? 0
                : 10,
        },

        visible: {
            opacity: 1,
            y: 0,

            transition: {
                duration: 0.38,
                ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                ],
            },
        },
    };

    return (
        <>
            <section
                className="
                    group
                    relative
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-slate-800/80
                    bg-[#0a0f17]
                    p-3
                    shadow-[0_18px_55px_rgba(0,0,0,0.16)]
                    transition-all
                    duration-500
                    hover:border-slate-700/80
                    sm:p-4
                "
            >
                {/* Ambient Background */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-52
                        w-52
                        rounded-full
                        bg-indigo-500/[0.045]
                        blur-[75px]
                        transition-all
                        duration-700
                        group-hover:bg-indigo-500/[0.07]
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        left-[35%]
                        h-40
                        w-40
                        rounded-full
                        bg-violet-500/[0.025]
                        blur-[70px]
                    "
                />

                {/* Top highlight */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-10
                        right-10
                        top-0
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-indigo-400/25
                        to-transparent
                    "
                />

                {/* Stat Grid */}

                <motion.div
                    variants={
                        containerVariants
                    }
                    initial="hidden"
                    animate="visible"
                    className="
                        relative
                        grid
                        grid-cols-1
                        gap-2
                        sm:grid-cols-2
                        sm:gap-3
                        lg:grid-cols-4
                    "
                >
                    {stats.map(
                        (
                            item
                        ) => {
                            const Icon =
                                item.icon;

                            const colors =
                                accentStyles[
                                    item.accent
                                ];

                            const content = (
                                <>
                                    {/* Ambient item glow */}

                                    <div
                                        className={`
                                            pointer-events-none
                                            absolute
                                            -right-10
                                            -top-10
                                            h-24
                                            w-24
                                            rounded-full
                                            opacity-0
                                            blur-[40px]
                                            transition-all
                                            duration-500
                                            group-hover/item:scale-110
                                            group-hover/item:opacity-[0.08]
                                            ${colors.glow}
                                        `}
                                    />

                                    {/* Icon */}

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
                                        className={`
                                            relative
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-[13px]
                                            border
                                            border-white/[0.035]
                                            shadow-[0_8px_22px_rgba(0,0,0,0.16)]
                                            ${colors.icon}
                                            sm:h-11
                                            sm:w-11
                                        `}
                                    >
                                        <Icon className="text-[13px] sm:text-sm" />
                                    </motion.div>

                                    {/* Content */}

                                    <div className="relative min-w-0 flex-1">
                                        <p
                                            className="
                                                truncate
                                                text-[9px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.1em]
                                                text-slate-600
                                                sm:text-[10px]
                                            "
                                        >
                                            {
                                                item.title
                                            }
                                        </p>

                                        <motion.p
                                            key={String(
                                                item.value
                                            )}
                                            initial={
                                                shouldReduceMotion
                                                    ? false
                                                    : {
                                                          opacity: 0,
                                                          y: 4,
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
                                                duration: 0.3,
                                            }}
                                            className="
                                                mt-1
                                                truncate
                                                text-[15px]
                                                font-semibold
                                                tracking-[-0.015em]
                                                text-slate-100
                                                sm:text-base
                                            "
                                        >
                                            {
                                                item.value
                                            }
                                        </motion.p>
                                    </div>

                                    {/* Status dot */}

                                    <span
                                        className={`
                                            relative
                                            h-1.5
                                            w-1.5
                                            shrink-0
                                            rounded-full
                                            opacity-40
                                            transition-all
                                            duration-300
                                            group-hover/item:opacity-90
                                            ${colors.dot}
                                        `}
                                    />

                                    {/* Inner border */}

                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            inset-0
                                            rounded-[17px]
                                            ring-1
                                            ring-inset
                                            ring-white/[0.02]
                                            transition-all
                                            duration-300
                                            group-hover/item:ring-white/[0.055]
                                        "
                                    />
                                </>
                            );

                            return (
                                <motion.div
                                    key={
                                        item.id
                                    }
                                    variants={
                                        itemVariants
                                    }
                                    whileHover={
                                        shouldReduceMotion
                                            ? undefined
                                            : {
                                                  y: -3,
                                              }
                                    }
                                    onClick={
                                        item.clickable
                                            ? () =>
                                                  setCalendarOpen(
                                                      true
                                                  )
                                            : undefined
                                    }
                                    role={
                                        item.clickable
                                            ? "button"
                                            : undefined
                                    }
                                    tabIndex={
                                        item.clickable
                                            ? 0
                                            : undefined
                                    }
                                    onKeyDown={(
                                        event
                                    ) => {
                                        if (
                                            item.clickable &&
                                            (event.key ===
                                                "Enter" ||
                                                event.key ===
                                                    " ")
                                        ) {
                                            setCalendarOpen(
                                                true
                                            );
                                        }
                                    }}
                                    className={`
                                        group/item
                                        relative
                                        flex
                                        min-w-0
                                        items-center
                                        gap-3
                                        overflow-hidden
                                        rounded-[17px]
                                        border
                                        border-slate-800/70
                                        bg-slate-950/40
                                        p-3
                                        shadow-[0_8px_25px_rgba(0,0,0,0.1)]
                                        transition-all
                                        duration-400
                                        hover:bg-slate-950/70
                                        hover:shadow-[0_12px_30px_rgba(0,0,0,0.16)]
                                        sm:gap-3.5
                                        sm:rounded-[18px]
                                        sm:p-3.5
                                        ${colors.border}
                                        ${
                                            item.clickable
                                                ? "cursor-pointer"
                                                : ""
                                        }
                                    `}
                                >
                                    {content}
                                </motion.div>
                            );
                        }
                    )}
                </motion.div>
            </section>

            {/* Study Calendar */}

            {calendarOpen && (
                <StudyStreakCalendar
                    studyDates={
                        studyDates
                    }
                    onClose={() =>
                        setCalendarOpen(
                            false
                        )
                    }
                />
            )}
        </>
    );
};

export default ProfileStats;