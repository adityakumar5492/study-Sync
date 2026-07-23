import { motion } from "framer-motion";
import {
  FaUsers,
  FaBookOpen,
  FaFilePdf,
  FaComments,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers className="text-4xl text-green-500" />,
    number: "10K+",
    title: "Students",
  },
  {
    icon: <FaBookOpen className="text-4xl text-blue-500" />,
    number: "5K+",
    title: "Study Rooms",
  },
  {
    icon: <FaFilePdf className="text-4xl text-red-500" />,
    number: "50K+",
    title: "PDFs Shared",
  },
  {
    icon: <FaComments className="text-4xl text-purple-500" />,
    number: "100K+",
    title: "Messages",
  },
];

const Stats = () => {
  return (
    <section
      id="stats"
      className="bg-slate-900 text-white py-24"
    >
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-green-400 font-semibold mb-3">
            OUR IMPACT
          </p>

          <h2 className="text-4xl font-bold">
            Trusted by Students Everywhere
          </h2>

          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            StudySync helps students collaborate, discuss, and learn
            together through interactive study rooms.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center hover:border-green-500 transition"
            >
              <div className="flex justify-center mb-5">
                {stat.icon}
              </div>

              <h3 className="text-4xl font-bold text-green-400">
                {stat.number}
              </h3>

              <p className="text-slate-400 mt-3">
                {stat.title}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Stats;