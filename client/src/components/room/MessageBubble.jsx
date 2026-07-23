import { FaUserCircle } from "react-icons/fa";

const MessageBubble = ({
  sender,
  text,
  time,
  isOwn,
  avatar,
}) => {
  return (
    <div
      className={`flex gap-3 mb-4 ${
        isOwn ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      {avatar ? (
        <img
          src={avatar}
          alt={sender}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1"
        />
      ) : (
        <FaUserCircle className="text-4xl text-slate-500 flex-shrink-0 mt-1" />
      )}

      {/* Message */}
      <div
        className={`flex flex-col max-w-[75%] ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        {/* Sender & Time */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-slate-400">
            {isOwn ? "You" : sender}
          </span>

          <span className="text-xs text-slate-500">
            {time}
          </span>
        </div>

        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-6 break-words ${
            isOwn
              ? "bg-green-500 text-white rounded-tr-md"
              : "bg-slate-800 text-slate-200 rounded-tl-md"
          }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;