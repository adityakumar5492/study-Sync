import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

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
            <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

                <h2 className="text-center text-3xl font-bold text-white">
                    Create Account 🚀
                </h2>

                <p className="mb-8 mt-3 text-center text-slate-400">
                    Join thousands of students learning together.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div className="grid gap-4 md:grid-cols-2">

                        <div>
                            <label className="text-sm text-slate-300">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-300">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@gmail.com"
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-300">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="********"
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-300">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="********"
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-green-500"
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="my-7 flex items-center gap-4">

                    <div className="h-px flex-1 bg-slate-700"></div>

                    <span className="text-sm text-slate-500">
                        OR
                    </span>

                    <div className="h-px flex-1 bg-slate-700"></div>

                </div>

                <button
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 py-3 text-white transition hover:border-green-500"
                >
                    <FcGoogle size={24} />
                    Continue with Google
                </button>

                <p className="mt-8 text-center text-slate-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-green-400 hover:text-green-300"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </AuthLayout>
    );
};

export default Register;