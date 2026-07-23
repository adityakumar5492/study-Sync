import { FaUserCircle, FaCrown } from "react-icons/fa";

const demoParticipants = [
  {
    id: 1,
    name: "You",
    role: "Host",
    isHost: true,
    online: true,
  },
  {
    id: 2,
    name: "Alice Johnson",
    role: "Member",
    online: true,
  },
  {
    id: 3,
    name: "Bob Smith",
    role: "Member",
    online: true,
  },
  {
    id: 4,
    name: "Charlie Brown",
    role: "Member",
    online: true,
  },
  {
    id: 5,
    name: "Diana Prince",
    role: "Member",
    online: false,
  },
  {
    id: 6,
    name: "Eve Wilson",
    role: "Member",
    online: true,
  },
];

const Participants = ({ roomId, participants = demoParticipants }) => {
  const onlineCount = participants.filter((user) => user.online).length;

  return (
    <div className="border-b border-slate-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white text-lg">
            Participants
          </h3>

          <p className="text-xs text-slate-500">
            Room ID: {roomId}
          </p>
        </div>

        <span className="text-sm text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
          {onlineCount} Online
        </span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <div className="relative">
              <FaUserCircle className="text-3xl text-slate-500" />

              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  participant.online
                    ? "bg-green-500"
                    : "bg-slate-600"
                }`}
              />
            </div>

            <div className="flex-1">
              <p className="text-sm text-white font-medium flex items-center gap-2">
                {participant.name}

                {participant.isHost && (
                  <FaCrown className="text-yellow-500 text-xs" />
                )}
              </p>

              <p className="text-xs text-slate-400">
                {participant.role}
              </p>
            </div>

            {participant.online && (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participants;