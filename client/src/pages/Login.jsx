import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiMail,
    FiLock,
    FiArrowRight,
    FiEye,
    FiEyeOff,
    FiHome,
    FiUsers,
    FiCheck,
    FiBookOpen,
} from "react-icons/fi";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginThunk } from "../redux/auth/authThunk";
import { clearError } from "../redux/auth/authSlice";

/*
 * STUDYSYNC — PREMIUM LOGIN
 *
 * Authentication logic remains unchanged.
 *
 * Improvements:
 * - Google authentication removed
 * - Smaller and more consistent typography
 * - Better mobile responsiveness
 * - Reduced animation workload
 * - Faster initial rendering
 * - No unnecessary infinite animations
 * - Tighter spacing
 * - Better viewport usage
 */

const STUDY_IMAGE =
    "https://images.pexels.com/photos/7973199/pexels-photo-7973199.jpeg?auto=compress&cs=tinysrgb&w=1800";

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();

    const { loading, error, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginThunk(formData));
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#030307] text-white">
            <LoginNavbar />

            <main className="relative min-h-screen pt-[68px]">
                {/* Lightweight background */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    {!reduceMotion && (
                        <>
                            <motion.div
                                animate={{
                                    x: [0, 35, 0],
                                    y: [0, -20, 0],
                                }}
                                transition={{
                                    duration: 22,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute -left-48 top-20 h-[420px] w-[420px] rounded-full bg-violet-600/[0.10] blur-[110px]"
                            />

                            <motion.div
                                animate={{
                                    x: [0, -30, 0],
                                    y: [0, 20, 0],
                                }}
                                transition={{
                                    duration: 25,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute -right-48 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.07] blur-[120px]"
                            />
                        </>
                    )}

                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                            backgroundSize: "70px 70px",
                        }}
                    />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030307_90%)]" />
                </div>

                <div className="relative mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-6xl items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                    <div className="grid w-full overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.02] shadow-[0_30px_100px_rgba(0,0,0,.5)] lg:grid-cols-[1.08fr_.92fr] lg:rounded-[30px]">
                        {/* =================================================
                            IMAGE / BRAND STORY
                           ================================================= */}

                        <section className="relative hidden min-h-[650px] overflow-hidden lg:block">
                            <motion.img
                                initial={
                                    reduceMotion
                                        ? { opacity: 1 }
                                        : { scale: 1.06, opacity: 0 }
                                }
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                }}
                                transition={{
                                    duration: reduceMotion ? 0 : 0.7,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                src={STUDY_IMAGE}
                                alt="Students collaborating during a study session"
                                onLoad={() => setImageLoaded(true)}
                                loading="eager"
                                decoding="async"
                                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ${
                                    imageLoaded ? "scale-100" : "scale-[1.02]"
                                }`}
                            />

                            <div className="absolute inset-0 bg-gradient-to-br from-[#05050a]/30 via-[#05050a]/35 to-[#05050a]/95" />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-[#05050a]/10" />

                            {/* Small animated glow */}
                            {!reduceMotion && (
                                <motion.div
                                    animate={{
                                        opacity: [0.12, 0.22, 0.12],
                                    }}
                                    transition={{
                                        duration: 7,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute -right-20 top-1/3 h-56 w-56 rounded-full bg-violet-500/25 blur-[90px]"
                                />
                            )}

                            {/* Image copy */}
                            <div className="absolute inset-x-0 bottom-0 p-7 xl:p-9">
                                <motion.div
                                    initial={
                                        reduceMotion
                                            ? { opacity: 1 }
                                            : { opacity: 0, y: 18 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: reduceMotion ? 0 : 0.55,
                                        delay: reduceMotion ? 0 : 0.15,
                                    }}
                                >
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-white/70 backdrop-blur-md">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        Study together
                                    </div>

                                    <h1 className="mt-5 max-w-lg text-3xl font-black leading-[0.98] tracking-[-0.045em] text-white xl:text-5xl">
                                        Your people are
                                        <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                                            already waiting.
                                        </span>
                                    </h1>

                                    <p className="mt-4 max-w-md text-xs leading-6 text-white/55 xl:text-sm">
                                        Jump back into your room, continue the
                                        conversation and keep building
                                        knowledge together.
                                    </p>

                                    <div className="mt-6 flex flex-wrap gap-2.5">
                                        <GlassStat
                                            icon={<FiUsers />}
                                            value="4"
                                            label="online"
                                        />

                                        <GlassStat
                                            icon={<FiBookOpen />}
                                            value="LIVE"
                                            label="collaboration"
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Floating notification */}
                            {!reduceMotion && (
                                <motion.div
                                    initial={{ opacity: 0, x: 18 }}
                                    animate={{
                                        opacity: [0, 1, 1, 1],
                                        x: [18, 0, 0, 0],
                                    }}
                                    transition={{
                                        duration: 3.5,
                                        delay: 0.4,
                                        repeat: Infinity,
                                        repeatDelay: 5,
                                    }}
                                    className="absolute right-6 top-7 rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 shadow-xl backdrop-blur-xl"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex -space-x-2">
                                            {["A", "R", "S"].map((x, i) => (
                                                <span
                                                    key={x}
                                                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#14141b] text-[7px] font-black ${
                                                        i === 0
                                                            ? "bg-violet-500"
                                                            : i === 1
                                                              ? "bg-cyan-500"
                                                              : "bg-emerald-500"
                                                    }`}
                                                >
                                                    {x}
                                                </span>
                                            ))}
                                        </div>

                                        <div>
                                            <p className="text-[8px] font-bold text-white">
                                                Your study group is live
                                            </p>

                                            <p className="mt-0.5 text-[7px] text-white/40">
                                                Join the conversation
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </section>

                        {/* =================================================
                            LOGIN PANEL
                           ================================================= */}

                        <section className="relative flex items-center bg-[#08080e]/95 px-5 py-7 sm:px-8 sm:py-9 lg:px-9 lg:py-10">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(139,92,246,.10),transparent_35%)]" />

                            <div className="relative mx-auto w-full max-w-sm">
                                {/* Mobile brand */}
                                <div className="mb-7 flex items-center gap-2.5 lg:hidden">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_22px_rgba(139,92,246,.2)]">
                                        <span className="text-xs font-black">
                                            S
                                        </span>
                                    </div>

                                    <span className="text-base font-black">
                                        Study
                                        <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                                            Sync
                                        </span>
                                    </span>
                                </div>

                                <motion.div
                                    initial={
                                        reduceMotion
                                            ? { opacity: 1 }
                                            : { opacity: 0, y: 14 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: reduceMotion ? 0 : 0.5,
                                    }}
                                >
                                    <div className="mb-6">
                                        <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/10 bg-violet-400/[0.05] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-violet-300">
                                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                                            Welcome back
                                        </span>

                                        <h2 className="mt-4 text-[28px] font-black leading-[1] tracking-[-0.045em] sm:text-3xl">
                                            Enter your
                                            <span className="block bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
                                                study universe.
                                            </span>
                                        </h2>

                                        <p className="mt-3 max-w-sm text-xs leading-5 text-zinc-500 sm:text-sm">
                                            Sign in to continue your
                                            collaborative learning journey.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
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

                                            <div>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <label
                                                        htmlFor="password"
                                                        className="text-[11px] font-semibold text-zinc-300 sm:text-xs"
                                                    >
                                                        Password
                                                    </label>

                                                    <button
                                                        type="button"
                                                        className="text-[10px] font-semibold text-violet-400 transition-colors hover:text-violet-300 sm:text-[11px]"
                                                    >
                                                        Forgot password?
                                                    </button>
                                                </div>

                                                <div className="group relative">
                                                    <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-violet-400" />

                                                    <input
                                                        id="password"
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        name="password"
                                                        value={
                                                            formData.password
                                                        }
                                                        onChange={handleChange}
                                                        placeholder="Enter your password"
                                                        autoComplete="current-password"
                                                        required
                                                        className="min-h-[48px] w-full rounded-xl border border-white/[0.08] bg-white/[0.035] py-3 pl-10 pr-11 text-xs text-white outline-none placeholder:text-zinc-700 transition-colors duration-200 focus:border-violet-400/40 focus:bg-violet-400/[0.04] focus:ring-2 focus:ring-violet-500/10 sm:rounded-2xl sm:text-sm"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                (prev) => !prev
                                                            )
                                                        }
                                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors hover:text-zinc-300"
                                                        aria-label={
                                                            showPassword
                                                                ? "Hide password"
                                                                : "Show password"
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <FiEyeOff size={16} />
                                                        ) : (
                                                            <FiEye size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <AnimatePresence initial={false}>
                                            {error && (
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
                                                    className="mt-4 overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5"
                                                >
                                                    <p className="text-[10px] leading-4 text-red-300 sm:text-xs">
                                                        {error}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileHover={
                                                loading || reduceMotion
                                                    ? {}
                                                    : { y: -1 }
                                            }
                                            whileTap={
                                                loading || reduceMotion
                                                    ? {}
                                                    : { scale: 0.99 }
                                            }
                                            transition={{ duration: 0.15 }}
                                            className="group relative mt-5 flex min-h-[48px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-white px-4 py-3 text-xs font-black text-black shadow-[0_10px_35px_rgba(255,255,255,.06)] transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:text-sm"
                                        >
                                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-100/80 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

                                            <span className="relative flex items-center gap-2.5">
                                                {loading ? (
                                                    <>
                                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                                        Signing in...
                                                    </>
                                                ) : (
                                                    <>
                                                        Enter StudySync
                                                        <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </span>
                                        </motion.button>
                                    </form>

                                    {/* Register link */}
                                    <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-zinc-600 sm:text-xs">
                                        <span>New to StudySync?</span>

                                        <Link
                                            to="/register"
                                            className="group inline-flex items-center gap-1 font-bold text-violet-400 transition-colors hover:text-violet-300"
                                        >
                                            Create account
                                            <FiArrowRight className="text-[9px] transition-transform duration-200 group-hover:translate-x-0.5" />
                                        </Link>
                                    </div>

                                    {/* Trust row */}
                                    <div className="mt-6 grid grid-cols-3 gap-1.5 border-t border-white/[0.06] pt-5">
                                        {[
                                            "Real-time",
                                            "Collaborative",
                                            "Secure",
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="flex items-center justify-center gap-1 text-[7px] font-semibold uppercase tracking-[0.08em] text-zinc-700 sm:text-[8px]"
                                            >
                                                <FiCheck className="text-emerald-500/70" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
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

const LoginNavbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 12);
                    ticking = false;
                });

                ticking = true;
            }
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
            transition={{ duration: 0.45 }}
            className={`fixed left-0 right-0 top-0 z-[100] border-b transition-[background-color,border-color,box-shadow] duration-300 ${
                scrolled
                    ? "border-white/[0.07] bg-[#030307]/90 shadow-xl shadow-black/20 backdrop-blur-xl"
                    : "border-transparent bg-[#030307]/60 backdrop-blur-md"
            }`}
        >
            <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    to="/"
                    className="group flex items-center gap-2.5"
                    aria-label="Go to StudySync landing page"
                >
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.35 }}
                        className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_22px_rgba(139,92,246,.2)]"
                    >
                        <span className="text-xs font-black text-white">
                            S
                        </span>

                        <span className="absolute inset-0 rounded-lg bg-white/20 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100" />
                    </motion.div>

                    <span className="text-lg font-black tracking-tight sm:text-xl">
                        Study
                        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            Sync
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-0.5 md:flex">
                    <NavItem to="/" icon={<FiHome />} label="Home" />

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
                        to="/"
                        className="hidden rounded-full px-3.5 py-2 text-[11px] font-semibold text-zinc-500 transition-colors hover:bg-white/5 hover:text-white sm:block"
                    >
                        Back to landing
                    </Link>

                    <Link
                        to="/register"
                        className="group relative overflow-hidden rounded-full bg-white px-3.5 py-2 text-[10px] font-black text-black shadow-[0_6px_24px_rgba(255,255,255,.06)] transition-transform hover:-translate-y-0.5 sm:px-4 sm:py-2.5 sm:text-xs"
                    >
                        <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                            Join StudySync
                            <FiArrowRight className="text-[11px] transition-transform duration-200 group-hover:translate-x-1" />
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
        className="group flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-white"
    >
        <span className="text-zinc-700 transition-colors group-hover:text-violet-400">
            {icon}
        </span>

        {label}
    </Link>
);

/* =========================================================
   INPUT
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
            className="mb-2 block text-[11px] font-semibold text-zinc-300 sm:text-xs"
        >
            {label}
        </label>

        <div className="group relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-violet-400">
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
                className="min-h-[48px] w-full rounded-xl border border-white/[0.08] bg-white/[0.035] py-3 pl-10 pr-4 text-xs text-white outline-none placeholder:text-zinc-700 transition-colors duration-200 focus:border-violet-400/40 focus:bg-violet-400/[0.04] focus:ring-2 focus:ring-violet-500/10 sm:rounded-2xl sm:text-sm"
            />
        </div>
    </div>
);

/* =========================================================
   GLASS STAT
   ========================================================= */

const GlassStat = ({ icon, value, label }) => (
    <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 backdrop-blur-md"
    >
        <span className="text-violet-300">{icon}</span>

        <div>
            <p className="text-[10px] font-black text-white">{value}</p>

            <p className="text-[7px] uppercase tracking-wider text-white/35">
                {label}
            </p>
        </div>
    </motion.div>
);

export default Login;