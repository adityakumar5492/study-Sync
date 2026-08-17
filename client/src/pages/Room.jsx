import { useEffect, useState } from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    FaChevronLeft,
    FaChevronRight,
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

    const [sidebarOpen, setSidebarOpen] =
        useState(true);

    const [onlineUsers, setOnlineUsers] =
        useState([]);

    const [drawingPermission, setDrawingPermission] =
    useState({
        mode: "everyone",
        allowedUsers: [],
    });

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

// NOW JOIN ROOM
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

        const confirmed =
            window.confirm(
                `Remove ${member.name} from this room?`
            );

        if (!confirmed) {
            return;
        }

        socket.emit(
            "room:remove-member",
            {
                roomId: room._id,
                memberId,
            }
        );
    };

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
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                Loading room...
            </div>
        );
    }

    // ===========================
    // Error
    // ===========================

    if (error && !room) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">

                <h1 className="mb-3 text-2xl font-bold">
                    Room Unavailable
                </h1>

                <p className="mb-8 max-w-md text-center text-slate-400">
                    {error}
                </p>

                <Link
                    to="/rooms"
                    className="rounded-xl bg-green-500 px-6 py-3 font-medium text-white transition hover:bg-green-600"
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
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">

                <h1 className="mb-3 text-2xl font-bold">
                    Room Not Found
                </h1>

                <p className="mb-8 text-slate-400">
                    This room does not exist or is no longer active.
                </p>

                <Link
                    to="/rooms"
                    className="rounded-xl bg-green-500 px-6 py-3 font-medium text-white transition hover:bg-green-600"
                >
                    Back to Rooms
                </Link>

            </div>
        );
    }

    return (
        <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-slate-950 text-white">

            {/* =================================
                ROOM HEADER
            ================================= */}

            <div className="z-50 shrink-0 border-b border-slate-800/80 bg-slate-950/95 shadow-lg shadow-black/10 backdrop-blur">
                <RoomHeader
                    room={room}
                    currentUser={user}
                />
            </div>

            {/* =================================
                MAIN ROOM AREA
            ================================= */}

            <div className="relative flex min-h-0 flex-1 overflow-hidden bg-slate-950">

                {/* =================================
                    LEFT SIDEBAR
                ================================= */}

                <aside
                    className={`relative z-40 flex min-h-0 shrink-0 flex-col overflow-hidden border-r border-slate-800/80 bg-slate-900 shadow-2xl shadow-black/20 transition-[width] duration-200 ease-out ${
                        sidebarOpen
                            ? "w-[320px] max-w-[38vw]"
                            : "w-0"
                    }`}
                >
                    {sidebarOpen && (
    <RoomCommunication
    room={room}
    roomId={room._id}
    currentUser={user}
    onlineUsers={onlineUsers}
    isHost={isHost}
    isMember={isMember}
    onRemoveMember={handleRemoveMember}
    drawingPermission={drawingPermission}
    onDrawingPermissionChange={
        handleDrawingPermissionChange
    }
/>
)}
                </aside>

                {/* =================================
                    SIDEBAR TOGGLE
                ================================= */}

                <button
                    type="button"
                    onClick={() =>
                        setSidebarOpen(
                            (open) => !open
                        )
                    }
                    className={`absolute top-1/2 z-[100] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700/80 bg-slate-800/95 text-slate-300 shadow-xl shadow-black/30 transition hover:bg-slate-700 hover:text-white ${
                        sidebarOpen
                            ? "left-[304px]"
                            : "left-2"
                    }`}
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
                    MAIN STUDY WORKSPACE
                ================================= */}

                <main className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">

                    {/* WORKSPACE TABS */}

                    <div className="flex h-11 shrink-0 border-b border-slate-800/80 bg-slate-900/95 px-1 pt-1 shadow-sm">

                        {/* PDF */}

                        <button
                            type="button"
                            onClick={() =>
                                setActiveTab(
                                    "pdf"
                                )
                            }
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-t-lg px-3 text-xs font-semibold transition-colors sm:text-sm ${
                                activeTab ===
                                "pdf"
                                    ? "bg-slate-800 text-green-400 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                            }`}
                        >
                            <span>
                                📄
                            </span>

                            PDF
                        </button>

                        {/* Whiteboard */}

                        <button
                            type="button"
                            onClick={() =>
                                setActiveTab(
                                    "whiteboard"
                                )
                            }
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-t-lg px-3 text-xs font-semibold transition-colors sm:text-sm ${
                                activeTab ===
                                "whiteboard"
                                    ? "bg-slate-800 text-green-400 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                            }`}
                        >
                            <span>
                                ✏️
                            </span>

                            Whiteboard
                        </button>

                    </div>

                    {/* STUDY WORKSPACE */}

                    <div className="min-h-0 flex-1 overflow-hidden p-1.5 sm:p-2 lg:p-3">

                        {/* PDF */}

                        {activeTab ===
                            "pdf" &&
                            room._id && (
                                <div className="h-full min-h-0 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900 shadow-xl shadow-black/10">

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
                                        drawingPermission={drawingPermission}
                                    />

                                </div>
                            )}

                        {/* Whiteboard */}

                        {activeTab ===
                            "whiteboard" && (
                                <div className="h-full min-h-0 overflow-hidden rounded-xl border border-slate-800/80 bg-white shadow-xl shadow-black/10">

                                    <Whiteboard
                                        roomId={
                                            room._id
                                        }
                                    />

                                </div>
                            )}

                    </div>

                </main>

            </div>

        </div>
    );
};

export default Room;