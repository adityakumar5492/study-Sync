import { useEffect, useState } from "react";
import { FaUserCircle, FaCrown } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAppSelector } from "../../redux/hooks";
import socket from "../../socket/socket";

const Participants = ({ room, roomId, participants = [] }) => {
    const { user } = useAppSelector((state) => state.auth);

    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (!roomId || !user) return;

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("room:join", {
            roomId,
            user,
        });

        const handleOnlineUsers = ({ users }) => {
            setOnlineUsers(users || []);
        };

        const handleSocketError = (message) => {
            toast.error(message || "Socket connection error.");
        };

        socket.on("room:online-users", handleOnlineUsers);
        socket.on("room:error", handleSocketError);

        return () => {
            socket.emit("room:leave", {
                roomId,
                user,
            });

            socket.off("room:online-users", handleOnlineUsers);
            socket.off("room:error", handleSocketError);
        };
    }, [roomId, user]);

    const isOnline = (participantId) =>
        onlineUsers.some((u) => u._id === participantId);

    return (
        <div className="border-b border-slate-800 p-4">

            <div className="mb-4 flex items-center justify-between">

                <div>
                    <h3 className="text-lg font-semibold text-white">
                        Participants
                    </h3>

                    <p className="text-xs text-slate-500">
                        Room ID: {roomId}
                    </p>
                </div>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                    {onlineUsers.length} Online
                </span>

            </div>

            <div className="max-h-60 space-y-2 overflow-y-auto">

                {participants.length === 0 ? (
                    <div className="py-6 text-center text-sm text-slate-400">
                        No participants found.
                    </div>
                ) : (
                    participants.map((participant) => {
                        const online = isOnline(participant._id);

                        return (
                            <div
                                key={participant._id}
                                className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-slate-800"
                            >
                                <div className="relative">

                                    <FaUserCircle className="text-3xl text-slate-500" />

                                    <span
                                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 ${
                                            online
                                                ? "bg-green-500"
                                                : "bg-slate-600"
                                        }`}
                                    />

                                </div>

                                <div className="flex-1">

                                    <p className="flex items-center gap-2 text-sm font-medium text-white">

                                        {participant.name}

                                        {participant._id === room?.host?._id && (
                                            <FaCrown className="text-xs text-yellow-500" />
                                        )}

                                        {participant._id === user?._id && (
                                            <span className="text-xs text-green-400">
                                                (You)
                                            </span>
                                        )}

                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {online ? "Online" : "Offline"}
                                    </p>

                                </div>

                                {online && (
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                )}
                            </div>
                        );
                    })
                )}

            </div>

        </div>
    );
};

export default Participants;