import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CTA = () => {
  return (
    <section className="bg-slate-950 py-24">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 p-12 lg:p-16 text-center">

          {/* Background Blur */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">

            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Transform
              <br />
              Your Study Sessions?
            </h2>

            <p className="text-white/90 text-lg mt-6 max-w-2xl mx-auto leading-8">
              Create study rooms, collaborate on PDFs, chat with friends,
              and make learning more interactive than ever before.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-3 mt-10 bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:scale-105 transition duration-300"
            >
              Get Started Free
              <FaArrowRight />
            </Link>

          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;