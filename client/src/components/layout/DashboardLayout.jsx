import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
    motion,
    useReducedMotion,
} from "framer-motion";

import Sidebar from "../dashboard/Sidebar";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const shouldReduceMotion =
        useReducedMotion();

    const openSidebar = () => {
        setSidebarOpen(true);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="relative flex min-h-screen overflow-hidden bg-[#060a10] text-white">

            {/* =========================================
                GLOBAL AMBIENT BACKGROUND
            ========================================= */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    fixed
                    -left-40
                    -top-40
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
                    -bottom-48
                    right-[-120px]
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-violet-500/[0.018]
                    blur-[140px]
                "
            />

            {/* =========================================
                SIDEBAR
            ========================================= */}

            <Sidebar
                isOpen={sidebarOpen}
                onClose={closeSidebar}
            />

            {/* =========================================
                MAIN APPLICATION AREA
            ========================================= */}

            <div className="relative flex min-w-0 flex-1 flex-col">

                {/* Very subtle top application line */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        left-0
                        right-0
                        top-0
                        z-10
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-indigo-400/[0.12]
                        to-transparent
                    "
                />

                <motion.main
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
                    transition={{
                        duration: 0.35,
                        ease: "easeOut",
                    }}
                    className="
                        relative
                        min-h-screen
                        min-w-0
                        flex-1
                    "
                >
                    <Outlet
                        context={{
                            openSidebar,
                        }}
                    />
                </motion.main>

            </div>
        </div>
    );
};

export default DashboardLayout;