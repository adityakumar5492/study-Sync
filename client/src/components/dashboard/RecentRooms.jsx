import RoomCard from "./RoomCard";

const rooms = [
  {
    title: "Operating System Revision",
    subject: "OS",
    members: 6,
    status: "Active",
  },
  {
    title: "DBMS Study Group",
    subject: "Database Management",
    members: 4,
    status: "Active",
  },
  {
    title: "DSA Practice",
    subject: "Data Structures",
    members: 8,
    status: "Starting Soon",
  },
];

const RecentRooms = () => {
  return (
    <section>

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Recent Study Rooms
        </h2>

        <button className="text-green-400 hover:text-green-300">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {rooms.map((room, index) => (
          <RoomCard
            key={index}
            title={room.title}
            subject={room.subject}
            members={room.members}
            status={room.status}
          />
        ))}

      </div>

    </section>
  );
};

export default RecentRooms;