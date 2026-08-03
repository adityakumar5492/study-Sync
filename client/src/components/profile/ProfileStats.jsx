import {
  FaUsers,
  FaClock,
  FaFilePdf,
  FaFire,
} from "react-icons/fa";

const stats = [
  {
    title: "Rooms Joined",
    value: 12,
    icon: <FaUsers className="text-green-500" />,
  },
  {
    title: "Study Hours",
    value: 58,
    icon: <FaClock className="text-blue-500" />,
  },
  {
    title: "PDFs Shared",
    value: 24,
    icon: <FaFilePdf className="text-red-500" />,
  },
  {
    title: "Current Streak",
    value: "14 Days",
    icon: <FaFire className="text-orange-500" />,
  },
];

const ProfileStats = () => {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-2xl font-bold mb-6">
        Statistics
      </h2>

      <div className="space-y-5">

        {stats.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.title}</span>
            </div>

            <span className="font-semibold">
              {item.value}
            </span>
          </div>
        ))}

      </div>

    </section>
  );
};

export default ProfileStats;