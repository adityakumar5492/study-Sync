import { FaUserCircle } from "react-icons/fa";

const MessageBubble = ({
    sender,
    text,
    time,
    isOwn = false,
    avatar,
}) => {
    return (
        <div
            className={`mb-4 flex gap-3 ${
                isOwn ? "flex-row-reverse" : ""
            }`}
        >
            {/* Avatar */}

            {avatar ? (
                <img
                    src={avatar}
                    alt={`${sender}'s avatar`}
                    className="mt-1 h-10 w-10 flex-shrink-0 rounded-full object-cover"
                />
            ) : (
                <FaUserCircle className="mt-1 text-4xl text-slate-500 flex-shrink-0" />
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
                        {isOwn ? "You" : sender || "Unknown User"}
                    </span>

                    <span className="text-xs text-slate-500">
                        {time || ""}
                    </span>

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