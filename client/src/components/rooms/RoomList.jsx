import RoomItem from "./RoomItem";

const RoomList = ({ rooms }) => {
  if (rooms.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-semibold">
          No study rooms found
        </h2>

        <p className="text-slate-400 mt-2">
          Try searching with a different keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {rooms.map((room) => (
        <RoomItem
          key={room.id}
          room={room}
        />
      ))}
    </div>
  );
};

export default RoomList;