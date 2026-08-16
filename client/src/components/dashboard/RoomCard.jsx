import {
    FaUsers,
    FaArrowRight,
    FaLock,
    FaGlobe,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-slate-900 hover:shadow-indigo-500/5 sm:p-5">

            {/* Subtle hover glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-indigo-500/0 blur-3xl transition duration-500 group-hover:bg-indigo-500/10" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                {/* Room Information */}
                <div className="min-w-0 flex-1">

                    {/* Title */}
                    <div className="flex min-w-0 items-center gap-2">

                        <h3 className="min-w-0 truncate text-base font-semibold text-white">
                            {room.name}
                        </h3>

                        <span
                            className={`shrink-0 ${
                                room.isPrivate
                                    ? "text-amber-400"
                                    : "text-cyan-400"
                            }`}
                            title={
                                room.isPrivate
                                    ? "Private room"
                                    : "Public room"
                            }
                        >
                            {room.isPrivate ? (
                                <FaLock className="text-xs" />
                            ) : (
                                <FaGlobe className="text-xs" />
                            )}
                        </span>

                    </div>

                    {/* Description */}
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {room.description ||
                            "No description provided."}
                    </p>

                    {/* Metadata */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">

                        <span className="flex items-center gap-1.5 whitespace-nowrap text-slate-500">
                            <FaUsers className="shrink-0 text-slate-600" />
                            {room.members?.length || 0} members
                        </span>

                        <span
                            className={`flex items-center gap-1.5 whitespace-nowrap font-medium ${
                                room.isActive
                                    ? "text-emerald-400"
                                    : "text-slate-500"
                            }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                    room.isActive
                                        ? "bg-emerald-400"
                                        : "bg-slate-600"
                                }`}
                            />

                            {room.isActive
                                ? "Active"
                                : "Inactive"}
                        </span>

                        <span className="max-w-full truncate text-slate-600 sm:max-w-40">
                            Host:{" "}
                            {room.host?.name || "Unknown"}
                        </span>

                    </div>

                </div>

                {/* Open Room */}
                <Link
                    to={`/room/${room._id}`}
                    className="flex h-10 w-full shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-400 transition duration-300 hover:border-indigo-500/40 hover:bg-indigo-500 hover:text-white active:scale-[0.98] sm:w-10"
                    aria-label={`Open ${room.name}`}
                >
                    <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>

            </div>
        </div>
    );
};

export default RoomCard;