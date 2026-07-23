import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaFilePdf } from "react-icons/fa";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { BsPeopleFill } from "react-icons/bs";

const Hero = () => {
  return (
    <section className="min-h-[90vh] bg-slate-950 text-white flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-green-400 font-semibold mb-3">
            🚀 Real-Time Collaborative Learning
          </p>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Study Together.
            <br />
            <span className="text-green-500">
              Learn Better.
            </span>
          </h1>

          <p className="text-slate-400 text-lg mt-6 max-w-xl leading-8">
            Collaborate on PDFs, discuss ideas in real time, annotate documents,
            and study with friends inside interactive study rooms.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">

            <Link
              to="/register"
              className="bg-green-500 hover:bg-green-600 transition px-7 py-4 rounded-xl font-semibold flex items-center gap-2"
            >
              Get Started
              <FaArrowRight />
            </Link>

            <button className="border border-slate-700 hover:border-green-500 hover:text-green-400 transition px-7 py-4 rounded-xl">
              Live Demo
            </button>

          </div>

        </motion.div>

        {/* Right Content */}

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative"
        >

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">

            <h2 className="text-2xl font-bold mb-8">
              Study Room
            </h2>

            <div className="space-y-5">

              <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl">
                <FaFilePdf className="text-red-500 text-2xl" />
                <div>
                  <h3 className="font-semibold">Operating_System.pdf</h3>
                  <p className="text-sm text-slate-400">
                    Shared PDF
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl">
                <HiOutlineChatAlt2 className="text-green-500 text-2xl" />
                <div>
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-sm text-slate-400">
                    12 new messages
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl">
                <BsPeopleFill className="text-blue-400 text-2xl" />
                <div>
                  <h3 className="font-semibold">
                    Participants
                  </h3>
                  <p className="text-sm text-slate-400">
                    6 Students Online
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Decorative Blur */}
          <div className="absolute -z-10 -top-10 -right-10 w-72 h-72 bg-green-500 rounded-full blur-[120px] opacity-20"></div>

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;