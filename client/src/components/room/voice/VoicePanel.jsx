import {
    FaVolumeUp,
} from "react-icons/fa";
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
        isMuted,
        participants,
        speakingUsers,
        joinVoice,
        leaveVoice,
        toggleMute,
    } = useVoiceChat({
        roomId,
        user: currentUser,
    });

    return (
        <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#090b10] p-3">
            {/* Ambient background */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/[0.05] blur-3xl" />

            <div className="relative">
                {/* ==============================
                    HEADER
                ============================== */}

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

                            {isJoined && (
                                <p className="mt-0.5 text-[9px] uppercase tracking-[0.15em] text-zinc-600">
                                    Live audio
                                </p>
                            )}
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

                {/* ==============================
                    PARTICIPANTS
                ============================== */}

                {isJoined && (
                    <div className="mb-3">
                        {participants.length === 0 ? (
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
                                    Invite someone to join
                                    the conversation
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {participants.map(
                                    (participant) => {
                                        const participantId =
                                            participant._id?.toString();

                                        const isSpeaking =
                                            Boolean(
                                                speakingUsers?.[
                                                    participantId
                                                ]
                                            );

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
                                                isSpeaking={
                                                    isSpeaking
                                                }
                                            />
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ==============================
                    CONTROLS
                ============================== */}

                <VoiceControls
                    isJoined={isJoined}
                    isMuted={isMuted}
                    onJoin={joinVoice}
                    onLeave={leaveVoice}
                    onToggleMute={
                        toggleMute
                    }
                />
            </div>
        </section>
    );
};

export default VoicePanel;