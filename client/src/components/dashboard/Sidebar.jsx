import { NavLink } from "react-router-dom";
import {
    motion,
    AnimatePresence,
    useReducedMotion,
} from "framer-motion";
import {
    FaHome,
    FaUsers,
    FaUserCircle,
    FaTimes,
    FaBolt,
    FaChevronRight,
} from "react-icons/fa";

const menuItems = [
    {
        to: "/dashboard",
        icon: FaHome,
        label: "Dashboard",
        desc: "Overview & activity",
    },
    {
        to: "/rooms",
        icon: FaUsers,
        label: "Study Rooms",
        desc: "Collaborate & learn",
    },
    {
        to: "/profile",
        icon: FaUserCircle,
        label: "Profile",
        desc: "Account & settings",
    },
];

const Sidebar = ({ isOpen, onClose }) => {
    const shouldReduceMotion = useReducedMotion();

    const itemVariants = {
        hidden: {
            opacity: 0,
            x: shouldReduceMotion ? 0 : -10,
        },
        visible: (index) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: shouldReduceMotion
                    ? 0
                    : 0.08 + index * 0.06,
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
            },
        }),
    };

    return (
        <>
            {/* =========================================
                MOBILE OVERLAY
            ========================================= */}

            <AnimatePresence>
                {isOpen && (
                    <motion.button
                        type="button"
                        aria-label="Close navigation menu"
                        onClick={onClose}
                        className="fixed inset-0 z-40 cursor-default bg-slate-950/70 backdrop-blur-md lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: shouldReduceMotion
                                ? 0
                                : 0.25,
                        }}
                    />
                )}
            </AnimatePresence>

            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-[272px] shrink-0 flex-col
                    overflow-hidden
                    border-r border-white/[0.055]
                    bg-[#080b14]
                    shadow-[20px_0_70px_rgba(0,0,0,0.18)]
                    transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                    lg:static
                    lg:z-auto
                    lg:min-h-screen
                    lg:translate-x-0
                    lg:shadow-none
                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                {/* =====================================
                    BACKGROUND ATMOSPHERE
                ===================================== */}

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {/* Top indigo atmosphere */}
                    <div className="absolute -left-20 -top-28 h-64 w-64 rounded-full bg-indigo-500/[0.07] blur-[100px]" />

                    {/* Bottom violet atmosphere */}
                    <div className="absolute -bottom-32 -right-28 h-72 w-72 rounded-full bg-violet-500/[0.045] blur-[110px]" />

                    {/* Vertical subtle light */}
                    <div className="absolute left-0 top-24 h-64 w-px bg-gradient-to-b from-indigo-400/20 via-indigo-400/[0.03] to-transparent" />
                </div>

                {/* =====================================
                    BRAND HEADER
                ===================================== */}

                <div className="relative shrink-0 px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
                    <div className="flex items-center justify-between">
                        <NavLink
                            to="/dashboard"
                            onClick={onClose}
                            className="group flex min-w-0 items-center gap-3.5"
                        >
                            {/* Logo */}
                            <motion.div
                                whileHover={
                                    shouldReduceMotion
                                        ? undefined
                                        : {
                                              scale: 1.04,
                                              rotate: -2,
                                          }
                                }
                                whileTap={
                                    shouldReduceMotion
                                        ? undefined
                                        : {
                                              scale: 0.96,
                                          }
                                }
                                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-indigo-400/20 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-[0_10px_35px_rgba(99,102,241,0.22)]"
                            >
                                <FaBolt className="relative text-[16px] text-white" />

                                {/* Logo shine */}
                                <div className="pointer-events-none absolute inset-[1px] rounded-[14px] bg-gradient-to-br from-white/20 via-transparent to-transparent" />

                                {/* Status */}
                                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[#080b14] bg-emerald-400">
                                    <span className="h-1 w-1 rounded-full bg-emerald-950" />
                                </span>
                            </motion.div>

                            {/* Brand */}
                            <div className="min-w-0">
                                <h1 className="truncate text-[16px] font-bold tracking-[-0.02em] text-white">
                                    Study
                                    <span className="text-indigo-400">
                                        Sync
                                    </span>
                                </h1>

                                <p className="mt-0.5 text-[10px] font-medium tracking-wide text-slate-600">
                                    COLLABORATIVE LEARNING
                                </p>
                            </div>
                        </NavLink>

                        {/* Mobile Close */}
                        <motion.button
                            type="button"
                            onClick={onClose}
                            whileHover={
                                shouldReduceMotion
                                    ? undefined
                                    : {
                                          scale: 1.05,
                                      }
                            }
                            whileTap={
                                shouldReduceMotion
                                    ? undefined
                                    : {
                                          scale: 0.92,
                                      }
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-slate-500 transition-colors hover:border-white/[0.1] hover:bg-white/[0.06] hover:text-white lg:hidden"
                            aria-label="Close navigation menu"
                        >
                            <FaTimes className="text-xs" />
                        </motion.button>
                    </div>
                </div>

                {/* =====================================
                    DIVIDER
                ===================================== */}

                <div className="relative mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent sm:mx-6" />

                {/* =====================================
                    NAVIGATION
                ===================================== */}

                <nav
                    aria-label="Main navigation"
                    className="relative flex-1 overflow-y-auto px-3 py-6 sm:px-4"
                >
                    {/* Section heading */}
                    <div className="mb-3 flex items-center justify-between px-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                            Workspace
                        </p>

                        <span className="h-1 w-1 rounded-full bg-slate-700" />
                    </div>

                    <div className="space-y-1.5">
                        {menuItems.map(
                            (item, index) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                        key={item.to}
                                        custom={index}
                                        variants={
                                            itemVariants
                                        }
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <NavLink
                                            to={item.to}
                                            onClick={onClose}
                                            className="block"
                                        >
                                            {({
                                                isActive,
                                            }) => (
                                                <motion.div
                                                    whileHover={
                                                        shouldReduceMotion
                                                            ? undefined
                                                            : {
                                                                  x: 2,
                                                              }
                                                    }
                                                    whileTap={
                                                        shouldReduceMotion
                                                            ? undefined
                                                            : {
                                                                  scale: 0.985,
                                                              }
                                                    }
                                                    className={`
                                                        group
                                                        relative
                                                        flex
                                                        min-h-[68px]
                                                        items-center
                                                        gap-3
                                                        overflow-hidden
                                                        rounded-2xl
                                                        border
                                                        p-3
                                                        transition-all
                                                        duration-300
                                                        ${
                                                            isActive
                                                                ? "border-indigo-400/[0.12] bg-indigo-500/[0.075]"
                                                                : "border-transparent hover:border-white/[0.045] hover:bg-white/[0.035]"
                                                        }
                                                    `}
                                                >
                                                    {/* Active glow */}
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="sidebar-active-glow"
                                                            className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/[0.08] via-violet-500/[0.025] to-transparent"
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 380,
                                                                damping: 32,
                                                            }}
                                                        />
                                                    )}

                                                    {/* Active indicator */}
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="sidebar-active-indicator"
                                                            className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-400 to-violet-500 shadow-[0_0_14px_rgba(129,140,248,0.55)]"
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 420,
                                                                damping: 32,
                                                            }}
                                                        />
                                                    )}

                                                    {/* Icon */}
                                                    <div
                                                        className={`
                                                            relative
                                                            flex
                                                            h-10
                                                            w-10
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            border
                                                            transition-all
                                                            duration-300
                                                            ${
                                                                isActive
                                                                    ? "border-indigo-400/20 bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_8px_24px_rgba(99,102,241,0.2)]"
                                                                    : "border-white/[0.045] bg-white/[0.025] text-slate-500 group-hover:border-white/[0.08] group-hover:bg-white/[0.055] group-hover:text-slate-200"
                                                            }
                                                        `}
                                                    >
                                                        <Icon className="text-[14px]" />

                                                        {isActive && (
                                                            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/15 to-transparent" />
                                                        )}
                                                    </div>

                                                    {/* Text */}
                                                    <div className="relative min-w-0 flex-1">
                                                        <p
                                                            className={`
                                                                truncate
                                                                text-[13px]
                                                                font-semibold
                                                                tracking-[-0.01em]
                                                                transition-colors
                                                                duration-200
                                                                ${
                                                                    isActive
                                                                        ? "text-white"
                                                                        : "text-slate-400 group-hover:text-slate-100"
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                item.label
                                                            }
                                                        </p>

                                                        <p
                                                            className={`
                                                                mt-1
                                                                truncate
                                                                text-[10px]
                                                                leading-none
                                                                transition-colors
                                                                duration-200
                                                                ${
                                                                    isActive
                                                                        ? "text-indigo-300/55"
                                                                        : "text-slate-600 group-hover:text-slate-500"
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                item.desc
                                                            }
                                                        </p>
                                                    </div>

                                                    {/* Arrow */}
                                                    <motion.div
                                                        animate={{
                                                            opacity:
                                                                isActive
                                                                    ? 1
                                                                    : 0,
                                                            x: isActive
                                                                ? 0
                                                                : -4,
                                                        }}
                                                        whileHover={{
                                                            x: 2,
                                                        }}
                                                        transition={{
                                                            duration: 0.2,
                                                        }}
                                                        className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-indigo-300/70"
                                                    >
                                                        <FaChevronRight className="text-[8px]" />
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </NavLink>
                                    </motion.div>
                                );
                            }
                        )}
                    </div>
                </nav>

                {/* =====================================
                    BOTTOM STATUS PANEL
                ===================================== */}

                <div className="relative shrink-0 px-4 pb-4 sm:px-5 sm:pb-5">
                    <div className="relative overflow-hidden rounded-2xl border border-white/[0.055] bg-white/[0.025] p-3.5">
                        {/* Ambient glow */}
                        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-indigo-500/[0.08] blur-2xl" />

                        <div className="relative flex items-center gap-3">
                            {/* Status icon */}
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/[0.06]">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                                </span>
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold text-slate-300">
                                    Workspace online
                                </p>

                                <p className="mt-0.5 truncate text-[9px] text-slate-600">
                                    Real-time collaboration active
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom border highlight */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
            </aside>
        </>
    );
};

export default Sidebar;