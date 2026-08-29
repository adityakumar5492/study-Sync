import {
    FaTrash,
    FaUserCircle,
    FaCheck,
    FaCheckDouble,
    FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";

const getMessageStatus = ({
    status,
    deliveredTo,
    seenBy,
}) => {
    if (status === "sending") {
        return "sending";
    }

    if (Array.isArray(seenBy) && seenBy.length > 0) {
        return "seen";
    }

    if (
        Array.isArray(deliveredTo) &&
        deliveredTo.length > 0
    ) {
        return "delivered";
    }

    return "sent";
};

const MessageStatus = ({
    status,
}) => {
    if (status === "sending") {
        return (
            <div className="flex items-center gap-1">
                <FaClock className="text-[7px] text-zinc-500" />
                <span>Sending</span>
            </div>
        );
    }

    if (status === "seen") {
        return (
            <div className="flex items-center gap-1">
                <FaCheckDouble className="text-[8px] text-cyan-300" />
                <span className="text-cyan-300/80">
                    Seen
                </span>
            </div>
        );
    }

    if (status === "delivered") {
        return (
            <div className="flex items-center gap-1">
                <FaCheckDouble className="text-[8px] text-violet-300/80" />
                <span>Delivered</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1">
            <FaCheck className="text-[7px] text-violet-400/70" />
            <span>Sent</span>
        </div>
    );
};

const MessageBubble = ({
    sender,
    text,
    time,
    isOwn = false,
    avatar,
    canDelete = false,
    onDelete,

    // Message status fields
    status,
    deliveredTo = [],
    seenBy = [],
}) => {
    const avatarUrl = avatar
        ? avatar.startsWith("http")
            ? avatar
            : `${import.meta.env.VITE_API_URL}${avatar}`
        : null;

    const resolvedStatus = getMessageStatus({
        status,
        deliveredTo,
        seenBy,
    });

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 12,
                x: isOwn ? 12 : -12,
                scale: 0.97,
            }}
            animate={{
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
            }}
            transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={`group relative mb-5 flex gap-3 ${
                isOwn ? "flex-row-reverse" : ""
            }`}
        >
            {/* ==========================================
                AVATAR
            ========================================== */}

            <motion.div
                whileHover={{
                    scale: 1.08,
                    y: -2,
                }}
                transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 20,
                }}
                className="relative mt-1 h-10 w-10 flex-shrink-0"
            >
                <motion.div
                    animate={{
                        opacity: [0.15, 0.35, 0.15],
                        scale: [0.9, 1.05, 0.9],
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={`absolute inset-0 rounded-full blur-md ${
                        isOwn
                            ? "bg-violet-500"
                            : "bg-cyan-400"
                    }`}
                />

                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={`${sender}'s avatar`}
                        className="relative h-10 w-10 rounded-full border border-white/10 object-cover shadow-lg"
                    />
                ) : (
                    <div
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 ${
                            isOwn
                                ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"
                                : "bg-gradient-to-br from-cyan-500/15 to-blue-500/15"
                        }`}
                    >
                        <FaUserCircle
                            className={
                                isOwn
                                    ? "text-3xl text-violet-300/80"
                                    : "text-3xl text-cyan-300/70"
                            }
                        />
                    </div>
                )}

                <motion.span
                    animate={{
                        opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                    className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#07070c] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]"
                />
            </motion.div>

            {/* ==========================================
                MESSAGE CONTENT
            ========================================== */}

            <div
                className={`flex max-w-[78%] min-w-0 flex-col ${
                    isOwn
                        ? "items-end"
                        : "items-start"
                }`}
            >
                {/* Sender + time + delete */}

                <div
                    className={`mb-1.5 flex items-center gap-2 ${
                        isOwn
                            ? "flex-row-reverse"
                            : ""
                    }`}
                >
                    <span
                        className={`text-[10px] font-bold ${
                            isOwn
                                ? "text-violet-300"
                                : "text-zinc-400"
                        }`}
                    >
                        {isOwn
                            ? "You"
                            : sender ||
                              "Unknown User"}
                    </span>

                    <span className="text-[9px] text-zinc-700">
                        {time || ""}
                    </span>

                    {canDelete && (
                        <motion.button
                            type="button"
                            initial={{
                                opacity: 1,
                                scale: 1,
                            }}
                            whileHover={{
                                scale: 1.08,
                            }}
                            whileTap={{
                                scale: 0.9,
                            }}
                            onClick={onDelete}
                            className="ml-1 flex h-6 w-6 items-center justify-center rounded-lg border border-transparent text-zinc-500 transition-all duration-200 hover:border-red-400/10 hover:bg-red-500/10 hover:text-red-400"
                            aria-label="Delete message"
                        >
                            <FaTrash size={9} />
                        </motion.button>
                    )}
                </div>

                {/* ==========================================
                    MESSAGE BUBBLE
                ========================================== */}

                <motion.div
                    whileHover={{
                        y: -1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                    }}
                    className={`relative overflow-hidden rounded-2xl px-4 py-3 text-sm leading-6 break-words whitespace-pre-wrap shadow-lg ${
                        isOwn
                            ? "rounded-tr-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-violet-500/10"
                            : "rounded-tl-md border border-white/[0.07] bg-white/[0.045] text-zinc-200 shadow-black/20 backdrop-blur-xl"
                    }`}
                >
                    {isOwn && (
                        <motion.div
                            animate={{
                                x: [
                                    "-120%",
                                    "120%",
                                ],
                            }}
                            transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: "linear",
                            }}
                            className="pointer-events-none absolute inset-y-0 left-0 w-8 rotate-12 bg-white/20 blur-md"
                        />
                    )}

                    {!isOwn && (
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.025] to-transparent" />
                    )}

                    <span className="relative z-10">
                        {text}
                    </span>
                </motion.div>

                {/* ==========================================
                    MESSAGE STATUS
                ========================================== */}

                {isOwn && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        transition={{
                            delay: 0.15,
                        }}
                        className="mt-1.5 flex items-center gap-1 text-[8px] text-zinc-700"
                    >
                        <MessageStatus
                            status={resolvedStatus}
                        />
                    </motion.div>
                )}
                
            </div>
        </motion.div>
    );
};

export default MessageBubble;