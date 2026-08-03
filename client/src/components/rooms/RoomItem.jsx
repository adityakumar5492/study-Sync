import {
    FaUsers,
    FaLock,
    FaGlobe,
    FaArrowRight,
} from "react-icons/fa";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import JoinPrivateRoomModal from "./JoinPrivateRoomModal";
import { useAppSelector } from "../../redux/hooks";

const RoomItem = ({ room }) => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const [showJoinModal, setShowJoinModal] = useState(false);

    // ✅ Check if current user is host
    const hostId = typeof room.host === "object" 
        ? room.host?._id?.toString() 
        : room.host?.toString();
    const currentUserId = user?._id?.toString();
    const isHost = hostId === currentUserId;

    // ✅ Check if current user is a member
    const isMember = room.members?.some(
        (member) => {
            const memberId = typeof member === "object" 
                ? member._id?.toString() 
                : member?.toString();
            return memberId === currentUserId;
        }
    );

    const handleOpen = () => {
        // ✅ Private room + user is NOT host/member → open join modal
        if (room.isPrivate && !isHost && !isMember) {
            setShowJoinModal(true);
            return;
        }

        // ✅ Otherwise (public room, or user is already host/member) → navigate directly
        navigate(`/room/${room._id}`);
    };

    return (
        <>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-green-500 hover:-translate-y-1">

                <div className="flex justify-between items-start gap-6">

                    <div className="flex-1">

                        <div className="flex items-center gap-3">

                            <h2 className="text-xl font-semibold">
                                {room.name}
                            </h2>

                            {room.isPrivate ? (
                                <FaLock
                                    className="text-yellow-400"
                                    title="Private Room"
                                />
                            ) : (
                                <FaGlobe
                                    className="text-green-400"
                                    title="Public Room"
                                />
                            )}

                        </div>

                        <p className="text-slate-400 mt-2">
                            {room.description || "No description provided."}
                        </p>

                        <div className="flex flex-wrap items-center gap-5 mt-5 text-sm">

                            <span className="flex items-center gap-2 text-slate-400">
                                <FaUsers />
                                {room.members?.length || 0} Members
                            </span>

                            <span
                                className={`font-medium ${
                                    room.isActive
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >
                                ● {room.isActive ? "Active" : "Inactive"}
                            </span>

                            <span className="text-slate-500">
                                Host: {room.host?.name || "Unknown"}
                            </span>

                        </div>

                    </div>

                    <button
                        onClick={handleOpen}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 transition px-5 py-3 rounded-xl font-medium"
                    >
                        {/* ✅ Show "Join" for private rooms the user isn't in, else "Open" */}
                        {room.isPrivate && !isHost && !isMember ? "Join" : "Open"}

                        <FaArrowRight />
                    </button>

                </div>

            </div>

            <JoinPrivateRoomModal
                isOpen={showJoinModal}
                room={room}
                onClose={() => setShowJoinModal(false)}
            />
        </>
    );
};

export default RoomItem;

