import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getRoomsThunk } from "../redux/room/roomThunk";

import RoomHeader from "../components/rooms/RoomHeader";
import SearchBar from "../components/rooms/SearchBar";
import RoomList from "../components/rooms/RoomList";
import CreateRoomModal from "../components/rooms/CreateRoomModal";

const Rooms = () => {
    const dispatch = useAppDispatch();

    const { rooms, loading, error } = useAppSelector(
        (state) => state.room
    );

    const [openModal, setOpenModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getRoomsThunk());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const filteredRooms = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) return rooms;

        return rooms.filter((room) => {
            const name = room.name?.toLowerCase() || "";
            const description = room.description?.toLowerCase() || "";

            return (
                name.includes(query) ||
                description.includes(query)
            );
        });
    }, [rooms, searchTerm]);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">

            <RoomHeader onCreate={() => setOpenModal(true)} />

            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
            />

            {loading ? (
                <div className="py-16 text-center text-slate-400">
                    Loading study rooms...
                </div>
            ) : (
                <RoomList rooms={filteredRooms} />
            )}

            <CreateRoomModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
            />

        </div>
    );
};

export default Rooms;