import { motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { BsPencilSquare } from "react-icons/bs";

const features = [
  {
    icon: <FaFilePdf />,
    title: "Shared PDF Workspace",
    description:
      "Upload study material once and let everyone in the room study from the same document in real time.",
    accent: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: <BsPencilSquare />,
    title: "Live Annotations",
    description:
      "Draw, highlight, and annotate directly on the shared PDF while studying together.",
    accent: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: <HiOutlineChatAlt2 />,
    title: "Real-Time Chat",
    description:
      "Ask questions, discuss concepts, and communicate with your study group without leaving the room.",
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="border-y border-slate-800/60 bg-slate-900 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Everything in one room
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Built for studying
            <span className="text-slate-500"> together.</span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            StudySync brings the tools your study group needs into one
            collaborative workspace.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-8 transition duration-300 hover:border-slate-700 hover:bg-slate-950"
            >
              {/* Icon */}
              <div
                className={`mb-7 flex h-14 w-14 items-center justify-center rounded-xl ${feature.bg} ${feature.accent} text-2xl`}
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold tracking-tight">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {feature.description}
              </p>

              {/* Bottom accent */}
              <div className="mt-8 h-px w-10 bg-slate-700 transition-all duration-300 group-hover:w-20 group-hover:bg-indigo-400" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;