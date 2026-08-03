import { FaEdit, FaUserCircle } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";

const ProfileHeader = ({ onEdit }) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left */}

        <div className="flex items-center gap-6">

          <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center">

            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-7xl text-slate-500" />
            )}

          </div>

          <div>

            <h2 className="text-3xl font-bold">
              {user?.name || "Student"}
            </h2>

            <p className="text-slate-400 mt-2">
              {user?.email}
            </p>

          </div>

        </div>

        {/* Right */}

        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-xl font-medium"
        >
          <FaEdit />
          Edit Profile
        </button>

      </div>

    </section>
  );
};

export default ProfileHeader;