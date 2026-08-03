import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

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
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

                <h2 className="text-3xl font-bold text-center text-white">
                    Welcome Back 👋
                </h2>

                <p className="text-slate-400 text-center mt-3 mb-8">
                    Sign in to continue your study journey.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="space-y-5">

                        <div>
                            <label className="text-slate-300 text-sm">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@gmail.com"
                                className="mt-2 w-full bg-slate-800 rounded-xl px-4 py-3 border border-slate-700 focus:border-green-500 outline-none text-white"
                            />
                        </div>

                        <div>
                            <label className="text-slate-300 text-sm">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="********"
                                className="mt-2 w-full bg-slate-800 rounded-xl px-4 py-3 border border-slate-700 focus:border-green-500 outline-none text-white"
                            />
                        </div>

                    </div>

                    {error && (
                        <p className="mt-4 text-red-400 text-sm">
                            {error}
                        </p>
                    )}

                    <div className="text-right mt-3">
                        <button
                            type="button"
                            className="text-green-400 text-sm hover:text-green-300"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-green-500 hover:bg-green-600 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <div className="flex items-center gap-4 my-7">
                    <div className="flex-1 h-px bg-slate-700"></div>
                    <span className="text-slate-500 text-sm">OR</span>
                    <div className="flex-1 h-px bg-slate-700"></div>
                </div>

                <button className="w-full border border-slate-700 hover:border-green-500 rounded-xl py-3 text-white flex justify-center items-center gap-3 transition">
                    <FcGoogle size={24} />
                    Continue with Google
                </button>

                <p className="text-center text-slate-400 mt-8">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-green-400 hover:text-green-300"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </AuthLayout>
    );
};

export default Login;