import { useState } from "react";
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
} from "react-icons/fi";

import AuthLayout from "../components/auth/AuthLayout";

import { useAppDispatch } from "../redux/hooks";
import { registerThunk } from "../redux/auth/authThunk";

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
            name,
            email,
            password,
            confirmPassword,
        } = formData;

        if (!name || !email || !password || !confirmPassword) {
            return toast.error("All fields are required.");
        }

        if (password.length < 6) {
            return toast.error(
                "Password must be at least 6 characters."
            );
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
            toast.error(
                err?.message ||
                    "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="relative w-full max-w-lg">

                {/* Background Glow */}
                <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">

                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Create your account
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Join StudySync and start learning
                            collaboratively.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Full name
                            </label>

                            <div className="relative">
                                <FiUser
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Email address
                            </label>

                            <div className="relative">
                                <FiMail
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <FiLock
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />

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
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-12 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (prev) => !prev
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <FiEyeOff size={18} />
                                    ) : (
                                        <FiEye size={18} />
                                    )}
                                </button>
                            </div>

                            <p className="mt-2 text-xs text-slate-600">
                                Minimum 6 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Confirm password
                            </label>

                            <div className="relative">
                                <FiLock
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-12 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (prev) => !prev
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff size={18} />
                                    ) : (
                                        <FiEye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-7 flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-800" />

                        <span className="text-xs font-medium text-slate-600">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-slate-800" />
                    </div>

                    {/* Google */}
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950 py-3.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                    >
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>

                    {/* Login */}
                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-indigo-400 transition hover:text-indigo-300"
                        >
                            Sign in
                        </Link>
                    </p>

                </div>
            </div>
        </AuthLayout>
    );
};

export default Register;