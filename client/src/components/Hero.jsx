import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaFilePdf } from "react-icons/fa";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { BsPeopleFill } from "react-icons/bs";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-[140px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-24">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Real-Time Collaborative Learning
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Study together.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Learn better.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            Collaborate on PDFs, discuss ideas, annotate documents, and
            study with friends inside interactive real-time study rooms.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-3 rounded-xl bg-indigo-500 px-7 py-3.5 font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:bg-indigo-400 hover:shadow-indigo-500/30"
            >
              Get Started
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-slate-700 bg-slate-900/50 px-7 py-3.5 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-900"
            >
              Explore Features
            </a>
          </div>

          {/* Small trust line */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span>✓ Real-time collaboration</span>
            <span>✓ Shared PDF workspace</span>
            <span>✓ Live communication</span>
          </div>
        </motion.div>

        {/* Right Product Preview */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-black/40 backdrop-blur">

            {/* Window Header */}
            <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>

              <div className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-400">
                Study Room
              </div>
            </div>

            {/* PDF Preview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Shared Material
                  </p>

                  <h2 className="mt-1 font-semibold text-white">
                    Operating_System.pdf
                  </h2>
                </div>

                <div className="rounded-lg bg-red-500/10 p-3">
                  <FaFilePdf className="text-xl text-red-400" />
                </div>
              </div>

              {/* Fake PDF */}
              <div className="space-y-3 rounded-xl border border-slate-800 bg-white p-6">
                <div className="h-3 w-2/3 rounded bg-slate-200" />
                <div className="h-2 w-full rounded bg-slate-100" />
                <div className="h-2 w-5/6 rounded bg-slate-100" />
                <div className="h-2 w-4/6 rounded bg-slate-100" />

                <div className="mt-6 h-24 rounded-lg bg-slate-100 p-4">
                  <div className="h-2 w-1/2 rounded bg-slate-300" />
                  <div className="mt-3 h-2 w-3/4 rounded bg-slate-200" />
                  <div className="mt-2 h-2 w-2/3 rounded bg-slate-200" />
                </div>

                <div className="h-2 w-4/5 rounded bg-slate-100" />
                <div className="h-2 w-3/5 rounded bg-slate-100" />
              </div>
            </div>

            {/* Activity Cards */}
            <div className="mt-4 grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-cyan-500/10 p-2">
                    <HiOutlineChatAlt2 className="text-lg text-cyan-400" />
                  </div>

                  <span className="text-xs text-slate-500">
                    Live
                  </span>
                </div>

                <p className="text-sm font-semibold text-white">
                  Live Chat
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  12 new messages
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-500/10 p-2">
                    <BsPeopleFill className="text-lg text-indigo-400" />
                  </div>

                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Live
                  </span>
                </div>

                <p className="text-sm font-semibold text-white">
                  Participants
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  6 students online
                </p>
              </div>

            </div>
          </div>

          {/* Glow */}
          <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-indigo-500/10 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;