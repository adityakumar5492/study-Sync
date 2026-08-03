import { useAppSelector } from "../../redux/hooks";

const ProfileInfo = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-2xl font-bold mb-6">
        Personal Information
      </h2>

      <div className="space-y-5">

        <div>
          <p className="text-slate-400 text-sm">Full Name</p>
          <p className="text-lg mt-1">{user?.name}</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Email</p>
          <p className="text-lg mt-1">{user?.email}</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Bio</p>
          <p className="text-lg mt-1">
            {user?.bio || "No bio added yet."}
          </p>
        </div>

      </div>

    </section>
  );
};

export default ProfileInfo;