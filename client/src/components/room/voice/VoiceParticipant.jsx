import {
    FaMicrophone,
    FaMicrophoneSlash,
} from "react-icons/fa";

const VoiceParticipant = ({
    participant,
    currentUser,
    isSpeaking = false,
}) => {
    const isCurrentUser =
        participant._id?.toString() ===
        currentUser?._id?.toString();

    return (
        <div
            className={`flex items-center gap-2 rounded-lg px-2.5 py-2 transition ${
                isSpeaking
                    ? "bg-green-500/10 ring-1 ring-green-500/40"
                    : "bg-slate-800"
            }`}
        >
            {/* Avatar */}

            <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700 text-xs font-semibold text-white ${
                    isSpeaking
                        ? "ring-2 ring-green-400"
                        : ""
                }`}
            >
                {participant.avatar ? (
                    <img
                        src={
                            participant.avatar.startsWith(
                                "http"
                            )
                                ? participant.avatar
                                : `http://localhost:5000${participant.avatar}`
                        }
                        alt={participant.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    participant.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"
                )}
            </div>

            {/* Name */}

            <span className="min-w-0 flex-1 truncate text-xs text-slate-200">
                {isCurrentUser
                    ? "You"
                    : participant.name}
            </span>

            {/* Speaking */}

            {isSpeaking && (
                <span className="text-[10px] font-medium text-green-400">
                    Speaking
                </span>
            )}

            {/* Microphone */}

            {participant.muted ? (
                <FaMicrophoneSlash
                    size={12}
                    className="shrink-0 text-red-400"
                />
            ) : (
                <FaMicrophone
                    size={12}
                    className={`shrink-0 ${
                        isSpeaking
                            ? "text-green-400"
                            : "text-slate-400"
                    }`}
                />
            )}
        </div>
    );
};

export default VoiceParticipant;