import {
    FaEdit,
    FaUserCircle,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";

const API_URL = "http://localhost:5000";

const ProfileHeader = ({ onEdit }) => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const avatarUrl = user?.avatar
        ? `${API_URL}${user.avatar}`
        : null;

    return (
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/10 sm:p-7">

            {/* Background Glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                {/* Profile */}
                <div className="flex min-w-0 items-center gap-5">

                    {/* Avatar */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-lg sm:h-22 sm:w-22">

                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={
                                    user?.name ||
                                    "Profile"
                                }
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <FaUserCircle className="text-6xl text-slate-600" />
                        )}

                    </div>

                    {/* User Details */}
                    <div className="min-w-0">

                        <h2 className="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            {user?.name || "Student"}
                        </h2>

                        <p className="mt-1 truncate text-sm text-slate-500">
                            {user?.email || "No email available"}
                        </p>

                        <div className="mt-3 flex items-center gap-2">

                            <span className="h-2 w-2 rounded-full bg-emerald-400" />

                            <span className="text-xs font-medium text-slate-500">
                                Active account
                            </span>

                        </div>

                    </div>
                </div>

                {/* Edit Profile */}
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 hover:shadow-indigo-500/30"
                >
                    <FaEdit className="text-xs" />
                    Edit Profile
                </button>

            </div>
        </section>
    );
};

export default ProfileHeader;