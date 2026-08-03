import { NavLink, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaUsers,
    FaUserCircle,
    FaSignOutAlt,
} from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/auth/authSlice";

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { user } = useAppSelector((state) => state.auth);

    const menuClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
            isActive
                ? "bg-green-500 text-white"
                : "text-slate-300 hover:bg-slate-800"
        }`;

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">

            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-3xl font-bold">
                    Study<span className="text-green-500">Sync</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-3">

                <NavLink
                    to="/dashboard"
                    className={menuClass}
                >
                    <FaHome />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/rooms"
                    className={menuClass}
                >
                    <FaUsers />
                    Study Rooms
                </NavLink>

                <NavLink
                    to="/profile"
                    className={menuClass}
                >
                    <FaUserCircle />
                    Profile
                </NavLink>

            </nav>

            {/* User Section */}
            <div className="border-t border-slate-800 p-5">

                <div className="flex items-center gap-3 mb-5">

                    <FaUserCircle className="text-4xl text-slate-400" />

                    <div>
                        <p className="font-semibold text-white">
                            {user?.name || "User"}
                        </p>

                        <p className="text-xs text-slate-400">
                            {user?.email}
                        </p>
                    </div>

                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition py-3 rounded-xl font-medium"
                >
                    <FaSignOutAlt />
                    Logout
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;