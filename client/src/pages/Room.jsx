import { useEffect, useState } from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    FaChevronLeft,
    FaChevronRight,
    FaUserMinus,
    FaExclamationTriangle,
    FaTimes,
} from "react-icons/fa";

import {
    useAppDispatch,
    useAppSelector,
} from "../redux/hooks";

import toast from "react-hot-toast";
import socket from "../socket/socket";

import {
    getRoomThunk,
} from "../redux/room/roomThunk";

import RoomHeader from "../components/room/RoomHeader";
import PdfViewer from "../components/room/PdfViewer";
import Whiteboard from "../components/room/Whiteboard";
import RoomCommunication from "../components/room/RoomCommunication";

const Room = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [activeTab, setActiveTab] =
        useState("pdf");

    /*
     * RESPONSIVE SIDEBAR
     *
     * Desktop:
     * Communication panel is displayed as a
     * left-side sidebar and can be collapsed.
     *
     * Mobile:
     * Communication is moved below the study
     * workspace instead of behaving like an overlay.
     */
    const [sidebarOpen, setSidebarOpen] =
        useState(true);

    const [onlineUsers, setOnlineUsers] =
        useState([]);

    const [drawingPermission, setDrawingPermission] =
        useState({
            mode: "everyone",
            allowedUsers: [],
        });

    const [removeMemberModal, setRemoveMemberModal] =
        useState({
            open: false,
            member: null,
        });

    const [removingMember, setRemovingMember] =
        useState(false);

    const {
        currentRoom: room,
        loading,
        error,
    } = useAppSelector(
        (state) => state.room
    );

    const { user } = useAppSelector(
        (state) => state.auth
    );

    const hostId =
        typeof room?.host === "object"
            ? room.host?._id?.toString()
            : room?.host?.toString();

    const isHost =
        hostId === user?._id?.toString();

    const isMember =
        room?.members?.some((member) => {
            const memberId =
                typeof member === "object"
                    ? member._id?.toString()
                    : member?.toString();

            return (
                memberId === user?._id?.toString()
            );
        }) || false;

    // ===========================
    // Load Room
    // ===========================

    useEffect(() => {
        if (id) {
            dispatch(getRoomThunk(id));
        }
    }, [dispatch, id]);

    // ===========================
    // Room Socket
    // ===========================

    useEffect(() => {
        if (!room?._id || !user) return;

        if (!socket.connected) {
            socket.connect();
        }

        // ===========================
        // Online Users
        // ===========================

        const handleOnlineUsers = ({ users }) => {
            setOnlineUsers(users || []);
        };

        // ===========================
        // Socket Error
        // ===========================

        const handleSocketError = (message) => {
            toast.error(
                message || "Socket connection error."
            );
        };

        // ===========================
        // Members Updated
        // ===========================

        const handleMembersUpdated = () => {
            dispatch(getRoomThunk(room._id));
        };

        // ===========================
        // User Removed
        // ===========================

        const handleRoomRemoved = ({ message }) => {
            toast.error(
                message ||
                    "You have been removed from this room."
            );

            navigate("/rooms");
        };

        // ===========================
        // Rejoin Request
        // ===========================

        const handleRejoinRequest = ({
            roomId: requestRoomId,
            user: requestedUser,
        }) => {
            if (requestRoomId !== room._id) {
                return;
            }

            if (!isHost) {
                return;
            }

            toast(
                `${
                    requestedUser?.name || "A user"
                } requested to rejoin.`,
                {
                    icon: "🔴",
                }
            );

            dispatch(getRoomThunk(room._id));
        };

        // ===========================
        // REGISTER LISTENERS FIRST
        // ===========================

        socket.on(
            "room:online-users",
            handleOnlineUsers
        );

        socket.on(
            "room:error",
            handleSocketError
        );

        socket.on(
            "room:members-updated",
            handleMembersUpdated
        );

        socket.on(
            "room:removed",
            handleRoomRemoved
        );

        socket.on(
            "room:rejoin-request",
            handleRejoinRequest
        );

        // ===========================
        // NOW JOIN ROOM
        // ===========================

        socket.emit("user:register", {
            userId: user._id,
        });

        socket.emit("room:join", {
            roomId: room._id,
            user,
            isHost,
        });

        // ===========================
        // CLEANUP
        // ===========================

        return () => {
            socket.emit("room:leave", {
                roomId: room._id,
                user,
            });

            socket.off(
                "room:online-users",
                handleOnlineUsers
            );

            socket.off(
                "room:error",
                handleSocketError
            );

            socket.off(
                "room:members-updated",
                handleMembersUpdated
            );

            socket.off(
                "room:removed",
                handleRoomRemoved
            );

            socket.off(
                "room:rejoin-request",
                handleRejoinRequest
            );
        };
    }, [
        room?._id,
        user,
        isHost,
        dispatch,
        navigate,
    ]);

    // ===========================
    // Drawing Permission Listener
    // ===========================

    useEffect(() => {
        const handleDrawingPermissionChange = ({
            mode,
            allowedUsers = [],
        }) => {
            setDrawingPermission({
                mode: mode || "everyone",
                allowedUsers,
            });
        };

        socket.on(
            "drawing:permission-change",
            handleDrawingPermissionChange
        );

        return () => {
            socket.off(
                "drawing:permission-change",
                handleDrawingPermissionChange
            );
        };
    }, []);

    // ===========================
    // Remove Member
    // ===========================

    const handleRemoveMember = (
        memberId
    ) => {
        if (!room?._id || !memberId) {
            return;
        }

        if (!isHost) {
            toast.error(
                "Only the host can remove members."
            );

            return;
        }

        const member =
            room.members?.find(
                (participant) =>
                    participant._id?.toString() ===
                    memberId?.toString()
            );

        if (!member) {
            return;
        }

        setRemoveMemberModal({
            open: true,
            member,
        });
    };

    // ===========================
    // Confirm Remove Member
    // ===========================

    const confirmRemoveMember = () => {
        const member =
            removeMemberModal.member;

        if (!room?._id || !member?._id) {
            setRemoveMemberModal({
                open: false,
                member: null,
            });

            return;
        }

        setRemovingMember(true);

        socket.emit(
            "room:remove-member",
            {
                roomId: room._id,
                memberId: member._id,
            }
        );

        setRemoveMemberModal({
            open: false,
            member: null,
        });

        setRemovingMember(false);
    };

    // ===========================
    // Cancel Remove Member
    // ===========================

    const cancelRemoveMember = () => {
        if (removingMember) {
            return;
        }

        setRemoveMemberModal({
            open: false,
            member: null,
        });
    };

    // ===========================
    // Drawing Permission
    // ===========================

    const handleDrawingPermissionChange = ({
        mode,
        allowedUsers = [],
    }) => {
        if (!isHost) return;

        const permission = {
            mode,
            allowedUsers,
        };

        setDrawingPermission(permission);

        socket.emit(
            "drawing:permission-change",
            {
                roomId: room._id,
                ...permission,
            }
        );
    };

    // ===========================
    // Loading
    // ===========================

    if (loading && !room) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-white">
                Loading room...
            </div>
        );
    }

    // ===========================
    // Error
    // ===========================

    if (error && !room) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-white">
                <h1 className="mb-3 text-center text-xl font-bold sm:text-2xl">
                    Room Unavailable
                </h1>

                <p className="mb-8 max-w-md text-center text-sm text-slate-400">
                    {error}
                </p>

                <Link
                    to="/rooms"
                    className="rounded-xl bg-green-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-600"
                >
                    Back to Rooms
                </Link>
            </div>
        );
    }

    // ===========================
    // Room Not Found
    // ===========================

    if (!room) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-white">
                <h1 className="mb-3 text-center text-xl font-bold sm:text-2xl">
                    Room Not Found
                </h1>

                <p className="mb-8 text-center text-sm text-slate-400">
                    This room does not exist or is no longer active.
                </p>

                <Link
                    to="/rooms"
                    className="rounded-xl bg-green-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-600"
                >
                    Back to Rooms
                </Link>
            </div>
        );
    }

    return (
        <div className="flex h-[100dvh] min-h-0 w-full flex-col overflow-hidden bg-slate-950 text-white">

            {/* =================================
                ROOM HEADER
            ================================= */}

            <div className="relative z-50 shrink-0 border-b border-slate-800/80 bg-slate-950/95 shadow-lg shadow-black/10 backdrop-blur">
                <RoomHeader
                    room={room}
                    currentUser={user}
                />
            </div>

            {/* =================================
                MAIN ROOM AREA
            ================================= */}

            <div
                className="
                    flex
                    min-h-0
                    min-w-0
                    flex-1
                    flex-col
                    overflow-y-auto
                    overflow-x-hidden
                    bg-slate-950

                    lg:flex-row
                    lg:overflow-hidden
                "
            >

                {/* =================================
                    DESKTOP LEFT SIDEBAR
                ================================= */}

                <aside
                    className={`
                        relative
                        hidden
                        min-h-0
                        shrink-0
                        flex-col
                        overflow-hidden
                        border-r
                        border-slate-800/80
                        bg-slate-900
                        shadow-2xl
                        shadow-black/40
                        transition-[width]
                        duration-200
                        ease-out

                        lg:flex

                        ${
                            sidebarOpen
                                ? "lg:w-[320px] lg:max-w-[38vw]"
                                : "lg:w-0 lg:border-r-0"
                        }
                    `}
                >
                    {sidebarOpen && (
                        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                            <RoomCommunication
                                room={room}
                                roomId={room._id}
                                currentUser={user}
                                onlineUsers={
                                    onlineUsers
                                }
                                isHost={isHost}
                                isMember={isMember}
                                onRemoveMember={
                                    handleRemoveMember
                                }
                                drawingPermission={
                                    drawingPermission
                                }
                                onDrawingPermissionChange={
                                    handleDrawingPermissionChange
                                }
                            />
                        </div>
                    )}
                </aside>

                {/* =================================
                    DESKTOP SIDEBAR TOGGLE
                ================================= */}

                <button
                    type="button"
                    onClick={() =>
                        setSidebarOpen(
                            (open) => !open
                        )
                    }
                    className={`
                        absolute
                        left-0
                        top-1/2
                        z-[100]
                        hidden
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-slate-700/80
                        bg-slate-800/95
                        text-slate-300
                        shadow-xl
                        shadow-black/30
                        transition-all
                        duration-200
                        hover:bg-slate-700
                        hover:text-white

                        lg:flex

                        ${
                            sidebarOpen
                                ? "lg:left-[302px]"
                                : "lg:left-2"
                        }
                    `}
                    title={
                        sidebarOpen
                            ? "Collapse sidebar"
                            : "Open sidebar"
                    }
                    aria-label={
                        sidebarOpen
                            ? "Collapse sidebar"
                            : "Open sidebar"
                    }
                >
                    {sidebarOpen ? (
                        <FaChevronLeft
                            size={11}
                        />
                    ) : (
                        <FaChevronRight
                            size={11}
                        />
                    )}
                </button>

                {/* =================================
                    STUDY + MOBILE COMMUNICATION
                ================================= */}

                <div
                    className="
                        flex
                        min-h-0
                        min-w-0
                        flex-col

                        lg:flex-1
                    "
                >

                    {/* =================================
                        MAIN STUDY WORKSPACE
                    ================================= */}

                    <main
                        className="
                            flex
                            h-[68dvh]
                            min-h-[420px]
                            min-w-0
                            shrink-0
                            flex-col
                            overflow-hidden
                            bg-slate-950

                            sm:h-[70dvh]

                            lg:h-auto
                            lg:min-h-0
                            lg:flex-1
                        "
                    >

                        {/* =================================
                            WORKSPACE TABS
                        ================================= */}

                        <div
                            className="
                                flex
                                h-10
                                min-h-10
                                shrink-0
                                border-b
                                border-slate-800/80
                                bg-slate-900/95
                                px-1
                                pt-1
                                shadow-sm

                                sm:h-10
                                sm:min-h-10

                                lg:h-11
                                lg:min-h-11
                            "
                        >

                            {/* PDF */}

                            <button
                                type="button"
                                onClick={() =>
                                    setActiveTab(
                                        "pdf"
                                    )
                                }
                                className={`
                                    flex
                                    min-w-0
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-1
                                    rounded-t-lg
                                    px-1.5
                                    text-[10px]
                                    font-semibold
                                    transition-colors

                                    sm:gap-1.5
                                    sm:px-2
                                    sm:text-xs

                                    lg:px-3
                                    lg:text-sm

                                    ${
                                        activeTab ===
                                        "pdf"
                                            ? "bg-slate-800 text-green-400 shadow-sm"
                                            : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                                    }
                                `}
                            >
                                <span className="shrink-0 text-[11px] sm:text-xs">
                                    📄
                                </span>

                                <span className="truncate">
                                    PDF
                                </span>
                            </button>

                            {/* Whiteboard */}

                            <button
                                type="button"
                                onClick={() =>
                                    setActiveTab(
                                        "whiteboard"
                                    )
                                }
                                className={`
                                    flex
                                    min-w-0
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-1
                                    rounded-t-lg
                                    px-1.5
                                    text-[10px]
                                    font-semibold
                                    transition-colors

                                    sm:gap-1.5
                                    sm:px-2
                                    sm:text-xs

                                    lg:px-3
                                    lg:text-sm

                                    ${
                                        activeTab ===
                                        "whiteboard"
                                            ? "bg-slate-800 text-green-400 shadow-sm"
                                            : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                                    }
                                `}
                            >
                                <span className="shrink-0 text-[11px] sm:text-xs">
                                    ✏️
                                </span>

                                <span className="truncate">
                                    Whiteboard
                                </span>
                            </button>
                        </div>

                        {/* =================================
                            STUDY WORKSPACE
                        ================================= */}

                        <div
                            className="
                                min-h-0
                                min-w-0
                                flex-1
                                overflow-hidden
                                p-1

                                sm:p-2

                                lg:p-3
                            "
                        >

                            {/* =================================
                                PDF
                            ================================= */}

                            {activeTab ===
                                "pdf" &&
                                room._id && (
                                    <div
                                        className="
                                            h-full
                                            min-h-0
                                            min-w-0
                                            overflow-hidden
                                            rounded-lg
                                            border
                                            border-slate-800/80
                                            bg-slate-900
                                            shadow-xl
                                            shadow-black/10

                                            sm:rounded-xl
                                        "
                                    >
                                        <PdfViewer
                                            roomId={
                                                room._id
                                            }
                                            room={
                                                room
                                            }
                                            currentUser={
                                                user
                                            }
                                            drawingPermission={
                                                drawingPermission
                                            }
                                        />
                                    </div>
                                )}

                            {/* =================================
                                WHITEBOARD
                            ================================= */}

                            {activeTab ===
                                "whiteboard" && (
                                    <div
                                        className="
                                            h-full
                                            min-h-0
                                            min-w-0
                                            overflow-hidden
                                            rounded-lg
                                            border
                                            border-slate-800/80
                                            bg-white
                                            shadow-xl
                                            shadow-black/10

                                            sm:rounded-xl
                                        "
                                    >
                                        <Whiteboard
                                            roomId={
                                                room._id
                                            }
                                        />
                                    </div>
                                )}
                        </div>
                    </main>

                    {/* =================================
                        MOBILE COMMUNICATION
                    ================================= */}

                    <section
                        className="
                            flex
                            min-h-[420px]
                            w-full
                            shrink-0
                            flex-col
                            overflow-hidden
                            border-t
                            border-slate-800/80
                            bg-slate-900

                            lg:hidden
                        "
                    >
                        <RoomCommunication
                            room={room}
                            roomId={room._id}
                            currentUser={user}
                            onlineUsers={
                                onlineUsers
                            }
                            isHost={isHost}
                            isMember={isMember}
                            onRemoveMember={
                                handleRemoveMember
                            }
                            drawingPermission={
                                drawingPermission
                            }
                            onDrawingPermissionChange={
                                handleDrawingPermissionChange
                            }
                        />
                    </section>
                </div>
            </div>

            {/* =================================
                REMOVE MEMBER MODAL
            ================================= */}

            {removeMemberModal.open && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-sm sm:px-4">
                    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b11] shadow-[0_25px_100px_rgba(0,0,0,.65)]">

                        {/* Modal Header */}

                        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5 sm:px-5 sm:py-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/[0.08] text-red-400">
                                    <FaUserMinus className="text-xs" />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="truncate text-sm font-bold text-white">
                                        Remove Member
                                    </h2>

                                    <p className="mt-0.5 text-[9px] text-zinc-600">
                                        Room management
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    cancelRemoveMember
                                }
                                disabled={
                                    removingMember
                                }
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                                aria-label="Close"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        </div>

                        {/* Modal Content */}

                        <div className="px-4 py-4 sm:px-5 sm:py-5">
                            <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-400/[0.08] bg-red-500/[0.04] p-3">
                                <FaExclamationTriangle className="mt-0.5 shrink-0 text-xs text-red-400" />

                                <p className="text-[10px] leading-relaxed text-zinc-400">
                                    Are you sure you want to remove{" "}
                                    <span className="font-bold text-white">
                                        {removeMemberModal
                                            .member
                                            ?.name ||
                                            "this member"}
                                    </span>{" "}
                                    from this room?
                                </p>
                            </div>

                            <p className="text-[9px] leading-relaxed text-zinc-600">
                                This member will immediately lose access to the room and its study session.
                            </p>
                        </div>

                        {/* Modal Actions */}

                        <div className="flex flex-col-reverse gap-2 border-t border-white/[0.06] bg-white/[0.015] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-end sm:px-5">
                            <button
                                type="button"
                                onClick={
                                    cancelRemoveMember
                                }
                                disabled={
                                    removingMember
                                }
                                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-[9px] font-bold text-zinc-400 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50 sm:w-auto"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    confirmRemoveMember
                                }
                                disabled={
                                    removingMember
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-500/[0.08] px-4 py-2.5 text-[9px] font-bold text-red-300 transition hover:border-red-400/25 hover:bg-red-500/[0.14] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                <FaUserMinus className="text-[8px]" />

                                {removingMember
                                    ? "Removing..."
                                    : "Remove Member"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Room;