import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAppSelector } from "../../redux/hooks";
import socket from "../../socket/socket";
import { getRoomMessages } from "../../api/room.api";

import MessageBubble from "./MessageBubble";

const ChatPanel = ({ roomId, isHost = false,isMember = false, }) => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typingUser, setTypingUser] = useState(null);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // ===========================
    // Scroll to latest message
    // ===========================

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "auto",
        });
    }, [messages]);

    // ===========================
    // Load messages + socket
    // ===========================

    useEffect(() => {
        if (!roomId || (!isHost && !isMember)) return;

        const loadMessages = async () => {
            try {
                const { data } =
                    await getRoomMessages(roomId);

                setMessages(data.messages || []);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                        "Failed to load chat history"
                );
            }
        };

        loadMessages();

        const handleNewMessage = (message) => {
            setMessages((prev) => [
                ...prev,
                message,
            ]);
        };

        const handleMessageDeleted = ({
            messageId,
        }) => {
            setMessages((prev) =>
                prev.filter(
                    (message) =>
                        message._id !== messageId
                )
            );
        };

        const handleUserTyping = ({ user }) => {
            setTypingUser(user);
        };

        const handleUserStopTyping = () => {
            setTypingUser(null);
        };

        socket.on(
            "chat:new-message",
            handleNewMessage
        );

        socket.on(
            "chat:message-deleted",
            handleMessageDeleted
        );

        socket.on(
            "chat:user-typing",
            handleUserTyping
        );

        socket.on(
            "chat:user-stop-typing",
            handleUserStopTyping
        );

        return () => {
            socket.off(
                "chat:new-message",
                handleNewMessage
            );

            socket.off(
                "chat:message-deleted",
                handleMessageDeleted
            );

            socket.off(
                "chat:user-typing",
                handleUserTyping
            );

            socket.off(
                "chat:user-stop-typing",
                handleUserStopTyping
            );

            if (typingTimeoutRef.current) {
                clearTimeout(
                    typingTimeoutRef.current
                );
            }
        };
    }, [roomId]);

    // ===========================
    // Delete Message
    // ===========================

    const handleDeleteMessage = (messageId) => {
        
        if (
            !messageId ||
            !roomId ||
            !user?._id
        ) {
            return;
        }

        if (!socket.connected) {
            toast.error("Socket disconnected.");
            return;
        }

        socket.emit(
            "chat:delete-message",
            {
                roomId,
                messageId,
                senderId: user._id,
            }
        );
    };

    // ===========================
    // Typing
    // ===========================

    const handleTyping = (e) => {
        const value = e.target.value;

        setInput(value);

        if (!socket.connected || !roomId) {
            return;
        }

        if (!value.trim()) {
            socket.emit(
                "chat:stop-typing",
                {
                    roomId,
                    user: user?.name,
                }
            );

            return;
        }

        socket.emit(
            "chat:typing",
            {
                roomId,
                user: user?.name,
            }
        );

        if (typingTimeoutRef.current) {
            clearTimeout(
                typingTimeoutRef.current
            );
        }

        typingTimeoutRef.current =
            setTimeout(() => {
                socket.emit(
                    "chat:stop-typing",
                    {
                        roomId,
                        user: user?.name,
                    }
                );
            }, 1500);
    };

    // ===========================
    // Send message
    // ===========================

    const handleSend = (e) => {
        e.preventDefault();

        const text = input.trim();

        if (!text) return;

        if (!socket.connected) {
            toast.error("Socket disconnected.");
            return;
        }

        socket.emit(
            "chat:send-message",
            {
                roomId,
                sender: user?.name,
                senderId: user?._id,
                avatar: user?.avatar,
                message: text,
            }
        );

        socket.emit(
            "chat:stop-typing",
            {
                roomId,
                user: user?.name,
            }
        );

        if (typingTimeoutRef.current) {
            clearTimeout(
                typingTimeoutRef.current
            );
        }

        setInput("");
    };

    const handleKeyDown = (e) => {
        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {
            e.preventDefault();
            handleSend(e);
        }
    };

    return (
        <div className="flex h-full min-h-0 flex-col">

            {/* Chat Header */}

            <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-slate-800 px-4">
                <div>
                    <h3 className="text-sm font-semibold text-white">
                        Live Chat
                    </h3>

                    <p className="text-[11px] text-slate-500">
                        Study together
                    </p>
                </div>

                <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-400">
                    Live
                </span>
            </div>

            {/* Messages */}

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">

                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center px-4 text-center">
                        <div className="text-sm text-slate-500">
                            <p>No messages yet.</p>

                            <p className="mt-1 text-xs">
                                Start the discussion.
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map(
                        (msg, index) => {
                            const messageSenderId =
                                msg.senderId?._id ||
                                msg.senderId ||
                                msg.sender?._id;

                            const isOwn =
                                messageSenderId?.toString() ===
                                user?._id?.toString();

                            const canDelete =
                                isHost || isOwn;

                            return (
                                <MessageBubble
                                    key={
                                        msg._id ||
                                        `${msg.sender}-${msg.createdAt}-${index}`
                                    }
                                    sender={
                                        msg.sender?.name ||
                                        msg.sender
                                    }
                                    text={msg.message}
                                    avatar={
                                        msg.avatar ||
                                        msg.sender?.avatar
                                    }
                                    time={
                                        msg.createdAt
                                            ? new Date(
                                                  msg.createdAt
                                              ).toLocaleTimeString(
                                                  [],
                                                  {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  }
                                              )
                                            : ""
                                    }
                                    isOwn={isOwn}
                                    canDelete={
                                        canDelete
                                    }
                                    onDelete={() =>
                                        handleDeleteMessage(
                                            msg._id
                                        )
                                    }
                                />
                            );
                        }
                    )
                )}

                {/* Typing indicator */}

                {typingUser &&
                    typingUser !== user?.name && (
                        <div className="px-2 text-xs text-slate-500">
                            {typingUser} is typing...
                        </div>
                    )}

                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}

            <form
                onSubmit={handleSend}
                className="flex shrink-0 gap-2 border-t border-slate-800 p-3"
            >
                <input
                    type="text"
                    value={input}
                    disabled={!socket.connected}
                    onKeyDown={handleKeyDown}
                    onChange={handleTyping}
                    placeholder={
                        socket.connected
                            ? "Type a message..."
                            : "Connecting..."
                    }
                    className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-400 outline-none transition focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                    type="submit"
                    disabled={
                        !socket.connected ||
                        !input.trim()
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-slate-700"
                    aria-label="Send message"
                >
                    <FaPaperPlane size={14} />
                </button>
            </form>
        </div>
    );
};

export default ChatPanel;