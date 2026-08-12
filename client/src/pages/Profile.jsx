import { useState } from "react";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileStats from "../components/profile/ProfileStats";
import ActivityTimeline from "../components/profile/ActivityTimeline";
import EditProfileModal from "../components/profile/EditProfileModal";

const Profile = () => {
    const [editModalOpen, setEditModalOpen] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">

                {/* ===========================
                    Header
                =========================== */}

                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        My Profile
                    </h1>
                </div>

                <ProfileHeader
                    onEdit={() =>
                        setEditModalOpen(true)
                    }
                />

                {/* ===========================
                    Statistics
                =========================== */}

                <div className="mt-6">
                    <ProfileStats />
                </div>

                {/* ===========================
                    Main Information
                =========================== */}

                <div className="mt-6 grid gap-6 lg:grid-cols-2">

                    <ProfileInfo />

                    <ActivityTimeline />

                </div>

                {/* ===========================
                    Edit Profile
                =========================== */}

                <EditProfileModal
                    open={editModalOpen}
                    onClose={() =>
                        setEditModalOpen(false)
                    }
                />

            </div>

        </div>
    );
};

export default Profile;