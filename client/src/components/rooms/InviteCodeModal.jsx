import {
    FaCheckCircle,
    FaCopy,
    FaArrowRight,
    FaLock,
} from "react-icons/fa";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const InviteCodeModal = ({
    isOpen,
    room,
    onClose,
}) => {
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();

    if (!isOpen || !room) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                room.inviteCode
            );

            toast.success("Invite code copied.");
        } catch {
            toast.error(
                "Failed to copy invite code."
            );
        }
    };

    const handleGoToRoom = () => {
        onClose();
        navigate(`/room/${room._id}`);
    };

    const overlayVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.25,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.2,
            },
        },
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 20,
            scale: shouldReduceMotion ? 1 : 0.96,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.42,
                ease: [0.16, 1, 0.3, 1],
            },
        },
        exit: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 10,
            scale: shouldReduceMotion ? 1 : 0.98,
            transition: {
                duration: 0.2,
                ease: "easeIn",
            },
        },
    };

    return (
        <AnimatePresence>
            <motion.div
                key="invite-modal-overlay"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
                className="
                    fixed
                    inset-0
                    z-[60]
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    overflow-y-auto
                    bg-[#02040a]/80
                    px-3
                    py-4
                    backdrop-blur-md
                    sm:px-4
                    sm:py-6
                "
                onMouseDown={(event) => {
                    if (
                        event.target ===
                        event.currentTarget
                    ) {
                        onClose();
                    }
                }}
            >
                <motion.div
                    key="invite-modal"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalVariants}
                    className="
                        relative
                        my-auto
                        w-full
                        max-w-md
                        overflow-hidden
                        rounded-[28px]
                        border
                        border-white/[0.08]
                        bg-[#0a0f1c]
                        shadow-[0_35px_120px_rgba(0,0,0,0.7)]
                        sm:rounded-[32px]
                    "
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                >
                    {/* =================================
                        AMBIENT BACKGROUND
                    ================================= */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-24
                            -top-24
                            h-64
                            w-64
                            rounded-full
                            bg-emerald-500/[0.08]
                            blur-[100px]
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-32
                            -left-24
                            h-60
                            w-60
                            rounded-full
                            bg-indigo-500/[0.06]
                            blur-[100px]
                        "
                    />

                    {/* =================================
                        TOP ACCENT
                    ================================= */}

                    <div className="relative h-px w-full bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

                    {/* =================================
                        CONTENT
                    ================================= */}

                    <div className="relative p-5 sm:p-8">

                        {/* =================================
                            SUCCESS ICON
                        ================================= */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: shouldReduceMotion
                                    ? 1
                                    : 0.7,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            transition={{
                                delay: 0.1,
                                duration: 0.45,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={
                                        shouldReduceMotion
                                            ? undefined
                                            : {
                                                  scale: [
                                                      1,
                                                      1.04,
                                                      1,
                                                  ],
                                              }
                                    }
                                    transition={{
                                        duration: 2.8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="
                                        flex
                                        h-16
                                        w-16
                                        items-center
                                        justify-center
                                        rounded-[20px]
                                        border
                                        border-emerald-400/15
                                        bg-emerald-500/[0.08]
                                        text-emerald-400
                                        shadow-[0_15px_45px_rgba(16,185,129,0.10)]
                                        sm:h-[72px]
                                        sm:w-[72px]
                                        sm:rounded-[22px]
                                    "
                                >
                                    <FaCheckCircle className="text-2xl sm:text-3xl" />
                                </motion.div>

                                <motion.div
                                    animate={
                                        shouldReduceMotion
                                            ? undefined
                                            : {
                                                  scale: [
                                                      1,
                                                      1.35,
                                                  ],
                                                  opacity: [
                                                      0.35,
                                                      0,
                                                  ],
                                              }
                                    }
                                    transition={{
                                        duration: 2.2,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                    }}
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-0
                                        rounded-[20px]
                                        border
                                        border-emerald-400/20
                                        sm:rounded-[22px]
                                    "
                                />
                            </div>
                        </motion.div>

                        {/* =================================
                            HEADING
                        ================================= */}

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
                                delay: 0.16,
                                duration: 0.35,
                            }}
                            className="mt-5 text-center"
                        >
                            <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-500/[0.05] px-2.5 py-1">
                                <FaLock className="text-[8px] text-emerald-400" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-400">
                                    Private room
                                </span>
                            </div>

                            <h2 className="mt-4 text-xl font-bold tracking-tight text-white sm:text-2xl">
                                Room created successfully
                            </h2>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Share this private invite
                                code with your study group
                                to give them access.
                            </p>
                        </motion.div>

                        {/* =================================
                            ROOM NAME
                        ================================= */}

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
                                delay: 0.22,
                                duration: 0.35,
                            }}
                            className="
                                mt-6
                                rounded-2xl
                                border
                                border-white/[0.055]
                                bg-white/[0.02]
                                px-4
                                py-3
                                text-center
                            "
                        >
                            <p className="truncate text-xs font-semibold text-slate-300">
                                {room.name}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-600">
                                Invite members to join
                                this room
                            </p>
                        </motion.div>

                        {/* =================================
                            INVITE CODE
                        ================================= */}

                        <motion.div
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
                                delay: 0.27,
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="
                                group
                                relative
                                mt-3
                                overflow-hidden
                                rounded-[22px]
                                border
                                border-indigo-400/15
                                bg-gradient-to-br
                                from-indigo-500/[0.09]
                                via-indigo-500/[0.04]
                                to-transparent
                                p-5
                                text-center
                                shadow-[0_15px_50px_rgba(99,102,241,0.06)]
                                sm:p-6
                            "
                        >
                            {/* Code glow */}
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    left-1/2
                                    top-1/2
                                    h-28
                                    w-28
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    rounded-full
                                    bg-indigo-500/[0.10]
                                    blur-[55px]
                                "
                            />

                            {/* Top line */}
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-x-8
                                    top-0
                                    h-px
                                    bg-gradient-to-r
                                    from-transparent
                                    via-indigo-400/40
                                    to-transparent
                                "
                            />

                            <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:text-[11px]">
                                Invite Code
                            </p>

                            <motion.p
                                whileHover={
                                    shouldReduceMotion
                                        ? undefined
                                        : {
                                              scale: 1.02,
                                          }
                                }
                                className="
                                    relative
                                    mt-3
                                    break-all
                                    text-2xl
                                    font-black
                                    tracking-[0.16em]
                                    text-indigo-300
                                    sm:text-3xl
                                    sm:tracking-[0.22em]
                                "
                            >
                                {room.inviteCode}
                            </motion.p>

                            <p className="relative mt-2 text-[10px] text-slate-700">
                                Anyone with this code
                                can request access
                            </p>
                        </motion.div>

                        {/* =================================
                            COPY BUTTON
                        ================================= */}

                        <motion.button
                            type="button"
                            onClick={handleCopy}
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
                                delay: 0.33,
                                duration: 0.35,
                            }}
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
                                mt-5
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
                                py-3.5
                                text-sm
                                font-bold
                                text-white
                                shadow-[0_15px_40px_rgba(99,102,241,0.18)]
                                transition-all
                                duration-300
                                hover:bg-indigo-400
                                hover:shadow-[0_18px_45px_rgba(99,102,241,0.28)]
                            "
                        >
                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    -translate-x-full
                                    bg-gradient-to-r
                                    from-transparent
                                    via-white/10
                                    to-transparent
                                    transition-transform
                                    duration-700
                                    group-hover:translate-x-full
                                "
                            />

                            <FaCopy className="relative text-xs" />

                            <span className="relative">
                                Copy Invite Code
                            </span>
                        </motion.button>

                        {/* =================================
                            GO TO ROOM
                        ================================= */}

                        <motion.button
                            type="button"
                            onClick={handleGoToRoom}
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
                                delay: 0.38,
                                duration: 0.35,
                            }}
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
                                mt-3
                                flex
                                min-h-12
                                w-full
                                items-center
                                justify-center
                                gap-2.5
                                rounded-2xl
                                border
                                border-white/[0.07]
                                bg-white/[0.025]
                                px-5
                                py-3.5
                                text-sm
                                font-semibold
                                text-slate-300
                                transition-all
                                duration-300
                                hover:border-white/[0.12]
                                hover:bg-white/[0.05]
                                hover:text-white
                            "
                        >
                            <span>
                                Go to Room
                            </span>

                            <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                        </motion.button>

                        {/* =================================
                            HINT
                        ================================= */}

                        <motion.p
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            transition={{
                                delay: 0.44,
                                duration: 0.35,
                            }}
                            className="
                                mt-5
                                text-center
                                text-[10px]
                                leading-5
                                text-slate-700
                            "
                        >
                            You can find the invite code
                            again from your room.
                        </motion.p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InviteCodeModal;