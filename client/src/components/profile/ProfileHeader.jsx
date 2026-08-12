import { FaEdit, FaUserCircle } from "react-icons/fa";
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
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between gap-6">

                {/* Avatar + Name */}
                <div className="flex items-center gap-5">

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800">

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
                            <FaUserCircle className="text-6xl text-slate-500" />
                        )}

                    </div>

                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        {user?.name || "Student"}
                    </h2>

                </div>

                {/* Edit Profile */}
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-white transition hover:bg-green-600"
                >
                    <FaEdit />
                    Edit Profile
                </button>

            </div>
        </section>
    );
};

export default ProfileHeader;