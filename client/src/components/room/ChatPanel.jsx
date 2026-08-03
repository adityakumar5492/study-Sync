import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAppSelector } from "../../redux/hooks";
import socket from "../../socket/socket";

import MessageBubble from "./MessageBubble";

const ChatPanel = ({ roomId }) => {
    const { user } = useAppSelector((state) => state.auth);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        const handleNewMessage = (message) => {
            setMessages((prev) => [...prev, message]);
        };

        socket.on("chat:new-message", handleNewMessage);

        return () => {
            socket.off("chat:new-message", handleNewMessage);
        };
    }, []);

    const handleSend = (e) => {
        e.preventDefault();

        const text = input.trim();

        if (!text) return;

        if (!socket.connected) {
            return toast.error("Socket disconnected.");
        }

        socket.emit("chat:send-message", {
            roomId,
            sender: user?.name,
            senderId: user?._id,
            avatar: user?.avatar,
            message: text,
        });

        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    return (
        <div className="flex flex-1 flex-col">

            {/* Header */}

            <div className="border-b border-slate-800 p-4">

                <h3 className="text-lg font-semibold text-white">
                    Live Chat
                </h3>

                <p className="text-xs text-slate-400">
                    Room: {roomId}
                </p>

            </div>

            {/* Messages */}

            <div className="flex-1 space-y-4 overflow-y-auto p-4">

                {messages.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                        No messages yet.
                        <br />
                        Start the discussion.
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble
                            key={msg._id || `${msg.sender}-${msg.createdAt}-${index}`}
                            sender={msg.sender}
                            text={msg.message}
                            avatar={msg.avatar}
                            time={
                                msg.createdAt
                                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : ""
                            }
                            isOwn={msg.senderId === user?._id}
                        />
                    ))
                )}

                <div ref={messagesEndRef} />

            </div>

            {/* Input */}

            <form
                onSubmit={handleSend}
                className="flex gap-3 border-t border-slate-800 p-4"
            >

                <input
                    type="text"
                    value={input}
                    disabled={!socket.connected}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                        socket.connected
                            ? "Type a message..."
                            : "Connecting..."
                    }
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:border-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                    type="submit"
                    disabled={!socket.connected || !input.trim()}
                    className="rounded-xl bg-green-500 px-5 py-3 text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-slate-700"
                    aria-label="Send message"
                >
                    <FaPaperPlane />
                </button>

            </form>

        </div>
    );
};

export default ChatPanel;