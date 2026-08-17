import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CTA = () => {
  return (
    <section className="bg-slate-950 py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500 px-6 py-16 text-center shadow-2xl shadow-indigo-500/10 sm:px-12 lg:px-20">

          {/* Background Effects */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-200/10 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
              Start learning together
            </span>

            <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Turn your next study session into a collaborative experience.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Create a study room, invite your friends, share your material,
              and start learning together in real time.
            </p>

            <Link
              to="/register"
              className="group mt-10 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-3.5 font-semibold text-slate-900 shadow-xl transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Create Your Room
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;