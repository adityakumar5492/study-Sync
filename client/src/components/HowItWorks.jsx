import { motion } from "framer-motion";
import {
  FaPlusCircle,
  FaFileUpload,
  FaUserFriends,
  FaBookOpen,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaPlusCircle className="text-4xl text-green-500" />,
    title: "Create a Study Room",
    description:
      "Start a private or public study room in just one click.",
  },
  {
    icon: <FaFileUpload className="text-4xl text-blue-500" />,
    title: "Upload a PDF",
    description:
      "Share your notes, books, or lecture slides with everyone instantly.",
  },
  {
    icon: <FaUserFriends className="text-4xl text-purple-500" />,
    title: "Invite Friends",
    description:
      "Share the room code and let your friends join the session.",
  },
  {
    icon: <FaBookOpen className="text-4xl text-orange-500" />,
    title: "Study Together",
    description:
      "Chat, annotate, and collaborate on the same PDF in real time.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="bg-slate-950 text-white py-24"
    >
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-green-400 font-semibold mb-3">
            HOW IT WORKS
          </p>

          <h2 className="text-4xl font-bold">
            Start Studying in 4 Easy Steps
          </h2>

          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Everything is designed to help students collaborate quickly
            without complicated setup.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-green-500 transition"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-green-500 text-black font-bold flex items-center justify-center">
                {index + 1}
              </div>

              <div className="flex justify-center mt-4 mb-6">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {step.title}
              </h3>

              <p className="text-slate-400 leading-7">
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