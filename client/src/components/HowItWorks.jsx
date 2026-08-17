import { motion } from "framer-motion";
import {
  FaPlusCircle,
  FaFileUpload,
  FaUserFriends,
  FaBookOpen,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaPlusCircle />,
    title: "Create a Room",
    description:
      "Create a private or public study room and set up your collaborative workspace.",
  },
  {
    icon: <FaFileUpload />,
    title: "Share Material",
    description:
      "Upload your PDF notes, books, or lecture slides for everyone in the room.",
  },
  {
    icon: <FaUserFriends />,
    title: "Invite Your Group",
    description:
      "Share the room invite code and bring your study partners into the session.",
  },
  {
    icon: <FaBookOpen />,
    title: "Study Together",
    description:
      "Read, annotate, chat, and collaborate on the same material in real time.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="bg-slate-950 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Simple workflow
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            From setup to study
            <span className="text-slate-500"> in minutes.</span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Create your room, invite your group, and start learning together
            without unnecessary setup.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* Connecting line */}
          <div className="absolute left-[12%] right-[12%] top-12 hidden h-px bg-gradient-to-r from-indigo-500/20 via-indigo-500/60 to-cyan-500/20 lg:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
              }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              {/* Number + Icon */}
              <div className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 shadow-xl shadow-black/20">
                <div className="text-3xl text-indigo-400">
                  {step.icon}
                </div>

                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-slate-950 bg-indigo-500 text-xs font-bold text-white">
                  {index + 1}
                </span>
              </div>

              <h3 className="mt-7 text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;