import { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaChevronDown,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaClock,
  FaCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/hooks";
import { logout } from "../../redux/auth/authSlice";
import {
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
} from "../../redux/notification/notificationSlice";
import socket from "../../socket/socket";

const API_URL = import.meta.env.VITE_API_URL;

const CountdownText = ({ expiresAt }) => {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, new Date(expiresAt).getTime() - Date.now())
  );

  useEffect(() => {
    const update = () => {
      setRemaining(
        Math.max(0, new Date(expiresAt).getTime() - Date.now())
      );
    };

    update();
    const intervalId = window.setInterval(update, 1000);

    return () => window.clearInterval(intervalId);
  }, [expiresAt]);

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (remaining <= 0) {
    return <span>24-hour limit reached</span>;
  }

  return (
    <span>
      {hours}h {minutes}m {seconds}s remaining
    </span>
  );
};

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const shouldReduceMotion = useReducedMotion();

  const { user } = useAppSelector(
    (state) => state.auth
  );

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const notifications = useAppSelector(
    (state) => state.notification.items
  );

  const unreadNotificationCount = useAppSelector(
    (state) => state.notification.unreadCount
  );

  const today = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  /* =========================================
      CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  ========================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================
      CLOSE PROFILE DROPDOWN WITH ESCAPE
  ========================================= */

  useEffect(() => {
    if (!profileOpen && !notificationsOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [profileOpen]);

  /* =========================================
      LOGOUT
  ========================================= */

  const handleLogout = () => {
    setProfileOpen(false);

    dispatch(logout());
    dispatch(clearNotifications());

    if (socket.connected) {
      socket.disconnect();
    }

    navigate("/login");
  };

  /* =========================================
      AVATAR URL
  ========================================= */

  const avatarUrl = user?.avatar
    ? /^https?:\/\//i.test(user.avatar)
      ? user.avatar
      : `${API_URL}${
          user.avatar.startsWith("/")
            ? ""
            : "/"
        }${user.avatar}`
    : null;

  const getNotificationText = (notification) => {
    if (notification.isOwnRoom) {
      return (
        <>
          Your room <span className="font-semibold text-white">
            {notification.roomName}
          </span>{" "}
          will be automatically deleted within 24 hours.
        </>
      );
    }

    return (
      <>
        <span className="font-semibold text-white">
          {notification.creatorName || "Someone"}
        </span>{" "}
        created room <span className="font-semibold text-white">
          {notification.roomName}
        </span>.
      </>
    );
  };

  /* =========================================
      MOTION VARIANTS
  ========================================= */

  const dropdownVariants = {
    hidden: shouldReduceMotion
      ? {
          opacity: 0,
        }
      : {
          opacity: 0,
          y: -10,
          scale: 0.96,
        },

    visible: shouldReduceMotion
      ? {
          opacity: 1,
        }
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
      ? {
          opacity: 0,
        }
      : {
          opacity: 0,
          y: -8,
          scale: 0.97,
          transition: {
            duration: 0.15,
            ease: "easeIn",
          },
        },
  };

  const menuItemVariants = {
    hidden: {
      opacity: 0,
      x: -8,
    },

    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: shouldReduceMotion
          ? 0
          : 0.04 + i * 0.04,
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <header
      className="
        mb-6
        flex
        min-w-0
        items-center
        justify-between
        gap-3
        sm:mb-8
        sm:gap-5
      "
    >
      {/* =========================================
          LEFT SECTION
      ========================================= */}

      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          gap-3
        "
      >
        {/* =====================================
            MOBILE SIDEBAR BUTTON

            IMPORTANT:
            This is the ONLY hamburger button
            required for the dashboard.
        ===================================== */}

        <motion.button
          type="button"
          onClick={onMenuClick}
          whileHover={
            shouldReduceMotion
              ? undefined
              : {
                  scale: 1.05,
                }
          }
          whileTap={
            shouldReduceMotion
              ? undefined
              : {
                  scale: 0.92,
                }
          }
          className="
            group
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-slate-800/90
            bg-slate-900/90
            text-slate-300
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            backdrop-blur-xl
            transition-all
            duration-200

            hover:border-indigo-500/40
            hover:bg-slate-800
            hover:text-white

            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-indigo-500/70
            focus-visible:ring-offset-2
            focus-visible:ring-offset-slate-950

            lg:hidden
          "
          aria-label="Open navigation menu"
          title="Open navigation menu"
        >
          <FaBars
            className="
              text-sm
              transition-transform
              duration-200
              group-hover:scale-110
            "
          />
        </motion.button>

        {/* =====================================
            WELCOME CONTENT
        ===================================== */}

        <div className="min-w-0">
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
            "
          >
            <motion.h2
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 8,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                truncate
                text-[18px]
                font-semibold
                leading-tight
                tracking-[-0.02em]
                text-white
                sm:text-2xl
                lg:text-[27px]
              "
            >
              Welcome back{" "}
              <span className="relative ml-1 inline-block">
                <span
                  className="
                    bg-gradient-to-r
                    from-indigo-300
                    via-violet-400
                    to-fuchsia-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  {user?.name || "Student"}
                </span>

                <span
                  className="
                    absolute
                    -bottom-0.5
                    left-0
                    h-px
                    w-full
                    bg-gradient-to-r
                    from-indigo-500/0
                    via-indigo-400/60
                    to-violet-500/0
                  "
                />
              </span>
            </motion.h2>

            <motion.span
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: 0.5,
                      rotate: -20,
                    }
              }
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                    }
              }
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 18,
              }}
              className="
                hidden
                text-lg
                sm:inline-block
              "
              aria-hidden="true"
            >
              👋
            </motion.span>
          </div>

          {/* Date */}

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                  }
            }
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.15,
              duration: 0.4,
            }}
            className="
              mt-1.5
              flex
              items-center
              gap-2
              text-xs
              text-slate-500
              sm:mt-2
              sm:text-sm
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-indigo-400/90
                shadow-[0_0_8px_rgba(129,140,248,0.5)]
              "
            />

            <p className="truncate">
              {today}
            </p>
          </motion.div>
        </div>
      </div>

      {/* =========================================
          RIGHT SECTION
      ========================================= */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-2
          sm:gap-3
        "
      >
        {/* =====================================
            NOTIFICATIONS
        ===================================== */}

        <div
          ref={notificationRef}
          className="relative"
        >
          <motion.button
            type="button"
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : { y: -2 }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : { scale: 0.93 }
            }
            className="
              group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
              border border-slate-800/90 bg-slate-900/70 text-slate-400
              shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur-md transition-all duration-200
              hover:border-slate-700 hover:bg-slate-800 hover:text-white
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70
              focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
              sm:h-11 sm:w-11
            "
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <FaBell
              className="
                text-[13px] transition-transform duration-200 group-hover:-rotate-12 sm:text-sm
              "
            />

            {unreadNotificationCount > 0 && (
              <motion.span
                initial={
                  shouldReduceMotion ? false : { scale: 0 }
                }
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                }}
                className="
                  absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center
                  rounded-full border-2 border-slate-950 bg-gradient-to-br from-indigo-500 to-violet-500
                  px-1 text-[9px] font-bold leading-none text-white shadow-[0_0_14px_rgba(99,102,241,0.55)]
                  sm:h-5 sm:min-w-5 sm:text-[10px]
                "
              >
                {unreadNotificationCount > 99
                  ? "99+"
                  : unreadNotificationCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                className="
                  absolute right-0 top-full z-[110] mt-2.5 w-[calc(100vw-1.5rem)] max-w-[380px]
                  overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950/95
                  shadow-[0_28px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl
                "
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-white">Notifications</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      Study room updates
                    </p>
                  </div>

                  {unreadNotificationCount > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(markAllNotificationsRead())
                      }
                      className="flex items-center gap-1.5 text-[10px] font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                    >
                      <FaCheck className="text-[9px]" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[430px] overflow-y-auto p-2">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-slate-600">
                        <FaBell />
                      </div>
                      <p className="mt-3 text-sm font-medium text-slate-300">
                        No notifications
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        New study room updates will appear here.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => {
                          dispatch(
                            markNotificationRead(notification.id)
                          );

                          if (notification.roomId) {
                            setNotificationsOpen(false);

                            // The creator can open their room directly.
                            // Other users may not be members of a private room,
                            // so send them to the room list instead.
                            if (notification.isOwnRoom) {
                              navigate(`/room/${notification.roomId}`);
                            } else {
                              navigate("/rooms");
                            }
                          }
                        }}
                        className={`mb-1 w-full rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
                          notification.read
                            ? "border-transparent bg-transparent hover:border-slate-800 hover:bg-slate-900/70"
                            : "border-indigo-500/10 bg-indigo-500/[0.06] hover:bg-indigo-500/[0.09]"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                            {notification.isOwnRoom ? (
                              <FaClock className="text-sm" />
                            ) : (
                              <FaBell className="text-sm" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-200">
                                {notification.isOwnRoom
                                  ? "Room expiry"
                                  : "New study room"}
                              </p>
                              {!notification.read && (
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                              )}
                            </div>

                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                              {getNotificationText(notification)}
                            </p>

                            {notification.isOwnRoom && (
                              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-amber-400">
                                <FaClock className="text-[9px]" />
                                <CountdownText
                                  expiresAt={notification.expiresAt}
                                />
                              </div>
                            )}

                            <p className="mt-2 text-[9px] text-slate-700">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =====================================
            PROFILE
        ===================================== */}

        <div
          ref={profileRef}
          className="relative"
        >
          <motion.button
            type="button"
            onClick={() =>
              setProfileOpen((prev) => !prev)
            }
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -1.5,
                  }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 0.98,
                  }
            }
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="
              group
              flex
              h-10
              items-center
              gap-2
              rounded-xl
              border
              border-slate-800/90
              bg-slate-900/70
              px-1.5
              shadow-[0_8px_30px_rgba(0,0,0,0.16)]
              backdrop-blur-md
              transition-all
              duration-200

              hover:border-slate-700
              hover:bg-slate-800

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500/70
              focus-visible:ring-offset-2
              focus-visible:ring-offset-slate-950

              sm:h-11
              sm:gap-2.5
              sm:px-2
            "
          >
            {/* Avatar */}

            <div className="relative shrink-0">
              <div
                className="
                  absolute
                  -inset-0.5
                  rounded-[11px]
                  bg-gradient-to-br
                  from-indigo-500/70
                  via-violet-500/40
                  to-fuchsia-500/20
                  opacity-0
                  blur-[4px]
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />

              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={
                    user?.name || "User"
                  }
                  className="
                    relative
                    h-8
                    w-8
                    rounded-[9px]
                    object-cover
                    ring-1
                    ring-white/10
                    transition-transform
                    duration-300
                    group-hover:scale-[1.04]
                  "
                />
              ) : (
                <div
                  className="
                    relative
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[9px]
                    bg-gradient-to-br
                    from-slate-700
                    to-slate-800
                    ring-1
                    ring-white/10
                  "
                >
                  <FaUserCircle
                    className="
                      text-[22px]
                      text-slate-400
                    "
                  />
                </div>
              )}

              {/* Online indicator */}

              <span
                className="
                  absolute
                  -bottom-0.5
                  -right-0.5
                  h-2.5
                  w-2.5
                  rounded-full
                  border-2
                  border-slate-900
                  bg-emerald-400
                  shadow-[0_0_10px_rgba(52,211,153,0.55)]
                "
                aria-label="Online"
              />
            </div>

            {/* User information */}

            <div
              className="
                hidden
                min-w-0
                text-left
                sm:block
              "
            >
              <p
                className="
                  max-w-36
                  truncate
                  text-[13px]
                  font-semibold
                  leading-tight
                  text-slate-100
                "
              >
                {user?.name || "Student"}
              </p>

              <p
                className="
                  mt-0.5
                  max-w-36
                  truncate
                  text-[11px]
                  leading-tight
                  text-slate-500
                "
              >
                {user?.email || ""}
              </p>
            </div>

            {/* Chevron */}

            <motion.span
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: profileOpen
                        ? 180
                        : 0,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className="
                mr-1
                flex
                shrink-0
                items-center
                justify-center
              "
            >
              <FaChevronDown
                className="
                  text-[9px]
                  text-slate-500
                  transition-colors
                  duration-200
                  group-hover:text-slate-300
                "
              />
            </motion.span>
          </motion.button>

          {/* =====================================
              PROFILE DROPDOWN
          ===================================== */}

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                className="
                  absolute
                  right-0
                  top-full
                  z-[100]
                  mt-2.5
                  w-[calc(100vw-1.5rem)]
                  max-w-[280px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-800/90
                  bg-slate-950/95
                  p-1.5
                  shadow-[0_28px_80px_rgba(0,0,0,0.6)]
                  backdrop-blur-2xl
                "
                role="menu"
                aria-label="Profile menu"
              >
                {/* Accent */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-x-8
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-indigo-400/60
                    to-transparent
                  "
                />

                {/* User Card */}

                <motion.div
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                  className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-slate-800/80
                    px-3
                    py-3.5
                  "
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={
                        user?.name || "User"
                      }
                      className="
                        h-10
                        w-10
                        shrink-0
                        rounded-xl
                        object-cover
                        ring-1
                        ring-white/10
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-800
                        ring-1
                        ring-white/5
                      "
                    >
                      <FaUserCircle
                        className="
                          text-3xl
                          text-slate-500
                        "
                      />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-white
                      "
                    >
                      {user?.name || "Student"}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[11px]
                        text-slate-500
                      "
                    >
                      {user?.email || ""}
                    </p>
                  </div>
                </motion.div>

                {/* Menu Items */}

                <div className="pt-1.5">
                  {/* Profile */}

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
                      group
                      flex
                      min-h-11
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      text-slate-300
                      transition-all
                      duration-200
                      hover:bg-white/[0.05]
                      hover:text-white
                      focus:outline-none
                      focus-visible:bg-white/[0.05]
                      focus-visible:ring-1
                      focus-visible:ring-indigo-500/50
                    "
                    role="menuitem"
                  >
                    <span
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-slate-900
                        text-slate-500
                        transition-all
                        duration-200
                        group-hover:bg-indigo-500/15
                        group-hover:text-indigo-400
                      "
                    >
                      <FaUserCircle className="text-sm" />
                    </span>

                    <span className="flex-1">
                      <span className="block font-medium">
                        Profile
                      </span>

                      <span
                        className="
                          mt-0.5
                          block
                          text-[10px]
                          text-slate-600
                          transition-colors
                          group-hover:text-slate-500
                        "
                      >
                        Manage your account
                      </span>
                    </span>
                  </motion.button>

                  {/* Logout */}

                  <motion.button
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={menuItemVariants}
                    type="button"
                    onClick={handleLogout}
                    className="
                      group
                      mt-1
                      flex
                      min-h-11
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      text-red-400
                      transition-all
                      duration-200
                      hover:bg-red-500/[0.08]
                      hover:text-red-300
                      focus:outline-none
                      focus-visible:bg-red-500/[0.08]
                      focus-visible:ring-1
                      focus-visible:ring-red-500/40
                    "
                    role="menuitem"
                  >
                    <span
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-red-500/[0.07]
                        text-red-400
                        transition-all
                        duration-200
                        group-hover:bg-red-500/15
                      "
                    >
                      <FaSignOutAlt className="text-sm" />
                    </span>

                    <span className="flex-1">
                      <span className="block font-medium">
                        Logout
                      </span>

                      <span
                        className="
                          mt-0.5
                          block
                          text-[10px]
                          text-red-500/50
                          transition-colors
                          group-hover:text-red-400/70
                        "
                      >
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