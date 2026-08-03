import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getRoomThunk } from "../redux/room/roomThunk";

import RoomHeader from "../components/room/RoomHeader";
import PdfViewer from "../components/room/PdfViewer";
import Participants from "../components/room/Participants";
import ChatPanel from "../components/room/ChatPanel";

const Room = () => {
    const { id } = useParams();

    const dispatch = useAppDispatch();

    const {
        currentRoom: room,
        loading,
        error,
    } = useAppSelector((state) => state.room);

    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (id) {
            dispatch(getRoomThunk(id));
        }
    }, [dispatch, id]);

    if (loading && !room) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading room...
            </div>
        );
    }

    // Clean error state — no join logic, no redirects, just a clear message
    if (error && !room) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
                <h1 className="mb-3 text-2xl font-bold">Room Unavailable</h1>
                <p className="mb-8 max-w-md text-center text-slate-400">
                    {error}
                </p>
                <Link
                    to="/rooms"
                    className="rounded-xl bg-green-500 px-6 py-3 font-medium text-white transition hover:bg-green-600"
                >
                    Back to Rooms
                </Link>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
                <h1 className="mb-3 text-2xl font-bold">Room Not Found</h1>
                <p className="mb-8 text-slate-400">
                    This room does not exist or is no longer active.
                </p>
                <Link
                    to="/rooms"
                    className="rounded-xl bg-green-500 px-6 py-3 font-medium text-white transition hover:bg-green-600"
                >
                    Back to Rooms
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">

            <RoomHeader
                room={room}
                currentUser={user}
            />

            <div className="flex flex-1 overflow-hidden">

                <div className="flex-[3] p-6 overflow-y-auto">

                    {room._id && (
                        <PdfViewer
                            roomId={room._id}
                            room={room}
                            currentUser={user}
                        />
                    )}

                </div>

                <div className="w-96 border-l border-slate-800 bg-slate-900 flex flex-col">

                    <Participants
                        room={room}
                        roomId={room._id}
                        participants={room.members || []}
                    />

                    <ChatPanel
                        roomId={room._id}
                        initialMessages={[]}
                    />

                </div>

            </div>

        </div>
    );
};

export default Room;