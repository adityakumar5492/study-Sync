import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import MessageBubble from "./MessageBubble";

const demoMessages = [
  {
    id: 1,
    sender: "Alice Johnson",
    text: "Hey everyone! Ready to study?",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    text: "Yes, let's go through Chapter 1!",
    time: "10:31 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Bob Smith",
    text: "I have a question about process scheduling. Can someone explain?",
    time: "10:32 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "You",
    text: "Sure! Round Robin scheduling assigns each process a fixed time quantum...",
    time: "10:33 AM",
    isOwn: true,
  },
];

const ChatPanel = ({ roomId, initialMessages = demoMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();

    const text = input.trim();

    if (!text) return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Later:
    // socket.emit("send-message", {
    //   roomId,
    //   message: newMessage,
    // });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <h3 className="font-semibold text-white text-lg">
          Live Chat
        </h3>

        <p className="text-xs text-slate-400">
          Room: {roomId}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            sender={msg.sender}
            text={msg.text}
            time={msg.time}
            isOwn={msg.isOwn}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="border-t border-slate-800 p-4 flex gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 transition px-5 py-3 rounded-xl text-white"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;