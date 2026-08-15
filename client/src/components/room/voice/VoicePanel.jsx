import {
    FaVolumeUp,
} from "react-icons/fa";

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
        joinVoice,
        leaveVoice,
        toggleMute,
    } = useVoiceChat({
        roomId,
        user: currentUser,
    });

    return (
        <section className="border-b border-slate-800 bg-slate-900 p-3">
            {/* Header */}

            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FaVolumeUp
                        size={14}
                        className="text-green-400"
                    />

                    <h3 className="text-sm font-semibold text-white">
                        Voice
                    </h3>
                </div>

                {isJoined && (
                    <span className="flex items-center gap-1.5 text-xs text-green-400">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        Connected
                    </span>
                )}
            </div>

            {/* Participants */}

            {isJoined && (
                <div className="mb-3 space-y-2">
                    {participants.length === 0 ? (
                        <p className="text-xs text-slate-500">
                            Waiting for others...
                        </p>
                    ) : (
                        participants.map(
                            (participant) => (
                                <VoiceParticipant
                                    key={
                                        participant._id
                                    }
                                    participant={
                                        participant
                                    }
                                    currentUser={
                                        currentUser
                                    }
                                />
                            )
                        )
                    )}
                </div>
            )}

            {/* Controls */}

            <VoiceControls
                isJoined={isJoined}
                isMuted={isMuted}
                onJoin={joinVoice}
                onLeave={leaveVoice}
                onToggleMute={toggleMute}
            />
        </section>
    );
};

export default VoicePanel;