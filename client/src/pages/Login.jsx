import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
    FiMail,
    FiLock,
    FiArrowRight,
    FiEye,
    FiEyeOff,
    FiHome,
    FiUsers,
  
    FiCheck,
    FiArrowUpRight,
    FiBookOpen,
} from "react-icons/fi";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import AuthLayout from "../components/auth/AuthLayout";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginThunk } from "../redux/auth/authThunk";
import { clearError } from "../redux/auth/authSlice";

/*
 * STUDYSYNC — PREMIUM LOGIN
 *
 * Keeps the existing authentication flow intact.
 * The visual layer is intentionally self-contained so it does not
 * change your Redux/auth architecture.
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
        <div className="min-h-screen overflow-hidden bg-[#030307] text-white">
            <LoginNavbar />

            <main className="relative min-h-screen pt-[76px]">
                {/* Cinematic background */}
                <div className="pointer-events-none fixed inset-0">
                    <motion.div
                        animate={
                            reduceMotion
                                ? {}
                                : {
                                      x: [0, 60, -40, 0],
                                      y: [0, -30, 45, 0],
                                      scale: [1, 1.08, 0.96, 1],
                                  }
                        }
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[130px]"
                    />

                    <motion.div
                        animate={
                            reduceMotion
                                ? {}
                                : {
                                      x: [0, -50, 30, 0],
                                      y: [0, 40, -25, 0],
                                      scale: [1, 0.94, 1.08, 1],
                                  }
                        }
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]"
                    />

                    <div
                        className="absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                            backgroundSize: "70px 70px",
                        }}
                    />
                </div>

                <div className="relative mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center px-5 py-10 sm:px-8 lg:py-14">
                    <div className="grid w-full overflow-hidden rounded-[34px] border border-white/[0.08] bg-white/[0.025] shadow-[0_40px_140px_rgba(0,0,0,.55)] backdrop-blur-2xl lg:grid-cols-[1.1fr_.9fr]">
                        {/* IMAGE / BRAND STORY */}
                        <section className="relative hidden min-h-[720px] overflow-hidden lg:block">
                            <motion.img
                                initial={{ scale: 1.12, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                src={STUDY_IMAGE}
                                alt="Students collaborating during a study session"
                                onLoad={() => setImageLoaded(true)}
                                className={`absolute inset-0 h-full w-full object-cover transition duration-1000 ${
                                    imageLoaded ? "scale-100" : "scale-105"
                                }`}
                            />

                            <div className="absolute inset-0 bg-gradient-to-br from-[#05050a]/35 via-[#05050a]/35 to-[#05050a]/95" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-[#05050a]/20" />

                            {/* animated image glow */}
                            <motion.div
                                animate={
                                    reduceMotion
                                        ? {}
                                        : {
                                              opacity: [0.15, 0.3, 0.15],
                                              scale: [1, 1.1, 1],
                                          }
                                }
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-violet-500/30 blur-[100px]"
                            />

                            {/* image copy */}
                            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 xl:p-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25, duration: 0.8 }}
                                >
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.2em] text-white/75 backdrop-blur-xl">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                                        Study together
                                    </div>

                                    <h1 className="mt-6 max-w-xl text-4xl font-black leading-[.98] tracking-[-.055em] text-white xl:text-6xl">
                                        Your people are
                                        <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                                            already waiting.
                                        </span>
                                    </h1>

                                    <p className="mt-5 max-w-lg text-sm leading-7 text-white/60">
                                        Jump back into your room, continue the
                                        conversation and keep building knowledge
                                        together.
                                    </p>

                                    <div className="mt-7 flex flex-wrap gap-3">
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

                            {/* floating notification */}
                            <motion.div
                                initial={{ opacity: 0, x: 30, y: 10 }}
                                animate={
                                    reduceMotion
                                        ? { opacity: 1, x: 0, y: 0 }
                                        : {
                                              opacity: [0, 1, 1, 1],
                                              x: [30, 0, 0, 0],
                                              y: [10, 0, -7, 0],
                                          }
                                }
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                }}
                                className="absolute right-7 top-8 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 shadow-2xl backdrop-blur-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {["A", "R", "S"].map((x, i) => (
                                            <span
                                                key={x}
                                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#14141b] text-[8px] font-black ${
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
                                        <p className="text-[9px] font-bold text-white">
                                            Your study group is live
                                        </p>
                                        <p className="mt-1 text-[8px] text-white/40">
                                            Join the conversation
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </section>

                        {/* LOGIN PANEL */}
                        <section className="relative flex items-center bg-[#08080e]/90 p-6 sm:p-10 lg:p-12">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(139,92,246,.12),transparent_35%)]" />

                            <div className="relative mx-auto w-full max-w-md">
                                {/* mobile brand */}
                                <div className="mb-8 flex items-center gap-3 lg:hidden">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_30px_rgba(139,92,246,.25)]">
                                        <span className="text-sm font-black">S</span>
                                    </div>
                                    <span className="text-lg font-black">
                                        Study
                                        <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                                            Sync
                                        </span>
                                    </span>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7 }}
                                >
                                    <div className="mb-8">
                                        <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/10 bg-violet-400/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.18em] text-violet-300">
                                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                                            Welcome back
                                        </span>

                                        <h2 className="mt-5 text-3xl font-black tracking-[-.045em] sm:text-4xl">
                                            Enter your
                                            <span className="block bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
                                                study universe.
                                            </span>
                                        </h2>

                                        <p className="mt-4 text-sm leading-6 text-zinc-500">
                                            Sign in to continue your collaborative
                                            learning journey.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-5">
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
                                                        className="text-xs font-semibold text-zinc-300"
                                                    >
                                                        Password
                                                    </label>

                                                    <button
                                                        type="button"
                                                        className="text-[11px] font-semibold text-violet-400 transition hover:text-violet-300"
                                                    >
                                                        Forgot password?
                                                    </button>
                                                </div>

                                                <div className="group relative">
                                                    <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-violet-400" />

                                                    <input
                                                        id="password"
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Enter your password"
                                                        autoComplete="current-password"
                                                        required
                                                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] py-4 pl-11 pr-12 text-sm text-white outline-none placeholder:text-zinc-700 transition duration-300 focus:border-violet-400/40 focus:bg-violet-400/[0.04] focus:ring-4 focus:ring-violet-500/10"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                (prev) => !prev
                                                            )
                                                        }
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-zinc-300"
                                                        aria-label={
                                                            showPassword
                                                                ? "Hide password"
                                                                : "Show password"
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <FiEyeOff size={17} />
                                                        ) : (
                                                            <FiEye size={17} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                        y: -5,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: "auto",
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                        y: -5,
                                                    }}
                                                    className="mt-5 overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3"
                                                >
                                                    <p className="text-xs leading-5 text-red-300">
                                                        {error}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileHover={
                                                loading
                                                    ? {}
                                                    : {
                                                          y: -2,
                                                          scale: 1.01,
                                                      }
                                            }
                                            whileTap={
                                                loading ? {} : { scale: 0.985 }
                                            }
                                            className="group relative mt-6 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white py-4 text-sm font-black text-black shadow-[0_15px_50px_rgba(255,255,255,.08)] transition disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-100/80 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                                            <span className="relative flex items-center gap-3">
                                                {loading ? (
                                                    <>
                                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                                        Signing in...
                                                    </>
                                                ) : (
                                                    <>
                                                        Enter StudySync
                                                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </span>
                                        </motion.button>
                                    </form>

                                    <div className="my-7 flex items-center gap-4">
                                        <div className="h-px flex-1 bg-white/[0.07]" />
                                        <span className="text-[9px] font-bold tracking-[.2em] text-zinc-700">
                                            OR
                                        </span>
                                        <div className="h-px flex-1 bg-white/[0.07]" />
                                    </div>

                                    <motion.button
                                        type="button"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.985 }}
                                        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] py-4 text-sm font-semibold text-zinc-300 transition hover:border-white/[0.14] hover:bg-white/[0.05]"
                                    >
                                        <FcGoogle size={19} />
                                        Continue with Google
                                    </motion.button>

                                    <div className="mt-7 flex items-center justify-center gap-2 text-xs text-zinc-600">
                                        <span>New to StudySync?</span>
                                        <Link
                                            to="/register"
                                            className="group inline-flex items-center gap-1 font-bold text-violet-400 transition hover:text-violet-300"
                                        >
                                            Create account
                                            <FiArrowUpRight className="text-[11px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </Link>
                                    </div>

                                    <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-6">
                                        {[
                                            "Real-time",
                                            "Collaborative",
                                            "Secure",
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="flex items-center justify-center gap-1.5 text-[8px] font-semibold uppercase tracking-wider text-zinc-700"
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
   PREMIUM NAVBAR
   ========================================================= */

const LoginNavbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed left-0 right-0 top-0 z-[100] border-b transition-all duration-500 ${
                scrolled
                    ? "border-white/[0.08] bg-[#030307]/85 shadow-2xl shadow-black/20 backdrop-blur-2xl"
                    : "border-transparent bg-[#030307]/50 backdrop-blur-xl"
            }`}
        >
            <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
                <Link
                    to="/"
                    className="group flex items-center gap-3"
                    aria-label="Go to StudySync landing page"
                >
                    <motion.div
                        whileHover={{ rotate: 180, scale: 1.06 }}
                        transition={{ duration: 0.5 }}
                        className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_30px_rgba(139,92,246,.25)]"
                    >
                        <span className="text-sm font-black text-white">S</span>
                        <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 blur-md transition group-hover:opacity-100" />
                    </motion.div>

                    <span className="text-xl font-black tracking-tight">
                        Study
                        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            Sync
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    <NavItem to="/" icon={<FiHome />} label="Home" />
                    <NavItem to="/#experience" icon={<FiUsers />} label="Experience" />
                    <NavItem to="/#features" icon={<FiBookOpen />} label="Features" />
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        to="/"
                        className="hidden rounded-full px-4 py-2.5 text-xs font-semibold text-zinc-500 transition hover:bg-white/5 hover:text-white sm:block"
                    >
                        Back to landing
                    </Link>

                    <Link
                        to="/register"
                        className="group relative overflow-hidden rounded-full bg-white px-4 py-2.5 text-xs font-black text-black shadow-[0_8px_30px_rgba(255,255,255,.07)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,255,255,.13)] sm:px-5"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Join StudySync
                            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                        </span>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-100 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </Link>
                </div>
            </div>
        </motion.header>
    );
};

const NavItem = ({ to, icon, label }) => (
    <Link
        to={to}
        className="group flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
    >
        <span className="text-zinc-700 transition group-hover:text-violet-400">
            {icon}
        </span>
        {label}
    </Link>
);

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
            className="mb-2 block text-xs font-semibold text-zinc-300"
        >
            {label}
        </label>

        <div className="group relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-violet-400">
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
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] py-4 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 transition duration-300 focus:border-violet-400/40 focus:bg-violet-400/[0.04] focus:ring-4 focus:ring-violet-500/10"
            />
        </div>
    </div>
);

const GlassStat = ({ icon, value, label }) => (
    <motion.div
        whileHover={{ y: -3 }}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl"
    >
        <span className="text-violet-300">{icon}</span>
        <div>
            <p className="text-xs font-black text-white">{value}</p>
            <p className="text-[8px] uppercase tracking-wider text-white/35">
                {label}
            </p>
        </div>
    </motion.div>
);

export default Login;