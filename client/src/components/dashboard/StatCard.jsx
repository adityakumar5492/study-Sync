import { motion, useReducedMotion } from "framer-motion";

const StatCard = ({
    title,
    value,
    icon,
    subtitle,
}) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={
                shouldReduceMotion
                    ? false
                    : {
                          opacity: 0,
                          y: 12,
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
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={
                shouldReduceMotion
                    ? undefined
                    : {
                          y: -4,
                      }
            }
            className="
                group
                relative
                min-w-0
                overflow-hidden
                rounded-[22px]
                border
                border-slate-800/80
                bg-[#0a0f17]
                p-4
                shadow-[0_12px_40px_rgba(0,0,0,0.16)]
                transition-[border-color,background-color,box-shadow]
                duration-500
                hover:border-indigo-500/20
                hover:bg-[#0c121c]
                hover:shadow-[0_18px_50px_rgba(0,0,0,0.24)]
                sm:p-5
            "
        >
            {/* Ambient glow */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-36
                    w-36
                    rounded-full
                    bg-indigo-500/[0.04]
                    blur-[55px]
                    transition-all
                    duration-700
                    group-hover:bg-indigo-500/[0.12]
                    group-hover:scale-110
                "
            />

            {/* Top accent */}
            <div
                className="
                    pointer-events-none
                    absolute
                    left-7
                    right-7
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-indigo-400/0
                    to-transparent
                    transition-all
                    duration-500
                    group-hover:via-indigo-400/50
                "
            />

            {/* Header */}
            <div className="relative mb-5 flex items-start justify-between">
                <motion.div
                    whileHover={
                        shouldReduceMotion
                            ? undefined
                            : {
                                  scale: 1.05,
                                  rotate: -3,
                              }
                    }
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                    }}
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-[14px]
                        border
                        border-slate-800/80
                        bg-slate-900/80
                        text-indigo-400
                        shadow-[0_8px_25px_rgba(0,0,0,0.18)]
                        transition-all
                        duration-300
                        group-hover:border-indigo-500/20
                        group-hover:bg-indigo-500/[0.08]
                    "
                >
                    {icon}
                </motion.div>

                <span
                    className="
                        mt-1
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-slate-700
                        transition-all
                        duration-300
                        group-hover:bg-indigo-400
                        group-hover:shadow-[0_0_10px_rgba(129,140,248,0.55)]
                    "
                />
            </div>

            {/* Value */}
            <div className="relative">
                <motion.h3
                    initial={
                        shouldReduceMotion
                            ? false
                            : {
                                  opacity: 0,
                                  y: 5,
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
                        delay: 0.08,
                        duration: 0.35,
                    }}
                    className="
                        truncate
                        text-[26px]
                        font-bold
                        tracking-[-0.04em]
                        text-white
                        sm:text-3xl
                    "
                >
                    {value}
                </motion.h3>

                <p className="
                    mt-1.5
                    truncate
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.08em]
                    text-slate-500
                    sm:text-xs
                ">
                    {title}
                </p>
            </div>

            {/* Subtitle */}
            {subtitle && (
                <div className="relative mt-4 flex items-center gap-2">
                    <span className="
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-indigo-400
                        shadow-[0_0_8px_rgba(129,140,248,0.45)]
                    " />

                    <p className="
                        truncate
                        text-[11px]
                        font-medium
                        text-indigo-300/80
                    ">
                        {subtitle}
                    </p>
                </div>
            )}

            {/* Bottom highlight */}
            <div className="
                pointer-events-none
                absolute
                inset-x-6
                bottom-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-white/[0.06]
                to-transparent
                opacity-0
                transition-opacity
                duration-500
                group-hover:opacity-100
            " />

            {/* Inner border */}
            <div className="
                pointer-events-none
                absolute
                inset-0
                rounded-[22px]
                ring-1
                ring-inset
                ring-white/[0.025]
                transition-all
                duration-500
                group-hover:ring-white/[0.06]
            " />
        </motion.div>
    );
};

export default StatCard;