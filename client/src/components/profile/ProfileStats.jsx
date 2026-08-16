import {
    FaUsers,
    FaDoorOpen,
    FaCalendarAlt,
    FaCheckCircle,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";

const ProfileStats = () => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const { rooms = [] } = useAppSelector(
        (state) => state.room
    );

    const currentUserId =
        user?._id?.toString();

    const memberSince = user?.createdAt
        ? new Date(
              user.createdAt
          ).toLocaleDateString(
              undefined,
              {
                  month: "short",
                  year: "numeric",
              }
          )
        : "—";

    const roomsJoined = rooms.filter((room) =>
        room.members?.some((member) => {
            const memberId =
                typeof member === "object"
                    ? member?._id?.toString()
                    : member?.toString();

            return memberId === currentUserId;
        })
    ).length;

    const roomsCreated = rooms.filter((room) => {
        const hostId =
            typeof room.host === "object"
                ? room.host?._id?.toString()
                : room.host?.toString();

        return hostId === currentUserId;
    }).length;

    const profileComplete = Boolean(
        user?.name &&
        user?.email &&
        user?.bio &&
        user?.avatar
    );

    const stats = [
        {
            title: "Rooms Joined",
            value: roomsJoined,
            icon: FaUsers,
            iconClass: "text-indigo-400",
            iconBg: "bg-indigo-500/10",
        },
        {
            title: "Rooms Created",
            value: roomsCreated,
            icon: FaDoorOpen,
            iconClass: "text-cyan-400",
            iconBg: "bg-cyan-500/10",
        },
        {
            title: "Member Since",
            value: memberSince,
            icon: FaCalendarAlt,
            iconClass: "text-violet-400",
            iconBg: "bg-violet-500/10",
        },
        {
            title: "Profile",
            value: profileComplete
                ? "Complete"
                : "Incomplete",
            icon: FaCheckCircle,
            iconClass: profileComplete
                ? "text-emerald-400"
                : "text-amber-400",
            iconBg: profileComplete
                ? "bg-emerald-500/10"
                : "bg-amber-500/10",
        },
    ];

    return (
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-3 shadow-xl shadow-black/10 sm:rounded-3xl sm:p-5">

            {/* Subtle background glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl" />

            <div className="relative grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">

                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 transition duration-300 hover:border-slate-700 hover:bg-slate-950/70 sm:gap-4 sm:rounded-2xl sm:p-4"
                        >
                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg} sm:h-11 sm:w-11`}
                            >
                                <Icon
                                    className={`text-sm sm:text-base ${item.iconClass}`}
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[11px] font-medium text-slate-500 sm:text-xs">
                                    {item.title}
                                </p>

                                <p className="mt-1 truncate text-base font-semibold text-white sm:text-lg">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    );
                })}

            </div>

        </section>
    );
};

export default ProfileStats;