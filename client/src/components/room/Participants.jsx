import {
    FaUserCircle,
    FaCrown,
    FaUserMinus,
    FaCheck,
    FaTimes,
} from "react-icons/fa";

import toast from "react-hot-toast";
import { getCollaboratorColor } from "./collaboratorColors";

import {
    approveRoomRejoin,
    rejectRoomRejoin,
} from "../../api/room.api";

import socket from "../../socket/socket";

import {
    useAppDispatch,
    useAppSelector,
} from "../../redux/hooks";

import {
    getRoomThunk,
} from "../../redux/room/roomThunk";

const Participants = ({
    room,
    roomId,
    participants = [],
    onlineUsers = [],
    onRemoveMember,
}) => {
    const dispatch = useAppDispatch();

    const { user } =
        useAppSelector(
            (state) => state.auth
        );

    const hostId =
        typeof room?.host === "object"
            ? room.host?._id?.toString()
            : room?.host?.toString();

    const currentUserId =
        user?._id?.toString();

    const isCurrentUserHost =
        hostId === currentUserId;

    const isOnline = (participantId) =>
        onlineUsers.some(
            (u) =>
                u._id?.toString() ===
                participantId?.toString()
        );

    // ===========================
    // Approve Rejoin
    // ===========================

    const handleApproveRejoin = async (
        userId
    ) => {
        try {
            await approveRoomRejoin(
                roomId,
                userId
            );

            // Tell server to notify the
            // approved user's browser.
            socket.emit(
                "room:rejoin-approved",
                {
                    roomId,
                    userId,
                }
            );

            toast.success(
                "Rejoin request approved."
            );

            // Refresh host's room UI.
            dispatch(
                getRoomThunk(roomId)
            );

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to approve request."
            );
        }
    };

    // ===========================
    // Reject Rejoin
    // ===========================

    const handleRejectRejoin = async (
        userId
    ) => {
        try {
            await rejectRoomRejoin(
                roomId,
                userId
            );

            toast.success(
                "Rejoin request rejected."
            );

            dispatch(
                getRoomThunk(roomId)
            );

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to reject request."
            );
        }
    };

    // ===========================
    // Active Participants
    // ===========================

    const activeParticipants =
        participants.map(
            (participant) => ({
                ...participant,
                previouslyRemoved: false,
            })
        );

    // ===========================
    // Previously Removed
    // ===========================

    const removedParticipants =
        (room?.removedMembers || [])
            .filter(
                (entry) => entry.user
            )
            .map((entry) => ({
                ...entry.user,
                previouslyRemoved: true,
                removedAt:
                    entry.removedAt,
            }));

    const displayedParticipants = [
        ...activeParticipants,
        ...removedParticipants.filter(
            (removed) =>
                !activeParticipants.some(
                    (active) =>
                        active._id?.toString() ===
                        removed._id?.toString()
                )
        ),
    ];

    return (
        <div className="border-b border-slate-800 p-4">

            {/* ===========================
                Header
            =========================== */}

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

            {/* ===========================
                Rejoin Requests
            =========================== */}

            {isCurrentUserHost &&
                room?.rejoinRequests?.some(
                    (request) =>
                        request.status ===
                        "pending"
                ) && (
                    <div className="mb-4 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">

                        <p className="mb-3 text-sm font-semibold text-orange-400">
                            Rejoin Requests
                        </p>

                            <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                            {room.rejoinRequests
                                .filter(
                                    (request) =>
                                        request.status ===
                                        "pending"
                                )
                                .map(
                                    (request) => (
                                        <div
                                            key={
                                                request
                                                    .user
                                                    ?._id
                                            }
                                            className="flex items-center gap-2 rounded-lg bg-slate-800 p-2"
                                        >

                                            <FaUserCircle className="text-2xl text-red-400" />

                                            <div className="min-w-0 flex-1">

                                                <p className="truncate text-sm text-white">
                                                    {
                                                        request
                                                            .user
                                                            ?.name
                                                    }
                                                </p>

                                                <p className="text-xs text-red-400">
                                                    Previously removed
                                                </p>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleApproveRejoin(
                                                        request
                                                            .user
                                                            ?._id
                                                    )
                                                }
                                                className="rounded-md p-2 text-green-400 hover:bg-green-500/10"
                                                title="Allow"
                                            >
                                                <FaCheck />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRejectRejoin(
                                                        request
                                                            .user
                                                            ?._id
                                                    )
                                                }
                                                className="rounded-md p-2 text-red-400 hover:bg-red-500/10"
                                                title="Reject"
                                            >
                                                <FaTimes />
                                            </button>

                                        </div>
                                    )
                                )}

                        </div>

                    </div>
                )}

            {/* ===========================
                Participants List
            =========================== */}

            <div className="max-h-60 space-y-2 overflow-y-auto">

                {displayedParticipants.length ===
                0 ? (
                    <div className="py-6 text-center text-sm text-slate-400">
                        No participants found.
                    </div>
                ) : (
                    displayedParticipants.map(
                        (participant) => {

                            const online =
                                isOnline(
                                    participant._id
                                );

                            const participantId =
                                participant._id?.toString();
                            
                            const collaboratorColor =
                                getCollaboratorColor(
                                    participantId
                                );
                            const isHost =
                                participantId ===
                                hostId;

                            const isYou =
                                participantId ===
                                currentUserId;

                            const wasRemoved =
                                participant.previouslyRemoved;

                            return (
                                <div
                                    key={
                                        participant._id
                                    }
                                    className={`flex items-center gap-3 rounded-lg p-2 transition ${
                                        wasRemoved
                                            ? "bg-red-500/5"
                                            : "hover:bg-slate-800"
                                    }`}
                                >

                                    <div className="relative">

                                        <FaUserCircle
                                            className={`text-3xl ${
                                                wasRemoved
                                                    ? "text-red-400"
                                                    : "text-slate-500"
                                            }`}
                                        />

                                        <span
    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 ${
        wasRemoved
            ? "bg-red-500"
            : online
            ? ""
            : "bg-slate-600"
    }`}
    style={
        online && !wasRemoved
            ? {
                  backgroundColor:
                      collaboratorColor,
              }
            : undefined
    }
/>

                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <p
                                            className={`flex items-center gap-2 truncate text-sm font-medium ${
                                                wasRemoved
                                                    ? "text-red-400"
                                                    : "text-white"
                                            }`}
                                        >

                                            {participant.name}

                                            {isHost &&
                                                !wasRemoved && (
                                                    <FaCrown className="shrink-0 text-xs text-yellow-500" />
                                                )}

                                            {isYou &&
                                                !wasRemoved && (
                                                    <span className="shrink-0 text-xs text-green-400">
                                                        (You)
                                                    </span>
                                                )}

                                        </p>

                                        <p
                                            className={`text-xs ${
                                                wasRemoved
                                                    ? "text-red-400"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            {wasRemoved
                                                ? "Previously removed"
                                                : online
                                                ? "Online"
                                                : "Offline"}
                                        </p>

                                    </div>

                                    {/* Remove active member */}

                                    {isCurrentUserHost &&
                                        !isHost &&
                                        !isYou &&
                                        !wasRemoved && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onRemoveMember?.(
                                                        participant._id
                                                    )
                                                }
                                                className="rounded-md p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                                                title="Remove member"
                                                aria-label={`Remove ${participant.name}`}
                                            >
                                                <FaUserMinus />
                                            </button>
                                        )}

                                    {online &&
                                        !wasRemoved && (
                                            <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
                                        )}

                                </div>
                            );
                        }
                    )
                )}

            </div>

        </div>
    );
};

export default Participants;