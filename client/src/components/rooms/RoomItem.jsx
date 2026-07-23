import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const RoomItem = ({ room }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center hover:border-green-500 transition">

      <div>
        <h2 className="text-xl font-semibold">
          {room.title}
        </h2>

        <p className="text-slate-400 mt-1">
          {room.subject}
        </p>

        <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <FaUsers />
            {room.members} Members
          </span>

          <span
            className={
              room.status === "Active"
                ? "text-green-400"
                : "text-yellow-400"
            }
          >
            ● {room.status}
          </span>
        </div>
      </div>

      <Link
        to={`/room/${room.id}`}
        className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg transition"
      >
        Join
      </Link>
    </div>
  );
};

export default RoomItem;