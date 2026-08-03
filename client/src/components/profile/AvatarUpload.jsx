import { FaCamera, FaUserCircle } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";

const AvatarUpload = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">

      <div className="w-32 h-32 mx-auto rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">

        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FaUserCircle className="text-7xl text-slate-500" />
        )}

      </div>

      <button className="mt-6 bg-green-500 hover:bg-green-600 transition px-5 py-3 rounded-xl flex items-center gap-2 mx-auto">

        <FaCamera />

        Upload Avatar

      </button>

    </section>
  );
};

export default AvatarUpload;