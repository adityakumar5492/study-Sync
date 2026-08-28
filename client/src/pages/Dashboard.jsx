import {
    useOutletContext,
    useNavigate,
} from "react-router-dom";

import {
    motion,
    useReducedMotion,
} from "framer-motion";

import Topbar from "../components/dashboard/Topbar";
import QuickActions from "../components/dashboard/QuickActions";
import StatsSection from "../components/dashboard/StatsSection";
import RecentRooms from "../components/dashboard/RecentRooms";
import StudyStreakCalendar from "../components/dashboard/StudyStreakCalendar";

const Dashboard = () => {
    const navigate = useNavigate();
    const { openSidebar } = useOutletContext();

    const shouldReduceMotion = useReducedMotion();

    // =========================================
    // QUICK ACTION HANDLERS
    // =========================================

    const handleCreateRoom = () => {
        navigate("/rooms", {
            state: {
                openCreateRoom: true,
            },
        });
    };

    const handleJoinRoom = () => {
        navigate("/rooms", {
            state: {
                openJoinRoom: true,
            },
        });
    };

    const handleUploadMaterial = () => {
        navigate("/materials");
    };

    // =========================================
    // ANIMATION
    // =========================================

    const sectionVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 12,
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
        <div className="relative min-h-screen overflow-hidden bg-[#060a10] text-white">

            {/* =========================================
                BACKGROUND ATMOSPHERE
            ========================================= */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    fixed
                    -left-40
                    top-0
                    h-96
                    w-96
                    rounded-full
                    bg-indigo-500/[0.025]
                    blur-[120px]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    fixed
                    bottom-[-180px]
                    right-[-120px]
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-violet-500/[0.02]
                    blur-[140px]
                "
            />

            {/* =========================================
                MAIN
            ========================================= */}

            <main className="relative min-w-0 overflow-y-auto">

                <div
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
                    "
                >

                    {/* =====================================
                        TOPBAR
                    ===================================== */}

                    <motion.div
                        initial={
                            shouldReduceMotion
                                ? false
                                : {
                                      opacity: 0,
                                      y: -8,
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
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        <Topbar
                            onMenuClick={openSidebar}
                        />
                    </motion.div>

                    {/* =====================================
                        QUICK ACTIONS
                    ===================================== */}

                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-7 sm:mb-8"
                    >
                        <QuickActions
                            onCreateRoom={
                                handleCreateRoom
                            }
                            onJoinRoom={
                                handleJoinRoom
                            }
                            onUploadMaterial={
                                handleUploadMaterial
                            }
                        />
                    </motion.section>

                    {/* =====================================
                        STATISTICS
                    ===================================== */}

                    <motion.section
    variants={sectionVariants}
    initial="hidden"
    animate="visible"
    transition={{
        delay: shouldReduceMotion ? 0 : 0.06,
    }}
    className="mb-7 sm:mb-8"
>
    <StatsSection />

    <div className="mt-6 sm:mt-8">
        <StudyStreakCalendar />
    </div>
</motion.section>

                    {/* =====================================
                        RECENT ROOMS
                    ===================================== */}

                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            delay: shouldReduceMotion
                                ? 0
                                : 0.12,
                        }}
                    >
                        <RecentRooms />
                    </motion.section>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;