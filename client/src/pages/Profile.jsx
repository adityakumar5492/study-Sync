import {
    useState,
    useEffect,
} from "react";

import {
    useOutletContext,
} from "react-router-dom";

import {
    FaBars,
} from "react-icons/fa";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileStats from "../components/profile/ProfileStats";
import ActivityTimeline from "../components/profile/ActivityTimeline";
import EditProfileModal from "../components/profile/EditProfileModal";

import { useAppDispatch } from "../redux/hooks";
import { getRoomsThunk } from "../redux/room/roomThunk";
import socket from "../socket/socket";

const Profile = () => {
    const [editModalOpen, setEditModalOpen] =
        useState(false);

    const dispatch = useAppDispatch();

    const { openSidebar } =
        useOutletContext();

    useEffect(() => {
        dispatch(getRoomsThunk());

        const handleActivityUpdate = () => {
            dispatch(getRoomsThunk());
        };

        socket.on(
            "profile:activity-updated",
            handleActivityUpdate
        );

        return () => {
            socket.off(
                "profile:activity-updated",
                handleActivityUpdate
            );
        };
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <main className="min-w-0 overflow-y-auto">

                <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8">

                    {/* Page Header */}
                    <div className="mb-6 sm:mb-7">

                        {/* Mobile / Tablet Menu */}
                        <button
                            type="button"
                            onClick={openSidebar}
                            className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 shadow-lg shadow-black/5 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white active:scale-95 lg:hidden"
                            aria-label="Open navigation menu"
                        >
                            <FaBars className="text-sm" />
                        </button>

                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-400 sm:text-sm">
                            Account
                        </p>

                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                            My Profile
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Manage your profile and view your study activity.
                        </p>

                    </div>

                    {/* Profile Header */}
                    <ProfileHeader
                        onEdit={() =>
                            setEditModalOpen(true)
                        }
                    />

                    {/* Statistics */}
                    <div className="mt-5 sm:mt-6">
                        <ProfileStats />
                    </div>

                    {/* Profile Information + Activity */}
                    <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-2">

                        <ProfileInfo />

                        <ActivityTimeline />

                    </div>

                </div>

            </main>

            {/* Edit Profile Modal */}
            <EditProfileModal
                open={editModalOpen}
                onClose={() =>
                    setEditModalOpen(false)
                }
            />

        </div>
    );
};

export default Profile;