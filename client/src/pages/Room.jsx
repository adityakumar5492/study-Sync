import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import RoomHeader from "../components/room/RoomHeader";
import PdfViewer from "../components/room/PdfViewer";
import Participants from "../components/room/Participants";
import ChatPanel from "../components/room/ChatPanel";

const Room = () => {
  const { id } = useParams();

  // Temporary room state
  const [room, setRoom] = useState({
    _id: id,
    title: "Operating System Revision",
    subject: "Operating System",
    pdf: null,
    participants: [],
    messages: [],
  });

  useEffect(() => {
    // Backend API will come here
    // Example:
    // const fetchRoom = async () => {
    //   const data = await getRoom(id);
    //   setRoom(data);
    // };
    //
    // fetchRoom();

    setRoom((prev) => ({
      ...prev,
      _id: id,
    }));
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <RoomHeader roomId={room._id} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF */}
        <div className="flex-[3] p-6 overflow-y-auto">
          <PdfViewer roomId={room._id} />
        </div>

        {/* Sidebar */}
        <div className="w-96 border-l border-slate-800 bg-slate-900 flex flex-col">
          <Participants
            roomId={room._id}
            participants={room.participants}
          />

          <ChatPanel
            roomId={room._id}
            initialMessages={room.messages}
          />
        </div>
      </div>
    </div>
  );
};

export default Room;