import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getRoomsThunk } from "../../redux/room/roomThunk";

import RoomCard from "./RoomCard";

const RecentRooms = () => {
  const dispatch = useAppDispatch();

  const { rooms, loading } = useAppSelector((state) => state.room);

  useEffect(() => {
    if (!rooms.length) {
      dispatch(getRoomsThunk());
    }
  }, [dispatch]);

  const recentRooms = rooms.slice(0, 5);

  return (
    <section>

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Recent Study Rooms
        </h2>

        <Link
          to="/rooms"
          className="text-green-400 hover:text-green-300 font-medium"
        >
          View All
        </Link>

      </div>

      {loading ? (

        <p className="text-slate-400">
          Loading rooms...
        </p>

      ) : recentRooms.length === 0 ? (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">

          <h3 className="text-xl font-semibold mb-2">
            No Study Rooms Yet
          </h3>

          <p className="text-slate-400">
            Create your first study room and start collaborating.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {recentRooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
            />
          ))}

        </div>

      )}

    </section>
  );
};

export default RecentRooms;