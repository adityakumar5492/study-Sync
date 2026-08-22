import {
    FaPlus,
    FaBars,
    FaUsers,
    FaBook,
  
} from "react-icons/fa";
import {
    motion,
    useReducedMotion,
} from "framer-motion";

const RoomHeader = ({
    onCreate,
    onMenuClick,
}) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <header className="relative overflow-hidden border-b border-white/[0.06] pb-6 sm:pb-8">
            {/* =================================
                BACKGROUND AMBIENCE
            ================================= */}

            <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-indigo-500/[0.07] blur-[110px]" />

            <div className="pointer-events-none absolute -left-32 bottom-[-180px] h-72 w-72 rounded-full bg-violet-500/[0.04] blur-[110px]" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10">

                {/* =================================
                    LEFT CONTENT
                ================================= */}

                <div className="min-w-0 max-w-3xl">

                    {/* Mobile Menu */}
                    <motion.button
                        type="button"
                        onClick={onMenuClick}
                        whileHover={
                            shouldReduceMotion
                                ? undefined
                                : { scale: 1.04 }
                        }
                        whileTap={
                            shouldReduceMotion
                                ? undefined
                                : { scale: 0.94 }
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
                            border-white/[0.07]
                            bg-white/[0.025]
                            text-slate-500
                            transition-all
                            duration-200
                            hover:border-white/[0.12]
                            hover:bg-white/[0.05]
                            hover:text-white
                            lg:hidden
                        "
                        aria-label="Open navigation menu"
                    >
                        <FaBars className="text-sm" />
                    </motion.button>

                    {/* Eyebrow */}
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
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="mb-3 flex items-center gap-2"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-400/10 bg-indigo-500/[0.08] text-indigo-400">
                            <FaUsers className="text-[10px]" />
                        </span>

                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 sm:text-xs">
                            Collaboration
                        </span>

                        <span className="h-1 w-1 rounded-full bg-slate-700" />

                        <span className="text-[10px] font-medium text-slate-600 sm:text-xs">
                            Study together
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{
                            opacity: 0,
                            y: shouldReduceMotion
                                ? 0
                                : 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.06,
                            duration: 0.45,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="
                            text-3xl
                            font-black
                            tracking-[-0.035em]
                            text-white
                            sm:text-4xl
                            lg:text-[42px]
                            lg:leading-[1.05]
                        "
                    >
                        Study Rooms
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{
                            opacity: 0,
                            y: shouldReduceMotion
                                ? 0
                                : 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.12,
                            duration: 0.4,
                        }}
                        className="
                            mt-3
                            max-w-2xl
                            text-sm
                            leading-6
                            text-slate-500
                            sm:text-[15px]
                        "
                    >
                        Join a focused study space or create
                        your own room and learn together in
                        real time.
                    </motion.p>
                </div>

                {/* =================================
                    CREATE ROOM ACTION
                ================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        x: shouldReduceMotion
                            ? 0
                            : 12,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        delay: 0.16,
                        duration: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="shrink-0"
                >
                    <motion.button
                        type="button"
                        onClick={onCreate}
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
                                      scale: 0.98,
                                  }
                        }
                        className="
                            group
                            relative
                            flex
                            min-h-12
                            w-full
                            items-center
                            justify-center
                            gap-2.5
                            overflow-hidden
                            rounded-2xl
                            bg-indigo-500
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            shadow-[0_15px_40px_rgba(99,102,241,0.16)]
                            transition-all
                            duration-300
                            hover:bg-indigo-400
                            hover:shadow-[0_18px_48px_rgba(99,102,241,0.25)]
                            sm:w-auto
                        "
                    >
                        {/* Shimmer */}
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                        {/* Icon */}
                        <span className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-white/10">
                            <FaPlus className="text-[10px] transition-transform duration-300 group-hover:rotate-90" />
                        </span>

                        <span className="relative">
                            Create Room
                        </span>
                    </motion.button>
                </motion.div>
            </div>

            {/* =================================
                BOTTOM STATUS STRIP
            ================================= */}

            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    delay: 0.24,
                    duration: 0.4,
                }}
                className="
                    relative
                    mt-6
                    flex
                    items-center
                    gap-3
                    sm:mt-7
                "
            >
                <div className="flex items-center gap-2 rounded-full border border-white/[0.055] bg-white/[0.02] px-3 py-1.5">
                    <motion.span
                        animate={
                            shouldReduceMotion
                                ? undefined
                                : {
                                      opacity: [
                                          0.45,
                                          1,
                                          0.45,
                                      ],
                                      scale: [
                                          0.9,
                                          1,
                                          0.9,
                                      ],
                                  }
                        }
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    />

                    <span className="text-[10px] font-medium text-slate-500 sm:text-xs">
                        Real-time collaboration
                    </span>
                </div>

                <div className="hidden h-px w-8 bg-white/[0.06] sm:block" />

                <div className="hidden items-center gap-1.5 text-[10px] text-slate-700 sm:flex sm:text-xs">
                    <FaBook className="text-[9px] text-indigo-400/70" />
                    Find your focus
                </div>
            </motion.div>
        </header>
    );
};

export default RoomHeader;