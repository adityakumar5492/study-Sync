import {
    FaUsers,
    FaClock,
    FaFilePdf,
    FaFire,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";
import StatCard from "./StatCard";

const StatsSection = () => {
    const { rooms } = useAppSelector((state) => state.room);

    const stats = [
        {
            title: "Rooms Joined",
            value: rooms?.length || 0,
            icon: <FaUsers />,
            iconColor: "text-indigo-400",
            iconBg: "bg-indigo-500/10",
        },
        {
            title: "Study Hours",
            value: "—",
            icon: <FaClock />,
            iconColor: "text-cyan-400",
            iconBg: "bg-cyan-500/10",
        },
        {
            title: "PDFs Shared",
            value: "—",
            icon: <FaFilePdf />,
            iconColor: "text-red-400",
            iconBg: "bg-red-500/10",
        },
        {
            title: "Current Streak",
            value: "—",
            icon: <FaFire />,
            iconColor: "text-orange-400",
            iconBg: "bg-orange-500/10",
        },
    ];

    return (
        <section>
            <div className="mb-5">
                <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                    Your Statistics
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                    A quick overview of your study activity.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={
                            <span
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor} sm:h-11 sm:w-11`}
                            >
                                {stat.icon}
                            </span>
                        }
                    />
                ))}
            </div>
        </section>
    );
};

export default StatsSection;