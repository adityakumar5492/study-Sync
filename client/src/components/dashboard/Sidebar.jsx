import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaUsers,
    FaUserCircle,
    FaTimes,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
    const menuClass = ({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 ${
            isActive
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
        }`;

    return (
        <>
            {/* ===========================
                Mobile / Tablet Overlay
            =========================== */}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* ===========================
                Sidebar
            =========================== */}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-64 shrink-0 flex-col
                    border-r border-slate-800
                    bg-slate-900
                    shadow-2xl shadow-black/20
                    transition-transform duration-300 ease-out

                    lg:static
                    lg:z-auto
                    lg:min-h-screen
                    lg:translate-x-0
                    lg:shadow-none

                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* ===========================
                    Logo
                =========================== */}

                <div className="flex h-[73px] shrink-0 items-center justify-between border-b border-slate-800 px-5 sm:px-6">

                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Study
                        <span className="text-indigo-400">
                            Sync
                        </span>
                    </h1>

                    {/* Mobile / Tablet Close */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-95 lg:hidden"
                        aria-label="Close navigation menu"
                    >
                        <FaTimes className="text-sm" />
                    </button>

                </div>

                {/* ===========================
                    Navigation
                =========================== */}

                <nav className="flex-1 space-y-2 overflow-y-auto p-4">

                    <NavLink
                        to="/dashboard"
                        onClick={onClose}
                        className={menuClass}
                    >
                        <FaHome className="shrink-0 text-sm" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/rooms"
                        onClick={onClose}
                        className={menuClass}
                    >
                        <FaUsers className="shrink-0 text-sm" />
                        <span>Study Rooms</span>
                    </NavLink>

                    <NavLink
                        to="/profile"
                        onClick={onClose}
                        className={menuClass}
                    >
                        <FaUserCircle className="shrink-0 text-sm" />
                        <span>Profile</span>
                    </NavLink>

                </nav>

            </aside>
        </>
    );
};

export default Sidebar;