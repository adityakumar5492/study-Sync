import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaArrowRight,
  FaBookOpen,
  FaComments,
  FaFilePdf,
  FaUsers,
  FaPen,
  FaCheck,
  FaPlus,
  FaMicrophone,
  FaLightbulb,
} from "react-icons/fa";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { BsPencilSquare, BsChatDotsFill } from "react-icons/bs";

const Landing = () => {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#05050a] text-white selection:bg-violet-500/30">
      <Navbar />
      <Hero />
      <CollaborationExperience />
      <Features />
      <HowItWorks />
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

  const links = [
    ["Experience", "#experience"],
    ["Features", "#features"],
    ["How It Works", "#how"],
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#05050a]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_24px_rgba(139,92,246,.25)] sm:h-9 sm:w-9">
            <FaBookOpen className="text-xs text-white" />
          </div>
          <span className="text-lg font-black tracking-tight sm:text-xl">
            Study
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Sync
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
          >
            Start studying
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 md:hidden"
        >
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/[0.06] bg-[#05050a] px-4 py-4 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                {label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-zinc-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-black"
              >
                Start studying
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

/* =========================================================
   HERO
   ========================================================= */

const Hero = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#05050a] pt-16 sm:pt-[72px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-20%] top-[-10%] h-[360px] w-[360px] rounded-full bg-violet-600/15 blur-[110px] sm:h-[520px] sm:w-[520px]" />
        <div className="absolute right-[-18%] top-[22%] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-[110px] sm:h-[480px] sm:w-[480px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#05050a_82%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-64px)] w-full max-w-7xl items-center gap-12 px-4 py-14 sm:min-h-[calc(100svh-72px)] sm:px-6 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:px-8 lg:py-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0"
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-300 sm:px-4 sm:text-xs sm:tracking-[0.18em]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,.7)]" />
            Real-time collaborative learning
          </div>

          <h1 className="mt-6 max-w-3xl text-[clamp(2.65rem,11vw,5.8rem)] font-black leading-[0.92] tracking-[-0.055em] sm:mt-7">
            Don't study
            <br />
            <span className="text-white">alone.</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              Build together.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-6 text-zinc-400 sm:mt-7 sm:text-base sm:leading-7 lg:text-lg">
            Study rooms, shared PDFs, live annotations, chat and voice — all in
            one focused collaborative workspace.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-black transition-transform hover:-translate-y-0.5 sm:px-7"
            >
              Create your study room
              <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#experience"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:px-7"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[9px]">
                <FaPlayIcon />
              </span>
              See the workspace
            </a>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-2.5 text-xs text-zinc-500 sm:mt-8 sm:grid-cols-3 sm:gap-4">
            {["Real-time collaboration", "Shared PDF workspace", "Live communication"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <FaCheck className="shrink-0 text-[9px] text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <HeroWorkspace reduceMotion={reduceMotion} />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#05050a] to-transparent" />
    </section>
  );
};

/* =========================================================
   HERO WORKSPACE
   ========================================================= */

const HeroWorkspace = ({ reduceMotion }) => {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.97 }}
      animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[680px]"
    >
      <div className="absolute inset-[12%] rounded-full bg-violet-600/10 blur-[80px]" />

      <div className="relative rounded-[24px] border border-white/10 bg-[#0b0b13]/95 p-1.5 shadow-[0_30px_90px_rgba(0,0,0,.55)] sm:rounded-[30px] sm:p-2">
        <div className="overflow-hidden rounded-[19px] border border-white/[0.06] bg-[#0d0d15] sm:rounded-[24px]">
          <div className="flex h-10 items-center justify-between border-b border-white/[0.06] px-3 sm:h-12 sm:px-4">
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400/70" />
              <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
              <span className="h-2 w-2 rounded-full bg-green-400/70" />
            </div>
            <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[7px] font-medium text-zinc-500 sm:px-3 sm:text-[8px]">
              STUDYSYNC / ROOM 204
            </span>
            <span className="flex items-center gap-1 text-[7px] font-bold text-emerald-400 sm:text-[8px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              LIVE
            </span>
          </div>

          <div className="grid gap-2.5 p-2.5 sm:grid-cols-[1fr_150px] sm:gap-3 sm:p-3">
            <div className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5 sm:p-3">
              <div className="mb-2.5 flex items-center justify-between gap-2 sm:mb-3">
                <div className="min-w-0">
                  <p className="text-[7px] uppercase tracking-[0.18em] text-zinc-600">Shared document</p>
                  <p className="mt-1 truncate text-[9px] font-bold text-zinc-200 sm:text-[10px]">
                    Operating Systems.pdf
                  </p>
                </div>
                <div className="shrink-0 rounded-lg bg-red-500/10 p-1.5 sm:p-2">
                  <FaFilePdf className="text-[10px] text-red-400 sm:text-xs" />
                </div>
              </div>

              <div className="relative min-h-[180px] overflow-hidden rounded-lg bg-[#f7f7fa] p-3 sm:min-h-[230px] sm:p-4">
                <p className="text-[10px] font-black text-zinc-900 sm:text-[11px]">PROCESS MANAGEMENT</p>
                <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
                  <div className="h-1.5 w-[72%] rounded-full bg-zinc-300" />
                  <div className="h-1.5 w-full rounded-full bg-zinc-200" />
                  <div className="h-1.5 w-[86%] rounded-full bg-zinc-200" />
                  <div className="h-1.5 w-[62%] rounded-full bg-zinc-200" />
                </div>

                <div className="mt-5 rounded-md bg-violet-100 p-2.5 sm:mt-7 sm:p-3">
                  <div className="h-1.5 w-[55%] rounded-full bg-violet-400" />
                  <div className="mt-2 h-1.5 w-[84%] rounded-full bg-violet-200" />
                </div>

                <div className="mt-4 space-y-1.5 sm:mt-5 sm:space-y-2">
                  <div className="h-1.5 w-full rounded-full bg-zinc-200" />
                  <div className="h-1.5 w-[68%] rounded-full bg-zinc-200" />
                </div>

                {!reduceMotion && (
                  <motion.div
                    animate={{ x: ["-20%", "105%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 top-[58%] h-6 w-20 rounded-full bg-violet-300/20 blur-md"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3">
              <PreviewPanel title="Participants">
                <div className="flex -space-x-2">
                  {["A", "R", "S", "M"].map((letter, index) => (
                    <div
                      key={letter}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0d0d15] text-[8px] font-black ${
                        index % 2 === 0
                          ? "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                          : "bg-gradient-to-br from-cyan-400 to-blue-500"
                      }`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[8px] text-zinc-600">4 students online</p>
              </PreviewPanel>

              <PreviewPanel title="Live chat">
                <div className="space-y-1.5">
                  <ChatLine text="This topic is confusing" />
                  <ChatLine text="Check page 12!" right />
                  <ChatLine text="Got it 🔥" />
                </div>
              </PreviewPanel>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex items-center gap-1.5 text-zinc-500">
              <MiniTool icon={<FaPen />} />
              <MiniTool icon={<BsPencilSquare />} />
              <MiniTool icon={<FaComments />} />
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[7px] font-medium text-emerald-400 sm:text-[8px]">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Everyone synced
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PreviewPanel = ({ title, children }) => (
  <div className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5 sm:p-3">
    <div className="mb-2 flex items-center justify-between gap-2">
      <span className="truncate text-[7px] font-semibold uppercase tracking-[0.14em] text-zinc-600">{title}</span>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
    </div>
    {children}
  </div>
);

const ChatLine = ({ text, right = false }) => (
  <div className={`rounded-md px-2 py-1 text-[7px] ${right ? "ml-auto w-fit bg-violet-500/15 text-violet-200" : "bg-white/5 text-zinc-500"}`}>
    {text}
  </div>
);

const MiniTool = ({ icon }) => (
  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-[8px]">
    {icon}
  </span>
);

const FaPlayIcon = () => (
  <span className="ml-0.5 block h-0 w-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white" />
);

/* =========================================================
   COLLABORATION EXPERIENCE
   ========================================================= */

const CollaborationExperience = () => {
  const reduceMotion = useReducedMotion();

  const activity = [
    ["Aditya", "highlighted Process Management", "violet", <BsPencilSquare />],
    ["Rahul", "sent a message", "cyan", <BsChatDotsFill />],
    ["Simran", "opened the shared PDF", "red", <FaFilePdf />],
    ["Mohit", "joined the voice room", "emerald", <FaMicrophone />],
  ];

  return (
    <section id="experience" className="relative overflow-hidden border-y border-white/[0.05] bg-[#07070d] py-20 sm:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="ONE ROOM. EVERYONE CONNECTED."
          title="The tools stay together, so the group stays focused."
          description="StudySync keeps material, communication and collaboration in the same shared context instead of scattering them across different apps."
          reduceMotion={reduceMotion}
        />

        <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {activity.map(([user, text, tone, icon], index) => (
              <motion.div
                key={text}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.05 }}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black ${tone === "violet" ? "bg-violet-500/10 text-violet-300" : tone === "cyan" ? "bg-cyan-500/10 text-cyan-300" : tone === "red" ? "bg-red-500/10 text-red-300" : "bg-emerald-500/10 text-emerald-300"}`}>
                  {user[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-zinc-400 sm:text-sm">
                    <span className="font-bold text-white">{user}</span> {text}
                  </p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                  </div>
                </div>
                <span className="shrink-0 text-sm text-zinc-600">{icon}</span>
              </motion.div>
            ))}
          </div>

          <CollaborationBoard reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  );
};

const CollaborationBoard = ({ reduceMotion }) => {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0a0a10] p-2 shadow-[0_25px_80px_rgba(0,0,0,.4)] sm:rounded-[30px] sm:p-3"
    >
      <div className="relative overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#101017] p-4 sm:rounded-[24px] sm:p-5">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="min-w-0">
            <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-600">Collaborative canvas</p>
            <p className="mt-1 truncate text-sm font-bold text-white">CPU Scheduling Notes</p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[7px] font-bold text-emerald-400">LIVE</span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[10px] font-bold text-zinc-300">Round Robin</p>
            <div className="mt-4 space-y-2.5">
              {[68, 88, 52, 76].map((width) => (
                <div key={width} className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-white/10" style={{ width: `${width}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-violet-400/15 bg-violet-500/10 p-3 text-[9px] leading-4 text-violet-200">
              “Think of the time quantum like a turn.”
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-4">
            <p className="text-[10px] font-bold text-cyan-200">Live reactions</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["🔥", "💡", "👏", "⚡"].map((emoji) => (
                <span key={emoji} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-sm">
                  {emoji}
                </span>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              {["Rahul joined", "Simran annotated", "Mohit reacted"].map((item) => (
                <p key={item} className="text-[9px] text-zinc-500">
                  <span className="mr-2 text-emerald-400">●</span>{item}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-white/[0.06] bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-bold tracking-[0.16em] text-zinc-600">COLLABORATION STATUS</span>
            <span className="text-[8px] font-bold text-emerald-400">SYNCED</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={reduceMotion ? { width: "68%" } : { width: 0 }}
              whileInView={reduceMotion ? undefined : { width: "68%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* =========================================================
   FEATURES
   ========================================================= */

const Features = () => {
  const reduceMotion = useReducedMotion();

  const features = [
    {
      icon: <FaFilePdf />,
      title: "Shared PDF workspace",
      text: "Upload once and let everyone study from the same document and context.",
      tone: "red",
    },
    {
      icon: <BsPencilSquare />,
      title: "Live annotations",
      text: "Highlight, draw and explain ideas directly on shared material.",
      tone: "violet",
    },
    {
      icon: <BsChatDotsFill />,
      title: "Chat and voice",
      text: "Discuss difficult concepts without switching to another application.",
      tone: "cyan",
    },
    {
      icon: <FaUsers />,
      title: "Real-time presence",
      text: "See who's in the room and keep the whole group in sync.",
      tone: "emerald",
    },
  ];

  return (
    <section id="features" className="relative overflow-hidden bg-[#05050a] py-20 sm:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="THE TOOLKIT"
          title="Everything your group actually needs."
          description="Four core capabilities cover the collaboration loop without turning the landing page into a feature catalogue."
          reduceMotion={reduceMotion}
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:mt-16 lg:gap-4">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.05 }}
              className="group relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.02] p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-white/[0.12] sm:rounded-[26px] sm:p-8"
            >
              <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125 ${feature.tone === "red" ? "bg-red-500/10" : feature.tone === "violet" ? "bg-violet-500/10" : feature.tone === "cyan" ? "bg-cyan-500/10" : "bg-emerald-500/10"}`} />
              <div className="relative">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-lg ${feature.tone === "red" ? "text-red-400" : feature.tone === "violet" ? "text-violet-400" : feature.tone === "cyan" ? "text-cyan-400" : "text-emerald-400"}`}>
                  {feature.icon}
                </div>
                <h3 className="mt-7 text-xl font-black tracking-tight sm:text-2xl">{feature.title}</h3>
                <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500 sm:text-base sm:leading-7">{feature.text}</p>
                <div className="mt-6 h-px w-10 bg-gradient-to-r from-violet-400 to-cyan-400 transition-all duration-300 group-hover:w-20" />
              </div>
            </motion.article>
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
  const reduceMotion = useReducedMotion();

  const steps = [
    { n: "01", icon: <FaPlus />, title: "Create a room", text: "Start a private or public study space for your group." },
    { n: "02", icon: <FaFilePdf />, title: "Bring your material", text: "Upload the PDF or notes everyone needs to study." },
    { n: "03", icon: <FaUsers />, title: "Study together", text: "Read, annotate, chat and solve problems in the same room." },
  ];

  return (
    <section id="how" className="relative overflow-hidden border-y border-white/[0.05] bg-[#08080d] py-20 sm:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="THE FLOW"
          title="From empty room to focused session."
          description="Simple setup. Shared context. Less context switching."
          reduceMotion={reduceMotion}
        />

        <div className="relative mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-violet-500/50 via-fuchsia-500/40 to-cyan-400/50 lg:block" />
          {steps.map((step, index) => (
            <motion.article
              key={step.n}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.06 }}
              className="relative rounded-[22px] border border-white/[0.07] bg-[#0b0b12] p-6 sm:p-7"
            >
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#0c0c13] text-lg text-violet-300 shadow-[0_12px_35px_rgba(0,0,0,.3)]">
                {step.icon}
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[8px] font-black">
                  {step.n}
                </span>
              </div>
              <h3 className="mt-7 text-lg font-bold text-white sm:text-xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">{step.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   SECTION HEADING
   ========================================================= */

const SectionHeading = ({ eyebrow, title, description, reduceMotion }) => {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45 }}
      className="max-w-3xl"
    >
      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 sm:text-xs sm:tracking-[0.22em]">
        <span className="h-px w-7 bg-violet-400/50 sm:w-8" />
        {eyebrow}
      </div>
      <h2 className="mt-5 text-[clamp(2rem,6vw,3.8rem)] font-black leading-[0.98] tracking-[-0.045em]">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base sm:leading-7 lg:text-lg">
        {description}
      </p>
    </motion.div>
  );
};

/* =========================================================
   FINAL CTA
   ========================================================= */

const FinalCTA = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#05050a] py-20 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-violet-600/15 via-white/[0.02] to-cyan-500/10 px-5 py-14 text-center sm:rounded-[34px] sm:px-10 sm:py-20">
          <FaLightbulb className="mx-auto text-2xl text-violet-300" />
          <h2 className="mx-auto mt-6 max-w-3xl text-[clamp(2.2rem,7vw,4rem)] font-black leading-[0.98] tracking-[-0.045em]">
            Make your next study session a shared one.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
            Create a room, bring your friends and keep the whole session in one place.
          </p>
          <Link
            to="/register"
            className="group mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-black text-black transition-transform hover:-translate-y-0.5"
          >
            Enter StudySync
            <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

/* =========================================================
   FOOTER
   ========================================================= */

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030307]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="max-w-sm">
          <Link to="/" className="text-xl font-black tracking-tight text-white sm:text-2xl">
            Study
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Sync</span>
          </Link>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            A real-time collaborative learning platform built for studying together.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 text-sm sm:gap-20">
          <div>
            <p className="font-bold text-white">Product</p>
            <div className="mt-4 space-y-3 text-zinc-600">
              <a className="block transition-colors hover:text-white" href="#features">Features</a>
              <a className="block transition-colors hover:text-white" href="#how">How it works</a>
              <a className="block transition-colors hover:text-white" href="#experience">Collaboration</a>
            </div>
          </div>
          <div>
            <p className="font-bold text-white">Account</p>
            <div className="mt-4 space-y-3 text-zinc-600">
              <Link className="block transition-colors hover:text-white" to="/login">Login</Link>
              <Link className="block transition-colors hover:text-white" to="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl border-t border-white/[0.06] px-4 py-6 text-xs text-zinc-700 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} StudySync. Built for collaborative learning.
      </div>
    </footer>
  );
};
