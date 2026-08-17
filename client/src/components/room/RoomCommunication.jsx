import { useState } from "react";

import {
    FaUsers,
    FaComments,
    FaMicrophone,
    FaPen,
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

    // Drawing permission
    drawingPermission,
    onDrawingPermissionChange,
}) => {
    const [activePanel, setActivePanel] =
        useState("participants");

    // ===========================
    // Check Current User
    // ===========================

    const currentUserId =
        currentUser?._id?.toString();

    const canDraw =
        isHost ||
        drawingPermission.mode === "everyone" ||
        (
            drawingPermission.mode ===
                "selected" &&
            drawingPermission.allowedUsers.includes(
                currentUserId
            )
        );

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-950">

            {/* ===========================
                Communication Tabs
            =========================== */}

            <div className="grid shrink-0 grid-cols-4 gap-px border-b border-slate-800/80 bg-slate-900/95 px-1 pt-1 shadow-lg shadow-black/10">

                {/* Participants */}

                <button
                    type="button"
                    onClick={() =>
                        setActivePanel(
                            "participants"
                        )
                    }
                    className={`flex min-w-0 items-center justify-center gap-1.5 rounded-t-lg px-1 py-3 text-[11px] font-semibold transition-colors sm:text-xs ${
                        activePanel ===
                        "participants"
                            ? "bg-slate-800 text-green-400 shadow-sm"
                            : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                    }`}
                >
                    <FaUsers size={12} />
                    Participants
                </button>

                {/* Chat */}

                <button
                    type="button"
                    onClick={() =>
                        setActivePanel("chat")
                    }
                    className={`flex min-w-0 items-center justify-center gap-1.5 rounded-t-lg px-1 py-3 text-[11px] font-semibold transition-colors sm:text-xs ${
                        activePanel === "chat"
                            ? "bg-slate-800 text-green-400 shadow-sm"
                            : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                    }`}
                >
                    <FaComments size={12} />
                    Chat
                </button>

                {/* Voice */}

                <button
                    type="button"
                    onClick={() =>
                        setActivePanel("voice")
                    }
                    className={`flex min-w-0 items-center justify-center gap-1.5 rounded-t-lg px-1 py-3 text-[11px] font-semibold transition-colors sm:text-xs ${
                        activePanel === "voice"
                            ? "bg-slate-800 text-green-400 shadow-sm"
                            : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                    }`}
                >
                    <FaMicrophone size={12} />
                    Voice
                </button>

                {/* Drawing */}

                <button
                    type="button"
                    onClick={() =>
                        setActivePanel("drawing")
                    }
                    className={`flex min-w-0 items-center justify-center gap-1.5 rounded-t-lg px-1 py-3 text-[11px] font-semibold transition-colors sm:text-xs ${
                        activePanel === "drawing"
                            ? "bg-slate-800 text-green-400 shadow-sm"
                            : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                    }`}
                >
                    <FaPen size={11} />
                    Drawing
                </button>

            </div>

            {/* ===========================
                Active Panel
            =========================== */}

            <div className="min-h-0 flex-1 overflow-hidden bg-slate-900/70">

                {/* Participants */}

                {activePanel ===
                    "participants" && (
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

                {/* Chat */}

                {activePanel === "chat" && (
                    <ChatPanel
                        roomId={roomId}
                        isHost={isHost}
                        isMember={isMember}
                    />
                )}

                {/* Voice */}

                {activePanel === "voice" && (
                    <VoicePanel
                        roomId={roomId}
                        currentUser={
                            currentUser
                        }
                    />
                )}

                {/* Drawing */}

                {activePanel === "drawing" && (
                    <div className="h-full overflow-y-auto p-3 sm:p-4 lg:p-5">

                        <div className="mb-5 rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 shadow-sm">
                            <h3 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                                Drawing Access
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Choose who can annotate
                                the PDF.
                            </p>
                        </div>

                        {/* ===========================
                            Host Controls
                        =========================== */}

                        {isHost && (
                            <div className="space-y-2 rounded-xl border border-slate-800/80 bg-slate-950/40 p-2">

                                {/* Host Only */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDrawingPermissionChange(
                                            {
                                                mode: "none",
                                                allowedUsers:
                                                    [],
                                            }
                                        )
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left text-sm text-slate-300 transition-colors hover:border-slate-700/70 hover:bg-slate-800/80 hover:text-white"
                                >
                                    <span
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                                            drawingPermission.mode ===
                                            "none"
                                                ? "border-green-500"
                                                : "border-slate-600"
                                        }`}
                                    >
                                        {drawingPermission.mode ===
                                            "none" && (
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                        )}
                                    </span>

                                    Host Only
                                </button>

                                {/* Everyone */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDrawingPermissionChange(
                                            {
                                                mode: "everyone",
                                                allowedUsers:
                                                    [],
                                            }
                                        )
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left text-sm text-slate-300 transition-colors hover:border-slate-700/70 hover:bg-slate-800/80 hover:text-white"
                                >
                                    <span
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                                            drawingPermission.mode ===
                                            "everyone"
                                                ? "border-green-500"
                                                : "border-slate-600"
                                        }`}
                                    >
                                        {drawingPermission.mode ===
                                            "everyone" && (
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                        )}
                                    </span>

                                    Everyone
                                </button>

                                {/* Selected Users */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDrawingPermissionChange(
                                            {
                                                mode: "selected",
                                                allowedUsers:
                                                    drawingPermission.allowedUsers ||
                                                    [],
                                            }
                                        )
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left text-sm text-slate-300 transition-colors hover:border-slate-700/70 hover:bg-slate-800/80 hover:text-white"
                                >
                                    <span
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                                            drawingPermission.mode ===
                                            "selected"
                                                ? "border-green-500"
                                                : "border-slate-600"
                                        }`}
                                    >
                                        {drawingPermission.mode ===
                                            "selected" && (
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                        )}
                                    </span>

                                    Selected Users
                                </button>

                                {/* ===========================
                                    User List
                                =========================== */}

                                {drawingPermission.mode ===
                                    "selected" && (
                                    <div className="mt-4 border-t border-slate-800/80 pt-4">

                                        <p className="mb-2 text-xs font-semibold text-slate-400">
                                            Select users:
                                        </p>

                                        <div className="max-h-[min(18rem,45vh)] space-y-1 overflow-y-auto pr-1">

                                            {(
                                                room?.members ||
                                                []
                                            ).map(
                                                (
                                                    member
                                                ) => {
                                                    const userId =
                                                        member?._id?.toString();

                                                    if (
                                                        !userId
                                                    ) {
                                                        return null;
                                                    }

                                                    const selected =
                                                        drawingPermission.allowedUsers.includes(
                                                            userId
                                                        );

                                                    const name =
                                                        member.name ||
                                                        member.username ||
                                                        member.email ||
                                                        "User";

                                                    return (
                                                        <button
                                                            key={
                                                                userId
                                                            }
                                                            type="button"
                                                            onClick={() => {
                                                                const current =
                                                                    drawingPermission.allowedUsers ||
                                                                    [];

                                                                const next =
                                                                    selected
                                                                        ? current.filter(
                                                                              (
                                                                                  id
                                                                              ) =>
                                                                                  id !==
                                                                                  userId
                                                                          )
                                                                        : [
                                                                              ...current,
                                                                              userId,
                                                                          ];

                                                                onDrawingPermissionChange(
                                                                    {
                                                                        mode: "selected",
                                                                        allowedUsers:
                                                                            next,
                                                                    }
                                                                );
                                                            }}
                                                            className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left text-sm text-slate-300 transition-colors hover:border-slate-700/70 hover:bg-slate-800/80 hover:text-white"
                                                        >
                                                            <span
                                                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                                                    selected
                                                                        ? "border-green-500 bg-green-500"
                                                                        : "border-slate-600"
                                                                }`}
                                                            >
                                                                {selected && (
                                                                    <span className="text-[10px] font-bold text-white">
                                                                        ✓
                                                                    </span>
                                                                )}
                                                            </span>

                                                            <span className="truncate">
                                                                {
                                                                    name
                                                                }
                                                            </span>
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===========================
                            Member Status
                        =========================== */}

                        {!isHost && (
                            <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 p-4 shadow-lg shadow-black/10 sm:p-5">

                                <div
                                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${
                                        canDraw
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-slate-800 text-slate-500"
                                    }`}
                                >
                                    <FaPen size={14} />
                                </div>

                                <p className="text-sm font-semibold text-white">
                                    {canDraw
                                        ? "Drawing allowed"
                                        : "Drawing restricted"}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    {canDraw
                                        ? "The host has allowed you to annotate the PDF."
                                        : "The host has not allowed you to annotate the PDF."}
                                </p>
                            </div>
                        )}

                    </div>
                )}

            </div>
        </div>
    );
};

export default RoomCommunication;