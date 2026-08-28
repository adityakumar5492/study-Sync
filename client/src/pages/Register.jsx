import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import {
    FiUser,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiHome,
    FiUsers,
    FiCheck,
    FiArrowUpRight,
    FiShield,
    FiZap,
    FiBookOpen,
} from "react-icons/fi";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { useAppDispatch } from "../redux/hooks";
import { registerThunk } from "../redux/auth/authThunk";

/*
 * STUDYSYNC — PREMIUM REGISTER
 *
 * Presentation optimized for:
 * - Fast initial rendering
 * - Faster animations
 * - Mobile-first responsiveness
 * - Smaller typography consistent with landing page
 * - Reduced expensive blur/animation work
 *
 * Authentication logic remains unchanged.
 */

const STUDY_IMAGE =
    "https://images.pexels.com/photos/5306450/pexels-photo-5306450.jpeg?auto=compress&cs=tinysrgb&w=1400";

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword } = formData;

        if (!name || !email || !password || !confirmPassword) {
            return toast.error("All fields are required.");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        try {
            setLoading(true);

            await dispatch(
                registerThunk({
                    name,
                    email,
                    password,
                })
            ).unwrap();

            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen overflow-x-hidden bg-[#030307] text-white"
            style={{
                WebkitOverflowScrolling: "touch",
            }}
        >
            <RegisterNavbar />

            <main className="relative min-h-screen pt-[68px] sm:pt-[72px]">
                {/* =====================================================
                    BACKGROUND
                   ===================================================== */}

                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    {!reduceMotion && (
                        <>
                            <motion.div
                                animate={{
                                    x: [0, 35, -20, 0],
                                    y: [0, -20, 25, 0],
                                    scale: [1, 1.05, 0.98, 1],
                                }}
                                transition={{
                                    duration: 24,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute -left-52 top-0 h-[420px] w-[420px] rounded-full bg-violet-600/[0.11] blur-[100px]"
                            />

                            <motion.div
                                animate={{
                                    x: [0, -25, 15, 0],
                                    y: [0, 25, -15, 0],
                                    scale: [1, 0.98, 1.04, 1],
                                }}
                                transition={{
                                    duration: 27,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute -right-52 bottom-0 h-[430px] w-[430px] rounded-full bg-cyan-500/[0.07] blur-[110px]"
                            />
                        </>
                    )}

                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
                            backgroundSize: "64px 64px",
                        }}
                    />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030307_88%)]" />
                </div>

                {/* =====================================================
                    MAIN CARD
                   ===================================================== */}

                <div className="relative mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-7xl items-center px-3 py-5 sm:px-6 sm:py-8 lg:min-h-[calc(100vh-72px)] lg:px-8 lg:py-10">
                    <div className="grid w-full overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.02] shadow-[0_30px_100px_rgba(0,0,0,.5)] lg:grid-cols-[0.95fr_1.05fr] lg:rounded-[30px]">
                        {/* =================================================
                            LEFT — REGISTER FORM
                           ================================================= */}

                        <section className="relative order-2 flex items-center bg-[#08080e]/95 p-5 sm:p-7 md:p-9 lg:order-1 lg:p-10 xl:p-11">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(139,92,246,.09),transparent_38%)]" />

                            <div className="relative mx-auto w-full max-w-[430px]">
                                {/* Mobile brand */}

                                <div className="mb-6 flex items-center gap-2.5 lg:hidden">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_22px_rgba(139,92,246,.2)]">
                                        <span className="text-xs font-black">
                                            S
                                        </span>
                                    </div>

                                    <span className="text-base font-black tracking-tight">
                                        Study
                                        <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                                            Sync
                                        </span>
                                    </span>
                                </div>

                                <motion.div
                                    initial={
                                        reduceMotion
                                            ? false
                                            : { opacity: 0, y: 12 }
                                    }
                                    animate={
                                        reduceMotion
                                            ? {}
                                            : { opacity: 1, y: 0 }
                                    }
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    {/* Heading */}

                                    <div className="mb-6 sm:mb-7">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/10 bg-cyan-400/[0.04] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.16em] text-cyan-300">
                                            <FiBookOpen size={11} />
                                            Create your workspace
                                        </span>

                                        <h1 className="mt-4 text-[28px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[32px]">
                                            Start building
                                            <span className="block bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
                                                together.
                                            </span>
                                        </h1>

                                        <p className="mt-3 max-w-md text-xs leading-5 text-zinc-500 sm:text-[13px]">
                                            Create your StudySync account and
                                            turn your next study session into
                                            a live, collaborative workspace.
                                        </p>
                                    </div>

                                    {/* Form */}

                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-3.5"
                                    >
                                        <PremiumInput
                                            id="name"
                                            name="name"
                                            type="text"
                                            label="Full name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            icon={<FiUser />}
                                            autoComplete="name"
                                        />

                                        <PremiumInput
                                            id="email"
                                            name="email"
                                            type="email"
                                            label="Email address"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            icon={<FiMail />}
                                            autoComplete="email"
                                        />

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            label="Password"
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            show={showPassword}
                                            setShow={setShowPassword}
                                            autoComplete="new-password"
                                        />

                                        <PasswordInput
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            label="Confirm password"
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            show={showConfirmPassword}
                                            setShow={setShowConfirmPassword}
                                            autoComplete="new-password"
                                        />

                                        <PasswordStrength
                                            password={formData.password}
                                        />

                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileHover={
                                                loading
                                                    ? {}
                                                    : {
                                                          y: -1,
                                                      }
                                            }
                                            whileTap={
                                                loading
                                                    ? {}
                                                    : { scale: 0.985 }
                                            }
                                            transition={{ duration: 0.15 }}
                                            className="group relative mt-1 flex min-h-[48px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-white px-4 py-3 text-xs font-black text-black shadow-[0_10px_35px_rgba(255,255,255,.06)] transition-all duration-200 hover:shadow-[0_14px_40px_rgba(255,255,255,.09)] disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:text-sm"
                                        >
                                            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-100/80 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

                                            <span className="relative flex items-center gap-2.5">
                                                {loading ? (
                                                    <>
                                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                                        Creating your space...
                                                    </>
                                                ) : (
                                                    <>
                                                        Create my StudySync
                                                        <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </span>
                                        </motion.button>
                                    </form>

                                    {/* Divider */}

                                    <div className="my-5 flex items-center gap-3">
                                        <div className="h-px flex-1 bg-white/[0.06]" />

                                        <span className="text-[8px] font-bold tracking-[.18em] text-zinc-700">
                                            OR
                                        </span>

                                        <div className="h-px flex-1 bg-white/[0.06]" />
                                    </div>

                                    {/* Google */}

                                    <motion.button
                                        type="button"
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.985 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs font-semibold text-zinc-300 transition-colors duration-200 hover:border-white/[0.12] hover:bg-white/[0.045] sm:rounded-2xl sm:text-sm"
                                    >
                                        <FcGoogle size={18} />
                                        Continue with Google
                                    </motion.button>

                                    {/* Login */}

                                    <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-600 sm:text-xs">
                                        <span>
                                            Already have an account?
                                        </span>

                                        <Link
                                            to="/login"
                                            className="group inline-flex items-center gap-1 font-bold text-violet-400 transition-colors duration-200 hover:text-violet-300"
                                        >
                                            Sign in
                                            <FiArrowUpRight className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </Link>
                                    </div>

                                    {/* Trust */}

                                    <div className="mt-5 grid grid-cols-3 gap-1.5 border-t border-white/[0.05] pt-5">
                                        {[
                                            [<FiShield />, "Secure"],
                                            [<FiZap />, "Realtime"],
                                            [<FiUsers />, "Together"],
                                        ].map(([icon, label]) => (
                                            <div
                                                key={label}
                                                className="flex items-center justify-center gap-1.5 text-[7px] font-semibold uppercase tracking-[.12em] text-zinc-700 sm:text-[8px]"
                                            >
                                                <span className="text-emerald-500/70">
                                                    {icon}
                                                </span>
                                                {label}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </section>

                        {/* =================================================
                            RIGHT — VISUAL STORY
                           ================================================= */}

                        <section className="relative order-1 min-h-[280px] overflow-hidden sm:min-h-[360px] lg:order-2 lg:min-h-[650px]">
                            <motion.img
                                initial={
                                    reduceMotion
                                        ? false
                                        : {
                                              scale: 1.06,
                                              opacity: 0,
                                          }
                                }
                                animate={
                                    reduceMotion
                                        ? {}
                                        : {
                                              scale: 1,
                                              opacity: 1,
                                          }
                                }
                                transition={{
                                    duration: 0.75,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                src={STUDY_IMAGE}
                                alt="Students collaborating on a study project"
                                onLoad={() => setImageLoaded(true)}
                                className={`absolute inset-0 h-full w-full object-cover transition-[filter,transform] duration-500 ${
                                    imageLoaded
                                        ? "scale-100"
                                        : "scale-[1.02]"
                                }`}
                                loading="eager"
                                decoding="async"
                            />

                            <div className="absolute inset-0 bg-gradient-to-br from-[#05050a]/15 via-[#05050a]/35 to-[#05050a]/95" />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-[#05050a]/10" />

                            {/* Animated glow */}

                            {!reduceMotion && (
                                <motion.div
                                    animate={{
                                        opacity: [0.1, 0.2, 0.1],
                                        scale: [1, 1.06, 1],
                                    }}
                                    transition={{
                                        duration: 7,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute -left-24 top-1/3 h-56 w-56 rounded-full bg-violet-500/25 blur-[80px]"
                                />
                            )}

                            {/* Live badge */}

                            <motion.div
                                initial={
                                    reduceMotion
                                        ? false
                                        : {
                                              opacity: 0,
                                              y: -8,
                                          }
                                }
                                animate={
                                    reduceMotion
                                        ? {}
                                        : {
                                              opacity: 1,
                                              y: 0,
                                          }
                                }
                                transition={{
                                    delay: 0.15,
                                    duration: 0.4,
                                }}
                                className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-md sm:left-6 sm:top-6 sm:px-3.5 sm:py-2"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-1.5 w-1.5">
                                        {!reduceMotion && (
                                            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
                                        )}
                                        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    </span>

                                    <span className="text-[7px] font-bold uppercase tracking-[.16em] text-white/70 sm:text-[8px]">
                                        Your next session starts here
                                    </span>
                                </div>
                            </motion.div>

                            {/* Activity card */}

                            <motion.div
                                initial={
                                    reduceMotion
                                        ? false
                                        : {
                                              opacity: 0,
                                              x: 18,
                                          }
                                }
                                animate={
                                    reduceMotion
                                        ? {}
                                        : {
                                              opacity: 1,
                                              x: 0,
                                          }
                                }
                                transition={{
                                    delay: 0.25,
                                    duration: 0.45,
                                }}
                                className="absolute right-4 top-16 rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 shadow-xl backdrop-blur-md sm:right-6 sm:top-20 sm:rounded-2xl sm:px-3.5 sm:py-3"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300 sm:h-9 sm:w-9 sm:rounded-xl">
                                        <FiUsers size={15} />
                                    </div>

                                    <div>
                                        <p className="text-[8px] font-bold text-white sm:text-[9px]">
                                            4 students connected
                                        </p>

                                        <p className="mt-0.5 text-[7px] text-white/40 sm:text-[8px]">
                                            studying together right now
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Avatars */}

                            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2 sm:right-6 sm:gap-2.5">
                                {[
                                    ["A", "from-violet-500 to-fuchsia-500"],
                                    ["R", "from-cyan-400 to-blue-500"],
                                    ["S", "from-emerald-400 to-cyan-500"],
                                ].map(([letter, gradient], index) => (
                                    <motion.div
                                        key={letter}
                                        initial={
                                            reduceMotion
                                                ? false
                                                : {
                                                      opacity: 0,
                                                      x: 15,
                                                  }
                                        }
                                        animate={
                                            reduceMotion
                                                ? {}
                                                : {
                                                      opacity: 1,
                                                      x: 0,
                                                  }
                                        }
                                        transition={{
                                            delay: 0.45 + index * 0.07,
                                            duration: 0.35,
                                        }}
                                        whileHover={
                                            reduceMotion
                                                ? {}
                                                : {
                                                      x: -4,
                                                      scale: 1.05,
                                                  }
                                        }
                                        className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br ${gradient} text-[8px] font-black shadow-lg sm:h-9 sm:w-9`}
                                    >
                                        {letter}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Bottom story */}

                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                                <motion.div
                                    initial={
                                        reduceMotion
                                            ? false
                                            : {
                                                  opacity: 0,
                                                  y: 14,
                                              }
                                    }
                                    animate={
                                        reduceMotion
                                            ? {}
                                            : {
                                                  opacity: 1,
                                                  y: 0,
                                              }
                                    }
                                    transition={{
                                        delay: 0.3,
                                        duration: 0.45,
                                    }}
                                >
                                    <div className="flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-[.18em] text-violet-300 sm:text-[8px]">
                                        <span className="h-px w-5 bg-violet-300/60 sm:w-7" />
                                        THE STUDYSYNC IDEA
                                    </div>

                                    <h2 className="mt-3 max-w-lg text-[23px] font-black leading-[0.98] tracking-[-.045em] text-white sm:mt-4 sm:text-[32px]">
                                        Don't just create
                                        <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                                            an account.
                                        </span>
                                        Create a room.
                                    </h2>

                                    <p className="mt-3 max-w-md text-[10px] leading-5 text-white/50 sm:mt-4 sm:text-xs sm:leading-6">
                                        Bring your people, your PDFs, your
                                        questions and your ideas into one
                                        shared space.
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                                        <VisualPill
                                            icon={<FiCheck />}
                                            text="Shared PDFs"
                                        />
                                        <VisualPill
                                            icon={<FiUsers />}
                                            text="Live people"
                                        />
                                        <VisualPill
                                            icon={<FiZap />}
                                            text="Realtime"
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Scan line — lightweight */}

                            {!reduceMotion && (
                                <motion.div
                                    animate={{
                                        y: ["-20%", "120%"],
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="pointer-events-none absolute left-0 right-0 top-0 h-16 bg-gradient-to-b from-transparent via-violet-400/[0.04] to-transparent"
                                />
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

/* =========================================================
   NAVBAR
   ========================================================= */

const RegisterNavbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (ticking) return;

            ticking = true;

            window.requestAnimationFrame(() => {
                setScrolled(window.scrollY > 12);
                ticking = false;
            });
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={`fixed left-0 right-0 top-0 z-[100] border-b transition-[background-color,border-color,box-shadow] duration-300 ${
                scrolled
                    ? "border-white/[0.07] bg-[#030307]/90 shadow-xl shadow-black/20 backdrop-blur-xl"
                    : "border-transparent bg-[#030307]/55 backdrop-blur-lg"
            }`}
        >
            <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
                <Link
                    to="/"
                    className="group flex items-center gap-2.5"
                    aria-label="Go to StudySync landing page"
                >
                    <motion.div
                        whileHover={{
                            rotate: 180,
                            scale: 1.04,
                        }}
                        transition={{ duration: 0.35 }}
                        className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_22px_rgba(139,92,246,.2)] sm:h-9 sm:w-9 sm:rounded-xl"
                    >
                        <span className="text-xs font-black text-white">
                            S
                        </span>

                        <span className="absolute inset-0 rounded-lg bg-white/15 opacity-0 blur-sm transition-opacity duration-200 group-hover:opacity-100 sm:rounded-xl" />
                    </motion.div>

                    <span className="text-base font-black tracking-tight sm:text-lg">
                        Study
                        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            Sync
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-0.5 md:flex">
                    <NavItem
                        to="/"
                        icon={<FiHome />}
                        label="Home"
                    />

                    <NavItem
                        to="/#experience"
                        icon={<FiUsers />}
                        label="Experience"
                    />

                    <NavItem
                        to="/#features"
                        icon={<FiBookOpen />}
                        label="Features"
                    />
                </nav>

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Link
                        to="/login"
                        className="hidden rounded-full px-3 py-2 text-[11px] font-semibold text-zinc-500 transition-colors duration-200 hover:bg-white/5 hover:text-white sm:block sm:px-4 sm:text-xs"
                    >
                        Sign in
                    </Link>

                    <Link
                        to="/"
                        className="group relative overflow-hidden rounded-full bg-white px-3 py-2 text-[10px] font-black text-black shadow-[0_7px_24px_rgba(255,255,255,.06)] transition-transform duration-200 hover:-translate-y-0.5 sm:px-4 sm:py-2.5 sm:text-xs"
                    >
                        <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                            <span className="hidden xs:inline sm:inline">
                                Back
                            </span>

                            <span className="sm:hidden">Back</span>

                            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                        </span>

                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-100 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    </Link>
                </div>
            </div>
        </motion.header>
    );
};

const NavItem = ({ to, icon, label }) => (
    <Link
        to={to}
        className="group flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold text-zinc-500 transition-colors duration-200 hover:bg-white/[0.04] hover:text-white"
    >
        <span className="text-zinc-700 transition-colors duration-200 group-hover:text-violet-400">
            {icon}
        </span>

        {label}
    </Link>
);

/* =========================================================
   INPUTS
   ========================================================= */

const PremiumInput = ({
    id,
    name,
    type,
    label,
    placeholder,
    value,
    onChange,
    icon,
    autoComplete,
}) => (
    <div>
        <label
            htmlFor={id}
            className="mb-1.5 block text-[10px] font-semibold text-zinc-300 sm:text-[11px]"
        >
            {label}
        </label>

        <div className="group relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors duration-200 group-focus-within:text-violet-400 sm:left-4">
                {icon}
            </span>

            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required
                className="min-h-[46px] w-full rounded-xl border border-white/[0.07] bg-white/[0.03] py-3 pl-10 pr-3 text-xs text-white outline-none placeholder:text-zinc-700 transition-[border-color,background-color,box-shadow] duration-200 focus:border-violet-400/40 focus:bg-violet-400/[0.035] focus:ring-4 focus:ring-violet-500/[0.07] sm:rounded-2xl sm:pl-11 sm:text-sm"
            />
        </div>
    </div>
);

const PasswordInput = ({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    show,
    setShow,
    autoComplete,
}) => (
    <div>
        <label
            htmlFor={id}
            className="mb-1.5 block text-[10px] font-semibold text-zinc-300 sm:text-[11px]"
        >
            {label}
        </label>

        <div className="group relative">
            <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors duration-200 group-focus-within:text-violet-400 sm:left-4" />

            <input
                id={id}
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required
                className="min-h-[46px] w-full rounded-xl border border-white/[0.07] bg-white/[0.03] py-3 pl-10 pr-11 text-xs text-white outline-none placeholder:text-zinc-700 transition-[border-color,background-color,box-shadow] duration-200 focus:border-violet-400/40 focus:bg-violet-400/[0.035] focus:ring-4 focus:ring-violet-500/[0.07] sm:rounded-2xl sm:pl-11 sm:text-sm"
            />

            <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-600 transition-colors duration-200 hover:text-zinc-300 sm:right-4"
                aria-label={
                    show ? `Hide ${label}` : `Show ${label}`
                }
            >
                {show ? (
                    <FiEyeOff size={16} />
                ) : (
                    <FiEye size={16} />
                )}
            </button>
        </div>
    </div>
);

/* =========================================================
   PASSWORD STRENGTH
   ========================================================= */

const PasswordStrength = ({ password }) => {
    const score = !password
        ? 0
        : Math.min(
              4,
              (password.length >= 6 ? 1 : 0) +
                  (password.length >= 10 ? 1 : 0) +
                  (/[A-Z]/.test(password) ? 1 : 0) +
                  (/[0-9!@#$%^&*]/.test(password) ? 1 : 0)
          );

    const labels = ["", "Weak", "Fair", "Good", "Strong"];

    return (
        <AnimatePresence initial={false}>
            {password && (
                <motion.div
                    initial={{
                        opacity: 0,
                        height: 0,
                    }}
                    animate={{
                        opacity: 1,
                        height: "auto",
                    }}
                    exit={{
                        opacity: 0,
                        height: 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <div className="flex items-center gap-2.5 px-1 pt-0.5">
                        <div className="flex flex-1 gap-1">
                            {[1, 2, 3, 4].map((bar) => (
                                <motion.span
                                    key={bar}
                                    initial={{
                                        scaleX: 0,
                                    }}
                                    animate={{
                                        scaleX: 1,
                                    }}
                                    transition={{
                                        duration: 0.18,
                                    }}
                                    className={`h-1 flex-1 origin-left rounded-full ${
                                        bar <= score
                                            ? score <= 1
                                                ? "bg-red-400"
                                                : score === 2
                                                  ? "bg-amber-400"
                                                  : score === 3
                                                    ? "bg-cyan-400"
                                                    : "bg-emerald-400"
                                            : "bg-white/[0.06]"
                                    }`}
                                />
                            ))}
                        </div>

                        <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-600">
                            {labels[score]}
                        </span>
                    </div>

                    <p className="mt-1.5 px-1 text-[8px] leading-4 text-zinc-700">
                        Use 6+ characters. Add uppercase letters, numbers or
                        symbols for a stronger password.
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/* =========================================================
   VISUAL PILL
   ========================================================= */

const VisualPill = ({ icon, text }) => (
    <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-2.5 py-1.5 text-[7px] font-semibold text-white/65 backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-[8px]"
    >
        <span className="text-cyan-300">
            {icon}
        </span>

        {text}
    </motion.div>
);

export default Register;