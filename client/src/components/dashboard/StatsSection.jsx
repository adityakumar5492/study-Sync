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

  // Temporary calculations (replace with backend values later)
  const stats = {
    roomsJoined: rooms?.length || 0,
    studyHours: 58,
    pdfsShared: 24,
    streak: 14,
  };

  return (
    <section className="mb-10">

      <h2 className="text-2xl font-bold mb-6">
        Statistics
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Rooms Joined"
          value={stats.roomsJoined}
          icon={<FaUsers className="text-green-500" />}
        />

        <StatCard
          title="Study Hours"
          value={`${stats.studyHours} hrs`}
          icon={<FaClock className="text-blue-500" />}
        />

        <StatCard
          title="PDFs Shared"
          value={stats.pdfsShared}
          icon={<FaFilePdf className="text-red-500" />}
        />

        <StatCard
          title="Current Streak"
          value={`${stats.streak} Days`}
          icon={<FaFire className="text-orange-500" />}
        />

      </div>

    </section>
  );
};

export default StatsSection;