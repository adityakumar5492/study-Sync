import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Logo */}

          <div>
            <h2 className="text-3xl font-bold text-white">
              Study<span className="text-green-500">Sync</span>
            </h2>

            <p className="mt-4 text-slate-400 leading-7">
              StudySync helps students collaborate in real time using
              shared PDFs, live chat, and interactive study rooms.
            </p>
          </div>

          {/* Product */}

          <div>
            <h3 className="text-white font-semibold mb-4">
              Product
            </h3>

            <ul className="space-y-3">
              <li>
                <a href="#features" className="hover:text-green-400">
                  Features
                </a>
              </li>

              <li>
                <a href="#how-it-works" className="hover:text-green-400">
                  How It Works
                </a>
              </li>

              <li>
                <a href="#stats" className="hover:text-green-400">
                  Statistics
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}

          <div>
            <h3 className="text-white font-semibold mb-4">
              Account
            </h3>

            <ul className="space-y-3">

              <li>
                <Link to="/login" className="hover:text-green-400">
                  Login
                </Link>
              </li>

              <li>
                <Link to="/register" className="hover:text-green-400">
                  Register
                </Link>
              </li>

            </ul>
          </div>

          {/* Social */}

          <div>

            <h3 className="text-white font-semibold mb-4">
              Connect
            </h3>

            <div className="flex gap-5 text-2xl">

              <a href="#">
                <FaGithub className="hover:text-green-400 transition" />
              </a>

              <a href="#">
                <FaLinkedin className="hover:text-green-400 transition" />
              </a>

              <a href="#">
                <FaTwitter className="hover:text-green-400 transition" />
              </a>

            </div>

          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
          © {new Date().getFullYear()} StudySync. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;