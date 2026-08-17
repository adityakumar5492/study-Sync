import { motion } from "framer-motion";
import {
  FaUsers,
  FaBookOpen,
  FaFilePdf,
  FaComments,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers />,
    value: "Real-Time",
    title: "Collaboration",
    description: "Study with your group in the same room.",
  },
  {
    icon: <FaBookOpen />,
    value: "Shared",
    title: "Study Rooms",
    description: "Create private or public collaborative rooms.",
  },
  {
    icon: <FaFilePdf />,
    value: "Live",
    title: "PDF Workspace",
    description: "Study from the same material together.",
  },
  {
    icon: <FaComments />,
    value: "Instant",
    title: "Communication",
    description: "Chat with everyone while you study.",
  },
];

const Stats = () => {
  return (
    <section
      id="stats"
      className="border-y border-slate-800/60 bg-slate-900 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Built for collaboration
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Everything happens
            <span className="text-slate-500"> in one place.</span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            StudySync brings the essential tools for collaborative learning
            into one focused workspace.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-400 transition group-hover:bg-indigo-500/15">
                {stat.icon}
              </div>

              <p className="text-2xl font-bold text-white">
                {stat.value}
              </p>

              <h3 className="mt-1 font-semibold text-slate-200">
                {stat.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Stats;