import { motion, useReducedMotion } from "framer-motion";
import {
    FaSearch,
    FaPlus,
    FaUsers,
    FaArrowRight,
} from "react-icons/fa";

import RoomItem from "./RoomItem";

const RoomList = ({ rooms }) => {
    const shouldReduceMotion = useReducedMotion();

    if (!rooms?.length) {
        return (
            <motion.section
                initial={{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : 12,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className="
                    relative
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/[0.06]
                    bg-[#0a0f1c]
                    px-5
                    py-16
                    text-center
                    shadow-[0_20px_70px_rgba(0,0,0,0.18)]
                    sm:px-8
                    sm:py-20
                "
            >
                {/* Ambient background */}
                <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-indigo-500/[0.06] blur-[90px]" />

                <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-violet-500/[0.04] blur-[100px]" />

                <div className="relative mx-auto max-w-md">

                    {/* Icon */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: shouldReduceMotion
                                ? 1
                                : 0.8,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            delay: 0.05,
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-indigo-400/10 bg-indigo-500/[0.07] text-indigo-400 shadow-[0_15px_45px_rgba(99,102,241,0.08)]"
                    >
                        <FaSearch className="text-xl" />
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
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
                            delay: 0.1,
                            duration: 0.35,
                        }}
                        className="mt-6 text-xl font-bold tracking-tight text-white sm:text-2xl"
                    >
                        No study rooms found
                    </motion.h2>

                    {/* Description */}
                    <motion.p
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
                            delay: 0.15,
                            duration: 0.35,
                        }}
                        className="mt-2 text-sm leading-6 text-slate-500"
                    >
                        Nothing matches your current
                        search. Try a different term or
                        create a new study space.
                    </motion.p>

                    {/* Visual divider */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            scaleX: 0,
                        }}
                        animate={{
                            opacity: 1,
                            scaleX: 1,
                        }}
                        transition={{
                            delay: 0.22,
                            duration: 0.4,
                        }}
                        className="mx-auto mt-7 h-px max-w-[180px] origin-center bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
                    />

                    {/* Supporting status */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: shouldReduceMotion
                                ? 0
                                : 6,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.27,
                            duration: 0.35,
                        }}
                        className="mt-6 flex items-center justify-center gap-2"
                    >
                        <FaUsers className="text-[10px] text-slate-700" />

                        <span className="text-[10px] font-medium text-slate-600">
                            Your study spaces will appear
                            here
                        </span>
                    </motion.div>
                </div>
            </motion.section>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren:
                            shouldReduceMotion
                                ? 0
                                : 0.06,
                    },
                },
            }}
            className="grid gap-4 md:grid-cols-2 lg:gap-5"
        >
            {rooms.map((room) => (
                <motion.div
                    key={room._id}
                    variants={{
                        hidden: {
                            opacity: 0,
                            y: shouldReduceMotion
                                ? 0
                                : 12,
                        },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.4,
                                ease: [
                                    0.16,
                                    1,
                                    0.3,
                                    1,
                                ],
                            },
                        },
                    }}
                    className="min-w-0"
                >
                    <RoomItem
                        room={room}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default RoomList;