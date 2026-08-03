import { useState } from "react";
import {
    FaArrowLeft,
    FaEllipsisV,
    FaLock,
    FaGlobe,
    FaUsers,
    FaCopy,
    FaTrash,
    FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppDispatch } from "../../redux/hooks";
import { deleteRoomThunk, leaveRoomThunk } from "../../redux/room/roomThunk";

const RoomHeader = ({ room, currentUser }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [menuOpen, setMenuOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [leaving, setLeaving] = useState(false);

    if (!room) return null;

    const hostId =
    typeof room.host === "object"
        ? room.host?._id?.toString()
        : room.host?.toString();

const currentUserId = currentUser?._id?.toString();

const isHost = hostId === currentUserId;

    const isMember = room.members?.some((member) => {
        const memberId =
            typeof member === "object" ? member._id?.toString() : member?.toString();
        return memberId === currentUserId;
    });

    const copyInviteCode = async () => {
        try {
            await navigator.clipboard.writeText(room.inviteCode);
            toast.success("Invite code copied.");
        } catch {
            toast.error("Failed to copy invite code.");
        }
    };

    const handleDeleteRoom = async () => {
        setMenuOpen(false);

        const confirmed = window.confirm(
            `Delete "${room.name}"? This cannot be undone — all members will lose access immediately.`
        );

        if (!confirmed) return;

        setDeleting(true);

        try {
            await dispatch(deleteRoomThunk(room._id)).unwrap();
            toast.success("Room deleted.");
            navigate("/rooms");
        } catch (err) {
            toast.error(
                typeof err === "string" ? err : "Failed to delete room."
            );
            setDeleting(false);
        }
    };

    const handleLeaveRoom = async () => {
        setMenuOpen(false);

        const confirmed = window.confirm(
            `Leave "${room.name}"? You'll need the invite code to rejoin.`
        );

        if (!confirmed) return;

        setLeaving(true);

        try {
            await dispatch(leaveRoomThunk(room._id)).unwrap();
            toast.success("You left the room.");
            navigate("/rooms");
        } catch (err) {
            toast.error(
                typeof err === "string" ? err : "Failed to leave room."
            );
            setLeaving(false);
        }
    };

    return (
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
            <div className="flex items-center gap-4">
                <Link
                    to="/rooms"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                    <FaArrowLeft size={18} />
                </Link>

                <div>
                    <h1 className="text-xl font-bold text-white">
                        {room.name}
                    </h1>

                    <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                            <FaUsers />
                            {room.members?.length || 0} Students
                        </span>

                        <span className="flex items-center gap-1">
                            {room.isPrivate ? (
                                <>
                                    <FaLock />
                                    Private
                                </>
                            ) : (
                                <>
                                    <FaGlobe />
                                    Public
                                </>
                            )}
                        </span>
                    </div>

                    {room.isPrivate && isHost && (
                        <div className="mt-3 flex items-center gap-3">
                            <span className="rounded-lg bg-slate-800 px-3 py-2 font-mono text-green-400">
                                {room.inviteCode}
                            </span>

                            <button
                                onClick={copyInviteCode}
                                className="flex items-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600"
                            >
                                <FaCopy />
                                Copy
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Room options menu */}
            <div className="relative">
                <button
                    onClick={() => setMenuOpen((open) => !open)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    aria-label="Room options"
                    aria-expanded={menuOpen}
                >
                    <FaEllipsisV />
                </button>

                {menuOpen && (
                    <>
                        {/* Click-outside catcher */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setMenuOpen(false)}
                        />

                        <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
                            {isHost && (
                                <button
                                    onClick={handleDeleteRoom}
                                    disabled={deleting}
                                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-400 transition hover:bg-slate-800 disabled:opacity-50"
                                >
                                    <FaTrash />
                                    {deleting ? "Deleting..." : "Delete Room"}
                                </button>
                            )}

                            {!isHost && isMember && (
                                <button
                                    onClick={handleLeaveRoom}
                                    disabled={leaving}
                                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-yellow-400 transition hover:bg-slate-800 disabled:opacity-50"
                                >
                                    <FaSignOutAlt />
                                    {leaving ? "Leaving..." : "Leave Room"}
                                </button>
                            )}

                            {!isHost && !isMember && (
                                <p className="px-4 py-3 text-sm text-slate-500">
                                    No actions available.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default RoomHeader;