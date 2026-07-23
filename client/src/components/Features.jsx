import { motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { BsPencilSquare } from "react-icons/bs";

const features = [
  {
    icon: <FaFilePdf className="text-4xl text-red-500" />,
    title: "Shared PDF Study",
    description:
      "Upload a PDF once and everyone in the room can view and study it together in real time.",
  },
  {
    icon: <BsPencilSquare className="text-4xl text-green-500" />,
    title: "Live Annotations",
    description:
      "Highlight, draw, underline, and write notes together on the same PDF instantly.",
  },
  {
    icon: <HiOutlineChatAlt2 className="text-4xl text-blue-500" />,
    title: "Real-Time Chat",
    description:
      "Discuss concepts, ask questions, and collaborate with your study group while learning.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-slate-900 text-white py-24"
    >
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-green-400 font-semibold mb-3">
            FEATURES
          </p>

          <h2 className="text-4xl font-bold">
            Everything You Need to Study Together
          </h2>

          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            StudySync combines collaborative learning tools into one
            seamless platform designed for students.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-green-500 transition"
            >
              <div className="mb-6">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>

              <p className="text-slate-400 leading-7">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;