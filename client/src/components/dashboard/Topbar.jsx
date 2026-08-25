import { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaChevronDown,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/auth/authSlice";

const API_URL = import.meta.env.VITE_API_URL;

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const shouldReduceMotion = useReducedMotion();

  const { user } = useAppSelector((state) => state.auth);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close with Escape
  useEffect(() => {
    if (!profileOpen) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [profileOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  const avatarUrl = user?.avatar
    ? /^https?:\/\//i.test(user.avatar)
        ? user.avatar
        : `${API_URL}${user.avatar.startsWith("/") ? "" : "/"}${user.avatar}`
    : null;
  // ===========================
  // Motion Variants
  // ===========================

  const dropdownVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: -10, scale: 0.96 },
    visible: shouldReduceMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 420,
            damping: 32,
            mass: 0.8,
          },
        },
    exit: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: -8,
          scale: 0.97,
          transition: { duration: 0.15, ease: "easeIn" },
        },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.04 + i * 0.04,
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <header className="mb-6 flex min-w-0 items-center justify-between gap-3 sm:mb-8 sm:gap-5">
      {/* =========================================
          LEFT SECTION
      ========================================= */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Mobile Menu */}
        <motion.button
          type="button"
          onClick={onMenuClick}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
          className="
            group flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl border border-slate-800/90 bg-slate-900/70
            text-slate-400 shadow-[0_8px_30px_rgba(0,0,0,0.18)]
            backdrop-blur-md transition-colors duration-200
            hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70
            focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
            lg:hidden
          "
          aria-label="Open navigation menu"
        >
          <FaBars className="text-sm transition-transform duration-200 group-hover:scale-110" />
        </motion.button>

        {/* Welcome Content */}
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <motion.h2
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="truncate text-[18px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-2xl lg:text-[27px]"
            >
              Welcome back,{" "}
              <span className="relative ml-1 inline-block">
                <span className="bg-gradient-to-r from-indigo-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  {user?.name || "Student"}
                </span>
                {/* subtle underline glow */}
                <span className="absolute -bottom-0.5 left-0 h-px w-full bg-gradient-to-r from-indigo-500/0 via-indigo-400/60 to-violet-500/0" />
              </span>
            </motion.h2>

            <motion.span
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.5, rotate: -20 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 18 }}
              className="hidden text-lg sm:inline-block"
              aria-hidden="true"
            >
              👋
            </motion.span>
          </div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 sm:mt-2 sm:text-sm"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/90 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
            <p className="truncate">{today}</p>
          </motion.div>
        </div>
      </div>

      {/* =========================================
          RIGHT SECTION
      ========================================= */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <motion.button
          type="button"
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.93 }}
          className="
            group relative flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl border border-slate-800/90 bg-slate-900/70
            text-slate-400 shadow-[0_8px_30px_rgba(0,0,0,0.16)]
            backdrop-blur-md transition-all duration-200
            hover:border-slate-700 hover:bg-slate-800 hover:text-white
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70
            focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
            sm:h-11 sm:w-11
          "
          aria-label="Notifications"
        >
          <FaBell className="text-[13px] transition-transform duration-200 group-hover:-rotate-12 sm:text-sm" />

          {/* Badge */}
          <motion.span
            initial={shouldReduceMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.25 }}
            className="
              absolute -right-1 -top-1 flex h-[18px] min-w-[18px]
              items-center justify-center rounded-full border-2 border-slate-950
              bg-gradient-to-br from-indigo-500 to-violet-500
              px-1 text-[9px] font-bold leading-none text-white
              shadow-[0_0_14px_rgba(99,102,241,0.55)]
              sm:h-5 sm:min-w-5 sm:text-[10px]
            "
          >
            3
            {/* soft pulse ring */}
            {!shouldReduceMotion && (
              <motion.span
                className="absolute inset-0 rounded-full bg-indigo-400/40"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </motion.span>
        </motion.button>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <motion.button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            whileHover={shouldReduceMotion ? undefined : { y: -1.5 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="
              group flex h-10 items-center gap-2 rounded-xl
              border border-slate-800/90 bg-slate-900/70 px-1.5
              shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur-md
              transition-all duration-200
              hover:border-slate-700 hover:bg-slate-800
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70
              focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
              sm:h-11 sm:gap-2.5 sm:px-2
            "
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="
                  absolute -inset-0.5 rounded-[11px]
                  bg-gradient-to-br from-indigo-500/70 via-violet-500/40 to-fuchsia-500/20
                  opacity-0 blur-[4px] transition-opacity duration-300
                  group-hover:opacity-100
                "
              />
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || "User"}
                  className="
                    relative h-8 w-8 rounded-[9px] object-cover
                    ring-1 ring-white/10 transition-transform duration-300
                    group-hover:scale-[1.04]
                  "
                />
              ) : (
                <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[9px] bg-gradient-to-br from-slate-700 to-slate-800 ring-1 ring-white/10">
                  <FaUserCircle className="text-[22px] text-slate-400" />
                </div>
              )}

              {/* Online indicator */}
              <span
                className="
                  absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full
                  border-2 border-slate-900 bg-emerald-400
                  shadow-[0_0_10px_rgba(52,211,153,0.55)]
                "
                aria-label="Online"
              />
            </div>

            {/* User info */}
            <div className="hidden min-w-0 text-left sm:block">
              <p className="max-w-36 truncate text-[13px] font-semibold leading-tight text-slate-100">
                {user?.name || "Student"}
              </p>
              <p className="mt-0.5 max-w-36 truncate text-[11px] leading-tight text-slate-500">
                {user?.email || ""}
              </p>
            </div>

            {/* Chevron */}
            <motion.span
              animate={shouldReduceMotion ? undefined : { rotate: profileOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="mr-1 flex shrink-0 items-center justify-center"
            >
              <FaChevronDown className="text-[9px] text-slate-500 transition-colors duration-200 group-hover:text-slate-300" />
            </motion.span>
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                className="
                  absolute right-0 top-full z-50 mt-2.5
                  w-[calc(100vw-1.5rem)] max-w-[280px]
                  overflow-hidden rounded-2xl
                  border border-slate-800/90 bg-slate-950/90
                  p-1.5 shadow-[0_28px_80px_rgba(0,0,0,0.6)]
                  backdrop-blur-2xl
                "
                role="menu"
                aria-label="Profile menu"
              >
                {/* Top accent line */}
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />

                {/* User card */}
                <motion.div
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                  className="flex items-center gap-3 border-b border-slate-800/80 px-3 py-3.5"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || "User"}
                      className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-white/5">
                      <FaUserCircle className="text-3xl text-slate-500" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {user?.name || "Student"}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                      {user?.email || ""}
                    </p>
                  </div>
                </motion.div>

                {/* Menu items */}
                <div className="pt-1.5">
                  <motion.button
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={menuItemVariants}
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="
                      group flex min-h-11 w-full items-center gap-3
                      rounded-xl px-3 py-2.5 text-left text-sm text-slate-300
                      transition-all duration-200
                      hover:bg-white/[0.05] hover:text-white
                      focus:outline-none focus-visible:bg-white/[0.05]
                      focus-visible:ring-1 focus-visible:ring-indigo-500/50
                    "
                    role="menuitem"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-slate-500 transition-all duration-200 group-hover:bg-indigo-500/15 group-hover:text-indigo-400">
                      <FaUserCircle className="text-sm" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium">Profile</span>
                      <span className="mt-0.5 block text-[10px] text-slate-600 transition-colors group-hover:text-slate-500">
                        Manage your account
                      </span>
                    </span>
                  </motion.button>

                  <motion.button
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={menuItemVariants}
                    type="button"
                    onClick={handleLogout}
                    className="
                      group mt-1 flex min-h-11 w-full items-center gap-3
                      rounded-xl px-3 py-2.5 text-left text-sm text-red-400
                      transition-all duration-200
                      hover:bg-red-500/[0.08] hover:text-red-300
                      focus:outline-none focus-visible:bg-red-500/[0.08]
                      focus-visible:ring-1 focus-visible:ring-red-500/40
                    "
                    role="menuitem"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/[0.07] text-red-400 transition-all duration-200 group-hover:bg-red-500/15">
                      <FaSignOutAlt className="text-sm" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium">Logout</span>
                      <span className="mt-0.5 block text-[10px] text-red-500/50 transition-colors group-hover:text-red-400/70">
                        Sign out of StudySync
                      </span>
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;