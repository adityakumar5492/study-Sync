import RoomItem from "./RoomItem";

const RoomList = ({ rooms }) => {
    if (!rooms?.length) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-16 text-center">

                <div className="mx-auto max-w-md">

                    <h2 className="text-lg font-semibold text-white">
                        No Study Rooms Found
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        No study rooms match your search.
                        Try a different search or create
                        a new room.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="grid gap-5 md:grid-cols-2">
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