import { FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { Link } from "react-router-dom";

const RoomHeader = ({ roomId }) => {
  // Temporary data (replace with backend data later)
  const room = {
    id: roomId,
    title: "Operating System Revision",
    onlineStudents: 6,
  };

  return (
    <header className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center gap-4">
        <Link
          to="/rooms"
          className="text-slate-400 hover:text-white transition p-2 rounded-lg hover:bg-slate-800"
        >
          <FaArrowLeft />
        </Link>

        <div>
          <h1 className="text-xl font-bold text-white">
            {room.title}
          </h1>

          <p className="text-sm text-slate-400">
            Room ID: {room.id} • {room.onlineStudents} Students Online
          </p>
        </div>
      </div>

      <button className="text-slate-400 hover:text-white transition p-2 rounded-lg hover:bg-slate-800">
        <FaEllipsisV />
      </button>
    </header>
  );
};

export default RoomHeader;