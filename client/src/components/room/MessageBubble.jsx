import {
    FaTrash,
    FaUserCircle,
} from "react-icons/fa";

const MessageBubble = ({
    sender,
    text,
    time,
    isOwn = false,
    avatar,
    canDelete = false,
    onDelete,
}) => {
    const avatarUrl = avatar
        ? avatar.startsWith("http")
            ? avatar
            : `http://localhost:5000${avatar}`
        : null;

    return (
        <div
            className={`group mb-4 flex gap-3 ${
                isOwn ? "flex-row-reverse" : ""
            }`}
        >
            {/* Avatar */}

            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={`${sender}'s avatar`}
                    className="mt-1 h-10 w-10 flex-shrink-0 rounded-full object-cover"
                />
            ) : (
                <FaUserCircle className="mt-1 flex-shrink-0 text-4xl text-slate-500" />
            )}

            {/* Message */}

            <div
                className={`flex max-w-[75%] flex-col ${
                    isOwn ? "items-end" : "items-start"
                }`}
            >
                {/* Sender & Time */}

                <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-400">
                        {isOwn
                            ? "You"
                            : sender || "Unknown User"}
                    </span>

                    <span className="text-xs text-slate-500">
                        {time || ""}
                    </span>

                    {/* Delete */}

                    {canDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-slate-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                            title="Delete message"
                            aria-label="Delete message"
                        >
                            <FaTrash size={10} />
                        </button>
                    )}
                </div>

                {/* Bubble */}

                <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 break-words whitespace-pre-wrap ${
                        isOwn
                            ? "rounded-tr-md bg-green-500 text-white"
                            : "rounded-tl-md bg-slate-800 text-slate-200"
                    }`}
                >
                    {text}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;