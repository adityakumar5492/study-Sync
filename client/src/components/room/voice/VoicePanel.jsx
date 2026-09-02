import { FaVolumeUp } from "react-icons/fa";
import { motion } from "framer-motion";

import useVoiceChat from "../../../hooks/useVoiceChat";
import VoiceControls from "./VoiceControls";
import VoiceParticipant from "./VoiceParticipant";

const VoicePanel = ({
    roomId,
    currentUser,
}) => {
    const {
        isJoined,
        isJoining,
        isMuted,
        participants,
        speakingUsers,
        connectionStates,
        audioPlaybackBlocked,
        joinVoice,
        leaveVoice,
        toggleMute,
        resumeRemoteAudio,
    } = useVoiceChat({
        roomId,
        user: currentUser,
    });

    return (
        <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#090b10] p-3">
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/[0.05] blur-3xl" />

            <div className="relative">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.07]">
                            <FaVolumeUp
                                size={12}
                                className="text-emerald-400"
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white">
                                Voice
                            </h3>

                            <p className="mt-0.5 text-[9px] uppercase tracking-[0.15em] text-zinc-600">
                                {isJoined
                                    ? "Live audio"
                                    : "Talk with your room"}
                            </p>
                        </div>
                    </div>

                    {isJoined && (
                        <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.06] px-2.5 py-1.5">
                            <motion.span
                                animate={{
                                    opacity: [
                                        0.35,
                                        1,
                                        0.35,
                                    ],
                                    scale: [
                                        0.9,
                                        1,
                                        0.9,
                                    ],
                                }}
                                transition={{
                                    duration: 1.6,
                                    repeat: Infinity,
                                }}
                                className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]"
                            />

                            <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400">
                                Connected
                            </span>
                        </div>
                    )}
                </div>

                {/* Browser audio fallback */}
                {isJoined &&
                    audioPlaybackBlocked && (
                        <div className="mb-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] p-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-amber-300">
                                        Audio is waiting for permission
                                    </p>

                                    <p className="mt-1 text-[9px] leading-relaxed text-zinc-500">
                                        Your microphone is connected, but the browser blocked remote audio playback.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        resumeRemoteAudio
                                    }
                                    className="shrink-0 rounded-lg border border-amber-400/20 bg-amber-400/[0.08] px-2.5 py-1.5 text-[9px] font-semibold text-amber-300 transition hover:bg-amber-400/[0.13]"
                                >
                                    Enable audio
                                </button>
                            </div>
                        </div>
                    )}

                {/* Participants */}
                {isJoined && (
                    <div className="mb-3">
                        {participants.length ===
                        0 ? (
                            <div className="rounded-2xl border border-dashed border-white/[0.07] bg-white/[0.02] px-4 py-5 text-center">
                                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                                    <FaVolumeUp
                                        size={12}
                                        className="text-zinc-600"
                                    />
                                </div>

                                <p className="text-[10px] font-medium text-zinc-500">
                                    Waiting for others...
                                </p>

                                <p className="mt-1 text-[8px] text-zinc-700">
                                    Invite someone to join the conversation
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {participants.map(
                                    (
                                        participant
                                    ) => {
                                        const participantId =
                                            participant._id?.toString();

                                        return (
                                            <VoiceParticipant
                                                key={
                                                    participantId
                                                }
                                                participant={
                                                    participant
                                                }
                                                currentUser={
                                                    currentUser
                                                }
                                                isSpeaking={Boolean(
                                                    speakingUsers?.[
                                                        participantId
                                                    ]
                                                )}
                                                connectionState={
                                                    connectionStates?.[
                                                        participantId
                                                    ] ||
                                                    (participantId ===
                                                    currentUser?._id?.toString()
                                                        ? "connected"
                                                        : "connecting")
                                                }
                                            />
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Controls */}
                <VoiceControls
                    isJoined={
                        isJoined
                    }
                    isJoining={
                        isJoining
                    }
                    isMuted={
                        isMuted
                    }
                    onJoin={
                        joinVoice
                    }
                    onLeave={
                        leaveVoice
                    }
                    onToggleMute={
                        toggleMute
                    }
                />
            </div>
        </section>
    );
};

export default VoicePanel;