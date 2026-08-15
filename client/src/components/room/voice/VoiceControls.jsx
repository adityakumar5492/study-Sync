import {
    FaMicrophone,
    FaMicrophoneSlash,
    FaPhoneSlash,
} from "react-icons/fa";

const VoiceControls = ({
    isJoined,
    isMuted,
    onJoin,
    onLeave,
    onToggleMute,
}) => {
    if (!isJoined) {
        return (
            <button
                type="button"
                onClick={onJoin}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600"
            >
                <FaMicrophone size={14} />
                Join Voice
            </button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={onToggleMute}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isMuted
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
            >
                {isMuted ? (
                    <FaMicrophoneSlash size={14} />
                ) : (
                    <FaMicrophone size={14} />
                )}

                {isMuted ? "Unmute" : "Mute"}
            </button>

            <button
                type="button"
                onClick={onLeave}
                className="flex items-center justify-center rounded-lg bg-red-500/20 px-4 py-2.5 text-red-400 transition hover:bg-red-500/30"
                title="Leave voice"
                aria-label="Leave voice"
            >
                <FaPhoneSlash size={14} />
            </button>
        </div>
    );
};

export default VoiceControls;