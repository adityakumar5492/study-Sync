import { FaPlus, FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const QuickActions = () => {
  return (
    <section className="mb-10">

      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Create Room */}

        <Link
          to="/rooms/create"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500 hover:-translate-y-1 transition duration-300"
        >
          <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center text-2xl mb-5">
            <FaPlus />
          </div>

          <h3 className="text-xl font-semibold">
            Create Study Room
          </h3>

          <p className="text-slate-400 mt-2">
            Start a new collaborative study session and invite your friends.
          </p>
        </Link>

        {/* Join Room */}

        <Link
          to="/rooms"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:-translate-y-1 transition duration-300"
        >
          <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center text-2xl mb-5">
            <FaSignInAlt />
          </div>

          <h3 className="text-xl font-semibold">
            Join Study Room
          </h3>

          <p className="text-slate-400 mt-2">
            Enter an existing room using a room code or invitation.
          </p>
        </Link>

      </div>

    </section>
  );
};

export default QuickActions;