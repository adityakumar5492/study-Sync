import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
    motion,
    useReducedMotion,
} from "framer-motion";
import { FaBars } from "react-icons/fa";

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
                MOBILE SIDEBAR BUTTON
            ========================================= */}

            <button
                type="button"
                onClick={openSidebar}
                aria-label="Open navigation menu"
                className="
                    fixed
                    left-4
                    top-4
                    z-30
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-[#0b1019]/95
                    text-zinc-300
                    shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                    backdrop-blur-xl
                    transition-all
                    duration-200
                    hover:border-violet-400/20
                    hover:bg-[#111725]
                    hover:text-white
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-violet-400/50
                    lg:hidden
                "
            >
                <FaBars className="text-sm" />
            </button>

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