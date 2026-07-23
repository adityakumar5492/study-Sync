import {
  FaUsers,
  FaClock,
  FaFilePdf,
  FaFire,
} from "react-icons/fa";

import StatCard from "./StatCard";

const StatsSection = () => {
  return (
    <section className="mb-10">

      <h2 className="text-2xl font-bold mb-6">
        Statistics
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Rooms Joined"
          value="12"
          icon={<FaUsers className="text-green-500" />}
        />

        <StatCard
          title="Study Hours"
          value="58"
          icon={<FaClock className="text-blue-500" />}
        />

        <StatCard
          title="PDFs Shared"
          value="24"
          icon={<FaFilePdf className="text-red-500" />}
        />

        <StatCard
          title="Current Streak"
          value="14 Days"
          icon={<FaFire className="text-orange-500" />}
        />

      </div>

    </section>
  );
};

export default StatsSection;