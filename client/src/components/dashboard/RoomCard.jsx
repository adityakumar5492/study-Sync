import { FaUsers, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const RoomCard = ({ title, subject, members, status }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500 transition-all duration-300">

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-xl font-semibold">
            {title}
          </h3>

          <p className="text-slate-400 mt-2">
            {subject}
          </p>

          <div className="flex items-center gap-5 mt-5 text-sm text-slate-400">

            <div className="flex items-center gap-2">
              <FaUsers />
              {members} Members
            </div>

            <span
              className={`${
                status === "Active"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              ● {status}
            </span>

          </div>

        </div>

        <Link
          to="/room/1"
          className="bg-green-500 hover:bg-green-600 transition p-3 rounded-xl"
        >
          <FaArrowRight />
        </Link>

      </div>

    </div>
  );
};

export default RoomCard;