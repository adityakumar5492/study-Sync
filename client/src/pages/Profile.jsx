import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileStats from "../components/profile/ProfileStats";
import ActivityTimeline from "../components/profile/ActivityTimeline";
import AvatarUpload from "../components/profile/AvatarUpload";
import EditProfileModal from "../components/profile/EditProfileModal";

const Profile = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          My Profile
        </h1>

        <ProfileHeader />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">

          <div className="lg:col-span-2 space-y-8">
            <ProfileInfo />
            <ActivityTimeline />
          </div>

          <div className="space-y-8">
            <AvatarUpload />
            <ProfileStats />
          </div>

        </div>

        <EditProfileModal />

      </div>

    </div>
  );
};

export default Profile;