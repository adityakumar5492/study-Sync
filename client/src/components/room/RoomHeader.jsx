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
import {
    deleteRoomThunk,
    leaveRoomThunk,
} from "../../redux/room/roomThunk";

const RoomHeader = ({ room, currentUser }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [menuOpen, setMenuOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [leaving, setLeaving] = useState(false);

    if (!room) return null;

    // ===========================
    // User / Host
    // ===========================

    const hostId =
        typeof room.host === "object"
            ? room.host?._id?.toString()
            : room.host?.toString();

    const currentUserId =
        currentUser?._id?.toString();

    const isHost =
        hostId === currentUserId;

    const isMember =
        room.members?.some((member) => {
            const memberId =
                typeof member === "object"
                    ? member._id?.toString()
                    : member?.toString();

            return memberId === currentUserId;
        });

    // ===========================
    // Copy Invite Code
    // ===========================

    const copyInviteCode = async () => {
        try {
            await navigator.clipboard.writeText(
                room.inviteCode
            );

            toast.success(
                "Invite code copied."
            );
        } catch {
            toast.error(
                "Failed to copy invite code."
            );
        }
    };

    // ===========================
    // Delete Room
    // ===========================

        const handleDeleteRoom = async () => {
            setMenuOpen(false);

            const confirmed = window.confirm(
                `Delete "${room.name}"? This cannot be undone — all members will lose access immediately.`
            );

            if (!confirmed) return;

            setDeleting(true);

            try {
                await dispatch(
                    deleteRoomThunk(room._id)
                ).unwrap();

                toast.success(
                    "Room deleted."
                );

                navigate("/rooms");
            } catch (err) {
                toast.error(
                    typeof err === "string"
                        ? err
                        : err?.message ||
                            "Failed to delete room."
                );

                setDeleting(false);
            }
        };

        // ===========================
        // Leave Room
        // ===========================

        const handleLeaveRoom = async () => {
        setMenuOpen(false);

        // Public room → no confirmation
        if (!room.isPrivate) {
            setLeaving(true);

            try {
                await dispatch(
                    leaveRoomThunk(room._id)
                ).unwrap();

                toast.success(
                    "You left the room."
                );

                navigate("/rooms");
            } catch (err) {
                toast.error(
                    typeof err === "string"
                        ? err
                        : err?.message ||
                            "Failed to leave room."
                );

                setLeaving(false);
            }

            return;
        }

        // Private room → confirmation
        const confirmed = window.confirm(
            `Leave "${room.name}"? You'll need the invite code to rejoin.`
        );

        if (!confirmed) return;

        setLeaving(true);

        try {
            await dispatch(
                leaveRoomThunk(room._id)
            ).unwrap();

            toast.success(
                "You left the room."
            );

            navigate("/rooms");
        } catch (err) {
            toast.error(
                typeof err === "string"
                    ? err
                    : err?.message ||
                        "Failed to leave room."
            );

            setLeaving(false);
        }
    };

    return (
        <header className="flex h-[56px] shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">

            {/* ===========================
                Left
            =========================== */}

            <div className="flex min-w-0 items-center gap-2.5">

                {/* Back */}
                <Link
                    to="/rooms"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    aria-label="Back to rooms"
                >
                    <FaArrowLeft size={14} />
                </Link>

                {/* Room Info */}
                <div className="min-w-0">

                    <div className="flex min-w-0 items-center gap-3">

                        {/* Room Name */}
                        <h1 className="max-w-[220px] truncate text-sm font-bold text-white sm:max-w-[320px]">
                            {room.name}
                        </h1>

                        {/* Members */}
                        <span className="hidden items-center gap-1 text-xs text-slate-500 sm:flex">
                            <FaUsers size={10} />
                            {room.members?.length || 0}
                            {room.maxMembers
                                ? `/${room.maxMembers}`
                                : ""}{" "}
                            students
                        </span>

                        {/* Privacy */}
                        <span
                            className={`hidden items-center gap-1 text-xs sm:flex ${
                                room.isPrivate
                                    ? "text-amber-400"
                                    : "text-cyan-400"
                            }`}
                        >
                            {room.isPrivate ? (
                                <>
                                    <FaLock size={9} />
                                    Private
                                </>
                            ) : (
                                <>
                                    <FaGlobe size={9} />
                                    Public
                                </>
                            )}
                        </span>

                        {/* Invite Code */}
                        {room.isPrivate &&
                            isHost && (
                                <div className="hidden items-center gap-1.5 md:flex">

                                    <span className="rounded-md bg-slate-800 px-2 py-1 font-mono text-[10px] font-semibold tracking-wider text-indigo-400">
                                        {room.inviteCode}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={
                                            copyInviteCode
                                        }
                                        className="flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-1 text-[10px] font-semibold text-indigo-400 transition hover:bg-indigo-500 hover:text-white"
                                    >
                                        <FaCopy size={9} />
                                        Copy
                                    </button>

                                </div>
                            )}

                    </div>

                </div>

            </div>

            {/* ===========================
                Room Menu
            =========================== */}

            <div className="relative shrink-0">

                <button
                    type="button"
                    onClick={() =>
                        setMenuOpen(
                            (open) => !open
                        )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    aria-label="Room options"
                    aria-expanded={menuOpen}
                >
                    <FaEllipsisV size={13} />
                </button>

                {menuOpen && (
                    <>
                        {/* Outside Click */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() =>
                                setMenuOpen(false)
                            }
                        />

                        {/* Menu */}
                        <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl shadow-black/40">

                            {/* Delete */}
                            {isHost && (
                                <button
                                    type="button"
                                    onClick={
                                        handleDeleteRoom
                                    }
                                    disabled={
                                        deleting
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                                >
                                    <FaTrash />

                                    {deleting
                                        ? "Deleting..."
                                        : "Delete Room"}
                                </button>
                            )}

                            {/* Leave */}
                            {!isHost &&
                                isMember && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleLeaveRoom
                                        }
                                        disabled={
                                            leaving
                                        }
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-yellow-400 transition hover:bg-yellow-500/10 disabled:opacity-50"
                                    >
                                        <FaSignOutAlt />

                                        {leaving
                                            ? "Leaving..."
                                            : "Leave Room"}
                                    </button>
                                )}

                            {/* No Actions */}
                            {!isHost &&
                                !isMember && (
                                    <p className="px-3 py-2.5 text-sm text-slate-600">
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