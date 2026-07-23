import { useEffect, useMemo, useState } from "react";

import RoomHeader from "../components/rooms/RoomHeader";
import SearchBar from "../components/rooms/SearchBar";
import RoomList from "../components/rooms/RoomList";
import CreateRoomModal from "../components/rooms/CreateRoomModal";

import roomsData from "../data/rooms";

const Rooms = () => {
  // Rooms state (later this will come from the backend)
  const [rooms, setRooms] = useState([]);

  // Create Room Modal
  const [openModal, setOpenModal] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Load rooms (temporary until backend)
  useEffect(() => {
    setRooms(roomsData);

    // Later:
    // const fetchRooms = async () => {
    //   const data = await getAllRooms();
    //   setRooms(data);
    // };
    //
    // fetchRooms();
  }, []);

  // Filter rooms
  const filteredRooms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return rooms.filter(
      (room) =>
        room.title.toLowerCase().includes(query) ||
        room.subject.toLowerCase().includes(query)
    );
  }, [rooms, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <RoomHeader onCreate={() => setOpenModal(true)} />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <RoomList rooms={filteredRooms} />

    <CreateRoomModal
      isOpen={openModal}
      onClose={() => setOpenModal(false)}
      onCreateRoom={(room) => {
      setRooms((prev) => [room, ...prev]);
      }}
    />    
    </div>
  );
};

export default Rooms;