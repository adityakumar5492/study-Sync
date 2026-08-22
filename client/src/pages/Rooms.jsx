import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    useNavigate,
    useOutletContext,
} from "react-router-dom";

import toast from "react-hot-toast";

import { FaPlus, FaSearch, FaLayerGroup } from "react-icons/fa";

import { removeRoom } from "../redux/room/roomSlice";

import {
    useAppDispatch,
    useAppSelector,
} from "../redux/hooks";

import {
    getRoomsThunk,
} from "../redux/room/roomThunk";

import socket from "../socket/socket";

import RoomHeader from "../components/rooms/RoomHeader";
import SearchBar from "../components/rooms/SearchBar";
import RoomList from "../components/rooms/RoomList";
import CreateRoomModal from "../components/rooms/CreateRoomModal";

const Rooms = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { openSidebar } = useOutletContext();

    const shouldReduceMotion = useReducedMotion();

    const {
        rooms,
        loading,
        error,
    } = useAppSelector(
        (state) => state.room
    );

    const { user } = useAppSelector(
        (state) => state.auth
    );

    const [openModal, setOpenModal] =
        useState(false);

    const [searchTerm, setSearchTerm] =
        useState("");

    // =========================================
    // LOAD ROOMS
    // =========================================

    useEffect(() => {
        dispatch(getRoomsThunk());
    }, [dispatch]);

    // =========================================
    // SOCKET + REJOIN APPROVAL
    // =========================================

    useEffect(() => {
        if (!user?._id) return;

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("user:register", {
            userId: user._id,
        });

        // =====================================
        // ROOM DELETED
        // =====================================

        const handleRoomDeleted = ({
            roomId,
            message,
        }) => {
            if (!roomId) return;

            dispatch(removeRoom(roomId));

            toast.success(
                message ||
                    "A study room was deleted."
            );
        };

        // =====================================
        // REJOIN APPROVED
        // =====================================

        const handleRejoinApproved = ({
            roomId,
            message,
        }) => {
            toast.success(
                message ||
                    "Your request to rejoin was approved."
            );

            navigate(`/room/${roomId}`);
        };

        socket.on(
            "room:deleted",
            handleRoomDeleted
        );

        socket.on(
            "room:rejoin-approved",
            handleRejoinApproved
        );

        return () => {
            socket.off(
                "room:deleted",
                handleRoomDeleted
            );

            socket.off(
                "room:rejoin-approved",
                handleRejoinApproved
            );
        };
    }, [
        user?._id,
        navigate,
        dispatch,
    ]);

    // =========================================
    // ERROR
    // =========================================

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // =========================================
    // SEARCH
    // =========================================

    const filteredRooms = useMemo(() => {
        const query =
            searchTerm.trim().toLowerCase();

        if (!query) {
            return rooms;
        }

        return rooms.filter((room) => {
            const name =
                room.name?.toLowerCase() || "";

            const description =
                room.description?.toLowerCase() || "";

            return (
                name.includes(query) ||
                description.includes(query)
            );
        });
    }, [rooms, searchTerm]);

    // =========================================
    // MOTION
    // =========================================

    const pageVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 12,
        },

        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    const searchVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 10,
        },

        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.08,
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    const contentVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 12,
        },

        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.14,
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050811] text-white">

            {/* =========================================
                AMBIENT BACKGROUND
            ========================================= */}

            <div
                className="
                    pointer-events-none
                    fixed
                    left-[-180px]
                    top-[-160px]
                    h-[420px]
                    w-[420px]
                    rounded-full
                    bg-indigo-600/[0.07]
                    blur-[130px]
                "
            />

            <div
                className="
                    pointer-events-none
                    fixed
                    right-[-180px]
                    top-[20%]
                    h-[400px]
                    w-[400px]
                    rounded-full
                    bg-violet-600/[0.045]
                    blur-[130px]
                "
            />

            <div
                className="
                    pointer-events-none
                    fixed
                    bottom-[-200px]
                    left-[35%]
                    h-[400px]
                    w-[400px]
                    rounded-full
                    bg-cyan-600/[0.025]
                    blur-[130px]
                "
            />

            {/* Very subtle grid */}
            <div
                className="
                    pointer-events-none
                    fixed
                    inset-0
                    opacity-[0.018]
                    [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
                    [background-size:64px_64px]
                "
            />

            {/* =========================================
                MAIN
            ========================================= */}

            <main className="relative min-w-0">

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={pageVariants}
                    className="
                        mx-auto
                        w-full
                        max-w-[1600px]
                        px-3
                        py-4
                        sm:px-5
                        sm:py-6
                        md:px-6
                        lg:px-8
                        lg:py-8
                    "
                >

                    {/* =================================
                        HEADER
                    ================================= */}

                    <RoomHeader
                        onCreate={() =>
                            setOpenModal(true)
                        }
                        onMenuClick={openSidebar}
                    />

                    {/* =================================
                        SEARCH AREA
                    ================================= */}

                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={searchVariants}
                        className="relative mt-6 sm:mt-8"
                    >
                        <div
                            className="
                                relative
                                overflow-hidden
                                rounded-[24px]
                                border
                                border-white/[0.055]
                                bg-gradient-to-br
                                from-slate-900/80
                                via-slate-900/55
                                to-slate-950/75
                                p-3
                                shadow-[0_20px_70px_rgba(0,0,0,0.18)]
                                backdrop-blur-xl
                                sm:p-4
                            "
                        >
                            {/* Top highlight */}
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-x-10
                                    top-0
                                    h-px
                                    bg-gradient-to-r
                                    from-transparent
                                    via-indigo-400/30
                                    to-transparent
                                "
                            />

                            {/* Glow */}
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-16
                                    -top-20
                                    h-40
                                    w-40
                                    rounded-full
                                    bg-indigo-500/[0.06]
                                    blur-[70px]
                                "
                            />

                            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/[0.07] text-indigo-400 sm:flex">
                                    <FaSearch className="text-xs" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="mb-2 flex items-center gap-2 sm:hidden">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                                            <FaSearch className="text-[10px]" />
                                        </div>

                                        <span className="text-xs font-semibold text-slate-300">
                                            Find a study room
                                        </span>
                                    </div>

                                    <SearchBar
                                        value={searchTerm}
                                        onChange={
                                            setSearchTerm
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* =================================
                        ROOM TOOLBAR
                    ================================= */}

                    {!loading && (
                        <motion.div
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
                                delay: 0.18,
                                duration: 0.35,
                            }}
                            className="
                                relative
                                mb-4
                                mt-5
                                flex
                                min-h-10
                                flex-wrap
                                items-center
                                justify-between
                                gap-3
                                sm:mb-5
                                sm:mt-6
                            "
                        >
                            {/* Left */}
                            <div className="flex items-center gap-2">
                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-white/[0.055]
                                        bg-white/[0.025]
                                        text-slate-500
                                    "
                                >
                                    <FaLayerGroup className="text-[10px]" />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-300 sm:text-sm">
                                        {filteredRooms.length}{" "}
                                        {filteredRooms.length ===
                                        1
                                            ? "study room"
                                            : "study rooms"}
                                    </p>

                                    <p className="hidden text-[10px] text-slate-600 sm:block">
                                        Available in your
                                        workspace
                                    </p>
                                </div>
                            </div>

                            {/* Right */}
                            <div className="flex items-center gap-2">
                                {searchTerm && (
                                    <motion.button
                                        type="button"
                                        initial={{
                                            opacity: 0,
                                            scale: 0.9,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.9,
                                        }}
                                        onClick={() =>
                                            setSearchTerm("")
                                        }
                                        whileHover={
                                            shouldReduceMotion
                                                ? undefined
                                                : {
                                                      y: -1,
                                                  }
                                        }
                                        whileTap={
                                            shouldReduceMotion
                                                ? undefined
                                                : {
                                                      scale: 0.95,
                                                  }
                                        }
                                        className="
                                            flex
                                            h-9
                                            items-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-indigo-400/10
                                            bg-indigo-500/[0.06]
                                            px-3
                                            text-[11px]
                                            font-semibold
                                            text-indigo-400
                                            transition-colors
                                            duration-200
                                            hover:border-indigo-400/20
                                            hover:bg-indigo-500/10
                                            hover:text-indigo-300
                                        "
                                    >
                                        Clear
                                    </motion.button>
                                )}

                                <motion.button
                                    type="button"
                                    onClick={() =>
                                        setOpenModal(true)
                                    }
                                    whileHover={
                                        shouldReduceMotion
                                            ? undefined
                                            : {
                                                  y: -2,
                                              }
                                    }
                                    whileTap={
                                        shouldReduceMotion
                                            ? undefined
                                            : {
                                                  scale: 0.96,
                                              }
                                    }
                                    className="
                                        group
                                        flex
                                        h-9
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-indigo-400/20
                                        bg-indigo-500/[0.08]
                                        px-3
                                        text-[11px]
                                        font-bold
                                        text-indigo-300
                                        shadow-[0_8px_25px_rgba(99,102,241,0.08)]
                                        transition-all
                                        duration-200
                                        hover:border-indigo-400/35
                                        hover:bg-indigo-500/[0.14]
                                        hover:text-indigo-200
                                    "
                                >
                                    <FaPlus className="text-[9px] transition-transform duration-200 group-hover:rotate-90" />

                                    <span className="hidden sm:inline">
                                        Create Room
                                    </span>

                                    <span className="sm:hidden">
                                        Create
                                    </span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* =================================
                        ROOM CONTENT
                    ================================= */}

                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        className="relative"
                    >
                        <AnimatePresence mode="wait">
                            {loading ? (
                                /* =========================
                                   LOADING STATE
                                ========================= */

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
                                        rounded-[26px]
                                        border
                                        border-white/[0.055]
                                        bg-slate-900/55
                                        p-5
                                        shadow-[0_25px_80px_rgba(0,0,0,0.18)]
                                        sm:p-8
                                    "
                                >
                                    {/* Shimmer */}
                                    <motion.div
                                        animate={
                                            shouldReduceMotion
                                                ? undefined
                                                : {
                                                      x: [
                                                          "-100%",
                                                          "200%",
                                                      ],
                                                  }
                                        }
                                        transition={{
                                            duration: 1.8,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="
                                            pointer-events-none
                                            absolute
                                            inset-y-0
                                            left-0
                                            w-1/2
                                            bg-gradient-to-r
                                            from-transparent
                                            via-white/[0.025]
                                            to-transparent
                                            skew-x-[-20deg]
                                        "
                                    />

                                    <div className="relative mx-auto max-w-md text-center">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/10 bg-indigo-500/[0.07]">
                                            <motion.div
                                                animate={
                                                    shouldReduceMotion
                                                        ? undefined
                                                        : {
                                                              rotate: 360,
                                                          }
                                                }
                                                transition={{
                                                    duration: 1.2,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                className="
                                                    h-6
                                                    w-6
                                                    rounded-full
                                                    border-2
                                                    border-slate-700
                                                    border-t-indigo-400
                                                    border-r-indigo-400/30
                                                "
                                            />
                                        </div>

                                        <p className="mt-5 text-sm font-semibold text-slate-300">
                                            Loading your study
                                            rooms
                                        </p>

                                        <p className="mt-1.5 text-xs leading-5 text-slate-600">
                                            Preparing your
                                            collaborative
                                            workspace...
                                        </p>

                                        {/* Skeleton bars */}
                                        <div className="mt-7 space-y-2">
                                            <div className="h-2 overflow-hidden rounded-full bg-slate-800/70">
                                                <motion.div
                                                    animate={
                                                        shouldReduceMotion
                                                            ? undefined
                                                            : {
                                                                  x: [
                                                                      "-100%",
                                                                      "300%",
                                                                  ],
                                                              }
                                                    }
                                                    transition={{
                                                        duration: 1.7,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"
                                                />
                                            </div>

                                            <div className="mx-auto h-2 w-2/3 overflow-hidden rounded-full bg-slate-800/50" />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                /* =========================
                                   ROOMS
                                ========================= */

                                <motion.div
                                    key="rooms"
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
                                    exit={{
                                        opacity: 0,
                                    }}
                                    transition={{
                                        duration: 0.35,
                                    }}
                                >
                                    {filteredRooms.length >
                                    0 ? (
                                        <div className="relative">
                                            {/* Grid ambient line */}
                                            <div
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    inset-x-0
                                                    -top-2
                                                    h-px
                                                    bg-gradient-to-r
                                                    from-transparent
                                                    via-white/[0.04]
                                                    to-transparent
                                                "
                                            />

                                            <RoomList
                                                rooms={
                                                    filteredRooms
                                                }
                                            />
                                        </div>
                                    ) : (
                                        /* =====================
                                           SEARCH EMPTY STATE
                                        ===================== */

                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                scale: shouldReduceMotion
                                                    ? 1
                                                    : 0.98,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            transition={{
                                                duration: 0.35,
                                            }}
                                            className="
                                                relative
                                                overflow-hidden
                                                rounded-[28px]
                                                border
                                                border-white/[0.055]
                                                bg-gradient-to-br
                                                from-slate-900/80
                                                via-slate-900/55
                                                to-slate-950/80
                                                px-5
                                                py-14
                                                text-center
                                                shadow-[0_25px_80px_rgba(0,0,0,0.2)]
                                                sm:px-8
                                                sm:py-20
                                            "
                                        >
                                            {/* Background glows */}
                                            <div
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    left-1/2
                                                    top-1/2
                                                    h-40
                                                    w-40
                                                    -translate-x-1/2
                                                    -translate-y-1/2
                                                    rounded-full
                                                    bg-indigo-500/[0.07]
                                                    blur-[70px]
                                                "
                                            />

                                            <motion.div
                                                animate={
                                                    shouldReduceMotion
                                                        ? undefined
                                                        : {
                                                              y: [
                                                                  0,
                                                                  -5,
                                                                  0,
                                                              ],
                                                              rotate: [
                                                                  0,
                                                                  2,
                                                                  0,
                                                              ],
                                                          }
                                                }
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                                className="
                                                    relative
                                                    mx-auto
                                                    flex
                                                    h-16
                                                    w-16
                                                    items-center
                                                    justify-center
                                                    rounded-[20px]
                                                    border
                                                    border-indigo-400/10
                                                    bg-indigo-500/[0.07]
                                                    shadow-[0_15px_40px_rgba(99,102,241,0.08)]
                                                "
                                            >
                                                <FaSearch className="text-lg text-indigo-400" />

                                                <span className="absolute inset-0 rounded-[20px] border border-indigo-400/10" />
                                            </motion.div>

                                            <div className="relative mx-auto mt-6 max-w-md">
                                                <h3 className="text-base font-bold tracking-tight text-white sm:text-lg">
                                                    {searchTerm
                                                        ? "No rooms found"
                                                        : "No study rooms yet"}
                                                </h3>

                                                <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-600 sm:text-sm">
                                                    {searchTerm
                                                        ? `Nothing matched "${searchTerm}". Try another room name or description.`
                                                        : "Create your first study room and bring your study group together."}
                                                </p>

                                                <motion.button
                                                    type="button"
                                                    onClick={() => {
                                                        if (
                                                            searchTerm
                                                        ) {
                                                            setSearchTerm(
                                                                ""
                                                            );
                                                            return;
                                                        }

                                                        setOpenModal(
                                                            true
                                                        );
                                                    }}
                                                    whileHover={
                                                        shouldReduceMotion
                                                            ? undefined
                                                            : {
                                                                  y: -2,
                                                                  scale: 1.01,
                                                              }
                                                    }
                                                    whileTap={
                                                        shouldReduceMotion
                                                            ? undefined
                                                            : {
                                                                  scale: 0.97,
                                                              }
                                                    }
                                                    className="
                                                        group
                                                        relative
                                                        mt-6
                                                        inline-flex
                                                        h-11
                                                        items-center
                                                        gap-2.5
                                                        overflow-hidden
                                                        rounded-xl
                                                        border
                                                        border-indigo-400/20
                                                        bg-indigo-500
                                                        px-5
                                                        text-xs
                                                        font-bold
                                                        text-white
                                                        shadow-[0_12px_35px_rgba(99,102,241,0.2)]
                                                        transition-all
                                                        duration-300
                                                        hover:bg-indigo-400
                                                        hover:shadow-[0_16px_40px_rgba(99,102,241,0.28)]
                                                    "
                                                >
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
                                                            group-hover:translate-x-full
                                                        "
                                                    />

                                                    {searchTerm ? (
                                                        <>
                                                            <FaSearch className="relative text-[10px]" />
                                                            <span className="relative">
                                                                Clear
                                                                Search
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaPlus className="relative text-[10px]" />
                                                            <span className="relative">
                                                                Create
                                                                Study
                                                                Room
                                                            </span>
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.section>
                </motion.div>
            </main>

            {/* =========================================
                CREATE ROOM MODAL
            ========================================= */}

            <CreateRoomModal
                isOpen={openModal}
                onClose={() =>
                    setOpenModal(false)
                }
            />
        </div>
    );
};

export default Rooms;