import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-green-500 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6">

      <h1 className="text-3xl font-bold mb-12">
        Study<span className="text-green-500">Sync</span>
      </h1>

      <nav className="space-y-3">

        <NavLink to="/dashboard" className={menuClass}>
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/rooms" className={menuClass}>
          <FaUsers />
          Study Rooms
        </NavLink>

        <NavLink to="/profile" className={menuClass}>
          <FaUserCircle />
          Profile
        </NavLink>

      </nav>

      <button className="mt-12 w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500 transition">
        <FaSignOutAlt />
        Logout
      </button>

    </aside>
  );
};

export default Sidebar;