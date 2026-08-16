import {
    FaUsers,
    FaLock,
    FaGlobe,
    FaArrowRight,
} from "react-icons/fa";

import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { requestRoomRejoin } from "../../api/room.api";
import socket from "../../socket/socket";

import JoinPrivateRoomModal from "./JoinPrivateRoomModal";

import { useAppSelector } from "../../redux/hooks";

const RoomItem = ({ room }) => {
    const navigate = useNavigate();

    const { user } = useAppSelector(
        (state) => state.auth
    );

    const [showJoinModal, setShowJoinModal] =
        useState(false);

    const [requestingRejoin, setRequestingRejoin] =
        useState(false);

    // ===========================
    // Host
    // ===========================

    const hostId =
        typeof room.host === "object"
            ? room.host?._id?.toString()
            : room.host?.toString();

    const currentUserId =
        user?._id?.toString();

    const isHost =
        hostId === currentUserId;

    // ===========================
    // Member
    // ===========================

    const isMember =
        room.members?.some((member) => {
            const memberId =
                typeof member === "object"
                    ? member._id?.toString()
                    : member?.toString();

            return memberId === currentUserId;
        });

    // ===========================
    // Previously Removed
    // ===========================

    const isRemoved =
        !isMember &&
        room.removedMembers?.some((entry) => {
            const removedUserId =
                typeof entry.user === "object"
                    ? entry.user?._id?.toString()
                    : entry.user?.toString();

            return (
                removedUserId === currentUserId
            );
        });

    // ===========================
    // Members
    // ===========================

    const memberCount =
        room.members?.length || 0;

    const maxMembers =
        room.maxMembers || 20;

    // ===========================
    // Open Room
    // ===========================

    const handleOpen = () => {
        if (
            room.isPrivate &&
            !isHost &&
            !isMember
        ) {
            setShowJoinModal(true);
            return;
        }

        navigate(`/room/${room._id}`);
    };

    // ===========================
    // Request Rejoin
    // ===========================

    const handleRequestRejoin = async () => {
        if (requestingRejoin) return;

        try {
            setRequestingRejoin(true);

            const { data } =
                await requestRoomRejoin(
                    room._id
                );

            socket.emit(
                "room:rejoin-request",
                {
                    roomId: room._id,
                    userId: currentUserId,
                }
            );

            toast.success(
                data.message ||
                    "Rejoin request sent."
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to send rejoin request."
            );
        } finally {
            setRequestingRejoin(false);
        }
    };

    return (
        <>
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-slate-900 hover:shadow-indigo-500/5 sm:p-5 lg:p-6">

                {/* Subtle hover glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-indigo-500/0 blur-3xl transition duration-500 group-hover:bg-indigo-500/10" />

                <div className="relative flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">

                    {/* ===========================
                        Room Information
                    =========================== */}

                    <div className="min-w-0 flex-1">

                        {/* Title */}
                        <div className="flex min-w-0 items-center gap-2">

                            <h2 className="min-w-0 truncate text-base font-semibold text-white sm:text-lg">
                                {room.name}
                            </h2>

                            {room.isPrivate ? (
                                <FaLock
                                    className="shrink-0 text-xs text-amber-400"
                                    title="Private Room"
                                />
                            ) : (
                                <FaGlobe
                                    className="shrink-0 text-xs text-cyan-400"
                                    title="Public Room"
                                />
                            )}

                        </div>

                        {/* Description */}
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                            {room.description ||
                                "No description provided."}
                        </p>

                        {/* Metadata */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2.5 text-xs sm:mt-5 sm:gap-x-5">

                            {/* Members */}
                            <span className="flex items-center gap-1.5 whitespace-nowrap text-slate-500">
                                <FaUsers className="shrink-0 text-slate-600" />

                                {memberCount}/{maxMembers}{" "}
                                members
                            </span>

                            {/* Status */}
                            <span
                                className={`flex items-center gap-1.5 whitespace-nowrap font-medium ${
                                    room.isActive
                                        ? "text-emerald-400"
                                        : "text-slate-500"
                                }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                        room.isActive
                                            ? "bg-emerald-400"
                                            : "bg-slate-600"
                                    }`}
                                />

                                {room.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </span>

                            {/* Privacy */}
                            <span className="whitespace-nowrap text-slate-600">
                                {room.isPrivate
                                    ? "Private"
                                    : "Public"}
                            </span>

                            {/* Host */}
                            <span className="max-w-full truncate text-slate-600 sm:max-w-40">
                                Host:{" "}
                                {room.host?.name ||
                                    "Unknown"}
                            </span>

                        </div>

                    </div>

                    {/* ===========================
                        Action
                    =========================== */}

                    <div className="w-full shrink-0 lg:w-auto">

                        {isRemoved ? (
                            <button
                                type="button"
                                onClick={
                                    handleRequestRejoin
                                }
                                disabled={
                                    requestingRejoin
                                }
                                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-2.5 text-xs font-semibold text-orange-400 transition hover:border-orange-500/30 hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-10 sm:w-auto"
                            >
                                {requestingRejoin
                                    ? "Requesting..."
                                    : "Rejoin"}

                                <FaArrowRight className="text-[10px]" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleOpen}
                                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2.5 text-xs font-semibold text-indigo-400 transition hover:border-indigo-500/30 hover:bg-indigo-500 hover:text-white active:scale-[0.99] sm:min-h-10 sm:w-auto"
                            >
                                {room.isPrivate &&
                                !isHost &&
                                !isMember
                                    ? "Join"
                                    : "Open"}

                                <FaArrowRight className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5" />
                            </button>
                        )}

                    </div>

                </div>

            </div>

            {/* Private Room Modal */}
            <JoinPrivateRoomModal
                isOpen={showJoinModal}
                room={room}
                onClose={() =>
                    setShowJoinModal(false)
                }
            />
        </>
    );
};

export default RoomItem;