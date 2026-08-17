import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-white"
            >
              Study
              <span className="text-indigo-400">Sync</span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              A real-time collaborative learning platform where students can
              study together, share PDFs, annotate documents, and communicate
              inside interactive study rooms.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
    href="https://github.com/adityakumar5492"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="GitHub"
    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:text-white"
>
    <FaGithub />
</a>

            <a
        href="https://www.linkedin.com/in/aditya-kumar-9a21002ba"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:text-white"
        >
        <FaLinkedin />
      </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:text-white"
              >
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href="#features"
                  className="transition hover:text-indigo-400"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="transition hover:text-indigo-400"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a
                  href="#stats"
                  className="transition hover:text-indigo-400"
                >
                  Collaboration
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-white">
              Account
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  to="/login"
                  className="transition hover:text-indigo-400"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="transition hover:text-indigo-400"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-4 border-t border-slate-800 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">
            © {new Date().getFullYear()} StudySync. All rights reserved.
          </p>

          <p className="text-slate-600">
            Built for collaborative learning.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;