import { Link, NavLink } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-white tracking-wide"
        >
          Study<span className="text-green-500">Sync</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">

          <a
           href="#features"
            className="relative group text-slate-300 hover:text-green-400 transition"
          >
            Features
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a
            href="#how-it-works"
            className="relative group text-slate-300 hover:text-green-400 transition"
          >
            How It Works
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a
            href="#stats"
            className="relative group text-slate-300 hover:text-green-400 transition"
          >
            Stats
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
          </a>

        </nav>

        {/* Buttons */}

        <div className="hidden md:flex items-center gap-4">

          <NavLink
            to="/login"
            className="text-slate-300 hover:text-white transition"
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition"
          >
            Get Started
          </NavLink>

        </div>

        {/* Mobile Menu */}

        <button className="md:hidden text-white text-3xl">

          <HiOutlineMenuAlt3 />

        </button>

      </div>
    </header>
  );
};

export default Navbar;