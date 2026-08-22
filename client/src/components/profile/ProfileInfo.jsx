import {
    FaEnvelope,
    FaCalendarAlt,
    FaInfoCircle,
} from "react-icons/fa";
import {
    motion,
    useReducedMotion,
} from "framer-motion";

import { useAppSelector } from "../../redux/hooks";

const ProfileInfo = () => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const shouldReduceMotion = useReducedMotion();

    const memberSince = user?.createdAt
        ? new Date(
              user.createdAt
          ).toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
          })
        : "Not available";

    const information = [
        {
            id: "email",
            label: "Email address",
            value: user?.email || "Not available",
            icon: FaEnvelope,
            accent: "emerald",
        },
        {
            id: "bio",
            label: "About",
            value: user?.bio || "No bio added yet.",
            icon: FaInfoCircle,
            accent: "indigo",
        },
        {
            id: "member",
            label: "Member since",
            value: memberSince,
            icon: FaCalendarAlt,
            accent: "violet",
        },
    ];

    const accentStyles = {
        emerald: {
            icon: "bg-emerald-500/10 text-emerald-300",
            glow: "bg-emerald-500",
            dot: "bg-emerald-400",
        },
        indigo: {
            icon: "bg-indigo-500/10 text-indigo-300",
            glow: "bg-indigo-500",
            dot: "bg-indigo-400",
        },
        violet: {
            icon: "bg-violet-500/10 text-violet-300",
            glow: "bg-violet-500",
            dot: "bg-violet-400",
        },
    };

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
            x: shouldReduceMotion ? 0 : -10,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <section className="group relative overflow-hidden rounded-[24px] border border-slate-800/80 bg-[#0a0f17] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.16)] transition-all duration-500 hover:border-slate-700/80 sm:p-6">
            {/* =========================================
                AMBIENT LIGHT
            ========================================= */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-indigo-500/[0.05] blur-[75px] transition-all duration-700 group-hover:bg-indigo-500/[0.09]" />

            <div className="pointer-events-none absolute -bottom-28 -left-20 h-44 w-44 rounded-full bg-violet-500/[0.025] blur-[70px]" />

            {/* Top highlight */}
            <div className="pointer-events-none absolute left-10 right-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="relative mb-6 sm:mb-7">
                <div className="mb-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-indigo-400/80">
                        Account details
                    </span>
                </div>

                <h2 className="text-lg font-semibold tracking-[-0.025em] text-white sm:text-xl">
                    Personal Information
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                    Your account and personal details.
                </p>
            </div>

            {/* =========================================
                INFORMATION LIST
            ========================================= */}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative space-y-2.5 sm:space-y-3"
            >
                {information.map((item) => {
                    const Icon = item.icon;
                    const colors =
                        accentStyles[item.accent];

                    return (
                        <motion.div
                            key={item.id}
                            variants={itemVariants}
                            whileHover={
                                shouldReduceMotion
                                    ? undefined
                                    : {
                                          x: 3,
                                      }
                            }
                            className="group/item relative flex min-w-0 gap-3 overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/35 p-3.5 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-950/70 sm:gap-4 sm:p-4"
                        >
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
                                    transition-opacity
                                    duration-500
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
                            <div className="relative min-w-0 flex-1 pt-0.5">
                                <div className="flex items-center gap-2">
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600 sm:text-[10px]">
                                        {item.label}
                                    </p>

                                    <span
                                        className={`
                                            hidden
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            opacity-0
                                            transition-opacity
                                            duration-300
                                            group-hover/item:opacity-70
                                            sm:block
                                            ${colors.dot}
                                        `}
                                    />
                                </div>

                                <p
                                    className={`
                                        mt-1.5
                                        text-[13px]
                                        leading-5
                                        text-slate-200
                                        transition-colors
                                        duration-300
                                        group-hover/item:text-white
                                        ${
                                            item.id ===
                                            "email"
                                                ? "break-all"
                                                : ""
                                        }
                                        sm:text-sm
                                        sm:leading-6
                                    `}
                                >
                                    {item.value}
                                </p>
                            </div>

                            {/* Right edge indicator */}
                            <div
                                className={`
                                    mt-2
                                    h-1.5
                                    w-1.5
                                    shrink-0
                                    rounded-full
                                    opacity-0
                                    transition-all
                                    duration-300
                                    group-hover/item:opacity-60
                                    ${colors.dot}
                                `}
                            />
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Bottom highlight */}
            <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Inner border */}
            <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/[0.025]" />
        </section>
    );
};

export default ProfileInfo;