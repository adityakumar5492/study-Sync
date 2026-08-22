import {
    FaUsers,
    FaArrowRight,
    FaLock,
    FaGlobe,
    FaCircle,
} from "react-icons/fa";
import {
    motion,
    useReducedMotion,
} from "framer-motion";
import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
    const shouldReduceMotion = useReducedMotion();

    const isActive = Boolean(room.isActive);
    const isPrivate = Boolean(room.isPrivate);
    const memberCount = room.members?.length || 0;

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 10,
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
        <motion.article
            variants={cardVariants}
            whileHover={
                shouldReduceMotion
                    ? undefined
                    : {
                          y: -4,
                      }
            }
            transition={{
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="
                group
                relative
                overflow-hidden
                rounded-[22px]
                border
                border-slate-800/80
                bg-[#0a0f17]
                p-4
                shadow-[0_12px_40px_rgba(0,0,0,0.12)]
                transition-[border-color,background-color,box-shadow]
                duration-300
                hover:border-slate-700
                hover:bg-[#0c121c]
                hover:shadow-[0_18px_50px_rgba(0,0,0,0.2)]
                sm:p-5
            "
        >
            {/* =========================================
                AMBIENT LIGHT
            ========================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-40
                    w-40
                    rounded-full
                    bg-indigo-500/[0.045]
                    blur-[65px]
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-20
                    left-1/3
                    h-32
                    w-32
                    rounded-full
                    bg-cyan-500/[0.02]
                    blur-[55px]
                "
            />

            {/* Top edge highlight */}
            <div
                className="
                    pointer-events-none
                    absolute
                    left-8
                    right-8
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-indigo-400/20
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                "
            />

            {/* =========================================
                CONTENT
            ========================================= */}

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                {/* Room information */}
                <div className="min-w-0 flex-1">
                    {/* Title row */}
                    <div className="flex min-w-0 items-center gap-2.5">
                        {/* Room indicator */}
                        <span
                            className={`
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-[10px]
                                border
                                ${
                                    isPrivate
                                        ? "border-amber-500/10 bg-amber-500/[0.07] text-amber-300"
                                        : "border-indigo-500/10 bg-indigo-500/[0.07] text-indigo-300"
                                }
                            `}
                        >
                            {isPrivate ? (
                                <FaLock className="text-[10px]" />
                            ) : (
                                <FaGlobe className="text-[11px]" />
                            )}
                        </span>

                        <h3
                            className="
                                min-w-0
                                truncate
                                text-[15px]
                                font-semibold
                                tracking-[-0.015em]
                                text-slate-100
                                transition-colors
                                duration-300
                                group-hover:text-white
                                sm:text-base
                            "
                        >
                            {room.name}
                        </h3>
                    </div>

                    {/* Description */}
                    <p
                        className="
                            mt-3
                            line-clamp-2
                            max-w-2xl
                            text-xs
                            leading-5
                            text-slate-500
                            sm:text-sm
                            sm:leading-6
                        "
                    >
                        {room.description ||
                            "No description provided."}
                    </p>

                    {/* =================================
                        METADATA
                    ================================= */}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        {/* Members */}
                        <div
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-lg
                                border
                                border-slate-800/70
                                bg-slate-950/40
                                px-2.5
                                py-1.5
                            "
                        >
                            <FaUsers className="text-[9px] text-slate-600" />

                            <span className="text-[10px] font-medium text-slate-500 sm:text-[11px]">
                                {memberCount}{" "}
                                {memberCount === 1
                                    ? "member"
                                    : "members"}
                            </span>
                        </div>

                        {/* Status */}
                        <div
                            className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-lg
                                border
                                px-2.5
                                py-1.5
                                ${
                                    isActive
                                        ? "border-emerald-500/10 bg-emerald-500/[0.045]"
                                        : "border-slate-800/70 bg-slate-950/40"
                                }
                            `}
                        >
                            <span className="relative flex h-1.5 w-1.5">
                                {isActive && (
                                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
                                )}

                                <span
                                    className={`
                                        relative
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        ${
                                            isActive
                                                ? "bg-emerald-400"
                                                : "bg-slate-600"
                                        }
                                    `}
                                />
                            </span>

                            <span
                                className={`
                                    text-[10px]
                                    font-medium
                                    sm:text-[11px]
                                    ${
                                        isActive
                                            ? "text-emerald-400"
                                            : "text-slate-500"
                                    }
                                `}
                            >
                                {isActive
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>

                        {/* Visibility */}
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-medium
                                text-slate-600
                                sm:text-[11px]
                            "
                        >
                            {isPrivate ? (
                                <>
                                    <FaLock className="text-[8px]" />
                                    Private
                                </>
                            ) : (
                                <>
                                    <FaGlobe className="text-[9px]" />
                                    Public
                                </>
                            )}
                        </span>
                    </div>

                    {/* Host */}
                    <div className="mt-3 flex min-w-0 items-center gap-1.5">
                        <span className="text-[10px] text-slate-700">
                            Hosted by
                        </span>

                        <span className="max-w-[180px] truncate text-[10px] font-medium text-slate-500 sm:text-[11px]">
                            {room.host?.name ||
                                "Unknown"}
                        </span>
                    </div>
                </div>

                {/* =========================================
                    OPEN ROOM
                ========================================= */}

                <Link
                    to={`/room/${room._id}`}
                    aria-label={`Open ${room.name}`}
                    className="
                        group/open
                        relative
                        flex
                        h-11
                        w-full
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-xl
                        border
                        border-slate-700/80
                        bg-slate-900/80
                        text-slate-400
                        shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                        transition-all
                        duration-300
                        hover:border-indigo-400/30
                        hover:bg-indigo-500
                        hover:text-white
                        hover:shadow-[0_10px_25px_rgba(99,102,241,0.2)]
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-400/70
                        focus-visible:ring-offset-2
                        focus-visible:ring-offset-[#0a0f17]
                        active:scale-[0.98]
                        sm:h-11
                        sm:w-11
                    "
                >
                    {/* Button shine */}
                    <span
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            -translate-x-full
                            bg-gradient-to-r
                            from-transparent
                            via-white/10
                            to-transparent
                            transition-transform
                            duration-700
                            group-hover/open:translate-x-full
                        "
                    />

                    <motion.span
                        whileHover={
                            shouldReduceMotion
                                ? undefined
                                : {
                                      x: 2,
                                  }
                        }
                        transition={{
                            duration: 0.2,
                        }}
                        className="relative"
                    >
                        <FaArrowRight className="text-xs" />
                    </motion.span>
                </Link>
            </div>

            {/* =========================================
                ACTIVE ROOM ACCENT
            ========================================= */}

            {isActive && (
                <div
                    className="
                        pointer-events-none
                        absolute
                        bottom-0
                        left-5
                        h-px
                        w-16
                        bg-gradient-to-r
                        from-emerald-400/50
                        to-transparent
                        opacity-60
                    "
                />
            )}

            {/* Inner border */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[22px]
                    ring-1
                    ring-inset
                    ring-white/[0.02]
                "
            />
        </motion.article>
    );
};

export default RoomCard;