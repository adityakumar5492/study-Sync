import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
    FiMail,
    FiLock,
    FiArrowRight,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";

import AuthLayout from "../components/auth/AuthLayout";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginThunk } from "../redux/auth/authThunk";
import { clearError } from "../redux/auth/authSlice";

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

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
        <AuthLayout>
            <div className="relative w-full max-w-md">

                {/* Background Glow */}
                <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">

                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Welcome back
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Sign in to continue your collaborative
                            learning journey.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8">

                        <div className="space-y-5">

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
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-slate-300"
                                    >
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

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
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
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
                            </div>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                                <p className="text-sm text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
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

                    {/* Register */}
                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-indigo-400 transition hover:text-indigo-300"
                        >
                            Create account
                        </Link>
                    </p>

                </div>
            </div>
        </AuthLayout>
    );
};

export default Login;