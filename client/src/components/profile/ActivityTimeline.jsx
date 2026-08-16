import { useEffect, useState } from "react";
import {
    FaHistory,
    FaPlus,
    FaSignInAlt,
    FaSignOutAlt,
    FaRedo,
} from "react-icons/fa";

import { getUserActivities } from "../../api/activity.api";
import socket from "../../socket/socket";

const ActivityTimeline = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response =
                    await getUserActivities();

                if (response.data?.success) {
                    setActivities(
                        response.data.activities || []
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to fetch activities:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();

        const handleActivityUpdate = () => {
            fetchActivities();
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
    }, []);

    const getActivityDetails = (activity) => {
        const roomName =
            activity.room?.name || "a room";

        switch (activity.type) {
            case "room_created":
                return {
                    text: `Created room "${roomName}"`,
                    icon: FaPlus,
                };

            case "room_joined":
                return {
                    text: `Joined room "${roomName}"`,
                    icon: FaSignInAlt,
                };

            case "room_left":
                return {
                    text: `Left room "${roomName}"`,
                    icon: FaSignOutAlt,
                };

            case "room_rejoined":
                return {
                    text: `Rejoined room "${roomName}"`,
                    icon: FaRedo,
                };

            default:
                return {
                    text: "Performed an activity",
                    icon: FaHistory,
                };
        }
    };

    const formatTime = (date) => {
        if (!date) return "";

        return new Date(
            date
        ).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <section className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-black/10 transition duration-300 hover:border-slate-700 sm:rounded-3xl sm:p-6">

            {/* Subtle background glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl transition duration-500 group-hover:bg-indigo-500/10" />

            {/* Header */}
            <div className="relative mb-6 flex items-center gap-3 sm:mb-7">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 sm:h-11 sm:w-11">
                    <FaHistory className="text-sm text-indigo-400 sm:text-base" />
                </div>

                <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-white sm:text-xl">
                        Recent Activity
                    </h2>

                    <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                        Your latest StudySync activity
                    </p>
                </div>

            </div>

            {/* Loading */}
            {loading && (
                <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 sm:min-h-[220px] sm:rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />

                        <p className="text-sm text-slate-500">
                            Loading activity...
                        </p>
                    </div>
                </div>
            )}

            {/* Empty */}
            {!loading &&
                activities.length === 0 && (
                    <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/50 sm:min-h-[220px] sm:rounded-2xl">

                        <div className="px-4 text-center sm:px-6">

                            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 sm:h-12 sm:w-12">
                                <FaHistory className="text-base text-slate-600 sm:text-lg" />
                            </div>

                            <p className="text-sm font-semibold text-slate-400">
                                No recent activity
                            </p>

                            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-600">
                                Your room activity will appear here.
                            </p>

                        </div>

                    </div>
                )}

            {/* Activities */}
            {!loading &&
                activities.length > 0 && (
                    <div className="relative max-h-[320px] space-y-3 overflow-y-auto pr-1 sm:space-y-4 sm:pr-2">

                        {activities.map(
                            (activity) => {
                                const {
                                    text,
                                    icon: Icon,
                                } =
                                    getActivityDetails(
                                        activity
                                    );

                                return (
                                    <div
                                        key={
                                            activity._id
                                        }
                                        className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3 transition duration-200 hover:border-slate-700 hover:bg-slate-950/70 sm:gap-4 sm:rounded-2xl sm:p-4"
                                    >

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 sm:h-10 sm:w-10">
                                            <Icon className="text-xs text-indigo-400 sm:text-sm" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="break-words text-sm font-medium leading-6 text-slate-200">
                                                {text}
                                            </p>

                                            <p className="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs">
                                                {formatTime(
                                                    activity.createdAt
                                                )}
                                            </p>
                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

        </section>
    );
};

export default ActivityTimeline;