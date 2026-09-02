import {
    FaMicrophone,
    FaMicrophoneSlash,
    FaPhoneSlash,
} from "react-icons/fa";
import { motion } from "framer-motion";

const VoiceControls = ({
    isJoined,
    isJoining = false,
    isMuted,
    onJoin,
    onLeave,
    onToggleMute,
}) => {
    if (!isJoined) {
        return (
            <motion.button
                type="button"
                onClick={onJoin}
                disabled={isJoining}
                whileHover={
                    !isJoining
                        ? { y: -1 }
                        : undefined
                }
                whileTap={
                    !isJoining
                        ? { scale: 0.98 }
                        : undefined
                }
                className={`group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl border px-4 py-3 text-sm font-semibold shadow-[0_0_25px_rgba(52,211,153,0.06)] transition-all duration-300 ${
                    isJoining
                        ? "cursor-wait border-emerald-400/10 bg-emerald-400/[0.05] text-emerald-300/60"
                        : "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300 hover:border-emerald-400/40 hover:bg-emerald-400/[0.13]"
                }`}
            >
                {!isJoining && (
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                )}

                <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10">
                    <FaMicrophone
                        size={13}
                    />
                </span>

                <span className="relative">
                    {isJoining
                        ? "Joining voice..."
                        : "Join Voice"}
                </span>

                {!isJoining && (
                    <span className="relative ml-auto flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" />

                        <span className="text-[9px] font-medium uppercase tracking-wider text-emerald-400/60">
                            Live
                        </span>
                    </span>
                )}
            </motion.button>
        );
    }

    return (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-2 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-2">
                {/* Mute */}
                <motion.button
                    type="button"
                    onClick={
                        onToggleMute
                    }
                    whileHover={{
                        y: -1,
                    }}
                    whileTap={{
                        scale: 0.96,
                    }}
                    className={`group relative flex h-12 flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-xl border transition-all duration-300 ${
                        isMuted
                            ? "border-red-400/20 bg-red-400/[0.08] text-red-300 hover:bg-red-400/[0.13]"
                            : "border-white/[0.06] bg-white/[0.045] text-white hover:border-emerald-400/20 hover:bg-emerald-400/[0.07]"
                    }`}
                >
                    <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isMuted
                                ? "bg-red-400/10"
                                : "bg-white/[0.05]"
                        }`}
                    >
                        {isMuted ? (
                            <FaMicrophoneSlash
                                size={12}
                            />
                        ) : (
                            <FaMicrophone
                                size={12}
                            />
                        )}
                    </span>

                    <span className="text-xs font-semibold">
                        {isMuted
                            ? "Unmute"
                            : "Mute"}
                    </span>

                    {!isMuted && (
                        <span className="absolute bottom-1.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-emerald-400/60" />
                    )}
                </motion.button>

                {/* Leave */}
                <motion.button
                    type="button"
                    onClick={onLeave}
                    whileHover={{
                        y: -1,
                    }}
                    whileTap={{
                        scale: 0.96,
                    }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/[0.07] text-red-400 transition-all duration-300 hover:border-red-400/25 hover:bg-red-400/[0.13]"
                    title="Leave voice"
                    aria-label="Leave voice"
                >
                    <FaPhoneSlash
                        size={13}
                    />
                </motion.button>
            </div>

            {/* Live status */}
            <div className="mt-2 flex items-center justify-center gap-2">
                <motion.span
                    animate={{
                        opacity: [
                            0.4,
                            1,
                            0.4,
                        ],
                        scale: [
                            0.9,
                            1,
                            0.9,
                        ],
                    }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]"
                />

                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                    Voice connected
                </span>
            </div>
        </div>
    );
};

export default VoiceControls;