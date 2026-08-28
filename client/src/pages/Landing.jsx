import { useEffect, useState } from "react";
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
  FaDesktop,
  FaSmile,
  FaVolumeUp,
  FaGlobe,
  FaRocket,
  FaQuoteLeft,
  FaBrain,
  FaLightbulb,
  FaBell,
  FaRegClock,
} from "react-icons/fa";

import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
} from "react-icons/hi";

import {
  BsPencilSquare,
  BsChatDotsFill,
} from "react-icons/bs";

/*
 * StudySync landing page
 *
 * Performance strategy:
 * - Keep the premium motion-heavy visual language.
 * - Use Framer Motion mainly for entrance/interaction animations.
 * - Move continuous decorative loops to CSS transforms/opacity.
 * - Keep large visual sections responsive with fluid sizing.
 * - Use content-visibility for below-the-fold sections.
 * - Avoid scroll listeners and per-frame React state updates.
 */

const sectionStyle = {
  contentVisibility: "auto",
  containIntrinsicSize: "900px",
};

const motionEase = [0.22, 1, 0.36, 1];

const Reveal = ({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.52,
  scale = false,
}) => {
  const reduced = useReducedMotion();

  const initial = reduced
    ? { opacity: 0 }
    : direction === "left"
      ? { opacity: 0, x: -20, ...(scale ? { scale: 0.985 } : {}) }
      : direction === "right"
        ? { opacity: 0, x: 20, ...(scale ? { scale: 0.985 } : {}) }
        : { opacity: 0, y: 18, ...(scale ? { scale: 0.985 } : {}) };

  const visible = reduced
    ? { opacity: 1 }
    : { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <motion.div
      initial={initial}
      whileInView={visible}
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -40px" }}
      transition={{ duration, delay, ease: motionEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Landing = () => {
  return (
    <main data-studysync-landing className="min-h-screen w-full overflow-x-clip bg-[#05050a] text-white selection:bg-violet-500/30">
      <style>{`
        @keyframes ss-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -9px, 0); }
        }

        @keyframes ss-float-reverse {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(2deg); }
          50% { transform: translate3d(0, 10px, 0) rotate(-2deg); }
        }

        @keyframes ss-pulse {
          0%, 100% { opacity: .35; transform: scale(1); }
          50% { opacity: .85; transform: scale(1.08); }
        }

        @keyframes ss-pulse-ring {
          0% { opacity: .45; transform: scale(1); }
          70%, 100% { opacity: 0; transform: scale(1.35); }
        }

        @keyframes ss-breathe {
          0%, 100% { opacity: .08; transform: scale(.96); }
          50% { opacity: .18; transform: scale(1.08); }
        }

        @keyframes ss-wave {
          0%, 100% { transform: scaleY(.35); }
          50% { transform: scaleY(1); }
        }

        @keyframes ss-packet {
          0% { opacity: 0; transform: translate3d(0, 0, 0); }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translate3d(var(--packet-x), var(--packet-y), 0); }
        }

        @keyframes ss-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes ss-orbit {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes ss-orbit-reverse {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        @keyframes ss-shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        @keyframes ss-annotation {
          0%, 100% { opacity: .35; }
          50% { opacity: .9; }
        }

        .ss-float { animation: ss-float 5s ease-in-out infinite; will-change: transform; }
        .ss-float-reverse { animation: ss-float-reverse 6s ease-in-out infinite; will-change: transform; }
        .ss-pulse { animation: ss-pulse 2.8s ease-in-out infinite; will-change: transform, opacity; }
        .ss-pulse-ring { animation: ss-pulse-ring 2.8s ease-out infinite; will-change: transform, opacity; }
        .ss-breathe { animation: ss-breathe 3.5s ease-in-out infinite; will-change: transform, opacity; }
        .ss-wave { animation: ss-wave var(--wave-duration, 1s) ease-in-out infinite; animation-delay: var(--wave-delay, 0s); transform-origin: bottom; will-change: transform; }
        .ss-marquee { animation: ss-marquee 24s linear infinite; will-change: transform; }
        .ss-orbit { animation: ss-orbit 35s linear infinite; will-change: transform; }
        .ss-orbit-reverse { animation: ss-orbit-reverse 45s linear infinite; will-change: transform; }
        .ss-shimmer { animation: ss-shimmer 2.8s linear infinite; will-change: transform; }
        .ss-annotation { animation: ss-annotation 2.5s ease-in-out infinite; }

        /* Landing-page performance + compact responsive typography. */
        [data-studysync-landing] {
          overflow-x: clip;
        }

        [data-studysync-landing] h1 {
          font-size: clamp(2.25rem, 8vw, 4.8rem);
          line-height: .96;
        }

        [data-studysync-landing] h2 {
          font-size: clamp(1.9rem, 6vw, 3.4rem);
          line-height: 1;
        }

        [data-studysync-landing] p {
          text-wrap: pretty;
        }

        @media (max-width: 640px) {
          [data-studysync-landing] section {
            content-visibility: auto;
            contain-intrinsic-size: 650px;
          }

          /* Keep the cinematic animation, but reduce decorative work on phones. */
          [data-studysync-landing] .ss-pulse:nth-of-type(n + 9) {
            display: none;
          }

          [data-studysync-landing] .ss-orbit,
          [data-studysync-landing] .ss-orbit-reverse {
            opacity: .5;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ss-float,
          .ss-float-reverse,
          .ss-pulse,
          .ss-pulse-ring,
          .ss-breathe,
          .ss-wave,
          .ss-marquee,
          .ss-orbit,
          .ss-orbit-reverse,
          .ss-shimmer,
          .ss-annotation {
            animation: none !important;
          }
        }
      `}</style>

      <Navbar />
      <Hero />
      <LiveCollaboration />
      <VoiceCollaboration />
      <InteractiveWorkspace />
      <CinematicRoom />
      <Features />
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
    let frame = 0;

    const onScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        frame = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const links = [
    ["Experience", "#experience"],
    ["Features", "#features"],
    ["How It Works", "#how"],
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: motionEase }}
      className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-b border-white/[0.07] bg-[#05050a]/85 shadow-[0_10px_40px_rgba(0,0,0,.18)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-8">
        <Link to="/" className="group flex min-w-0 items-center gap-2">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.45 }}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_24px_rgba(139,92,246,.3)]"
          >
            <FaBookOpen className="text-sm text-white" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </motion.div>

          <span className="truncate text-lg font-black tracking-tight sm:text-xl">
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
              className="group relative rounded-full px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {label}
              <span className="absolute bottom-1 left-4 right-4 h-px origin-left scale-x-0 bg-gradient-to-r from-violet-400 to-cyan-400 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="group relative overflow-hidden rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(255,255,255,.16)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start studying
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-y-0 left-0 w-1/2 -translate-x-[140%] bg-gradient-to-r from-transparent via-violet-200/70 to-transparent ss-shimmer" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
        >
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: motionEase }}
            className="overflow-hidden border-t border-white/10 bg-[#05050a]/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4">
              {links.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {label}
                </a>
              ))}

              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm text-zinc-300"
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
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
    stiffness: 70,
    damping: 24,
    mass: 0.6,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 70,
    damping: 24,
    mass: 0.6,
  });

  const rotateX = useTransform(smoothY, [-500, 500], [5, -5]);
  const rotateY = useTransform(smoothX, [-500, 500], [-5, 5]);

  const handleMouseMove = (event) => {
    if (reduceMotion || window.innerWidth < 1024) return;

    mouseX.set(event.clientX - window.innerWidth / 2);
    mouseY.set(event.clientY - window.innerHeight / 2);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative isolate min-h-[780px] overflow-hidden bg-[#05050a] sm:min-h-screen"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-18%] top-[5%] h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[110px] sm:h-[550px] sm:w-[550px] sm:blur-[140px]" />
        <div className="absolute right-[-15%] top-[25%] h-[380px] w-[380px] rounded-full bg-cyan-500/15 blur-[110px] sm:h-[500px] sm:w-[500px] sm:blur-[140px]" />

        <div
          className="absolute left-[-18%] top-[5%] h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[100px] sm:h-[550px] sm:w-[550px]"
          style={{
            animation: reduceMotion ? "none" : "ss-breathe 12s ease-in-out infinite",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "clamp(42px, 5vw, 70px) clamp(42px, 5vw, 70px)",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,#05050a_84%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[780px] w-full max-w-7xl items-center gap-10 px-4 pb-14 pt-24 sm:min-h-screen sm:px-8 sm:pb-16 sm:pt-28 lg:grid-cols-[.9fr_1.1fr] lg:gap-8">
        <div className="relative z-20 mx-auto w-full max-w-2xl lg:mx-0">
          <Reveal className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[.15em] text-violet-300 backdrop-blur-xl sm:px-4 sm:text-xs sm:tracking-[.18em]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <span className="truncate">The future of collaborative learning</span>
          </Reveal>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.06, ease: motionEase }}
            className="max-w-3xl text-[clamp(3.1rem,13vw,5.5rem)] font-black leading-[.9] tracking-[-.055em]"
          >
            Don&apos;t study
            <br />
            <span className="relative">
              alone.
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 blur-sm ss-pulse" />
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              Build together.
            </span>
          </motion.h1>

          <Reveal delay={0.16} className="mt-7 max-w-xl text-sm leading-6 text-zinc-400 sm:mt-8 sm:text-lg sm:leading-7">
            A real-time study universe where your friends, notes, PDFs,
            conversations, annotations and ideas live in one beautiful
            collaborative room.
          </Reveal>

          <Reveal delay={0.24} className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
            <Link
              to="/register"
              className="group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full bg-white px-6 py-3.5 text-sm font-bold text-black shadow-[0_15px_60px_rgba(255,255,255,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(255,255,255,.16)] sm:px-7 sm:py-4"
            >
              <span className="relative z-10 flex items-center gap-3">
                Create your study room
                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
              <span className="absolute inset-y-0 left-0 w-1/2 -translate-x-[140%] bg-gradient-to-r from-transparent via-violet-100 to-transparent ss-shimmer" />
            </Link>

            <a
              href="#experience"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-zinc-300 backdrop-blur-xl transition duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white sm:px-7 sm:py-4"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <FaPlay className="ml-0.5 text-[9px]" />
              </span>
              See how it works
            </a>
          </Reveal>

          <Reveal delay={0.32} className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5 text-[10px] text-zinc-500 sm:mt-9 sm:gap-x-6 sm:text-xs">
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
          </Reveal>
        </div>

        <motion.div
          style={
            reduceMotion || typeof window === "undefined" || window.innerWidth < 1024
              ? {}
              : { rotateX, rotateY }
          }
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[700px] [perspective:1200px] [transform-style:preserve-3d]"
        >
          <StudyUniverse />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#05050a] to-transparent sm:h-40" />
    </section>
  );
};

/* =========================================================
   STUDY UNIVERSE
   ========================================================= */

const StudyUniverse = () => {
  const people = [
    { name: "A", position: "left-[1%] top-[18%]", gradient: "from-violet-500 to-fuchsia-500", delay: "0s" },
    { name: "R", position: "right-[1%] top-[12%]", gradient: "from-cyan-400 to-blue-500", delay: ".8s" },
    { name: "S", position: "left-[4%] bottom-[14%]", gradient: "from-emerald-400 to-cyan-500", delay: "1.4s" },
    { name: "M", position: "right-[3%] bottom-[12%]", gradient: "from-orange-400 to-pink-500", delay: "2s" },
  ];

  return (
    <div className="relative aspect-[1.02/1] w-full min-w-0">
      <div className="absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[65px] sm:blur-[90px]" />

      <div className="ss-orbit absolute left-1/2 top-1/2 h-[90%] w-[90%] rounded-full border border-violet-400/[0.08]" />
      <div className="ss-orbit-reverse absolute left-1/2 top-1/2 h-[72%] w-[72%] rounded-full border border-cyan-400/[0.07]" />
      <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.07]" />

      {people.map((person) => (
        <div
          key={person.name}
          className={`absolute ${person.position} z-30 ss-float`}
          style={{ animationDelay: person.delay }}
        >
          <StudentAvatar name={person.name} gradient={person.gradient} />
        </div>
      ))}

      <div className="ss-float absolute left-1/2 top-1/2 z-20 w-[68%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0c0c14]/90 shadow-[0_30px_90px_rgba(0,0,0,.65),0_0_60px_rgba(124,58,237,.12)] backdrop-blur-xl sm:rounded-[28px]">
          <div className="flex h-9 items-center justify-between border-b border-white/[0.07] px-3 sm:h-11 sm:px-4">
            <div className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400/70 sm:h-2 sm:w-2" />
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400/70 sm:h-2 sm:w-2" />
              <span className="h-1.5 w-1.5 rounded-full bg-green-400/70 sm:h-2 sm:w-2" />
            </div>

            <div className="hidden rounded-md bg-white/5 px-2 py-1 text-[6px] font-medium text-zinc-500 xs:block sm:px-3 sm:text-[8px]">
              STUDYSYNC / ROOM 204
            </div>

            <div className="flex items-center gap-1 text-[6px] text-emerald-400 sm:text-[8px]">
              <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] sm:h-1.5 sm:w-1.5" />
              LIVE
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_72px] gap-2 p-2 sm:grid-cols-[minmax(0,1fr)_105px] sm:gap-3 sm:p-3">
            <div className="relative min-w-0 overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.025] p-2 sm:rounded-xl sm:p-3">
              <div className="mb-2 flex items-center justify-between sm:mb-3">
                <div className="min-w-0">
                  <p className="text-[5px] uppercase tracking-widest text-zinc-600 sm:text-[7px]">
                    Shared document
                  </p>
                  <p className="mt-1 truncate text-[7px] font-bold text-zinc-200 sm:text-[10px]">
                    Operating Systems.pdf
                  </p>
                </div>

                <div className="rounded-md bg-red-500/10 p-1.5 sm:rounded-lg sm:p-2">
                  <FaFilePdf className="text-[8px] text-red-400 sm:text-xs" />
                </div>
              </div>

              <div className="relative overflow-hidden rounded-md bg-[#f8f8fa] p-2.5 sm:rounded-lg sm:p-4">
                <p className="text-[7px] font-black text-zinc-900 sm:text-[11px]">
                  PROCESS MANAGEMENT
                </p>

                <div className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
                  <div className="h-1 w-[75%] rounded-full bg-zinc-300 sm:h-1.5" />
                  <div className="h-1 w-full rounded-full bg-zinc-200 sm:h-1.5" />
                  <div className="h-1 w-[88%] rounded-full bg-zinc-200 sm:h-1.5" />
                  <div className="h-1 w-[65%] rounded-full bg-zinc-200 sm:h-1.5" />
                </div>

                <div className="ss-annotation mt-3 rounded-md bg-violet-200 p-2 sm:mt-5 sm:p-3">
                  <div className="h-1 w-[55%] rounded-full bg-violet-400 sm:h-1.5" />
                  <div className="mt-1.5 h-1 w-[85%] rounded-full bg-violet-200 sm:mt-2 sm:h-1.5" />
                </div>

                <div className="mt-2.5 space-y-1.5 sm:mt-4 sm:space-y-2">
                  <div className="h-1 w-full rounded-full bg-zinc-200 sm:h-1.5" />
                  <div className="h-1 w-[70%] rounded-full bg-zinc-200 sm:h-1.5" />
                </div>

                <div
                  className="absolute bottom-3 left-5 h-5 w-14 rotate-[-5deg] rounded-full border-b-2 border-violet-500 sm:bottom-5 sm:left-7 sm:h-8 sm:w-24"
                  style={{ animation: "ss-annotation 2s ease-in-out infinite" }}
                />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2 sm:rounded-xl sm:p-3">
                <div className="mb-2 flex items-center justify-between sm:mb-3">
                  <span className="text-[6px] font-semibold text-zinc-500 sm:text-[8px]">
                    ONLINE
                  </span>
                  <span className="text-[6px] text-emerald-400 sm:text-[8px]">
                    4
                  </span>
                </div>

                <div className="flex -space-x-1.5 sm:-space-x-2">
                  {["A", "R", "S", "M"].map((letter, index) => (
                    <div
                      key={letter}
                      className={`ss-pulse flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0c0c14] bg-gradient-to-br ${
                        index % 2 === 0
                          ? "from-violet-500 to-fuchsia-500"
                          : "from-cyan-400 to-blue-500"
                      } text-[6px] font-black sm:h-7 sm:w-7 sm:text-[8px]`}
                      style={{ animationDelay: `${index * 0.4}s` }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2 sm:rounded-xl sm:p-3">
                <div className="mb-2 flex items-center gap-1.5 sm:mb-3 sm:gap-2">
                  <BsChatDotsFill className="text-[7px] text-cyan-400 sm:text-[10px]" />
                  <span className="text-[6px] font-semibold text-zinc-400 sm:text-[8px]">
                    LIVE CHAT
                  </span>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <ChatBubble text="This is confusing 😭" side="left" />
                  <ChatBubble text="Check page 12!" side="right" />
                  <ChatBubble text="Got it 🔥" side="left" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.07] px-2.5 py-2 sm:px-4 sm:py-3">
            <div className="flex gap-1 sm:gap-2">
              <ToolButton icon={<FaPen />} />
              <ToolButton icon={<FaSearch />} />
              <ToolButton icon={<BsPencilSquare />} />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[6px] text-emerald-400 sm:gap-2 sm:px-2.5 sm:text-[7px]">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Synced
            </div>
          </div>
        </div>
      </div>

      <div className="ss-float absolute right-[4%] top-[30%] z-40 hidden rounded-2xl border border-white/10 bg-[#10101a]/90 px-3 py-2 shadow-2xl backdrop-blur-xl sm:block sm:px-4 sm:py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-[8px] font-bold sm:h-7 sm:w-7">
            R
          </div>
          <div>
            <p className="text-[8px] font-bold text-white">Rahul</p>
            <p className="mt-0.5 text-[7px] text-zinc-500 sm:text-[8px]">
              I think the answer is...
            </p>
          </div>
        </div>
      </div>

      <div className="ss-float-reverse absolute bottom-[17%] left-[2%] z-40 hidden rounded-2xl border border-violet-400/20 bg-violet-500/10 px-3 py-2 backdrop-blur-xl sm:block sm:px-4 sm:py-3">
        <div className="flex items-center gap-2">
          <BsPencilSquare className="text-violet-300" />
          <span className="text-[8px] font-semibold text-violet-200 sm:text-[9px]">
            Aditya highlighted this
          </span>
        </div>
      </div>

      <div className="ss-pulse-ring absolute left-1/2 top-1/2 z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/30 sm:h-32 sm:w-32" />
    </div>
  );
};

const StudentAvatar = ({ name, gradient }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-violet-500/30 blur-xl" />
      <div
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br ${gradient} text-[10px] font-black shadow-[0_10px_30px_rgba(0,0,0,.45)] sm:h-14 sm:w-14 sm:text-sm`}
      >
        {name}
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#05050a] bg-emerald-400 shadow-[0_0_10px_#34d399] sm:h-3.5 sm:w-3.5" />
      </div>
      <div className="ss-pulse-ring absolute inset-0 rounded-full border border-cyan-400/50" />
    </div>
  );
};

const ChatBubble = ({ text, side }) => (
  <motion.div
    initial={{ opacity: 0, x: side === "left" ? -5 : 5 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.45 }}
    className={`rounded-md px-1.5 py-1 text-[5px] sm:rounded-lg sm:px-2 sm:py-1.5 sm:text-[7px] ${
      side === "right"
        ? "ml-auto w-fit bg-violet-500/20 text-violet-200"
        : "bg-white/5 text-zinc-500"
    }`}
  >
    {text}
  </motion.div>
);

const ToolButton = ({ icon }) => (
  <motion.div
    whileHover={{ scale: 1.12, y: -2 }}
    className="flex h-5 w-5 items-center justify-center rounded-md bg-white/5 text-[6px] text-zinc-500 sm:h-6 sm:w-6 sm:text-[8px]"
  >
    {icon}
  </motion.div>
);

/* =========================================================
   LIVE COLLABORATION
   ========================================================= */

const LiveCollaboration = () => {
  return (
    <section
      id="experience"
      style={sectionStyle}
      className="relative overflow-hidden bg-[#05050a] py-16 sm:py-22 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="LIVE PRESENCE"
          title="It feels less like an app. More like a digital campus."
          description="See what your friends are reading. Discuss ideas instantly. Annotate the same page. Everything stays synchronized."
        />

        <div className="relative mx-auto mt-14 max-w-5xl sm:mt-20">
          <div className="absolute left-1/2 top-1/2 h-[260px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />

          <Reveal scale className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-1.5 shadow-[0_25px_80px_rgba(0,0,0,.45)] sm:rounded-[32px] sm:p-2">
            <div className="rounded-[22px] border border-white/[0.05] bg-[#0a0a10] p-4 sm:rounded-[26px] sm:p-8">
              <div className="flex flex-col gap-5 sm:gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center">
                  <div className="flex shrink-0 items-center">
                    {["A", "R", "S", "M", "K"].map((person, index) => (
                      <motion.div
                        key={person}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08, type: "spring", stiffness: 180 }}
                        whileHover={{ y: -7, zIndex: 10 }}
                        className={`relative -ml-2.5 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#0a0a10] text-[9px] font-black first:ml-0 sm:h-14 sm:w-14 sm:text-xs ${
                          index % 2 === 0
                            ? "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                            : "bg-gradient-to-br from-cyan-400 to-blue-500"
                        }`}
                      >
                        {person}
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a10] bg-emerald-400 sm:h-3 sm:w-3" />
                      </motion.div>
                    ))}
                  </div>

                  <div className="ml-3 min-w-0 sm:ml-4">
                    <p className="text-xs font-bold text-white sm:text-sm">5 students</p>
                    <p className="text-[10px] text-zinc-600 sm:text-xs">
                      studying together
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <ActivityPill icon={<FaFilePdf />} text="PDF synced" color="red" />
                  <ActivityPill icon={<BsPencilSquare />} text="3 annotations" color="violet" />
                  <ActivityPill icon={<FaComments />} text="12 messages" color="cyan" />
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <div className="mb-2 flex justify-between text-[9px] sm:text-[10px]">
                  <span className="text-zinc-600">Collective study session</span>
                  <span className="text-zinc-500">68%</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "68%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.25, delay: 0.15, ease: motionEase }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const ActivityPill = ({ icon, text, color }) => {
  const colors = {
    red: "text-red-400 bg-red-400/10 border-red-400/10",
    violet: "text-violet-400 bg-violet-400/10 border-violet-400/10",
    cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/10",
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[8px] sm:gap-2 sm:px-3 sm:py-2 sm:text-[10px] ${colors[color]}`}
    >
      {icon}
      {text}
    </motion.div>
  );
};

/* =========================================================
   LIVE VOICE COLLABORATION
   ========================================================= */

const VoiceCollaboration = () => {
  const speakers = [
    {
      name: "Aditya",
      role: "Explaining",
      gradient: "from-violet-500 to-fuchsia-500",
      message: "Wait — look at this process!",
    },
    {
      name: "Rahul",
      role: "Listening",
      gradient: "from-cyan-400 to-blue-500",
      message: "Ohhh, now I get it.",
    },
    {
      name: "Simran",
      role: "Annotating",
      gradient: "from-emerald-400 to-cyan-500",
      message: "I marked the important part.",
    },
    {
      name: "Karan",
      role: "Solving",
      gradient: "from-orange-400 to-pink-500",
      message: "Give me 30 seconds...",
    },
  ];

  return (
    <section
      style={sectionStyle}
      className="relative overflow-hidden border-y border-white/[0.05] bg-[#07070d] py-16 sm:py-22 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[10%] h-[320px] w-[320px] rounded-full bg-violet-600/10 blur-[110px]" />
        <div className="absolute bottom-[5%] right-[5%] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="LIVE PRESENCE"
          title="You don't just see who's online. You feel the room."
          description="Students speak, react, point at the same page and solve problems together. StudySync turns a silent screen into a living study session."
        />

        <div className="mt-12 grid gap-5 sm:mt-16 sm:gap-8 lg:grid-cols-[1.25fr_.75fr]">
          <Reveal scale className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b13] p-2 shadow-[0_30px_90px_rgba(0,0,0,.5)] sm:rounded-[34px] sm:p-3">
            <div className="relative min-h-[430px] overflow-hidden rounded-[23px] border border-white/[0.06] bg-gradient-to-br from-[#11111b] via-[#0b0b12] to-[#08080d] p-3 sm:min-h-[510px] sm:rounded-[27px] sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[8px] font-bold uppercase tracking-[.25em] text-violet-400">
                    LIVE STUDY ROOM
                  </p>
                  <p className="mt-1 truncate text-xs font-bold text-white sm:text-base">
                    Operating Systems — Group Revision
                  </p>
                </div>

                <div className="ml-3 flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1.5 text-[8px] font-bold text-emerald-300 sm:px-3 sm:text-[9px]">
                  <span className="ss-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  4 LIVE
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
                {speakers.map((speaker, index) => (
                  <SpeakerTile key={speaker.name} speaker={speaker} index={index} />
                ))}
              </div>

              <div className="absolute bottom-4 left-1/2 flex max-w-[calc(100%-24px)] -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2 py-1.5 shadow-2xl backdrop-blur-xl sm:bottom-5 sm:gap-2 sm:px-3 sm:py-2">
                <LiveControl icon={<FaMicrophone />} />
                <LiveControl icon={<FaVideo />} />
                <LiveControl icon={<FaDesktop />} />
                <LiveControl icon={<FaSmile />} />
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,.2)] sm:h-9 sm:w-9"
                >
                  <FaPhoneIcon />
                </motion.div>
              </div>
            </div>
          </Reveal>

          <div className="space-y-3 sm:space-y-4">
            {[
              ["00:14", "Aditya is explaining", "“The scheduler decides which process gets CPU time.”", "violet", <FaMicrophone />],
              ["00:27", "Rahul reacted", "“That finally makes sense 🔥”", "cyan", <FaSmile />],
              ["00:41", "Simran annotated", "Highlighted → Round Robin scheduling", "emerald", <BsPencilSquare />],
              ["01:02", "Karan joined", "Joined from another device", "orange", <FaUsers />],
            ].map(([time, title, message, tone, icon], index) => (
              <Reveal key={time} direction="right" delay={index * 0.05}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="group rounded-[20px] border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-xl sm:rounded-[24px] sm:p-5"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs sm:h-10 sm:w-10 ${
                        tone === "violet"
                          ? "bg-violet-500/10 text-violet-300"
                          : tone === "cyan"
                            ? "bg-cyan-500/10 text-cyan-300"
                            : tone === "emerald"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-orange-500/10 text-orange-300"
                      }`}
                    >
                      {icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-white sm:text-sm">{title}</p>
                        <span className="shrink-0 font-mono text-[8px] text-zinc-600 sm:text-[9px]">
                          {time}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[10px] leading-5 text-zinc-500 sm:mt-2 sm:text-xs sm:leading-6">
                        {message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}

            <div className="ss-float rounded-[20px] border border-violet-400/10 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 p-4 sm:rounded-[24px] sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {speakers.map((speaker) => (
                    <div
                      key={speaker.name}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#11111b] bg-gradient-to-br ${speaker.gradient} text-[7px] font-black sm:h-8 sm:w-8 sm:text-[8px]`}
                    >
                      {speaker.name[0]}
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-white sm:text-xs">
                    Everyone is in sync
                  </p>
                  <p className="text-[8px] text-zinc-600 sm:text-[10px]">
                    Voice • Video • Chat • Notes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SpeakerTile = ({ speaker, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: motionEase }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="group relative min-h-[160px] overflow-hidden rounded-[20px] border border-white/[0.08] bg-black/30 p-3.5 sm:min-h-[185px] sm:rounded-[22px] sm:p-4"
    >
      <div
        className={`ss-breathe absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${speaker.gradient} blur-3xl`}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${speaker.gradient} text-xs font-black shadow-lg sm:h-11 sm:w-11 sm:rounded-2xl sm:text-sm`}
        >
          {speaker.name[0]}
        </div>

        <div className="flex h-8 items-end gap-[3px]">
          {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
            <span
              key={bar}
              className="ss-wave w-1 rounded-full bg-cyan-300/80"
              style={{
                height: "14px",
                "--wave-duration": `${0.65 + bar * 0.05}s`,
                "--wave-delay": `${bar * 0.06 + index * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-6 sm:mt-7">
        <p className="text-xs font-bold text-white">{speaker.name}</p>
        <p className="mt-1 text-[8px] uppercase tracking-widest text-zinc-600 sm:text-[9px]">
          {speaker.role}
        </p>

        <div
          className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.035] px-2.5 py-2 text-[8px] leading-4 text-zinc-400 sm:px-3 sm:text-[9px]"
          style={{
            animation: "ss-pulse 5s ease-in-out infinite",
            animationDelay: `${1 + index * 1.1}s`,
          }}
        >
          {speaker.message}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[7px] text-emerald-400 sm:text-[8px]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        speaking
      </div>
    </motion.div>
  );
};

const LiveControl = ({ icon }) => (
  <motion.button
    type="button"
    whileHover={{ y: -2, scale: 1.06 }}
    whileTap={{ scale: 0.94 }}
    aria-label="Room control"
    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[10px] text-zinc-400 transition hover:bg-white/10 hover:text-white sm:h-9 sm:w-9 sm:text-[11px]"
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
    { user: "A", name: "Aditya", text: "highlighted Process Management", icon: <BsPencilSquare />, gradient: "from-violet-500 to-fuchsia-500" },
    { user: "R", name: "Rahul", text: "sent a message", icon: <BsChatDotsFill />, gradient: "from-cyan-400 to-blue-500" },
    { user: "S", name: "Simran", text: "opened the shared PDF", icon: <FaFilePdf />, gradient: "from-red-500 to-orange-500" },
    { user: "M", name: "Mohit", text: "joined the voice room", icon: <FaMicrophone />, gradient: "from-emerald-400 to-cyan-500" },
  ];

  return (
    <section
      style={sectionStyle}
      className="relative overflow-hidden bg-[#05050a] py-16 sm:py-22 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="THE WHOLE EXPERIENCE"
          title="One workspace. Four things happening at once."
          description="The point is not to add more UI. The point is to make collaboration visible, immediate and genuinely useful."
        />

        <div className="mt-12 grid gap-5 sm:mt-16 sm:gap-6 lg:grid-cols-[.72fr_1.28fr]">
          <div className="space-y-3 sm:space-y-4">
            {activities.map((activity, index) => (
              <Reveal key={activity.text} direction="left" delay={index * 0.05}>
                <motion.div
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 sm:gap-4 sm:p-4"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${activity.gradient} text-[9px] font-black sm:h-10 sm:w-10 sm:text-xs`}
                  >
                    {activity.user}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-zinc-300 sm:text-xs">
                      <span className="font-bold text-white">{activity.name}</span>{" "}
                      {activity.text}
                    </p>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full w-1/3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 ss-shimmer"
                        style={{ animationDuration: `${2.8 + index}s` }}
                      />
                    </div>
                  </div>

                  <span className="shrink-0 text-sm text-zinc-600">{activity.icon}</span>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal scale>
            <div className="relative min-h-[410px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a10] p-3 shadow-[0_30px_90px_rgba(0,0,0,.45)] sm:min-h-[480px] sm:rounded-[32px] sm:p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,.12),transparent_45%)]" />

              {[
                ["A", "left-[18%] top-[32%]", "from-violet-500 to-fuchsia-500", "0s"],
                ["R", "left-[55%] top-[52%]", "from-cyan-400 to-blue-500", ".7s"],
                ["S", "right-[18%] top-[24%]", "from-emerald-400 to-cyan-500", "1.4s"],
              ].map(([name, pos, gradient, delay]) => (
                <div
                  key={name}
                  className={`absolute ${pos} z-20 ss-float`}
                  style={{ animationDelay: delay, animationDuration: "7s" }}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-[8px] font-black shadow-lg`}>
                    {name}
                  </div>
                  <div className="ml-5 mt-[-3px] h-0 w-0 rotate-[-35deg] border-l-[5px] border-r-[5px] border-t-[9px] border-l-transparent border-r-transparent border-t-white/80" />
                </div>
              ))}

              <div className="relative z-10 h-full rounded-[22px] border border-white/[0.06] bg-[#101017] p-4 sm:rounded-[25px] sm:p-5">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 sm:pb-4">
                  <div className="min-w-0">
                    <p className="text-[8px] uppercase tracking-[.2em] text-zinc-600 sm:text-[9px]">
                      Collaborative Canvas
                    </p>
                    <p className="mt-1 truncate text-xs font-bold text-white sm:text-sm">
                      CPU Scheduling Notes
                    </p>
                  </div>

                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((x) => (
                      <span key={x} className="h-2 w-2 rounded-full bg-white/10" />
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4">
                  <div className="rounded-2xl bg-white/[0.025] p-3.5 sm:p-4">
                    <p className="text-[9px] font-bold text-zinc-300 sm:text-[10px]">
                      Round Robin
                    </p>

                    <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
                      {[65, 90, 48, 78, 58].map((width, index) => (
                        <motion.div
                          key={width}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${width}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: index * 0.06, ease: motionEase }}
                          className="h-1.5 rounded-full bg-white/10 sm:h-2"
                        />
                      ))}
                    </div>

                    <div className="mt-5 rounded-xl border border-violet-400/20 bg-violet-500/10 p-2.5 text-[8px] leading-4 text-violet-200 sm:mt-6 sm:p-3 sm:text-[9px]">
                      Aditya: &quot;Think of the time quantum like a turn.&quot;
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-3.5 sm:p-4">
                    <p className="text-[9px] font-bold text-cyan-200 sm:text-[10px]">
                      Live reactions
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                      {["🔥", "💡", "😂", "👏", "⚡"].map((emoji, index) => (
                        <span
                          key={emoji}
                          className="ss-float flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-sm"
                          style={{
                            animationDuration: `${2.5 + index * 0.2}s`,
                            animationDelay: `${index * 0.15}s`,
                          }}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 space-y-2 sm:mt-7">
                      <p className="text-[7px] text-zinc-600 sm:text-[8px]">
                        LIVE ACTIVITY
                      </p>

                      {["Rahul joined", "Simran annotated", "Mohit reacted"].map(
                        (item, index) => (
                          <motion.p
                            key={item}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="text-[8px] text-zinc-400 sm:text-[9px]"
                          >
                            <span className="mr-2 text-emerald-400">●</span>
                            {item}
                          </motion.p>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/[0.06] bg-black/20 p-3 sm:mt-5 sm:p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-zinc-500 sm:text-[9px]">
                      COLLABORATION HEAT
                    </span>
                    <span className="text-[8px] text-emerald-400 sm:text-[9px]">
                      HIGH
                    </span>
                  </div>

                  <div className="mt-3 flex h-10 items-end gap-1 sm:mt-4 sm:h-14">
                    {Array.from({ length: 28 }).map((_, index) => (
                      <span
                        key={index}
                        className="ss-wave flex-1 rounded-t bg-gradient-to-t from-violet-500/20 to-cyan-400/80"
                        style={{
                          height: `${8 + ((index * 17) % 34)}px`,
                          "--wave-duration": `${1.2 + (index % 5) * 0.2}s`,
                          "--wave-delay": `${index * 0.04}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   CINEMATIC ROOM
   ========================================================= */

const CinematicRoom = () => {
  const cursorData = [
    { name: "A", label: "Aditya", x: "15%", y: "26%", gradient: "from-violet-500 to-fuchsia-500", delay: "0s" },
    { name: "R", label: "Rahul", x: "72%", y: "20%", gradient: "from-cyan-400 to-blue-500", delay: ".8s" },
    { name: "S", label: "Simran", x: "38%", y: "65%", gradient: "from-emerald-400 to-cyan-500", delay: "1.5s" },
    { name: "M", label: "Mohit", x: "79%", y: "70%", gradient: "from-orange-400 to-pink-500", delay: "2.2s" },
  ];

  return (
    <section
      style={sectionStyle}
      className="relative overflow-hidden bg-[#030307] py-16 sm:py-22 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(124,58,237,.12),transparent_35%),radial-gradient(circle_at_15%_70%,rgba(34,211,238,.08),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(217,70,239,.07),transparent_28%)]" />

        <div className="ss-orbit absolute left-1/2 top-1/2 h-[min(700px,90vw)] w-[min(700px,90vw)] rounded-full border border-white/[0.035]" />
        <div className="ss-orbit-reverse absolute left-1/2 top-1/2 h-[min(520px,70vw)] w-[min(520px,70vw)] rounded-full border border-dashed border-violet-400/[0.08]" />

        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="ss-pulse absolute h-1 w-1 rounded-full bg-white/50"
            style={{
              left: `${(index * 29) % 100}%`,
              top: `${(index * 47) % 100}%`,
              animationDelay: `${index * 0.12}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/15 bg-fuchsia-400/[0.05] px-3.5 py-2 text-[9px] font-black uppercase tracking-[.2em] text-fuchsia-300 sm:px-4 sm:text-[10px] sm:tracking-[.22em]">
              <FaBrain />
              A room that feels alive
            </div>
          </Reveal>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, delay: 0.05, ease: motionEase }}
            className="mt-6 text-[clamp(2.6rem,10vw,3.75rem)] font-black leading-[.95] tracking-[-.055em] sm:mt-7 sm:text-6xl"
          >
            Four minds.
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              One shared moment.
            </span>
          </motion.h2>

          <Reveal delay={0.1} className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-zinc-500 sm:mt-6 sm:text-base sm:leading-7">
            This is the visual heartbeat of StudySync: people moving around the
            same material, talking, reacting and leaving traces of their thinking.
          </Reveal>
        </div>

        <Reveal scale className="relative mx-auto mt-12 max-w-6xl sm:mt-20">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#09090f]/95 p-1.5 shadow-[0_40px_140px_rgba(0,0,0,.65),0_0_80px_rgba(124,58,237,.1)] backdrop-blur-xl sm:rounded-[38px] sm:p-2">
            <div className="relative overflow-hidden rounded-[23px] border border-white/[0.06] bg-[#0d0d15] sm:rounded-[31px]">
              <div className="flex h-11 items-center justify-between border-b border-white/[0.06] px-3 sm:h-14 sm:px-5">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((x) => (
                    <span key={x} className="h-2 w-2 rounded-full bg-white/10 sm:h-2.5 sm:w-2.5" />
                  ))}
                </div>

                <div className="hidden rounded-full border border-white/[0.06] bg-white/[0.025] px-4 py-1.5 text-[7px] font-mono text-zinc-600 sm:block sm:px-5 sm:py-2 sm:text-[8px]">
                  studysync.app / room / os-revision
                </div>

                <div className="flex items-center gap-1.5 text-[7px] text-emerald-400 sm:gap-2 sm:text-[8px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                  LIVE
                </div>
              </div>

              <div className="grid min-h-[390px] grid-cols-1 gap-2 p-2 sm:min-h-[500px] sm:grid-cols-[minmax(0,1fr)_190px] sm:gap-3 sm:p-3 md:grid-cols-[minmax(0,1fr)_220px]">
                <div className="relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#f7f7fa]">
                  <div className="flex items-center justify-between border-b border-black/10 px-3 py-3 sm:px-5 sm:py-4">
                    <div className="min-w-0">
                      <p className="text-[7px] font-bold uppercase tracking-[.2em] text-zinc-500 sm:text-[8px]">
                        Shared PDF
                      </p>
                      <p className="mt-1 truncate text-[9px] font-black text-zinc-900 sm:text-xs">
                        Operating Systems — Process Scheduling
                      </p>
                    </div>

                    <div className="ml-2 flex shrink-0 gap-1 sm:gap-2">
                      <span className="rounded-md bg-red-500/10 px-1.5 py-1 text-[6px] font-bold text-red-500 sm:px-2 sm:text-[8px]">
                        PDF
                      </span>
                      <span className="hidden rounded-md bg-black/5 px-2 py-1 text-[8px] text-zinc-500 xs:block">
                        12 / 38
                      </span>
                    </div>
                  </div>

                  <div className="relative p-4 sm:p-7 lg:p-10">
                    <p className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl">
                      Process Scheduling
                    </p>

                    <p className="mt-2 max-w-xl text-[9px] leading-5 text-zinc-500 sm:mt-3 sm:text-xs sm:leading-6">
                      The scheduler selects a process from the ready queue and
                      allocates CPU time according to the selected scheduling algorithm.
                    </p>

                    <div className="mt-6 grid gap-2 sm:mt-9 sm:grid-cols-3 sm:gap-3">
                      {["FCFS", "SJF", "Round Robin"].map((item, index) => (
                        <motion.div
                          key={item}
                          animate={{ y: [0, index % 2 ? -3 : 3, 0] }}
                          transition={{ duration: 3 + index, repeat: Infinity, ease: "easeInOut" }}
                          className={`rounded-xl border p-3 sm:p-4 ${
                            index === 2
                              ? "border-violet-400/30 bg-violet-100"
                              : "border-black/5 bg-black/[0.025]"
                          }`}
                        >
                          <p className="text-[8px] font-black text-zinc-800 sm:text-[10px]">
                            {item}
                          </p>
                          <div className="mt-2 h-1.5 rounded-full bg-zinc-200">
                            <div
                              className={`h-full rounded-full ${
                                index === 2 ? "w-[82%] bg-violet-500" : "w-[55%] bg-zinc-300"
                              }`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-3.5 sm:mt-8 sm:p-5">
                      <p className="text-[8px] font-black uppercase tracking-[.18em] text-violet-500 sm:text-[9px]">
                        Group explanation
                      </p>
                      <p className="mt-1.5 text-[9px] font-bold leading-5 text-violet-950 sm:mt-2 sm:text-xs sm:leading-6">
                        &quot;Think of the time quantum like a turn. Everyone gets a
                        small slice of CPU time.&quot;
                      </p>
                    </div>

                    <div
                      className="absolute left-0 top-[49%] h-6 w-20 rounded-full bg-violet-300/20 blur-md sm:h-7 sm:w-24"
                      style={{ animation: "ss-shimmer 3.5s linear infinite" }}
                    />
                  </div>

                  {cursorData.map((cursor, index) => (
                    <div
                      key={cursor.name}
                      className="absolute z-30"
                      style={{
                        left: cursor.x,
                        top: cursor.y,
                        animation: "ss-float 6s ease-in-out infinite",
                        animationDelay: cursor.delay,
                        animationDuration: `${6 + index}s`,
                      }}
                    >
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${cursor.gradient} text-[7px] font-black text-white shadow-lg sm:h-7 sm:w-7 sm:text-[8px]`}>
                        {cursor.name}
                      </div>
                      <div className="ml-4 h-0 w-0 rotate-[-28deg] border-l-[4px] border-r-[4px] border-t-[8px] border-l-transparent border-r-transparent border-t-zinc-900 sm:ml-5 sm:border-l-[5px] sm:border-r-[5px] sm:border-t-[10px]" />
                      <div className="ml-5 mt-1 hidden rounded-full bg-black px-2 py-1 text-[6px] font-bold text-white shadow-xl sm:block sm:text-[7px]">
                        {cursor.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden space-y-3 sm:block">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[8px] font-bold uppercase tracking-[.18em] text-zinc-600">
                        Participants
                      </p>
                      <span className="text-[8px] text-emerald-400">4 active</span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {cursorData.map((person, index) => (
                        <div key={person.name} className="flex items-center gap-3">
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
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                    <div className="flex items-center gap-2">
                      <FaVolumeUp className="text-[9px] text-cyan-300" />
                      <p className="text-[8px] font-bold text-zinc-400">VOICE ACTIVITY</p>
                    </div>

                    <div className="mt-5 flex h-12 items-end gap-1">
                      {Array.from({ length: 24 }).map((_, index) => (
                        <span
                          key={index}
                          className="ss-wave flex-1 rounded-full bg-gradient-to-t from-violet-500/30 to-cyan-300"
                          style={{
                            height: `${8 + ((index * 13) % 32)}px`,
                            "--wave-duration": `${0.7 + (index % 5) * 0.08}s`,
                            "--wave-delay": `${index * 0.03}s`,
                          }}
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
                      {["Rahul reacted 🔥", "Simran highlighted a line", "Mohit joined"].map(
                        (event, index) => (
                          <motion.p
                            key={event}
                            initial={{ opacity: 0, x: 10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.25 + index * 0.12 }}
                            className="text-[8px] text-zinc-500"
                          >
                            <span className="mr-2 text-cyan-400">›</span>
                            {event}
                          </motion.p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ss-float absolute -left-2 top-[22%] hidden rounded-2xl border border-violet-400/20 bg-[#11111a]/90 px-3 py-2 shadow-2xl backdrop-blur-xl sm:block sm:px-4 sm:py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                    <FaLightbulb />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-white sm:text-[9px]">Idea captured</p>
                    <p className="mt-1 text-[7px] text-zinc-600 sm:text-[8px]">
                      Round Robin → time quantum
                    </p>
                  </div>
                </div>
              </div>

              <div className="ss-float-reverse absolute -right-2 bottom-[19%] hidden rounded-2xl border border-cyan-400/20 bg-[#11111a]/90 px-3 py-2 shadow-2xl backdrop-blur-xl sm:block sm:px-4 sm:py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                    <FaVolumeUp />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-white sm:text-[9px]">Live discussion</p>
                    <p className="mt-1 text-[7px] text-zinc-600 sm:text-[8px]">
                      4 people connected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* =========================================================
   LIVE STUDY MAP
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
    <section
      style={sectionStyle}
      className="relative overflow-hidden bg-[#05050a] py-16 sm:py-22 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <Reveal direction="left">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.04] px-3.5 py-2 text-[9px] font-black uppercase tracking-[.2em] text-cyan-300 sm:px-4 sm:text-[10px]">
                <FaGlobe />
                Everything is connected
              </div>
            </Reveal>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.8, delay: 0.05, ease: motionEase }}
              className="mt-6 text-[clamp(2.6rem,10vw,3.75rem)] font-black leading-[.96] tracking-[-.05em] sm:mt-7 sm:text-6xl"
            >
              Your study room is a
              <span className="block bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                living network.
              </span>
            </motion.h2>

            <Reveal delay={0.1} className="mt-5 max-w-xl text-sm leading-6 text-zinc-500 sm:mt-6 sm:text-base sm:leading-7">
              Every action creates a visible relationship: people connect to the
              document, conversations connect to ideas, and ideas connect back to
              the people discussing them.
            </Reveal>

            <div className="mt-7 grid max-w-xl grid-cols-2 gap-2.5 sm:mt-9 sm:gap-3">
              {[
                [<FaUsers />, "4", "active minds"],
                [<FaMicrophone />, "1", "speaking now"],
                [<BsPencilSquare />, "7", "annotations"],
                [<FaRegClock />, "42m", "session time"],
              ].map(([icon, value, label], index) => (
                <Reveal key={label} delay={index * 0.04}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 sm:p-4"
                  >
                    <div className="text-cyan-300">{icon}</div>
                    <p className="mt-2 text-lg font-black text-white sm:mt-3 sm:text-xl">
                      {value}
                    </p>
                    <p className="mt-1 text-[8px] uppercase tracking-widest text-zinc-600 sm:text-[9px]">
                      {label}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal scale>
            <div className="relative mx-auto aspect-square w-full max-w-[620px]">
              <div className="absolute inset-[8%] rounded-full bg-violet-500/5 blur-[65px] sm:blur-[80px]" />
              <div className="ss-orbit absolute inset-[8%] rounded-full border border-violet-400/[0.08]" />
              <div className="ss-orbit-reverse absolute inset-[20%] rounded-full border border-cyan-400/[0.08]" />

              <svg className="absolute inset-0 h-full w-full overflow-visible">
                {nodes.slice(1).map((node, index) => (
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
                    transition={{ duration: 0.9, delay: index * 0.08 }}
                  />
                ))}
              </svg>

              {nodes.slice(1, 5).map((node, index) => {
                const startX = 50;
                const startY = 45;
                const endX = parseFloat(node.x);
                const endY = parseFloat(node.y);

                return (
                  <div
                    key={`packet-${node.label}`}
                    className="absolute left-[50%] top-[45%] z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,.8)]"
                    style={{
                      "--packet-x": `${endX - startX}vw`,
                      "--packet-y": `${endY - startY}vw`,
                      animation: `ss-packet 3.5s ease-in-out infinite`,
                      animationDelay: `${index * 0.8}s`,
                    }}
                  />
                );
              })}

              {nodes.map((node, index) => (
                <div
                  key={node.label}
                  className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: node.x,
                    top: node.y,
                    animation: `ss-float ${node.main ? 3 : 4 + index * 0.25}s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  {node.main ? (
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 shadow-[0_0_60px_rgba(139,92,246,.18)] backdrop-blur-xl sm:h-28 sm:w-28">
                      <div className="ss-pulse-ring absolute inset-0 rounded-full border border-violet-300/30" />
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg text-red-500 shadow-xl sm:h-16 sm:w-16 sm:rounded-2xl sm:text-2xl">
                        {node.icon}
                      </div>
                      <span className="absolute -bottom-6 rounded-full border border-white/10 bg-[#0b0b12] px-2 py-1 text-[6px] font-bold text-zinc-400 sm:-bottom-7 sm:px-3 sm:text-[8px]">
                        shared document
                      </span>
                    </div>
                  ) : (
                    <div className="group flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/15 bg-gradient-to-br from-violet-500 to-cyan-400 text-[9px] font-black shadow-[0_15px_45px_rgba(0,0,0,.5)] sm:h-14 sm:w-14 sm:text-sm">
                        {node.icon}
                      </div>
                      <span className="mt-1.5 rounded-full border border-white/[0.06] bg-[#0b0b12]/90 px-2 py-1 text-[6px] font-bold text-zinc-500 backdrop-blur-xl sm:mt-2 sm:px-2.5 sm:text-[8px]">
                        {node.label}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   STUDY FLOW
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
    <section
      style={sectionStyle}
      className="relative overflow-hidden bg-[#08080d] py-16 sm:py-22 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="A SESSION, VISUALIZED"
          title="Watch a study session come alive."
          description="People arrive, talk, annotate, react and move through the same material together."
        />

        <div className="relative mt-12 sm:mt-20">
          <div className="absolute bottom-0 left-[28px] top-0 hidden w-px bg-gradient-to-b from-violet-500/60 via-fuchsia-500/30 to-cyan-400/60 md:block" />

          <div className="space-y-4 sm:space-y-6">
            {cards.map((card, index) => (
              <Reveal key={card.stat} direction={index % 2 ? "right" : "left"}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#0b0b12] p-5 shadow-[0_20px_60px_rgba(0,0,0,.25)] sm:rounded-[30px] sm:p-8 md:pl-20"
                >
                  <div className="absolute right-[-60px] top-[-60px] h-44 w-44 rounded-full bg-violet-500/5 blur-3xl transition-transform duration-700 hover:scale-150" />

                  <div className="relative flex flex-col gap-5 sm:gap-7 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[.2em] text-violet-400 sm:text-[10px]">
                        <span className="md:hidden">{card.icon}</span>
                        MOMENT {card.stat}
                      </div>

                      <h3 className="mt-3 text-xl font-black tracking-tight text-white sm:mt-4 sm:text-3xl">
                        {card.title}
                      </h3>

                      <p className="mt-2.5 text-xs leading-6 text-zinc-500 sm:mt-4 sm:text-base sm:leading-7">
                        {card.text}
                      </p>
                    </div>

                    <div
                      className="ss-float relative shrink-0 self-start sm:self-auto"
                      style={{ animationDelay: `${index * 0.3}s` }}
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-[22px] border border-white/10 bg-gradient-to-br from-violet-500/10 to-cyan-400/5 text-2xl text-violet-300 shadow-[0_15px_50px_rgba(0,0,0,.3)] sm:h-28 sm:w-28 sm:rounded-[28px] sm:text-4xl">
                        {card.icon}
                      </div>
                      <span className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-1 font-mono text-[7px] font-black text-black sm:text-[8px]">
                        0{index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="absolute left-[10px] top-8 hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#08080d] text-violet-300 shadow-[0_0_30px_rgba(139,92,246,.2)] md:flex">
                    {card.icon}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal scale className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 p-7 text-center sm:mt-24 sm:rounded-[36px] sm:p-14">
          <div className="ss-orbit absolute left-1/2 top-1/2 h-[360px] w-[360px] rounded-full border border-dashed border-white/[0.06] sm:h-[420px] sm:w-[420px]" />
          <FaQuoteLeft className="relative mx-auto text-xl text-violet-300 sm:text-2xl" />
          <p className="relative mx-auto mt-5 max-w-3xl text-xl font-black leading-tight tracking-tight text-white sm:mt-7 sm:text-4xl">
            &quot;The best study session is the one where everyone is contributing.&quot;
          </p>
          <p className="relative mt-4 text-[9px] uppercase tracking-[.2em] text-zinc-600 sm:mt-5 sm:text-xs">
            StudySync philosophy
          </p>
        </Reveal>
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
      style={sectionStyle}
      className="relative overflow-hidden border-y border-white/[0.05] bg-[#08080d] py-16 sm:py-22 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="THE TOOLKIT"
          title="Everything your group needs."
          description="Not another boring dashboard packed with unnecessary features. Just the tools that make studying together actually work."
        />

        <div className="mt-12 grid gap-3.5 sm:mt-16 sm:grid-cols-2 sm:gap-5">
          {features.map((feature, index) => (
            <Reveal key={feature.number} delay={index * 0.04}>
              <motion.div
                whileHover={{ y: -6 }}
                className={`group relative h-full overflow-hidden rounded-[24px] border border-white/[0.07] bg-gradient-to-br ${feature.gradient} p-6 transition-shadow duration-500 hover:border-white/[0.13] hover:shadow-[0_25px_70px_rgba(0,0,0,.3)] sm:rounded-[28px] sm:p-8`}
              >
                <div className="absolute right-[-40px] top-[-40px] h-36 w-36 rounded-full bg-white/[0.025] blur-3xl transition-transform duration-700 group-hover:scale-150" />

                <div className="relative flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-lg ${feature.iconColor} sm:h-14 sm:w-14 sm:text-xl`}>
                    {feature.icon}
                  </div>
                  <span className="font-mono text-[10px] text-zinc-700 sm:text-xs">
                    {feature.number}
                  </span>
                </div>

                <h3 className="relative mt-7 text-xl font-black tracking-tight sm:mt-9 sm:text-2xl">
                  {feature.title}
                </h3>

                <p className="relative mt-3 max-w-lg text-xs leading-6 text-zinc-500 sm:mt-4 sm:text-base sm:leading-7">
                  {feature.text}
                </p>

                <div className="relative mt-6 h-px w-10 bg-gradient-to-r from-violet-400 to-cyan-400 transition-all duration-500 group-hover:w-20 sm:mt-8 sm:w-12" />
              </motion.div>
            </Reveal>
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
      style={sectionStyle}
      className="relative overflow-hidden bg-[#05050a] py-16 sm:py-22 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="THE FLOW"
          title="From empty room to full study session."
          description="Four steps. Zero unnecessary friction."
        />

        <div className="relative mt-12 sm:mt-20">
          <div className="absolute left-[12%] right-[12%] top-9 hidden h-px bg-white/[0.06] lg:block">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: motionEase }}
              className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
            />
          </div>

          <div className="grid gap-8 sm:gap-10 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal key={step.n} delay={index * 0.04} className="relative text-center">
                <motion.div
                  whileHover={{ scale: 1.06, rotate: 4 }}
                  className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#0c0c13] text-violet-300 shadow-[0_15px_40px_rgba(0,0,0,.35)] sm:h-[74px] sm:w-[74px]"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative text-lg sm:text-xl">{step.icon}</span>

                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[7px] font-black text-white sm:h-6 sm:w-6 sm:text-[8px]">
                    {step.n}
                  </span>
                </motion.div>

                <h3 className="mt-5 text-base font-bold sm:mt-7 sm:text-lg">
                  {step.title}
                </h3>

                <p className="mx-auto mt-2 max-w-[230px] text-xs leading-5 text-zinc-600 sm:mt-3 sm:text-sm sm:leading-6">
                  {step.text}
                </p>
              </Reveal>
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
    <Reveal className="max-w-3xl">
      <div className="flex items-center gap-2.5 text-[9px] font-bold uppercase tracking-[.2em] text-violet-400 sm:gap-3 sm:text-xs sm:tracking-[.22em]">
        <span className="h-px w-6 bg-violet-400/50 sm:w-8" />
        {eyebrow}
      </div>

      <h2 className="mt-5 text-[clamp(2.35rem,8vw,3.75rem)] font-black leading-[.96] tracking-[-.045em] sm:mt-6 sm:text-6xl">
        {title}
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500 sm:mt-6 sm:text-lg sm:leading-7">
        {description}
      </p>
    </Reveal>
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
    <section
      style={sectionStyle}
      className="relative overflow-hidden border-y border-white/[0.05] bg-[#030307] py-6 sm:py-8"
    >
      <div className="ss-marquee flex w-max gap-3 px-2 sm:gap-4">
        {[...stats, ...stats].map(([title, text], index) => (
          <div
            key={`${title}-${index}`}
            className="flex min-w-[210px] items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 sm:min-w-[245px] sm:gap-4 sm:px-5 sm:py-4"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.35)]" />
            <div>
              <p className="text-[8px] font-black tracking-[.18em] text-white sm:text-[9px]">
                {title}
              </p>
              <p className="mt-1 text-[8px] text-zinc-600 sm:text-[9px]">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* =========================================================
   FINAL CTA
   ========================================================= */

const FinalCTA = () => {
  return (
    <section
      style={sectionStyle}
      className="relative overflow-hidden bg-[#05050a] py-16 sm:py-22 lg:py-28"
    >
      <div className="absolute left-1/2 top-1/2 h-[380px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[110px] sm:h-[500px] sm:w-[800px] sm:blur-[140px]" />

      <div className="relative mx-auto w-full max-w-5xl px-4 text-center sm:px-8">
        <Reveal scale className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-cyan-500/10 px-5 py-14 shadow-[0_35px_100px_rgba(124,58,237,.1)] sm:rounded-[40px] sm:px-12 sm:py-20">
          {[1, 2, 3, 4, 5].map((dot) => (
            <span
              key={dot}
              className="ss-float absolute h-1.5 w-1.5 rounded-full bg-violet-300"
              style={{
                left: `${10 + dot * 15}%`,
                top: `${20 + (dot % 2) * 45}%`,
                animationDelay: `${dot * 0.3}s`,
                animationDuration: `${3 + dot}s`,
              }}
            />
          ))}

          <HiOutlineSparkles className="mx-auto text-2xl text-violet-300 sm:text-3xl" />

          <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2.3rem,8vw,3.75rem)] font-black leading-[.96] tracking-[-.045em] sm:mt-7 sm:text-6xl">
            Your next study session
            <br />
            should feel different.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-zinc-400 sm:mt-6 sm:text-base sm:leading-7">
            Stop studying in isolation. Create a room, bring your friends and
            turn learning into something you actually want to return to.
          </p>

          <Link
            to="/register"
            className="group mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-black text-black transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(255,255,255,.15)] sm:mt-9 sm:px-8 sm:py-4"
          >
            Enter StudySync
            <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
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
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <Link
              to="/"
              className="text-xl font-black tracking-tight text-white sm:text-2xl"
            >
              Study
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Sync
              </span>
            </Link>

            <p className="mt-3 max-w-sm text-xs leading-6 text-zinc-600 sm:mt-4 sm:text-sm">
              A real-time collaborative learning platform built for students
              who believe learning is better together.
            </p>

            <div className="mt-5 flex gap-2.5 sm:mt-6 sm:gap-3">
              <Social icon={<FaGithub />} href="https://github.com" label="GitHub" />
              <Social icon={<FaLinkedin />} href="https://linkedin.com" label="LinkedIn" />
              <Social icon={<FaTwitter />} href="#" label="Twitter" />
            </div>
          </div>

          <div className="flex gap-12 text-xs sm:gap-16 sm:text-sm">
            <div>
              <p className="font-bold text-white">Product</p>
              <div className="mt-3 space-y-2.5 text-zinc-600 sm:mt-4 sm:space-y-3">
                <a className="block transition hover:text-white" href="#features">
                  Features
                </a>
                <a className="block transition hover:text-white" href="#how">
                  How it works
                </a>
                <a className="block transition hover:text-white" href="#experience">
                  Collaboration
                </a>
              </div>
            </div>

            <div>
              <p className="font-bold text-white">Account</p>
              <div className="mt-3 space-y-2.5 text-zinc-600 sm:mt-4 sm:space-y-3">
                <Link className="block transition hover:text-white" to="/login">
                  Login
                </Link>
                <Link className="block transition hover:text-white" to="/register">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/[0.06] pt-6 text-[10px] text-zinc-700 sm:mt-14 sm:pt-7 sm:text-xs">
          © {new Date().getFullYear()} StudySync. Built for collaborative learning.
          <p className="mt-1">Built By Aditya</p>
        </div>
      </div>
    </footer>
  );
};

const Social = ({ icon, href, label }) => {
  return (
    <motion.a
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      whileHover={{ y: -4, scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-500 transition hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-white sm:h-10 sm:w-10"
    >
      {icon}
    </motion.a>
  );
};
