import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaLayerGroup,
    FaPlus,
} from "react-icons/fa";
import {
    motion,
    AnimatePresence,
    useReducedMotion,
} from "framer-motion";

import {
    useAppDispatch,
    useAppSelector,
} from "../../redux/hooks";
import { getRoomsThunk } from "../../redux/room/roomThunk";

import RoomCard from "./RoomCard";

const RecentRooms = () => {
    const dispatch = useAppDispatch();
    const shouldReduceMotion = useReducedMotion();

    const { rooms = [], loading } =
        useAppSelector((state) => state.room);

    useEffect(() => {
        if (!rooms.length) {
            dispatch(getRoomsThunk());
        }
    }, [dispatch, rooms.length]);

    const recentRooms = rooms.slice(0, 4);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion
                    ? 0
                    : 0.06,
            },
        },
    };

    const itemVariants = {
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
        <section className="relative">
            {/* =========================================
                HEADER
            ========================================= */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <div className="mb-1.5 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />

                        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-indigo-400/75">
                            Workspace
                        </span>
                    </div>

                    <h2 className="text-lg font-semibold tracking-[-0.025em] text-white sm:text-xl">
                        Recent Study Rooms
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                        Continue where you left off.
                    </p>
                </div>

                <Link
                    to="/rooms"
                    className="
                        group/view
                        inline-flex
                        w-fit
                        shrink-0
                        items-center
                        gap-2
                        rounded-lg
                        px-2
                        py-1.5
                        text-xs
                        font-semibold
                        text-slate-500
                        transition-all
                        duration-200
                        hover:bg-slate-900
                        hover:text-indigo-300
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-400/60
                    "
                >
                    <span>View all</span>

                    <motion.span
                        whileHover={
                            shouldReduceMotion
                                ? undefined
                                : { x: 2 }
                        }
                    >
                        <FaArrowRight className="text-[9px]" />
                    </motion.span>
                </Link>
            </div>

            {/* =========================================
                CONTENT
            ========================================= */}

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="
                            relative
                            overflow-hidden
                            rounded-[22px]
                            border
                            border-slate-800/80
                            bg-[#0a0f17]
                            p-4
                            shadow-[0_12px_40px_rgba(0,0,0,0.12)]
                            sm:p-5
                        "
                    >
                        {/* Loading shine */}
                        <div className="
                            pointer-events-none
                            absolute
                            inset-0
                            -translate-x-full
                            animate-[shimmer_1.8s_infinite]
                            bg-gradient-to-r
                            from-transparent
                            via-white/[0.025]
                            to-transparent
                        " />

                        <div className="space-y-3">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="
                                        flex
                                        min-h-[150px]
                                        flex-col
                                        justify-between
                                        rounded-[19px]
                                        border
                                        border-slate-800/70
                                        bg-slate-950/35
                                        p-4
                                        sm:min-h-[165px]
                                        sm:p-5
                                    "
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-slate-800/80" />

                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="h-3.5 w-2/3 animate-pulse rounded-md bg-slate-800/80" />

                                            <div className="h-3 w-full animate-pulse rounded-md bg-slate-800/60" />

                                            <div className="h-3 w-4/5 animate-pulse rounded-md bg-slate-800/60" />
                                        </div>
                                    </div>

                                    <div className="mt-5 flex gap-2">
                                        <div className="h-6 w-20 animate-pulse rounded-lg bg-slate-800/60" />
                                        <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-800/60" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400/60" />
                            <p className="text-[10px] font-medium text-slate-600">
                                Loading your workspace
                            </p>
                        </div>
                    </motion.div>
                ) : recentRooms.length === 0 ? (
                    /* =================================
                        EMPTY STATE
                    ================================= */

                    <motion.div
                        key="empty"
                        initial={{
                            opacity: 0,
                            y: shouldReduceMotion
                                ? 0
                                : 8,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-[22px]
                            border
                            border-dashed
                            border-slate-800
                            bg-[#0a0f17]
                            px-5
                            py-10
                            text-center
                            shadow-[0_12px_40px_rgba(0,0,0,0.1)]
                            sm:px-6
                            sm:py-12
                        "
                    >
                        {/* Ambient glow */}
                        <div className="
                            pointer-events-none
                            absolute
                            left-1/2
                            top-1/2
                            h-48
                            w-48
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-indigo-500/[0.04]
                            blur-[70px]
                            transition-all
                            duration-700
                            group-hover:bg-indigo-500/[0.07]
                        " />

                        {/* Icon */}
                        <motion.div
                            animate={
                                shouldReduceMotion
                                    ? undefined
                                    : {
                                          y: [
                                              0,
                                              -3,
                                              0,
                                          ],
                                      }
                            }
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="
                                relative
                                mx-auto
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-indigo-500/10
                                bg-indigo-500/[0.07]
                                text-indigo-300
                                shadow-[0_10px_30px_rgba(99,102,241,0.08)]
                            "
                        >
                            <FaLayerGroup className="text-base" />
                        </motion.div>

                        <div className="relative">
                            <h3 className="mt-5 text-base font-semibold tracking-[-0.015em] text-white">
                                No study rooms yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                                Create your first study room
                                and start collaborating with
                                your study group.
                            </p>

                            <Link
                                to="/rooms"
                                className="
                                    group/create
                                    relative
                                    mt-5
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-indigo-400/20
                                    bg-indigo-500
                                    px-5
                                    py-2.5
                                    text-xs
                                    font-semibold
                                    text-white
                                    shadow-[0_10px_30px_rgba(99,102,241,0.18)]
                                    transition-all
                                    duration-300
                                    hover:border-indigo-300/30
                                    hover:bg-indigo-400
                                    hover:shadow-[0_14px_35px_rgba(99,102,241,0.28)]
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-400/70
                                    focus-visible:ring-offset-2
                                    focus-visible:ring-offset-[#0a0f17]
                                "
                            >
                                <span className="
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
                                    group-hover/create:translate-x-full
                                " />

                                <FaPlus className="relative text-[9px]" />

                                <span className="relative">
                                    Create a Room
                                </span>
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    /* =================================
                        ROOMS
                    ================================= */

                    <motion.div
                        key="rooms"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="
                            grid
                            grid-cols-1
                            gap-3
                            sm:gap-4
                            lg:grid-cols-2
                        "
                    >
                        {recentRooms.map((room) => (
                            <motion.div
                                key={room._id}
                                variants={itemVariants}
                            >
                                <RoomCard room={room} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default RecentRooms;