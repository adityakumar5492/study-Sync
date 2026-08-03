import RoomItem from "./RoomItem";

const RoomList = ({ rooms }) => {
    if (!rooms?.length) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

                <h2 className="text-2xl font-semibold">
                    No Study Rooms Found
                </h2>

                <p className="text-slate-400 mt-2">
                    No study rooms are available. Create a new room or try a different search.
                </p>

            </div>
        );
    }

    return (
        <div className="space-y-5">
            {rooms.map((room) => (
                <RoomItem
                    key={room._id}
                    room={room}
                />
            ))}
        </div>
    );
};

export default RoomList;