import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useOutletContext,
} from "react-router-dom";
import toast from "react-hot-toast";
import { removeRoom } from "../redux/room/roomSlice";
import {
    useAppDispatch,
    useAppSelector,
} from "../redux/hooks";

import {
    getRoomsThunk,
} from "../redux/room/roomThunk";

import socket from "../socket/socket";

import RoomHeader from "../components/rooms/RoomHeader";
import SearchBar from "../components/rooms/SearchBar";
import RoomList from "../components/rooms/RoomList";
import CreateRoomModal from "../components/rooms/CreateRoomModal";

const Rooms = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { openSidebar } = useOutletContext();

    const {
        rooms,
        loading,
        error,
    } = useAppSelector(
        (state) => state.room
    );

    const { user } = useAppSelector(
        (state) => state.auth
    );

    const [openModal, setOpenModal] =
        useState(false);

    const [searchTerm, setSearchTerm] =
        useState("");

    // ===========================
    // Load Rooms
    // ===========================

    useEffect(() => {
        dispatch(getRoomsThunk());
    }, [dispatch]);

    // ===========================
    // Socket + Rejoin Approval
    // ===========================

useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
        socket.connect();
    }

    socket.emit("user:register", {
        userId: user._id,
    });

    // ===========================
    // Room Deleted
    // ===========================

    const handleRoomDeleted = ({
        roomId,
        message,
    }) => {
        if (!roomId) return;

        // Remove deleted room immediately
        dispatch(removeRoom(roomId));

        toast.success(
            message ||
                "A study room was deleted."
        );
    };

    // ===========================
    // Rejoin Approved
    // ===========================

    const handleRejoinApproved = ({
        roomId,
        message,
    }) => {
        toast.success(
            message ||
                "Your request to rejoin was approved."
        );

        navigate(`/room/${roomId}`);
    };

    socket.on(
        "room:deleted",
        handleRoomDeleted
    );

    socket.on(
        "room:rejoin-approved",
        handleRejoinApproved
    );

    return () => {
        socket.off(
            "room:deleted",
            handleRoomDeleted
        );

        socket.off(
            "room:rejoin-approved",
            handleRejoinApproved
        );
    };
}, [
    user?._id,
    navigate,
    dispatch,
]);

    // ===========================
    // Error
    // ===========================

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // ===========================
    // Search
    // ===========================

    const filteredRooms = useMemo(() => {
        const query =
            searchTerm.trim().toLowerCase();

        if (!query) {
            return rooms;
        }

        return rooms.filter((room) => {
            const name =
                room.name?.toLowerCase() || "";

            const description =
                room.description?.toLowerCase() || "";

            return (
                name.includes(query) ||
                description.includes(query)
            );
        });
    }, [rooms, searchTerm]);

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <main className="min-w-0">

                <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-8">

                    {/* ===========================
                        Header
                    =========================== */}

                    <RoomHeader
                        onCreate={() =>
                            setOpenModal(true)
                        }
                        onMenuClick={openSidebar}
                    />

                    {/* ===========================
                        Search
                    =========================== */}

                    <div className="mt-8">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />
                    </div>

                    {/* ===========================
                        Room Count
                    =========================== */}

                    {!loading && (
                        <div className="mb-5 mt-7 flex items-center justify-between">

                            <p className="text-sm text-slate-500">
                                {filteredRooms.length}{" "}
                                {filteredRooms.length === 1
                                    ? "study room"
                                    : "study rooms"}{" "}
                                found
                            </p>

                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearchTerm("")
                                    }
                                    className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
                                >
                                    Clear search
                                </button>
                            )}

                        </div>
                    )}

                    {/* ===========================
                        Rooms
                    =========================== */}

                    {loading ? (
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-16 text-center">

                            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />

                            <p className="mt-4 text-sm text-slate-500">
                                Loading study rooms...
                            </p>

                        </div>
                    ) : (
                        <RoomList
                            rooms={filteredRooms}
                        />
                    )}

                </div>

            </main>

            {/* ===========================
                Create Room Modal
            =========================== */}

            <CreateRoomModal
                isOpen={openModal}
                onClose={() =>
                    setOpenModal(false)
                }
            />

        </div>
    );
};

export default Rooms;