import {
    FaMicrophone,
    FaMicrophoneSlash,
} from "react-icons/fa";
import { motion } from "framer-motion";

const VoiceParticipant = ({
    participant,
    currentUser,
    isSpeaking = false,
}) => {
    const isCurrentUser =
        participant._id?.toString() ===
        currentUser?._id?.toString();

    const avatarUrl = participant.avatar
        ? participant.avatar.startsWith("http")
            ? participant.avatar
            : `http://localhost:5000${participant.avatar}`
        : null;

    return (
        <motion.div
            layout
            initial={{
                opacity: 0,
                y: 8,
                scale: 0.98,
            }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
            }}
            transition={{
                duration: 0.25,
            }}
            className={`relative overflow-hidden rounded-2xl border p-3 transition-all duration-300 ${
                isSpeaking
                    ? "border-emerald-400/40 bg-emerald-400/[0.08] shadow-[0_0_30px_rgba(52,211,153,0.12)]"
                    : "border-white/[0.06] bg-white/[0.035] hover:bg-white/[0.055]"
            }`}
        >
            {/* Speaking glow */}
            {isSpeaking && (
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: [0.15, 0.35, 0.15],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                    }}
                    className="pointer-events-none absolute inset-0 bg-emerald-400/[0.08] blur-xl"
                />
            )}

            <div className="relative flex items-center gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                    {isSpeaking && (
                        <>
                            <motion.div
                                animate={{
                                    scale: [1, 1.18, 1],
                                    opacity: [0.7, 0, 0.7],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                }}
                                className="absolute -inset-1 rounded-full border border-emerald-400"
                            />

                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.25, 0, 0.25],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                }}
                                className="absolute -inset-2 rounded-full bg-emerald-400/20 blur-sm"
                            />
                        </>
                    )}

                    <div
                        className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border ${
                            isSpeaking
                                ? "border-emerald-300/70"
                                : "border-white/10"
                        } bg-slate-800`}
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={participant.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-sm font-semibold text-white">
                                {participant.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </span>
                        )}
                    </div>

                    {/* Online dot */}
                    <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 ${
                            isSpeaking
                                ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.9)]"
                                : "bg-emerald-500"
                        }`}
                    />
                </div>

                {/* User information */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-white">
                            {isCurrentUser
                                ? "You"
                                : participant.name}
                        </span>

                        {isCurrentUser && (
                            <span className="rounded-md bg-violet-400/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-violet-300">
                                You
                            </span>
                        )}
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                        {isSpeaking ? (
                            <span className="text-[10px] font-medium text-emerald-400">
                                Speaking
                            </span>
                        ) : participant.muted ? (
                            <span className="text-[10px] text-zinc-500">
                                Muted
                            </span>
                        ) : (
                            <span className="text-[10px] text-zinc-500">
                                Listening
                            </span>
                        )}
                    </div>
                </div>

                {/* Voice visualizer */}
                {isSpeaking && (
                    <div className="flex h-8 items-center gap-[3px]">
                        {[0, 1, 2, 3, 4, 5, 6].map(
                            (bar) => (
                                <motion.span
                                    key={bar}
                                    animate={{
                                        height: [
                                            5,
                                            12 + (bar % 3) * 5,
                                            7,
                                            16 - (bar % 2) * 4,
                                            5,
                                        ],
                                    }}
                                    transition={{
                                        duration:
                                            0.7 +
                                            bar * 0.06,
                                        repeat: Infinity,
                                        repeatType:
                                            "mirror",
                                        ease: "easeInOut",
                                        delay:
                                            bar * 0.05,
                                    }}
                                    className="w-[3px] rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.55)]"
                                />
                            )
                        )}
                    </div>
                )}

                {/* Microphone */}
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        participant.muted
                            ? "bg-red-400/10 text-red-400"
                            : isSpeaking
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-white/[0.04] text-zinc-500"
                    }`}
                >
                    {participant.muted ? (
                        <FaMicrophoneSlash size={11} />
                    ) : (
                        <FaMicrophone size={11} />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default VoiceParticipant;