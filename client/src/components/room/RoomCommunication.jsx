import { useState } from "react";
import {
    FaUsers,
    FaComments,
    FaMicrophone,
} from "react-icons/fa";

import Participants from "./Participants";
import ChatPanel from "./ChatPanel";
import VoicePanel from "./voice/VoicePanel";

const RoomCommunication = ({
    room,
    roomId,
    currentUser,
    onlineUsers,
    isHost,
    isMember,
    onRemoveMember,
}) => {
    const [activePanel, setActivePanel] =
        useState("participants");

    return (
        <div className="flex h-full min-h-0 flex-col bg-slate-900">

            {/* ===========================
                Communication Tabs
            =========================== */}

            <div className="grid shrink-0 grid-cols-3 border-b border-slate-800 bg-slate-950">

                <button
                    type="button"
                    onClick={() =>
                        setActivePanel("participants")
                    }
                    className={`flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-medium transition ${
                        activePanel === "participants"
                            ? "border-b-2 border-green-500 text-green-400"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                    <FaUsers size={12} />
                    Participants
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setActivePanel("chat")
                    }
                    className={`flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-medium transition ${
                        activePanel === "chat"
                            ? "border-b-2 border-green-500 text-green-400"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                    <FaComments size={12} />
                    Chat
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setActivePanel("voice")
                    }
                    className={`flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-medium transition ${
                        activePanel === "voice"
                            ? "border-b-2 border-green-500 text-green-400"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                    <FaMicrophone size={12} />
                    Voice
                </button>

            </div>

            {/* ===========================
                Active Panel
            =========================== */}

            <div className="min-h-0 flex-1 overflow-hidden">

                {activePanel === "participants" && (
                    <Participants
                        room={room}
                        roomId={roomId}
                        participants={
                            room.members || []
                        }
                        onlineUsers={onlineUsers}
                        onRemoveMember={
                            onRemoveMember
                        }
                    />
                )}

                {activePanel === "chat" && (
                    <ChatPanel
                        roomId={roomId}
                        isHost={isHost}
                        isMember={isMember}
                    />
                )}

                {activePanel === "voice" && (
                    <VoicePanel
                        roomId={roomId}
                        currentUser={currentUser}
                    />
                )}

            </div>
        </div>
    );
};

export default RoomCommunication;