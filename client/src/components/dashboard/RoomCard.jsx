import {
  FaUsers,
  FaArrowRight,
  FaLock,
  FaGlobe,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-green-500 hover:-translate-y-1">

      <div className="flex justify-between items-start">

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-2">

            <h3 className="text-xl font-semibold">
              {room.name}
            </h3>

            {room.isPrivate ? (
              <FaLock className="text-yellow-400" />
            ) : (
              <FaGlobe className="text-green-400" />
            )}

          </div>

          <p className="text-slate-400">
            {room.description || "No description provided."}
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-5 text-sm">

            <div className="flex items-center gap-2 text-slate-400">
              <FaUsers />
              {room.members?.length || 0} Members
            </div>

            <span
              className={`font-medium ${
                room.isActive
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              ● {room.isActive ? "Active" : "Inactive"}
            </span>

            <span className="text-slate-500">
              Host: {room.host?.name || "Unknown"}
            </span>

          </div>

        </div>

        <Link
          to={`/room/${room._id}`}
          className="ml-6 bg-green-500 hover:bg-green-600 transition p-3 rounded-xl"
        >
          <FaArrowRight />
        </Link>

      </div>

    </div>
  );
};

export default RoomCard;