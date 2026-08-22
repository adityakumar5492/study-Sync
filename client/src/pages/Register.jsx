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

import AuthLayout from "../components/auth/AuthLayout";

import { useAppDispatch } from "../redux/hooks";
import { registerThunk } from "../redux/auth/authThunk";

/*
 * STUDYSYNC — PREMIUM REGISTER
 *
 * The authentication logic remains the same:
 * - local form state
 * - client-side validation
 * - registerThunk(...)
 * - success toast
 * - redirect to /dashboard
 *
 * Only the presentation layer is upgraded.
 */

const STUDY_IMAGE =
    "https://images.pexels.com/photos/5306450/pexels-photo-5306450.jpeg?auto=compress&cs=tinysrgb&w=1800";

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
        <div className="min-h-screen overflow-hidden bg-[#030307] text-white">
            <RegisterNavbar />

            <main className="relative min-h-screen pt-[76px]">
                {/* =====================================================
                    CINEMATIC BACKGROUND
                   ===================================================== */}
                <div className="pointer-events-none fixed inset-0">
                    <motion.div
                        animate={
                            reduceMotion
                                ? {}
                                : {
                                      x: [0, 70, -35, 0],
                                      y: [0, -35, 45, 0],
                                      scale: [1, 1.1, 0.96, 1],
                                  }
                        }
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -left-44 top-10 h-[520px] w-[520px] rounded-full bg-violet-600/15 blur-[140px]"
                    />

                    <motion.div
                        animate={
                            reduceMotion
                                ? {}
                                : {
                                      x: [0, -55, 30, 0],
                                      y: [0, 45, -25, 0],
                                      scale: [1, 0.94, 1.08, 1],
                                  }
                        }
                        transition={{
                            duration: 21,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -right-44 bottom-0 h-[540px] w-[540px] rounded-full bg-cyan-500/10 blur-[150px]"
                    />

                    <div
                        className="absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                            backgroundSize: "70px 70px",
                        }}
                    />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030307_85%)]" />
                </div>

                <div className="relative mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center px-5 py-10 sm:px-8 lg:py-14">
                    <div className="grid w-full overflow-hidden rounded-[36px] border border-white/[0.08] bg-white/[0.025] shadow-[0_45px_150px_rgba(0,0,0,.6)] backdrop-blur-2xl lg:grid-cols-[.9fr_1.1fr]">
                        {/* =================================================
                            LEFT — REGISTER FORM
                           ================================================= */}
                        <section className="relative order-2 flex items-center bg-[#08080e]/90 p-6 sm:p-10 lg:order-1 lg:p-12">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,.13),transparent_38%)]" />

                            <div className="relative mx-auto w-full max-w-md">
                                {/* Mobile brand */}
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
                                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.18em] text-cyan-300">
                                            <FiBookOpen />
                                            Create your workspace
                                        </span>

                                        <h1 className="mt-5 text-3xl font-black leading-[1] tracking-[-.05em] sm:text-4xl">
                                            Start building
                                            <span className="block bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
                                                together.
                                            </span>
                                        </h1>

                                        <p className="mt-4 text-sm leading-6 text-zinc-500">
                                            Create your StudySync account and turn
                                            your next study session into a live,
                                            collaborative workspace.
                                        </p>
                                    </div>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
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

                                        {/* Password quality */}
                                        <PasswordStrength
                                            password={formData.password}
                                        />

                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileHover={
                                                loading
                                                    ? {}
                                                    : { y: -2, scale: 1.01 }
                                            }
                                            whileTap={
                                                loading
                                                    ? {}
                                                    : { scale: 0.985 }
                                            }
                                            className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white py-4 text-sm font-black text-black shadow-[0_15px_50px_rgba(255,255,255,.08)] transition disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-100/90 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                                            <span className="relative flex items-center gap-3">
                                                {loading ? (
                                                    <>
                                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                                        Creating your space...
                                                    </>
                                                ) : (
                                                    <>
                                                        Create my StudySync
                                                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </span>
                                        </motion.button>
                                    </form>

                                    <div className="my-6 flex items-center gap-4">
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
                                        <span>Already have an account?</span>
                                        <Link
                                            to="/login"
                                            className="group inline-flex items-center gap-1 font-bold text-violet-400 transition hover:text-violet-300"
                                        >
                                            Sign in
                                            <FiArrowUpRight className="text-[11px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </Link>
                                    </div>

                                    {/* Trust row */}
                                    <div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-6">
                                        {[
                                            [<FiShield />, "Secure"],
                                            [<FiZap />, "Realtime"],
                                            [<FiUsers />, "Together"],
                                        ].map(([icon, label]) => (
                                            <div
                                                key={label}
                                                className="flex items-center justify-center gap-1.5 text-[8px] font-semibold uppercase tracking-wider text-zinc-700"
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
                        <section className="relative order-1 min-h-[460px] overflow-hidden lg:order-2 lg:min-h-[760px]">
                            <motion.img
                                initial={{ scale: 1.12, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    duration: 1.2,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                src={STUDY_IMAGE}
                                alt="Students collaborating on a study project"
                                onLoad={() => setImageLoaded(true)}
                                className={`absolute inset-0 h-full w-full object-cover transition duration-1000 ${
                                    imageLoaded ? "scale-100" : "scale-105"
                                }`}
                            />

                            <div className="absolute inset-0 bg-gradient-to-br from-[#05050a]/20 via-[#05050a]/35 to-[#05050a]/95" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-[#05050a]/15" />

                            {/* animated glow */}
                            <motion.div
                                animate={
                                    reduceMotion
                                        ? {}
                                        : {
                                              opacity: [0.12, 0.28, 0.12],
                                              scale: [1, 1.12, 1],
                                          }
                                }
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-violet-500/30 blur-[110px]"
                            />

                            {/* top live badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.7 }}
                                className="absolute left-7 top-7 rounded-full border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />
                                        <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                                    </span>
                                    <span className="text-[9px] font-bold uppercase tracking-[.2em] text-white/75">
                                        Your next session starts here
                                    </span>
                                </div>
                            </motion.div>

                            {/* floating activity card */}
                            <motion.div
                                initial={{ opacity: 0, x: 35 }}
                                animate={
                                    reduceMotion
                                        ? { opacity: 1, x: 0 }
                                        : {
                                              opacity: [0, 1, 1, 1],
                                              x: [35, 0, 0, 0],
                                              y: [5, 0, -8, 0],
                                          }
                                }
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                }}
                                className="absolute right-7 top-24 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 shadow-2xl backdrop-blur-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                                        <FiUsers />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-white">
                                            4 students connected
                                        </p>
                                        <p className="mt-1 text-[8px] text-white/40">
                                            studying together right now
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* animated avatars */}
                            <div className="absolute right-8 top-1/2 flex -translate-y-1/2 flex-col gap-3">
                                {[
                                    ["A", "from-violet-500 to-fuchsia-500"],
                                    ["R", "from-cyan-400 to-blue-500"],
                                    ["S", "from-emerald-400 to-cyan-500"],
                                ].map(([letter, gradient], index) => (
                                    <motion.div
                                        key={letter}
                                        initial={{ opacity: 0, x: 25 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.8 + index * 0.12,
                                            type: "spring",
                                        }}
                                        whileHover={{ x: -5, scale: 1.08 }}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br ${gradient} text-[9px] font-black shadow-xl`}
                                    >
                                        {letter}
                                    </motion.div>
                                ))}
                            </div>

                            {/* bottom story */}
                            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                >
                                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.22em] text-violet-300">
                                        <span className="h-px w-8 bg-violet-300/60" />
                                        THE STUDYSYNC IDEA
                                    </div>

                                    <h2 className="mt-5 max-w-xl text-3xl font-black leading-[.98] tracking-[-.05em] text-white sm:text-5xl">
                                        Don't just create
                                        <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                                            an account.
                                        </span>
                                        Create a room.
                                    </h2>

                                    <p className="mt-5 max-w-lg text-sm leading-7 text-white/55">
                                        Bring your people, your PDFs, your
                                        questions and your ideas into one
                                        shared space.
                                    </p>

                                    <div className="mt-7 flex flex-wrap gap-3">
                                        <VisualPill icon={<FiCheck />} text="Shared PDFs" />
                                        <VisualPill icon={<FiUsers />} text="Live people" />
                                        <VisualPill icon={<FiZap />} text="Realtime" />
                                    </div>
                                </motion.div>
                            </div>

                            {/* animated scan line */}
                            <motion.div
                                animate={{ y: ["-20%", "120%"] }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="pointer-events-none absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-transparent via-violet-400/[0.06] to-transparent"
                            />
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

                <div className="flex items-center gap-2">
                    <Link
                        to="/login"
                        className="hidden rounded-full px-4 py-2.5 text-xs font-semibold text-zinc-500 transition hover:bg-white/5 hover:text-white sm:block"
                    >
                        Sign in
                    </Link>

                    <Link
                        to="/"
                        className="group relative overflow-hidden rounded-full bg-white px-4 py-2.5 text-xs font-black text-black shadow-[0_8px_30px_rgba(255,255,255,.07)] transition hover:-translate-y-0.5 sm:px-5"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Back to landing
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
            className="mb-2 block text-xs font-semibold text-zinc-300"
        >
            {label}
        </label>

        <div className="group relative">
            <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-violet-400" />

            <input
                id={id}
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] py-4 pl-11 pr-12 text-sm text-white outline-none placeholder:text-zinc-700 transition duration-300 focus:border-violet-400/40 focus:bg-violet-400/[0.04] focus:ring-4 focus:ring-violet-500/10"
            />

            <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-zinc-300"
                aria-label={show ? `Hide ${label}` : `Show ${label}`}
            >
                {show ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </button>
        </div>
    </div>
);

const PasswordStrength = ({ password }) => {
    const score =
        !password
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
                    initial={{ opacity: 0, height: 0, y: -5 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -5 }}
                    className="overflow-hidden"
                >
                    <div className="flex items-center gap-3 px-1 pt-1">
                        <div className="flex flex-1 gap-1">
                            {[1, 2, 3, 4].map((bar) => (
                                <motion.span
                                    key={bar}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
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

                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                            {labels[score]}
                        </span>
                    </div>

                    <p className="mt-2 px-1 text-[9px] text-zinc-700">
                        Use 6+ characters. Add uppercase letters, numbers or
                        symbols for a stronger password.
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const VisualPill = ({ icon, text }) => (
    <motion.div
        whileHover={{ y: -3 }}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[9px] font-semibold text-white/65 backdrop-blur-xl"
    >
        <span className="text-cyan-300">{icon}</span>
        {text}
    </motion.div>
);

export default Register;