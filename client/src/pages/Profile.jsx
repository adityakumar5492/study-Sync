import {
    useState,
    useEffect,
} from "react";
import {
    useOutletContext,
} from "react-router-dom";
import {
    FaBars,
    FaUserCircle,
    FaBolt,
} from "react-icons/fa";
import {
    motion,
    AnimatePresence,
    useReducedMotion,
} from "framer-motion";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileStats from "../components/profile/ProfileStats";
import ActivityTimeline from "../components/profile/ActivityTimeline";
import EditProfileModal from "../components/profile/EditProfileModal";

import { useAppDispatch } from "../redux/hooks";
import { getRoomsThunk } from "../redux/room/roomThunk";
import socket from "../socket/socket";

const Profile = () => {
    const [editModalOpen, setEditModalOpen] =
        useState(false);

    const dispatch = useAppDispatch();
    const shouldReduceMotion = useReducedMotion();

    const { openSidebar } = useOutletContext();

    useEffect(() => {
        dispatch(getRoomsThunk());

        const handleActivityUpdate = () => {
            dispatch(getRoomsThunk());
        };

        socket.on(
            "profile:activity-updated",
            handleActivityUpdate
        );

        return () => {
            socket.off(
                "profile:activity-updated",
                handleActivityUpdate
            );
        };
    }, [dispatch]);

    const pageVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: shouldReduceMotion
                    ? 0
                    : 0.07,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 16,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            {/* =========================================
                AMBIENT BACKGROUND
            ========================================= */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div
                    className="
                        absolute
                        -left-40
                        -top-40
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-indigo-600/[0.035]
                        blur-[120px]
                    "
                />

                <div
                    className="
                        absolute
                        -right-40
                        top-[20%]
                        h-[360px]
                        w-[360px]
                        rounded-full
                        bg-violet-600/[0.025]
                        blur-[120px]
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-[180px]
                        left-[35%]
                        h-[360px]
                        w-[360px]
                        rounded-full
                        bg-cyan-600/[0.02]
                        blur-[120px]
                    "
                />

                <div
                    className="
                        absolute
                        inset-0
                        opacity-[0.018]
                    "
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                        backgroundSize:
                            "48px 48px",
                    }}
                />
            </div>

            <main className="relative min-w-0 overflow-y-auto">
                <motion.div
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
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
                    {/* =====================================
                        PAGE HEADER
                    ===================================== */}

                    <motion.div
                        variants={itemVariants}
                        className="relative mb-6 sm:mb-8"
                    >
                        {/* Mobile Menu */}
                        <motion.button
                            type="button"
                            onClick={openSidebar}
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
                                          scale: 0.94,
                                      }
                            }
                            className="
                                mb-5
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-slate-800/80
                                bg-slate-900/80
                                text-slate-400
                                shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                                backdrop-blur-md
                                transition-all
                                duration-200
                                hover:border-indigo-500/25
                                hover:bg-slate-800
                                hover:text-white
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-indigo-500/70
                                focus-visible:ring-offset-2
                                focus-visible:ring-offset-slate-950
                                lg:hidden
                            "
                            aria-label="Open navigation menu"
                        >
                            <FaBars className="text-sm" />
                        </motion.button>

                        {/* Header Label */}
                        <div className="mb-2.5 flex items-center gap-2">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/40" />

                                <span className="relative h-1.5 w-1.5 rounded-full bg-indigo-400" />
                            </span>

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]
                                    text-indigo-400/90
                                    sm:text-xs
                                "
                            >
                                Account
                            </p>
                        </div>

                        {/* Title */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h1
                                    className="
                                        text-[28px]
                                        font-bold
                                        tracking-[-0.04em]
                                        text-white
                                        sm:text-4xl
                                        lg:text-[42px]
                                    "
                                >
                                    My Profile
                                </h1>

                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-xs
                                        leading-5
                                        text-slate-500
                                        sm:text-sm
                                        sm:leading-6
                                    "
                                >
                                    Manage your account and keep
                                    track of your collaborative
                                    learning activity.
                                </p>
                            </div>

                            {/* Status Pill */}
                            <div
                                className="
                                    hidden
                                    items-center
                                    gap-2
                                    self-start
                                    rounded-full
                                    border
                                    border-slate-800/80
                                    bg-slate-900/60
                                    px-3
                                    py-1.5
                                    backdrop-blur-md
                                    sm:flex
                                    sm:self-auto
                                "
                            >
                                <FaBolt className="text-[9px] text-indigo-400" />

                                <span
                                    className="
                                        text-[10px]
                                        font-medium
                                        text-slate-500
                                    "
                                >
                                    Your learning space
                                </span>
                            </div>
                        </div>

                        {/* Header Divider */}
                        <div
                            className="
                                mt-6
                                h-px
                                w-full
                                bg-gradient-to-r
                                from-indigo-500/20
                                via-slate-800/80
                                to-transparent
                                sm:mt-7
                            "
                        />
                    </motion.div>

                    {/* =====================================
                        PROFILE HERO
                    ===================================== */}

                    <motion.section
                        variants={itemVariants}
                        className="
                            relative
                            overflow-hidden
                            rounded-[24px]
                            border
                            border-slate-800/80
                            bg-[#0a0f17]
                            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                        "
                    >
                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-24
                                -top-24
                                h-64
                                w-64
                                rounded-full
                                bg-indigo-500/[0.055]
                                blur-[80px]
                            "
                        />

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -bottom-[120px]
                                left-[30%]
                                h-48
                                w-48
                                rounded-full
                                bg-violet-500/[0.025]
                                blur-[70px]
                            "
                        />

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

                        <div className="relative">
                            <ProfileHeader
                                onEdit={() =>
                                    setEditModalOpen(true)
                                }
                            />
                        </div>

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                rounded-[24px]
                                ring-1
                                ring-inset
                                ring-white/[0.025]
                            "
                        />
                    </motion.section>

                    {/* =====================================
                        STATISTICS
                    ===================================== */}

                    <motion.section
                        variants={itemVariants}
                        className="mt-5 sm:mt-6"
                    >
                        <div className="mb-4 flex items-center gap-2">
                            <FaUserCircle className="text-[11px] text-slate-600" />

                            <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-slate-600
                                "
                            >
                                Activity overview
                            </span>
                        </div>

                        <ProfileStats />
                    </motion.section>

                    {/* =====================================
                        INFORMATION + ACTIVITY
                    ===================================== */}

                    <motion.section
                        variants={itemVariants}
                        className="
                            mt-6
                            grid
                            gap-5
                            sm:mt-7
                            sm:gap-6
                            lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
                        "
                    >
                        {/* Profile Information */}
                        <div
                            className="
                                relative
                                min-w-0
                                overflow-hidden
                                rounded-[24px]
                                border
                                border-slate-800/80
                                bg-[#0a0f17]
                                shadow-[0_16px_50px_rgba(0,0,0,0.15)]
                            "
                        >
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-20
                                    -top-20
                                    h-40
                                    w-40
                                    rounded-full
                                    bg-indigo-500/[0.035]
                                    blur-[60px]
                                "
                            />

                            <div className="relative">
                                <ProfileInfo />
                            </div>

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    rounded-[24px]
                                    ring-1
                                    ring-inset
                                    ring-white/[0.025]
                                "
                            />
                        </div>

                        {/* Activity Timeline */}
                        <div
                            className="
                                relative
                                min-w-0
                                overflow-hidden
                                rounded-[24px]
                                border
                                border-slate-800/80
                                bg-[#0a0f17]
                                shadow-[0_16px_50px_rgba(0,0,0,0.15)]
                            "
                        >
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -left-20
                                    -top-20
                                    h-40
                                    w-40
                                    rounded-full
                                    bg-violet-500/[0.03]
                                    blur-[60px]
                                "
                            />

                            <div className="relative">
                                <ActivityTimeline />
                            </div>

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    rounded-[24px]
                                    ring-1
                                    ring-inset
                                    ring-white/[0.025]
                                "
                            />
                        </div>
                    </motion.section>

                    <div className="h-8 sm:h-10" />
                </motion.div>
            </main>

            {/* =========================================
                EDIT PROFILE MODAL
            ========================================= */}

            <AnimatePresence>
                {editModalOpen && (
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
                        exit={
                            shouldReduceMotion
                                ? undefined
                                : {
                                      opacity: 0,
                                  }
                        }
                    >
                        <EditProfileModal
                            open={editModalOpen}
                            onClose={() =>
                                setEditModalOpen(false)
                            }
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;