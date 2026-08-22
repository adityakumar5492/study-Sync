import {
    FaEdit,
    FaUserCircle,
    FaShieldAlt,
} from "react-icons/fa";
import {
    motion,
    useReducedMotion,
} from "framer-motion";

import { useAppSelector } from "../../redux/hooks";

const API_URL = "http://localhost:5000";

const ProfileHeader = ({ onEdit }) => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const shouldReduceMotion = useReducedMotion();

    const avatarUrl = user?.avatar
        ? `${API_URL}${user.avatar}`
        : null;

    return (
        <section className="group relative overflow-hidden rounded-[24px] border border-slate-800/80 bg-[#0a0f17] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-6 lg:p-7">
            {/* =========================================
                AMBIENT BACKGROUND
            ========================================= */}

            <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-indigo-500/[0.07] blur-[100px] transition-all duration-700 group-hover:bg-indigo-500/[0.1]" />

            <div className="pointer-events-none absolute -bottom-32 left-[25%] h-56 w-56 rounded-full bg-violet-500/[0.025] blur-[90px]" />

            {/* Top light */}
            <div className="pointer-events-none absolute left-12 right-12 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

            {/* Subtle grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.012]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                }}
            />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                {/* =====================================
                    PROFILE IDENTITY
                ===================================== */}

                <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                    {/* Avatar */}
                    <motion.div
                        initial={
                            shouldReduceMotion
                                ? false
                                : {
                                      opacity: 0,
                                      scale: 0.92,
                                  }
                        }
                        animate={
                            shouldReduceMotion
                                ? undefined
                                : {
                                      opacity: 1,
                                      scale: 1,
                                  }
                        }
                        whileHover={
                            shouldReduceMotion
                                ? undefined
                                : {
                                      scale: 1.035,
                                  }
                        }
                        transition={{
                            duration: 0.45,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="relative h-[72px] w-[72px] shrink-0 sm:h-20 sm:w-20"
                    >
                        {/* Avatar glow */}
                        <div className="absolute inset-[-5px] rounded-[22px] bg-indigo-500/10 blur-xl opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* Avatar frame */}
                        <div className="relative h-full w-full overflow-hidden rounded-[20px] border border-slate-700/80 bg-slate-950 shadow-[0_12px_35px_rgba(0,0,0,0.3)]">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={
                                        user?.name ||
                                        "Profile"
                                    }
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                                    <FaUserCircle className="text-[48px] text-slate-600 sm:text-[54px]" />
                                </div>
                            )}

                            {/* Image overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/[0.03]" />
                        </div>

                        {/* Online indicator */}
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-[#0a0f17] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                        </span>
                    </motion.div>

                    {/* User details */}
                    <motion.div
                        initial={
                            shouldReduceMotion
                                ? false
                                : {
                                      opacity: 0,
                                      x: -8,
                                  }
                        }
                        animate={
                            shouldReduceMotion
                                ? undefined
                                : {
                                      opacity: 1,
                                      x: 0,
                                  }
                        }
                        transition={{
                            delay: 0.08,
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="min-w-0"
                    >
                        {/* Eyebrow */}
                        <div className="mb-1.5 flex items-center gap-2">
                            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-indigo-400/80">
                                StudySync member
                            </span>
                        </div>

                        <h2 className="truncate text-xl font-bold tracking-[-0.035em] text-white sm:text-2xl lg:text-3xl">
                            {user?.name || "Student"}
                        </h2>

                        <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                            {user?.email ||
                                "No email available"}
                        </p>

                        {/* Account status */}
                        <div className="mt-2.5 flex items-center gap-2">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
                                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            </span>

                            <span className="text-[10px] font-medium text-slate-500 sm:text-xs">
                                Active account
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* =====================================
                    ACTION AREA
                ===================================== */}

                <motion.div
                    initial={
                        shouldReduceMotion
                            ? false
                            : {
                                  opacity: 0,
                                  y: 8,
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
                        delay: 0.12,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex w-full shrink-0 items-center gap-2 sm:w-auto"
                >
                    {/* Account security hint */}
                    <div className="hidden items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-950/50 px-3 py-2.5 xl:flex">
                        <FaShieldAlt className="text-[10px] text-emerald-400/70" />

                        <span className="text-[10px] font-medium text-slate-600">
                            Account secured
                        </span>
                    </div>

                    {/* Edit button */}
                    <motion.button
                        type="button"
                        onClick={onEdit}
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
                                      scale: 0.97,
                                  }
                        }
                        className="
                            group/button
                            relative
                            flex
                            min-h-11
                            w-full
                            items-center
                            justify-center
                            gap-2
                            overflow-hidden
                            rounded-xl
                            border
                            border-indigo-400/20
                            bg-indigo-500
                            px-5
                            py-3
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
                            focus-visible:ring-indigo-400
                            focus-visible:ring-offset-2
                            focus-visible:ring-offset-[#0a0f17]
                            sm:w-auto
                            sm:px-5
                            sm:text-sm
                        "
                    >
                        {/* Button shine */}
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />

                        <FaEdit className="relative text-[11px]" />

                        <span className="relative">
                            Edit Profile
                        </span>
                    </motion.button>
                </motion.div>
            </div>

            {/* Bottom divider */}
            <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Inner border */}
            <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/[0.025]" />
        </section>
    );
};

export default ProfileHeader;