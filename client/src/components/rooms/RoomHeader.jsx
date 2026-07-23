import { FaPlus } from "react-icons/fa";

const RoomHeader = ({ onCreate }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold">
          Study Rooms
        </h1>

        <p className="text-slate-400 mt-2">
          Join an existing room or create your own.
        </p>
      </div>

      <button
        onClick={onCreate}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-5 py-3 rounded-xl transition"
      >
        <FaPlus />
        Create Room
      </button>
    </div>
  );
};

export default RoomHeader;