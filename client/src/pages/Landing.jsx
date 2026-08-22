import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  FaArrowRight,
  FaBookOpen,
  FaComments,
  FaFilePdf,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaUsers,
  FaVideo,
  FaPen,
  FaSearch,
  FaPlus,
  FaCheck,
  FaPlay,
  FaMicrophone,
  FaMicrophoneSlash,
  FaDesktop,
  FaSmile,
  FaVolumeUp,
  FaClock,
  FaGlobe,
  FaRocket,
  FaQuoteLeft,
  FaBrain,
  FaLightbulb,
  FaBell,
  FaRegClock,
  FaExpand,
  FaPlayCircle,
} from "react-icons/fa";

import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
} from "react-icons/hi";

import {
  BsPeopleFill,
  BsPencilSquare,
  BsChatDotsFill,
} from "react-icons/bs";

/* =========================================================
   STUDYSYNC — PREMIUM LANDING PAGE
   ========================================================= */

const Landing = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05050a] text-white selection:bg-violet-500/30">
      <Navbar />
      <Hero />
      <LiveCollaboration />
      <VoiceCollaboration />
      <InteractiveWorkspace />
      <CinematicRoom />
      <LiveStudyMap />
      <StudyFlow />
      <Features />
      <HowItWorks />
      <StatsMarquee />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Landing;

/* =========================================================
   NAVBAR
   ========================================================= */

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Experience", "#experience"],
    ["Features", "#features"],
    ["How It Works", "#how"],
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.07] bg-[#05050a]/80 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* LOGO */}

          <Link to="/" className="group relative flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_30px_rgba(139,92,246,.35)]"
            >
              <FaBookOpen className="text-sm text-white" />

              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
            </motion.div>

            <span className="text-xl font-black tracking-tight">
              Study
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Sync
              </span>
            </span>
          </Link>

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-2 md:flex">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="group relative rounded-full px-5 py-2.5 text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                {label}

                <span className="absolute bottom-1 left-5 right-5 h-px origin-left scale-x-0 bg-gradient-to-r from-violet-400 to-cyan-400 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          {/* ACTIONS */}

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="group relative overflow-hidden rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(255,255,255,.18)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start studying
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </span>

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-200/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
          </div>

          {/* MOBILE */}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
          >
            {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 bg-[#05050a]/95 px-5 backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-2 py-5">
                {links.map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    {label}
                  </a>
                ))}

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-zinc-300"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-white px-4 py-3 text-center font-bold text-black"
                >
                  Start studying
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

/* =========================================================
   HERO
   ========================================================= */

const Hero = () => {
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 80,
    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 80,
    damping: 20,
  });

  const rotateX = useTransform(smoothY, [-500, 500], [6, -6]);
  const rotateY = useTransform(smoothX, [-500, 500], [-6, 6]);

  const handleMouseMove = (e) => {
    if (reduceMotion) return;

    mouseX.set(e.clientX - window.innerWidth / 2);
    mouseY.set(e.clientY - window.innerHeight / 2);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-[#05050a]"
    >
      {/* =================================================
          BACKGROUND
          ================================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* giant glow */}

        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  x: [0, 60, -40, 0],
                  y: [0, -40, 50, 0],
                  scale: [1, 1.1, 0.95, 1],
                }
          }
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[-15%] top-[5%] h-[550px] w-[550px] rounded-full bg-violet-600/20 blur-[140px]"
        />

        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  x: [0, -50, 30, 0],
                  y: [0, 40, -30, 0],
                  scale: [1, 0.9, 1.08, 1],
                }
          }
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-10%] top-[25%] h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]"
        />

        {/* grid */}

        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

        {/* vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#05050a_85%)]" />
      </div>

      {/* =================================================
          CONTENT
          ================================================= */}

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-10 lg:pt-28">
        {/* LEFT */}

        <div className="relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-violet-300 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
            </span>

            The future of collaborative learning
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-3xl text-[3.4rem] font-black leading-[.95] tracking-[-.055em] sm:text-6xl lg:text-[5.5rem]"
          >
            Don't study
            <br />

            <span className="relative">
              alone.
              <motion.span
                animate={
                  reduceMotion
                    ? {}
                    : {
                        opacity: [0.3, 1, 0.3],
                      }
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 blur-sm"
              />
            </span>

            <br />

            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              Build together.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mt-8 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg"
          >
            A real-time study universe where your friends, notes, PDFs,
            conversations, annotations and ideas live in one beautiful
            collaborative room.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              to="/register"
              className="group relative overflow-hidden rounded-full bg-white px-7 py-4 font-bold text-black shadow-[0_15px_60px_rgba(255,255,255,.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(255,255,255,.16)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Create your study room
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1.5" />
              </span>

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-100 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>

            <a
              href="#experience"
              className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-7 py-4 font-semibold text-zinc-300 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <FaPlay className="ml-0.5 text-[9px]" />
              </span>
              See how it works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-500"
          >
            {[
              "Real-time collaboration",
              "Shared PDF workspace",
              "Live communication",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <FaCheck className="text-[9px] text-emerald-400" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* =================================================
            COLLABORATION SCENE
            ================================================= */}

        <motion.div
          style={
            reduceMotion
              ? {}
              : {
                  rotateX,
                  rotateY,
                }
          }
          initial={{ opacity: 0, scale: 0.88, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.1,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mx-auto w-full max-w-[700px] [transform-style:preserve-3d]"
        >
          <StudyUniverse />
        </motion.div>
      </div>

      {/* bottom fade */}

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#05050a] to-transparent" />
    </section>
  );
};

/* =========================================================
   STUDY UNIVERSE
   ========================================================= */

const StudyUniverse = () => {
  const people = [
    {
      name: "A",
      position: "left-[2%] top-[18%]",
      gradient: "from-violet-500 to-fuchsia-500",
      delay: 0,
    },
    {
      name: "R",
      position: "right-[1%] top-[12%]",
      gradient: "from-cyan-400 to-blue-500",
      delay: 0.8,
    },
    {
      name: "S",
      position: "left-[5%] bottom-[15%]",
      gradient: "from-emerald-400 to-cyan-500",
      delay: 1.4,
    },
    {
      name: "M",
      position: "right-[4%] bottom-[13%]",
      gradient: "from-orange-400 to-pink-500",
      delay: 2,
    },
  ];

  return (
    <div className="relative aspect-[1.05/1] w-full">
      {/* outer glow */}

      <div className="absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[90px]" />

      {/* orbit rings */}

      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/[0.08]"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.07]"
      />

      {/* connection lines */}

      <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.07]" />

      {/* people */}

      {people.map((person) => (
        <motion.div
          key={person.name}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            delay: person.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute ${person.position} z-30`}
        >
          <StudentAvatar
            name={person.name}
            gradient={person.gradient}
          />
        </motion.div>
      ))}

      {/* MAIN ROOM */}

      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 z-20 w-[68%] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0c0c14]/90 shadow-[0_40px_120px_rgba(0,0,0,.7),0_0_80px_rgba(124,58,237,.15)] backdrop-blur-2xl">
          {/* window header */}

          <div className="flex h-11 items-center justify-between border-b border-white/[0.07] px-4">
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400/70" />
              <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
              <span className="h-2 w-2 rounded-full bg-green-400/70" />
            </div>

            <div className="rounded-md bg-white/5 px-3 py-1 text-[8px] font-medium text-zinc-500">
              STUDYSYNC / ROOM 204
            </div>

            <div className="flex items-center gap-1 text-[8px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              LIVE
            </div>
          </div>

          {/* workspace */}

          <div className="grid grid-cols-[1fr_105px] gap-3 p-3">
            {/* PDF */}

            <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[7px] uppercase tracking-widest text-zinc-600">
                    Shared document
                  </p>

                  <p className="mt-1 text-[10px] font-bold text-zinc-200">
                    Operating Systems.pdf
                  </p>
                </div>

                <div className="rounded-lg bg-red-500/10 p-2">
                  <FaFilePdf className="text-xs text-red-400" />
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg bg-[#f8f8fa] p-4">
                <p className="text-[11px] font-black text-zinc-900">
                  PROCESS MANAGEMENT
                </p>

                <div className="mt-3 space-y-2">
                  <div className="h-1.5 w-[75%] rounded-full bg-zinc-300" />
                  <div className="h-1.5 w-full rounded-full bg-zinc-200" />
                  <div className="h-1.5 w-[88%] rounded-full bg-zinc-200" />
                  <div className="h-1.5 w-[65%] rounded-full bg-zinc-200" />
                </div>

                {/* highlighted section */}

                <motion.div
                  animate={{
                    opacity: [0.35, 0.8, 0.35],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                  }}
                  className="mt-5 rounded-md bg-violet-200 p-3"
                >
                  <div className="h-1.5 w-[55%] rounded-full bg-violet-400" />

                  <div className="mt-2 h-1.5 w-[85%] rounded-full bg-violet-200" />
                </motion.div>

                <div className="mt-4 space-y-2">
                  <div className="h-1.5 w-full rounded-full bg-zinc-200" />
                  <div className="h-1.5 w-[70%] rounded-full bg-zinc-200" />
                </div>

                {/* animated annotation */}

                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className="absolute bottom-5 left-7 h-8 w-24 rotate-[-5deg] rounded-full border-b-2 border-violet-500"
                />
              </div>
            </div>

            {/* SIDE PANEL */}

            <div className="space-y-3">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[8px] font-semibold text-zinc-500">
                    ONLINE
                  </span>

                  <span className="text-[8px] text-emerald-400">
                    4 people
                  </span>
                </div>

                <div className="flex -space-x-2">
                  {["A", "R", "S", "M"].map((x, i) => (
                    <motion.div
                      key={x}
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.4,
                        repeat: Infinity,
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0c0c14] bg-gradient-to-br from-violet-500 to-cyan-400 text-[8px] font-black"
                    >
                      {x}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CHAT */}

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                <div className="mb-3 flex items-center gap-2">
                  <BsChatDotsFill className="text-[10px] text-cyan-400" />

                  <span className="text-[8px] font-semibold text-zinc-400">
                    LIVE CHAT
                  </span>
                </div>

                <div className="space-y-2">
                  <ChatBubble
                    text="This topic is confusing 😭"
                    side="left"
                  />

                  <ChatBubble
                    text="Check page 12!"
                    side="right"
                  />

                  <ChatBubble
                    text="Got it 🔥"
                    side="left"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* bottom toolbar */}

          <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-3">
            <div className="flex gap-2">
              <ToolButton icon={<FaPen />} />
              <ToolButton icon={<FaSearch />} />
              <ToolButton icon={<BsPencilSquare />} />
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[7px] text-emerald-400">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Everyone synced
            </div>
          </div>
        </div>
      </motion.div>

      {/* FLOATING CHAT */}

      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute right-[7%] top-[31%] z-40 hidden rounded-2xl border border-white/10 bg-[#10101a]/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-[9px] font-bold">
            R
          </div>

          <div>
            <p className="text-[8px] font-bold text-white">Rahul</p>
            <p className="mt-0.5 text-[8px] text-zinc-500">
              I think the answer is...
            </p>
          </div>
        </div>
      </motion.div>

      {/* FLOATING ANNOTATION */}

      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [2, -2, 2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute bottom-[18%] left-[2%] z-40 hidden rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <BsPencilSquare className="text-violet-300" />

          <span className="text-[9px] font-semibold text-violet-200">
            Aditya highlighted this
          </span>
        </div>
      </motion.div>

      {/* CENTER PULSE */}

      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 0, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="absolute left-1/2 top-1/2 z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/30"
      />
    </div>
  );
};

/* =========================================================
   STUDENT AVATAR
   ========================================================= */

const StudentAvatar = ({ name, gradient }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-violet-500/40 blur-xl" />

      <motion.div
        whileHover={{ scale: 1.15 }}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br ${gradient} text-sm font-black shadow-[0_10px_40px_rgba(0,0,0,.5)]`}
      >
        {name}

        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#05050a] bg-emerald-400 shadow-[0_0_10px_#34d399]" />
      </motion.div>

      <motion.div
        animate={{
          opacity: [0, 1, 0],
          scale: [0.7, 1.3, 1.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="absolute inset-0 rounded-full border border-cyan-400/50"
      />
    </div>
  );
};

/* =========================================================
   CHAT BUBBLE
   ========================================================= */

const ChatBubble = ({ text, side }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -5 : 5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg px-2 py-1.5 text-[7px] ${
        side === "right"
          ? "ml-auto w-fit bg-violet-500/20 text-violet-200"
          : "bg-white/5 text-zinc-500"
      }`}
    >
      {text}
    </motion.div>
  );
};

/* =========================================================
   TOOL BUTTON
   ========================================================= */

const ToolButton = ({ icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.15, y: -2 }}
      className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-[8px] text-zinc-500"
    >
      {icon}
    </motion.div>
  );
};

/* =========================================================
   LIVE COLLABORATION
   ========================================================= */

const LiveCollaboration = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-[#05050a] py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-300">
            <HiOutlineLightningBolt />
            One room. Everyone connected.
          </span>

          <h2 className="mt-7 text-4xl font-black tracking-[-.04em] sm:text-6xl">
            It feels less like an app.
            <br />

            <span className="bg-gradient-to-r from-zinc-400 to-zinc-700 bg-clip-text text-transparent">
              More like a digital campus.
            </span>
          </h2>

          <p className="mt-6 text-base leading-7 text-zinc-500 sm:text-lg">
            See what your friends are reading. Discuss ideas instantly.
            Annotate the same page. Everything stays synchronized.
          </p>
        </motion.div>

        {/* collaboration strip */}

        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-2 shadow-[0_30px_100px_rgba(0,0,0,.5)]"
          >
            <div className="rounded-[26px] border border-white/[0.05] bg-[#0a0a10] p-5 sm:p-8">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                {/* avatars */}

                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((person, index) => (
                    <motion.div
                      key={person}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                      }}
                      whileHover={{
                        y: -8,
                        zIndex: 10,
                      }}
                      className={`relative -ml-3 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#0a0a10] text-xs font-black ${
                        index % 2 === 0
                          ? "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                          : "bg-gradient-to-br from-cyan-400 to-blue-500"
                      }`}
                    >
                      {["A", "R", "S", "M", "K"][index]}

                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0a0a10] bg-emerald-400" />
                    </motion.div>
                  ))}

                  <div className="ml-3 text-sm">
                    <p className="font-bold text-white">5 students</p>
                    <p className="text-xs text-zinc-600">studying together</p>
                  </div>
                </div>

                {/* activity */}

                <div className="flex flex-wrap items-center gap-3">
                  <ActivityPill
                    icon={<FaFilePdf />}
                    text="PDF synced"
                    color="red"
                  />

                  <ActivityPill
                    icon={<BsPencilSquare />}
                    text="3 annotations"
                    color="violet"
                  />

                  <ActivityPill
                    icon={<FaComments />}
                    text="12 messages"
                    color="cyan"
                  />
                </div>
              </div>

              {/* progress */}

              <div className="mt-8">
                <div className="mb-2 flex justify-between text-[10px]">
                  <span className="text-zinc-600">
                    Collective study session
                  </span>

                  <span className="text-zinc-500">68%</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "68%" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.5,
                      delay: 0.3,
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   ACTIVITY PILL
   ========================================================= */

const ActivityPill = ({ icon, text, color }) => {
  const colors = {
    red: "text-red-400 bg-red-400/10 border-red-400/10",
    violet: "text-violet-400 bg-violet-400/10 border-violet-400/10",
    cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/10",
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] ${colors[color]}`}
    >
      {icon}
      {text}
    </motion.div>
  );
};


/* =========================================================
   LIVE VOICE COLLABORATION — "PEOPLE SPEAKING TOGETHER"
   ========================================================= */

const VoiceCollaboration = () => {
  const speakers = [
    { name: "Aditya", role: "Explaining", gradient: "from-violet-500 to-fuchsia-500", message: "Wait — look at this process!" },
    { name: "Rahul", role: "Listening", gradient: "from-cyan-400 to-blue-500", message: "Ohhh, now I get it." },
    { name: "Simran", role: "Annotating", gradient: "from-emerald-400 to-cyan-500", message: "I marked the important part." },
    { name: "Karan", role: "Solving", gradient: "from-orange-400 to-pink-500", message: "Give me 30 seconds..." },
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.05] bg-[#07070d] py-28 sm:py-40">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [-100, 100, -100], y: [0, 70, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[10%] h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[130px]"
        />
        <motion.div
          animate={{ x: [100, -80, 100], y: [0, -60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[5%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="LIVE PRESENCE"
          title="You don't just see who's online. You feel the room."
          description="Students speak, react, point at the same page and solve problems together. StudySync turns a silent screen into a living study session."
        />

        <div className="mt-20 grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
          {/* Main video collaboration stage */}
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
            className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#0b0b13] p-3 shadow-[0_40px_120px_rgba(0,0,0,.55)]"
          >
            <div className="relative min-h-[510px] overflow-hidden rounded-[27px] border border-white/[0.06] bg-gradient-to-br from-[#11111b] via-[#0b0b12] to-[#08080d] p-4 sm:p-6">
              {/* fake top bar */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[.25em] text-violet-400">
                    LIVE STUDY ROOM
                  </p>
                  <p className="mt-1 text-sm font-bold text-white sm:text-base">
                    Operating Systems — Group Revision
                  </p>
                </div>

                <motion.div
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[9px] font-bold text-emerald-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                  4 LIVE
                </motion.div>
              </div>

              {/* connecting energy line */}
              <div className="absolute left-1/2 top-[48%] hidden h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent md:block" />
              <motion.div
                animate={{ x: ["-20%", "120%"] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-[48%] hidden h-1 w-20 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-sm md:block"
              />

              {/* speaker tiles */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {speakers.map((speaker, index) => (
                  <SpeakerTile key={speaker.name} speaker={speaker} index={index} />
                ))}
              </div>

              {/* room controls */}
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 shadow-2xl backdrop-blur-xl">
                <LiveControl icon={<FaMicrophone />} />
                <LiveControl icon={<FaVideo />} />
                <LiveControl icon={<FaDesktop />} />
                <LiveControl icon={<FaSmile />} />
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,.25)]"
                >
                  <FaPhoneIcon />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Conversation timeline */}
          <div className="space-y-4">
            {[
              ["00:14", "Aditya is explaining", "“The scheduler decides which process gets CPU time.”", "violet"],
              ["00:27", "Rahul reacted", "“That finally makes sense 🔥”", "cyan"],
              ["00:41", "Simran annotated", "Highlighted → Round Robin scheduling", "emerald"],
              ["01:02", "Karan joined", "Joined from another device", "orange"],
            ].map(([time, title, message, tone], index) => (
              <motion.div
                key={time}
                initial={{ opacity: 0, x: 35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 6 }}
                className="group rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    tone === "violet" ? "bg-violet-500/10 text-violet-300" :
                    tone === "cyan" ? "bg-cyan-500/10 text-cyan-300" :
                    tone === "emerald" ? "bg-emerald-500/10 text-emerald-300" :
                    "bg-orange-500/10 text-orange-300"
                  }`}>
                    {index === 0 ? <FaMicrophone /> : index === 1 ? <FaSmile /> : index === 2 ? <BsPencilSquare /> : <FaUsers />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-white">{title}</p>
                      <span className="font-mono text-[9px] text-zinc-600">{time}</span>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-zinc-500">{message}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="rounded-[24px] border border-violet-400/10 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {speakers.map((s) => (
                    <div
                      key={s.name}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#11111b] bg-gradient-to-br ${s.gradient} text-[8px] font-black`}
                    >
                      {s.name[0]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Everyone is in sync</p>
                  <p className="text-[10px] text-zinc-600">Voice • Video • Chat • Notes</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SpeakerTile = ({ speaker, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.015 }}
      className="group relative min-h-[185px] overflow-hidden rounded-[22px] border border-white/[0.08] bg-black/30 p-4"
    >
      <motion.div
        animate={{
          opacity: [0.08, 0.18, 0.08],
          scale: [0.95, 1.1, 0.95],
        }}
        transition={{ duration: 3 + index, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${speaker.gradient} blur-3xl`}
      />

      <div className="relative flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${speaker.gradient} text-sm font-black shadow-lg`}>
          {speaker.name[0]}
        </div>

        <div className="flex items-end gap-[3px]">
          {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
            <motion.span
              key={bar}
              animate={{ height: [4, 9 + ((bar + index) % 4) * 4, 5, 12, 4] }}
              transition={{
                duration: 0.65 + bar * 0.05,
                repeat: Infinity,
                delay: bar * 0.06 + index * 0.15,
                ease: "easeInOut",
              }}
              className="w-1 rounded-full bg-cyan-300/80"
            />
          ))}
        </div>
      </div>

      <div className="relative mt-7">
        <p className="text-xs font-bold text-white">{speaker.name}</p>
        <p className="mt-1 text-[9px] uppercase tracking-widest text-zinc-600">{speaker.role}</p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -4] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 1 + index * 1.1,
            times: [0, 0.15, 0.75, 1],
          }}
          className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.035] px-3 py-2 text-[9px] leading-4 text-zinc-400"
        >
          {speaker.message}
        </motion.div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[8px] text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        speaking
      </div>
    </motion.div>
  );
};

const LiveControl = ({ icon }) => (
  <motion.button
    whileHover={{ y: -3, scale: 1.08 }}
    whileTap={{ scale: 0.94 }}
    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[11px] text-zinc-400 transition hover:bg-white/10 hover:text-white"
  >
    {icon}
  </motion.button>
);

const FaPhoneIcon = () => (
  <span className="block h-3 w-3 rotate-[135deg] rounded-[2px] border-b-2 border-l-2 border-white" />
);


/* =========================================================
   INTERACTIVE WORKSPACE
   ========================================================= */

const InteractiveWorkspace = () => {
  const activities = [
    { user: "A", text: "highlighted Process Management", icon: <BsPencilSquare />, gradient: "from-violet-500 to-fuchsia-500" },
    { user: "R", text: "sent a message", icon: <BsChatDotsFill />, gradient: "from-cyan-400 to-blue-500" },
    { user: "S", text: "opened the shared PDF", icon: <FaFilePdf />, gradient: "from-red-500 to-orange-500" },
    { user: "M", text: "joined the voice room", icon: <FaMicrophone />, gradient: "from-emerald-400 to-cyan-500" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#05050a] py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="THE WHOLE EXPERIENCE"
          title="One workspace. Four things happening at once."
          description="The point is not to add more UI. The point is to make collaboration visible, immediate and genuinely useful."
        />

        <div className="mt-20 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.text}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 7 }}
                className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${activity.gradient} text-xs font-black`}>
                  {activity.user}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-zinc-300">
                    <span className="font-bold text-white">{activity.user === "A" ? "Aditya" : activity.user === "R" ? "Rahul" : activity.user === "S" ? "Simran" : "Mohit"}</span>{" "}
                    {activity.text}
                  </p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2.8 + index, repeat: Infinity, ease: "linear", delay: index * .5 }}
                      className="h-full w-1/3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                    />
                  </div>
                </div>
                <span className="text-sm text-zinc-600">{activity.icon}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative min-h-[480px] overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a10] p-4 shadow-[0_35px_100px_rgba(0,0,0,.5)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,.12),transparent_45%)]" />

            {/* floating cursors */}
            {[
              ["A", "left-[18%] top-[32%]", "from-violet-500 to-fuchsia-500"],
              ["R", "left-[55%] top-[52%]", "from-cyan-400 to-blue-500"],
              ["S", "right-[18%] top-[24%]", "from-emerald-400 to-cyan-500"],
            ].map(([name, pos, gradient], index) => (
              <motion.div
                key={name}
                animate={{ x: [0, 30, -15, 0], y: [0, -15, 22, 0] }}
                transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut", delay: index * .7 }}
                className={`absolute ${pos} z-20`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-[8px] font-black shadow-lg`}>
                  {name}
                </div>
                <div className="ml-5 mt-[-3px] h-0 w-0 border-l-[5px] border-r-[5px] border-t-[9px] border-l-transparent border-r-transparent border-t-white/80 rotate-[-35deg]" />
              </motion.div>
            ))}

            <div className="relative z-10 h-full rounded-[25px] border border-white/[0.06] bg-[#101017] p-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[.2em] text-zinc-600">Collaborative Canvas</p>
                  <p className="mt-1 text-sm font-bold text-white">CPU Scheduling Notes</p>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((x) => (
                    <span key={x} className="h-2 w-2 rounded-full bg-white/10" />
                  ))}
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/[0.025] p-4">
                  <p className="text-[10px] font-bold text-zinc-300">Round Robin</p>
                  <div className="mt-5 space-y-3">
                    {[65, 90, 48, 78, 58].map((w, i) => (
                      <motion.div
                        key={i}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${w}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: .8, delay: i * .08 }}
                        className="h-2 rounded-full bg-white/10"
                      />
                    ))}
                  </div>
                  <motion.div
                    animate={{ opacity: [0.3, 1, .3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-6 rounded-xl border border-violet-400/20 bg-violet-500/10 p-3 text-[9px] text-violet-200"
                  >
                    Aditya: "Think of the time quantum like a turn."
                  </motion.div>
                </div>

                <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-4">
                  <p className="text-[10px] font-bold text-cyan-200">Live reactions</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["🔥", "💡", "😂", "👏", "⚡"].map((emoji, i) => (
                      <motion.span
                        key={emoji}
                        animate={{ y: [0, -6, 0], rotate: [0, i % 2 ? 4 : -4, 0] }}
                        transition={{ duration: 2.5 + i * .2, repeat: Infinity, delay: i * .15 }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-sm"
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </div>
                  <div className="mt-7 space-y-2">
                    <p className="text-[8px] text-zinc-600">LIVE ACTIVITY</p>
                    {["Rahul joined", "Simran annotated", "Mohit reacted"].map((item, i) => (
                      <motion.p
                        key={item}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: .5 + i * .15 }}
                        className="text-[9px] text-zinc-400"
                      >
                        <span className="mr-2 text-emerald-400">●</span>{item}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-zinc-500">COLLABORATION HEAT</span>
                  <span className="text-[9px] text-emerald-400">HIGH</span>
                </div>
                <div className="mt-4 flex h-14 items-end gap-1">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: [6, 12 + ((i * 17) % 36), 8] }}
                      transition={{ duration: 1.2 + (i % 5) * .2, repeat: Infinity, delay: i * .04 }}
                      className="flex-1 rounded-t bg-gradient-to-t from-violet-500/20 to-cyan-400/80"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};



/* =========================================================
   CINEMATIC ROOM — DEEP VISUAL PRODUCT MOMENT
   ========================================================= */

const CinematicRoom = () => {
  const cursorData = [
    { name: "A", label: "Aditya", x: "15%", y: "26%", gradient: "from-violet-500 to-fuchsia-500", delay: 0 },
    { name: "R", label: "Rahul", x: "72%", y: "20%", gradient: "from-cyan-400 to-blue-500", delay: .8 },
    { name: "S", label: "Simran", x: "38%", y: "65%", gradient: "from-emerald-400 to-cyan-500", delay: 1.5 },
    { name: "M", label: "Mohit", x: "79%", y: "70%", gradient: "from-orange-400 to-pink-500", delay: 2.2 },
  ];

  return (
    <section className="relative min-h-[900px] overflow-hidden bg-[#030307] py-28 sm:py-40">
      {/* cinematic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(124,58,237,.12),transparent_35%),radial-gradient(circle_at_15%_70%,rgba(34,211,238,.08),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(217,70,239,.07),transparent_28%)]" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.08, 1] }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-400/[0.08]"
        />

        {/* stars / particles */}
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.span
            key={i}
            animate={{
              opacity: [.1, .8, .1],
              scale: [.6, 1.2, .6],
              y: [0, -12 - (i % 4) * 5, 0],
            }}
            transition={{
              duration: 2.5 + (i % 5),
              repeat: Infinity,
              delay: i * .12,
            }}
            className="absolute h-1 w-1 rounded-full bg-white/50"
            style={{
              left: `${(i * 29) % 100}%`,
              top: `${(i * 47) % 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .7 }}
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/[0.05] px-4 py-2 text-[10px] font-black uppercase tracking-[.22em] text-fuchsia-300"
          >
            <FaBrain />
            A room that feels alive
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .8, delay: .08 }}
            className="mt-7 text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl"
          >
            Four minds.
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              One shared moment.
            </span>
          </motion.h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
            This is the visual heartbeat of StudySync: people moving around the
            same material, talking, reacting and leaving traces of their thinking.
          </p>
        </div>

        {/* central cinematic workspace */}
        <motion.div
          initial={{ opacity: 0, scale: .86, y: 70 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-20 max-w-6xl [perspective:1600px]"
        >
          <motion.div
            animate={{ rotateX: [2, -1, 2], rotateY: [-2, 2, -2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="relative [transform-style:preserve-3d]"
          >
            <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-[#09090f]/95 p-2 shadow-[0_50px_180px_rgba(0,0,0,.75),0_0_100px_rgba(124,58,237,.12)] backdrop-blur-2xl">
              <div className="relative min-h-[560px] overflow-hidden rounded-[31px] border border-white/[0.06] bg-[#0d0d15]">
                {/* top browser chrome */}
                <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-5">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((x) => (
                      <span key={x} className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    ))}
                  </div>
                  <div className="rounded-full border border-white/[0.06] bg-white/[0.025] px-5 py-2 text-[8px] font-mono text-zinc-600">
                    studysync.app / room / os-revision
                  </div>
                  <div className="flex items-center gap-2 text-[8px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                    LIVE
                  </div>
                </div>

                {/* shared workspace */}
                <div className="grid min-h-[500px] grid-cols-[1fr_220px] gap-3 p-3">
                  <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#f7f7fa]">
                    <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[.2em] text-zinc-500">
                          Shared PDF
                        </p>
                        <p className="mt-1 text-xs font-black text-zinc-900">
                          Operating Systems — Process Scheduling
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className="rounded-md bg-red-500/10 px-2 py-1 text-[8px] font-bold text-red-500">PDF</span>
                        <span className="rounded-md bg-black/5 px-2 py-1 text-[8px] text-zinc-500">12 / 38</span>
                      </div>
                    </div>

                    <div className="relative p-7 sm:p-10">
                      <p className="text-2xl font-black tracking-tight text-zinc-900">
                        Process Scheduling
                      </p>
                      <p className="mt-3 max-w-xl text-xs leading-6 text-zinc-500">
                        The scheduler selects a process from the ready queue and
                        allocates CPU time according to the selected scheduling algorithm.
                      </p>

                      <div className="mt-9 grid gap-3 sm:grid-cols-3">
                        {["FCFS", "SJF", "Round Robin"].map((item, i) => (
                          <motion.div
                            key={item}
                            animate={{ y: [0, i % 2 ? -3 : 3, 0] }}
                            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                            className={`rounded-xl border p-4 ${
                              i === 2
                                ? "border-violet-400/30 bg-violet-100"
                                : "border-black/5 bg-black/[0.025]"
                            }`}
                          >
                            <p className="text-[10px] font-black text-zinc-800">{item}</p>
                            <div className="mt-3 h-1.5 rounded-full bg-zinc-200">
                              <div className={`h-full rounded-full ${i === 2 ? "w-[82%] bg-violet-500" : "w-[55%] bg-zinc-300"}`} />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-8 rounded-2xl border border-violet-200 bg-violet-50 p-5">
                        <p className="text-[9px] font-black uppercase tracking-[.18em] text-violet-500">
                          Group explanation
                        </p>
                        <p className="mt-2 text-xs font-bold leading-6 text-violet-950">
                          "Think of the time quantum like a turn. Everyone gets a
                          small slice of CPU time."
                        </p>
                      </div>

                      {/* animated highlights */}
                      <motion.div
                        animate={{ x: ["-20%", "110%"] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 top-[49%] h-7 w-24 rounded-full bg-violet-300/20 blur-md"
                      />
                    </div>

                    {/* animated cursors */}
                    {cursorData.map((cursor, index) => (
                      <motion.div
                        key={cursor.name}
                        animate={{
                          left: [cursor.x, `calc(${cursor.x} + ${index % 2 ? "-8%" : "8%"})`, cursor.x],
                          top: [cursor.y, `calc(${cursor.y} + ${index % 2 ? "7%" : "-6%"})`, cursor.y],
                        }}
                        transition={{
                          duration: 6 + index,
                          repeat: Infinity,
                          delay: cursor.delay,
                          ease: "easeInOut",
                        }}
                        className="absolute z-30"
                      >
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${cursor.gradient} text-[8px] font-black text-white shadow-lg`}>
                          {cursor.name}
                        </div>
                        <div className="ml-5 h-0 w-0 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-zinc-900 rotate-[-28deg]" />
                        <div className="ml-6 mt-1 rounded-full bg-black px-2 py-1 text-[7px] font-bold text-white shadow-xl">
                          {cursor.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* live side panel */}
                  <div className="hidden space-y-3 md:block">
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] font-bold uppercase tracking-[.18em] text-zinc-600">Participants</p>
                        <span className="text-[8px] text-emerald-400">4 active</span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {cursorData.map((person, index) => (
                          <motion.div
                            key={person.name}
                            animate={{ opacity: [0.65, 1, .65] }}
                            transition={{ duration: 2 + index * .3, repeat: Infinity }}
                            className="flex items-center gap-3"
                          >
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${person.gradient} text-[8px] font-black`}>
                              {person.name}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[9px] font-bold text-zinc-300">{person.label}</p>
                              <p className="text-[7px] text-zinc-600">
                                {index === 0 ? "speaking" : index === 1 ? "watching" : index === 2 ? "annotating" : "solving"}
                              </p>
                            </div>
                            <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? "bg-violet-400" : "bg-emerald-400"}`} />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                      <div className="flex items-center gap-2">
                        <FaVolumeUp className="text-[9px] text-cyan-300" />
                        <p className="text-[8px] font-bold text-zinc-400">VOICE ACTIVITY</p>
                      </div>

                      <div className="mt-5 flex h-12 items-center gap-1">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <motion.span
                            key={i}
                            animate={{ height: [3, 6 + ((i * 13) % 32), 5] }}
                            transition={{ duration: .7 + (i % 5) * .08, repeat: Infinity, delay: i * .03 }}
                            className="flex-1 rounded-full bg-gradient-to-t from-violet-500/30 to-cyan-300"
                          />
                        ))}
                      </div>

                      <div className="mt-4 rounded-xl bg-violet-500/10 p-3">
                        <p className="text-[8px] text-violet-200">
                          Aditya is explaining Round Robin scheduling...
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                      <div className="flex items-center gap-2">
                        <FaBell className="text-[9px] text-amber-300" />
                        <p className="text-[8px] font-bold text-zinc-400">LIVE EVENTS</p>
                      </div>
                      <div className="mt-4 space-y-3">
                        {["Rahul reacted 🔥", "Simran highlighted a line", "Mohit joined"].map((event, i) => (
                          <motion.p
                            key={event}
                            initial={{ opacity: 0, x: 10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: .3 + i * .15 }}
                            className="text-[8px] text-zinc-500"
                          >
                            <span className="mr-2 text-cyan-400">›</span>{event}
                          </motion.p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* floating glass labels */}
              <motion.div
                animate={{ y: [0, -9, 0], rotate: [-2, 1, -2] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -left-5 top-[22%] hidden rounded-2xl border border-violet-400/20 bg-[#11111a]/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                    <FaLightbulb />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-white">Idea captured</p>
                    <p className="mt-1 text-[8px] text-zinc-600">Round Robin → time quantum</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], rotate: [2, -1, 2] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -right-5 bottom-[19%] hidden rounded-2xl border border-cyan-400/20 bg-[#11111a]/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                    <FaVolumeUp />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-white">Live discussion</p>
                    <p className="mt-1 text-[8px] text-zinc-600">4 people connected</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};


/* =========================================================
   LIVE STUDY MAP — VISUAL NETWORK
   ========================================================= */

const LiveStudyMap = () => {
  const nodes = [
    { label: "PDF", x: "50%", y: "45%", icon: <FaFilePdf />, main: true },
    { label: "Aditya", x: "14%", y: "24%", icon: "A" },
    { label: "Rahul", x: "84%", y: "23%", icon: "R" },
    { label: "Simran", x: "19%", y: "76%", icon: "S" },
    { label: "Mohit", x: "81%", y: "77%", icon: "M" },
    { label: "Chat", x: "50%", y: "12%", icon: <BsChatDotsFill /> },
    { label: "Voice", x: "50%", y: "88%", icon: <FaMicrophone /> },
  ];

  return (
    <section className="relative overflow-hidden bg-[#05050a] py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .7 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[.22em] text-cyan-300"
            >
              <FaGlobe />
              Everything is connected
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .8, delay: .08 }}
              className="mt-7 text-4xl font-black leading-[.98] tracking-[-.05em] sm:text-6xl"
            >
              Your study room is a
              <span className="block bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                living network.
              </span>
            </motion.h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
              Every action creates a visible relationship: people connect to the
              document, conversations connect to ideas, and ideas connect back to
              the people discussing them.
            </p>

            <div className="mt-9 grid max-w-xl grid-cols-2 gap-3">
              {[
                [<FaUsers />, "4", "active minds"],
                [<FaMicrophone />, "1", "speaking now"],
                [<BsPencilSquare />, "7", "annotations"],
                [<FaRegClock />, "42m", "session time"],
              ].map(([icon, value, label], i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: .15 + i * .08 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                >
                  <div className="text-cyan-300">{icon}</div>
                  <p className="mt-3 text-xl font-black text-white">{value}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-widest text-zinc-600">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* network visual */}
          <motion.div
            initial={{ opacity: 0, scale: .88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative mx-auto aspect-square w-full max-w-[650px]"
          >
            <div className="absolute inset-[8%] rounded-full bg-violet-500/5 blur-[80px]" />

            {/* orbit rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[8%] rounded-full border border-violet-400/[0.08]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[20%] rounded-full border border-cyan-400/[0.08]"
            />

            {/* connection lines */}
            <svg className="absolute inset-0 h-full w-full overflow-visible">
              {nodes.slice(1).map((node, i) => (
                <motion.line
                  key={node.label}
                  x1="50%"
                  y1="45%"
                  x2={node.x}
                  y2={node.y}
                  stroke="rgba(167,139,250,.16)"
                  strokeWidth="1"
                  strokeDasharray="5 9"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: i * .12 }}
                />
              ))}
            </svg>

            {/* moving packets */}
            {nodes.slice(1, 5).map((node, i) => (
              <motion.div
                key={`packet-${node.label}`}
                animate={{
                  left: ["50%", node.x, "50%"],
                  top: ["45%", node.y, "45%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  delay: i * .8,
                  ease: "easeInOut",
                }}
                className="absolute z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,.8)]"
              />
            ))}

            {nodes.map((node, i) => (
              <motion.div
                key={node.label}
                animate={
                  node.main
                    ? { scale: [1, 1.04, 1] }
                    : { y: [0, -7, 0] }
                }
                transition={{
                  duration: node.main ? 3 : 4 + i * .25,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * .2,
                }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
                style={{ left: node.x, top: node.y }}
              >
                {node.main ? (
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 shadow-[0_0_80px_rgba(139,92,246,.2)] backdrop-blur-xl">
                    <motion.div
                      animate={{ scale: [1, 1.35, 1], opacity: [.4, 0, .4] }}
                      transition={{ duration: 2.8, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-violet-300/30"
                    />
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-red-500 shadow-xl">
                      {node.icon}
                    </div>
                    <span className="absolute -bottom-7 rounded-full border border-white/10 bg-[#0b0b12] px-3 py-1 text-[8px] font-bold text-zinc-400">
                      shared document
                    </span>
                  </div>
                ) : (
                  <div className="group flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/15 bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-black shadow-[0_15px_45px_rgba(0,0,0,.5)]"
                    >
                      {node.icon}
                    </motion.div>
                    <span className="mt-2 rounded-full border border-white/[0.06] bg-[#0b0b12]/90 px-2.5 py-1 text-[8px] font-bold text-zinc-500 backdrop-blur-xl">
                      {node.label}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};


/* =========================================================
   STUDY FLOW — LONGER SCROLL EXPERIENCE
   ========================================================= */

const StudyFlow = () => {
  const cards = [
    {
      icon: <FaRocket />,
      title: "Start in seconds",
      text: "Create a room and invite your group without building a complicated workspace first.",
      stat: "01",
    },
    {
      icon: <FaGlobe />,
      title: "Everyone arrives",
      text: "Presence, voice, chat and shared material make the room instantly feel occupied.",
      stat: "02",
    },
    {
      icon: <FaPen />,
      title: "Ideas become visible",
      text: "Annotate, point, highlight and explain concepts while everyone watches the same context.",
      stat: "03",
    },
    {
      icon: <FaCheck />,
      title: "Leave with progress",
      text: "The session ends with actual progress instead of 47 open tabs and a dead group chat.",
      stat: "04",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#08080d] py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="A SESSION, VISUALIZED"
          title="Watch a study session come alive."
          description="Scroll through the experience: people arrive, talk, annotate, react and move through the same material together."
        />

        <div className="relative mt-24">
          <div className="absolute bottom-0 left-[28px] top-0 hidden w-px bg-gradient-to-b from-violet-500/60 via-fuchsia-500/30 to-cyan-400/60 md:block" />

          <div className="space-y-8 md:space-y-12">
            {cards.map((card, index) => (
              <motion.div
                key={card.stat}
                initial={{ opacity: 0, x: index % 2 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}
                className="relative md:pl-20"
              >
                <motion.div
                  whileInView={{ scale: [0.7, 1.1, 1] }}
                  viewport={{ once: true }}
                  className="absolute left-[10px] top-8 hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#08080d] text-violet-300 shadow-[0_0_30px_rgba(139,92,246,.2)] md:flex"
                >
                  {card.icon}
                </motion.div>

                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#0b0b12] p-7 shadow-[0_25px_80px_rgba(0,0,0,.3)] sm:p-10"
                >
                  <div className="absolute right-[-70px] top-[-70px] h-56 w-56 rounded-full bg-violet-500/5 blur-3xl transition-all duration-700 group-hover:scale-150" />

                  <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-violet-400">
                        <span className="md:hidden">{card.icon}</span>
                        MOMENT {card.stat}
                      </div>
                      <h3 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                        {card.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-zinc-500 sm:text-base">
                        {card.text}
                      </p>
                    </div>

                    <motion.div
                      animate={{ rotate: [0, 4, -4, 0], y: [0, -5, 0] }}
                      transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                      className="relative shrink-0"
                    >
                      <div className="flex h-28 w-28 items-center justify-center rounded-[28px] border border-white/10 bg-gradient-to-br from-violet-500/10 to-cyan-400/5 text-4xl text-violet-300 shadow-[0_20px_60px_rgba(0,0,0,.35)]">
                        {card.icon}
                      </div>
                      <span className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-1 font-mono text-[8px] font-black text-black">
                        0{index + 1}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Big animated quote */}
        <motion.div
          initial={{ opacity: 0, scale: .94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: .9 }}
          className="relative mx-auto mt-28 max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 p-8 text-center sm:p-14"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.06]"
          />
          <FaQuoteLeft className="relative mx-auto text-2xl text-violet-300" />
          <p className="relative mx-auto mt-7 max-w-3xl text-2xl font-black leading-tight tracking-tight text-white sm:text-4xl">
            "The best study session is the one where everyone is contributing."
          </p>
          <p className="relative mt-5 text-xs uppercase tracking-[.2em] text-zinc-600">
            StudySync philosophy
          </p>
        </motion.div>
      </div>
    </section>
  );
};


/* =========================================================
   FEATURES
   ========================================================= */

const Features = () => {
  const features = [
    {
      number: "01",
      icon: <FaFilePdf />,
      title: "One shared workspace",
      text: "Everyone sees the same study material. Upload once and your entire group is instantly on the same page.",
      gradient: "from-red-500/20 to-orange-500/5",
      iconColor: "text-red-400",
    },
    {
      number: "02",
      icon: <BsPencilSquare />,
      title: "Ideas move in real time",
      text: "Highlight, draw, annotate and explain concepts directly on shared material while your friends watch.",
      gradient: "from-violet-500/20 to-fuchsia-500/5",
      iconColor: "text-violet-400",
    },
    {
      number: "03",
      icon: <BsChatDotsFill />,
      title: "Conversation stays alive",
      text: "Ask questions and discuss difficult concepts without switching between Discord, WhatsApp and your notes.",
      gradient: "from-cyan-500/20 to-blue-500/5",
      iconColor: "text-cyan-400",
    },
    {
      number: "04",
      icon: <FaUsers />,
      title: "Know who's actually studying",
      text: "Live participants, presence indicators and shared activity make the room feel genuinely alive.",
      gradient: "from-emerald-500/20 to-cyan-500/5",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden border-y border-white/[0.05] bg-[#08080d] py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="THE TOOLKIT"
          title="Everything your group needs."
          description="Not another boring dashboard packed with unnecessary features. Just the tools that make studying together actually work."
        />

        <div className="mt-20 grid gap-5 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.65,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -8,
              }}
              className={`group relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-gradient-to-br ${feature.gradient} p-8 transition-shadow duration-500 hover:border-white/[0.13] hover:shadow-[0_30px_80px_rgba(0,0,0,.35)] sm:p-10`}
            >
              <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-white/[0.025] blur-3xl transition-all duration-700 group-hover:scale-150" />

              <div className="relative flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-xl ${feature.iconColor}`}
                >
                  {feature.icon}
                </div>

                <span className="font-mono text-xs text-zinc-700">
                  {feature.number}
                </span>
              </div>

              <h3 className="relative mt-9 text-2xl font-black tracking-tight">
                {feature.title}
              </h3>

              <p className="relative mt-4 max-w-lg text-sm leading-7 text-zinc-500 sm:text-base">
                {feature.text}
              </p>

              <div className="relative mt-8 h-px w-12 bg-gradient-to-r from-violet-400 to-cyan-400 transition-all duration-500 group-hover:w-24" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   HOW IT WORKS
   ========================================================= */

const HowItWorks = () => {
  const steps = [
    {
      n: "01",
      title: "Create a room",
      text: "Create a private or public study space for your group.",
      icon: <FaPlus />,
    },
    {
      n: "02",
      title: "Bring your material",
      text: "Upload PDFs, notes or lecture material everyone needs.",
      icon: <FaFilePdf />,
    },
    {
      n: "03",
      title: "Invite your people",
      text: "Share the room and watch your study group appear live.",
      icon: <FaUsers />,
    },
    {
      n: "04",
      title: "Actually study",
      text: "Read, annotate, chat and solve problems together.",
      icon: <FaBookOpen />,
    },
  ];

  return (
    <section
      id="how"
      className="relative overflow-hidden bg-[#05050a] py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="THE FLOW"
          title="From empty room to full study session."
          description="Four steps. Zero unnecessary friction."
        />

        <div className="relative mt-20">
          {/* animated line */}

          <div className="absolute left-[12%] right-[12%] top-9 hidden h-px bg-white/[0.06] lg:block">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
            />
          </div>

          <div className="grid gap-12 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                }}
                className="relative text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 5 }}
                  className="relative z-10 mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-2xl border border-white/10 bg-[#0c0c13] text-violet-300 shadow-[0_15px_40px_rgba(0,0,0,.4)]"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/10 opacity-0 blur-xl transition-opacity hover:opacity-100" />

                  <span className="relative text-xl">{step.icon}</span>

                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[8px] font-black text-white">
                    {step.n}
                  </span>
                </motion.div>

                <h3 className="mt-7 text-lg font-bold">{step.title}</h3>

                <p className="mx-auto mt-3 max-w-[230px] text-sm leading-6 text-zinc-600">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   SECTION HEADING
   ========================================================= */

const SectionHeading = ({ eyebrow, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="max-w-3xl"
    >
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.22em] text-violet-400">
        <span className="h-px w-8 bg-violet-400/50" />
        {eyebrow}
      </div>

      <h2 className="mt-6 text-4xl font-black leading-[1] tracking-[-.045em] sm:text-6xl">
        {title}
      </h2>

      <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
        {description}
      </p>
    </motion.div>
  );
};


/* =========================================================
   STATS MARQUEE
   ========================================================= */

const StatsMarquee = () => {
  const stats = [
    ["REAL-TIME", "Everything updates instantly"],
    ["VOICE", "Talk while you study"],
    ["PDF", "One shared source of truth"],
    ["CHAT", "Questions stay in context"],
    ["PRESENCE", "Know who is actually here"],
    ["SYNC", "Everyone sees the same moment"],
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.05] bg-[#030307] py-8">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex w-max gap-4"
      >
        {[...stats, ...stats].map(([title, text], index) => (
          <div
            key={`${title}-${index}`}
            className="flex min-w-[245px] items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.35)]" />
            <div>
              <p className="text-[9px] font-black tracking-[.18em] text-white">{title}</p>
              <p className="mt-1 text-[9px] text-zinc-600">{text}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};


/* =========================================================
   FINAL CTA
   ========================================================= */

const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden bg-[#05050a] py-28 sm:py-40">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-cyan-500/10 px-6 py-20 shadow-[0_40px_120px_rgba(124,58,237,.12)] sm:px-12"
        >
          {/* floating dots */}

          {[1, 2, 3, 4, 5].map((dot) => (
            <motion.span
              key={dot}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.7, 0.2],
              }}
              transition={{
                duration: 3 + dot,
                repeat: Infinity,
                delay: dot * 0.3,
              }}
              className="absolute h-1.5 w-1.5 rounded-full bg-violet-300"
              style={{
                left: `${10 + dot * 15}%`,
                top: `${20 + (dot % 2) * 45}%`,
              }}
            />
          ))}

          <HiOutlineSparkles className="mx-auto text-3xl text-violet-300" />

          <h2 className="mx-auto mt-7 max-w-3xl text-4xl font-black tracking-[-.045em] sm:text-6xl">
            Your next study session
            <br />
            should feel different.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400">
            Stop studying in isolation. Create a room, bring your friends and
            turn learning into something you actually want to return to.
          </p>

          <Link
            to="/register"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-black text-black transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(255,255,255,.15)]"
          >
            Enter StudySync
            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* =========================================================
   FOOTER
   ========================================================= */

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030307]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <Link
              to="/"
              className="text-2xl font-black tracking-tight text-white"
            >
              Study
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Sync
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-600">
              A real-time collaborative learning platform built for students
              who believe learning is better together.
            </p>

            <div className="mt-6 flex gap-3">
              <Social icon={<FaGithub />} href="https://github.com" />
              <Social icon={<FaLinkedin />} href="https://linkedin.com" />
              <Social icon={<FaTwitter />} href="#" />
            </div>
          </div>

          <div className="flex gap-16 text-sm">
            <div>
              <p className="font-bold text-white">Product</p>

              <div className="mt-4 space-y-3 text-zinc-600">
                <a className="block transition hover:text-white" href="#features">
                  Features
                </a>

                <a className="block transition hover:text-white" href="#how">
                  How it works
                </a>

                <a
                  className="block transition hover:text-white"
                  href="#experience"
                >
                  Collaboration
                </a>
              </div>
            </div>

            <div>
              <p className="font-bold text-white">Account</p>

              <div className="mt-4 space-y-3 text-zinc-600">
                <Link
                  className="block transition hover:text-white"
                  to="/login"
                >
                  Login
                </Link>

                <Link
                  className="block transition hover:text-white"
                  to="/register"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/[0.06] pt-7 text-xs text-zinc-700">
          © {new Date().getFullYear()} StudySync. Built for collaborative
          learning.
          <p>Built By Aditya</p>
        </div>
      </div>
    </footer>
  );
};

/* =========================================================
   SOCIAL
   ========================================================= */

const Social = ({ icon, href }) => {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      whileHover={{ y: -4, scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-500 transition hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-white"
    >
      {icon}
    </motion.a>
  );
};