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

    const profileComplete =
        Boolean(
            user?.name &&
            user?.email &&
            user?.bio &&
            user?.avatar
        );

    const stats = [
        {
            title: "Rooms Joined",
            value: "—",
            icon: FaUsers,
            iconClass: "text-green-400",
        },
        {
            title: "Rooms Created",
            value: "—",
            icon: FaDoorOpen,
            iconClass: "text-blue-400",
        },
        {
            title: "Member Since",
            value: memberSince,
            icon: FaCalendarAlt,
            iconClass: "text-purple-400",
        },
        {
            title: "Profile",
            value: profileComplete
                ? "Complete"
                : "Incomplete",
            icon: FaCheckCircle,
            iconClass: profileComplete
                ? "text-green-400"
                : "text-yellow-400",
        },
    ];

    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div className="grid grid-cols-1 divide-y divide-slate-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">

                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="flex items-center gap-4 px-4 py-3 first:pt-3 sm:py-2"
                        >

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800">
                                <Icon
                                    className={`text-lg ${item.iconClass}`}
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm text-slate-500">
                                    {item.title}
                                </p>

                                <p className="mt-1 truncate text-lg font-semibold text-white">
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