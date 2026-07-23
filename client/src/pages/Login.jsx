import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import AuthLayout from "../components/auth/AuthLayout";

const Login = () => {
  return (
    <AuthLayout>
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <h2 className="text-3xl font-bold text-center text-white">
          Welcome Back 👋
        </h2>

        <p className="text-slate-400 text-center mt-3 mb-8">
          Sign in to continue your study journey.
        </p>

        <div className="space-y-5">

          <div>
            <label className="text-slate-300 text-sm">
              Email
            </label>

            <input
              type="email"
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
              placeholder="********"
              className="mt-2 w-full bg-slate-800 rounded-xl px-4 py-3 border border-slate-700 focus:border-green-500 outline-none text-white"
            />
          </div>

        </div>

        <div className="text-right mt-3">
          <button className="text-green-400 text-sm hover:text-green-300">
            Forgot Password?
          </button>
        </div>

        <button className="w-full mt-6 bg-green-500 hover:bg-green-600 py-3 rounded-xl font-semibold text-white transition">
          Login
        </button>

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