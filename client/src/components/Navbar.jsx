import { Link, NavLink } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Collaboration", href: "#stats" },
  ];

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-white"
        >
          Study
          <span className="text-indigo-400">Sync</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          <NavLink
            to="/login"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 hover:shadow-indigo-500/30"
          >
            Get Started
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-2xl text-slate-300 transition hover:bg-slate-800 hover:text-white md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <HiOutlineMenuAlt3 />
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4">

            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="rounded-lg px-3 py-2 text-slate-300 transition hover:bg-slate-900 hover:text-white"
              >
                {item.label}
              </a>
            ))}

            {/* Mobile Actions */}
            <div className="mt-2 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-4">

                <NavLink
                  to="/login"
                  onClick={handleNavClick}
                  className="text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={handleNavClick}
                  className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Get Started
                </NavLink>

              </div>
            </div>

          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;