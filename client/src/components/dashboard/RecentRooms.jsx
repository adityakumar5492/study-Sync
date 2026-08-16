import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getRoomsThunk } from "../../redux/room/roomThunk";

import RoomCard from "./RoomCard";

const RecentRooms = () => {
    const dispatch = useAppDispatch();

    const { rooms, loading } = useAppSelector(
        (state) => state.room
    );

    useEffect(() => {
        if (!rooms.length) {
            dispatch(getRoomsThunk());
        }
    }, [dispatch, rooms.length]);

    const recentRooms = rooms.slice(0, 4);

    return (
        <section>

            {/* Header */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                        Recent Study Rooms
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Continue where you left off.
                    </p>
                </div>

                <Link
                    to="/rooms"
                    className="w-fit shrink-0 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
                >
                    View all
                </Link>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/5 sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />

                        <p className="text-sm text-slate-500">
                            Loading rooms...
                        </p>
                    </div>
                </div>
            ) : recentRooms.length === 0 ? (

                /* Empty State */
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-5 py-10 text-center shadow-lg shadow-black/5 sm:px-6">
                    <h3 className="text-base font-semibold text-white">
                        No study rooms yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Create your first study room and start collaborating
                        with your study group.
                    </p>

                    <Link
                        to="/rooms"
                        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.99]"
                    >
                        Create a Room
                    </Link>
                </div>

            ) : (

                /* Rooms */
                <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
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