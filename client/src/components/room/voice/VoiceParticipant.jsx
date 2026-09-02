import {
    FaMicrophone,
    FaMicrophoneSlash,
} from "react-icons/fa";

const VoiceParticipant = ({
    participant,
    currentUser,
    isSpeaking = false,
    connectionState = "connected",
}) => {
    const isCurrentUser =
        participant._id?.toString() ===
        currentUser?._id?.toString();

    const avatarUrl =
        participant.avatar
            ? participant.avatar.startsWith("http")
                ? participant.avatar
                : `${import.meta.env.VITE_API_URL}${participant.avatar}`
            : null;

    const isConnecting =
        !isCurrentUser &&
        ["connecting", "disconnected"].includes(
            connectionState
        );

    const isConnectionFailed =
        !isCurrentUser &&
        connectionState === "failed";

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border p-3 ${
                isSpeaking
                    ? "border-emerald-400/40 bg-emerald-400/[0.08]"
                    : isConnectionFailed
                    ? "border-red-400/20 bg-red-400/[0.05]"
                    : "border-white/[0.06] bg-white/[0.035] hover:bg-white/[0.055]"
            }`}
        >
            {/* Static speaking highlight */}
            {isSpeaking && (
                <div className="pointer-events-none absolute inset-0 bg-emerald-400/[0.025]" />
            )}

            <div className="relative flex items-center gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                    {/* Static speaking ring */}
                    {isSpeaking && (
                        <div className="absolute -inset-1 rounded-full border border-emerald-400/50" />
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

                    {/* Online / speaking indicator */}
                    <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 ${
                            isSpeaking
                                ? "bg-emerald-400"
                                : isConnectionFailed
                                ? "bg-red-400"
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
                        {isCurrentUser &&
                        participant.muted ? (
                            <span className="text-[10px] font-medium text-red-400">
                                Muted
                            </span>
                        ) : isSpeaking ? (
                            <span className="text-[10px] font-medium text-emerald-400">
                                Speaking
                            </span>
                        ) : isConnectionFailed ? (
                            <span className="text-[10px] font-medium text-red-400">
                                Connection failed
                            </span>
                        ) : isConnecting ? (
                            <span className="text-[10px] font-medium text-amber-400">
                                Connecting...
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

                {/* Static voice indicator */}
                {isSpeaking && (
                    <div
                        className="flex h-8 items-center gap-[3px]"
                        aria-label="Speaking"
                    >
                        {[7, 11, 15, 10, 14, 9, 6].map(
                            (height, index) => (
                                <span
                                    key={index}
                                    style={{
                                        height: `${height}px`,
                                    }}
                                    className="w-[3px] rounded-full bg-emerald-400/80"
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
        </div>
    );
};

export default VoiceParticipant;