import { useState, useRef, useEffect } from "react";
import {
    FaBell,
    FaChevronDown,
    FaUserCircle,
    FaSignOutAlt,
    FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
    useAppDispatch,
    useAppSelector,
} from "../../redux/hooks";

import { logout } from "../../redux/auth/authSlice";

const API_URL = "http://localhost:5000";

const Topbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { user } = useAppSelector(
        (state) => state.auth
    );

    const [profileOpen, setProfileOpen] =
        useState(false);

    const profileRef = useRef(null);

    const today = new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    );

    // ===========================
    // Close Dropdown
    // ===========================

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(
                    event.target
                )
            ) {
                setProfileOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // ===========================
    // Logout
    // ===========================

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const avatarUrl = user?.avatar
        ? `${API_URL}${user.avatar}`
        : null;

    return (
        <header className="mb-6 flex min-w-0 items-start justify-between gap-3 sm:mb-8 sm:items-center sm:gap-4">

            {/* ===========================
                Left
            =========================== */}

            <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">

                {/* Mobile Menu */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 shadow-lg shadow-black/5 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white active:scale-95 lg:hidden"
                    aria-label="Open navigation menu"
                >
                    <FaBars />
                </button>

                {/* Welcome */}
                <div className="min-w-0">
                    <h2 className="text-lg font-bold leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl">
                        Welcome back,{" "}
                        <span className="text-indigo-400">
                            {user?.name || "Student"}
                        </span>{" "}
                        <span className="whitespace-nowrap">
                            👋
                        </span>
                    </h2>

                    <p className="mt-1 truncate text-xs text-slate-500 sm:mt-2 sm:text-sm">
                        {today}
                    </p>
                </div>

            </div>

            {/* ===========================
                Right Actions
            =========================== */}

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">

                {/* Notifications */}
                <button
                    type="button"
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 shadow-lg shadow-black/5 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white active:scale-95 sm:h-11 sm:w-11"
                    aria-label="Notifications"
                >
                    <FaBell className="text-sm" />

                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-slate-950 bg-red-500 px-1 text-[10px] font-bold text-white">
                        3
                    </span>
                </button>

                {/* Profile Dropdown */}
                <div
                    ref={profileRef}
                    className="relative"
                >
                    <button
                        type="button"
                        onClick={() =>
                            setProfileOpen(
                                (prev) => !prev
                            )
                        }
                        className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-1.5 shadow-lg shadow-black/5 transition hover:border-slate-700 hover:bg-slate-800 active:scale-[0.98] sm:h-11 sm:gap-2.5 sm:px-2.5"
                    >

                        {/* Avatar */}
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={
                                    user?.name ||
                                    "User"
                                }
                                className="h-8 w-8 shrink-0 rounded-lg object-cover sm:h-8 sm:w-8"
                            />
                        ) : (
                            <FaUserCircle className="shrink-0 text-2xl text-slate-500" />
                        )}

                        {/* User */}
                        <div className="hidden min-w-0 text-left sm:block">
                            <p className="max-w-32 truncate text-sm font-semibold text-white">
                                {user?.name ||
                                    "Student"}
                            </p>

                            <p className="max-w-32 truncate text-xs text-slate-500">
                                {user?.email || ""}
                            </p>
                        </div>

                        <FaChevronDown
                            className={`shrink-0 text-[10px] text-slate-500 transition-transform ${
                                profileOpen
                                    ? "rotate-180"
                                    : ""
                            }`}
                        />

                    </button>

                    {/* ===========================
                        Dropdown
                    =========================== */}

                    {profileOpen && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-1.5rem)] max-w-60 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl shadow-black/50">

                            {/* User */}
                            <div className="flex items-center gap-3 border-b border-slate-800 px-3 py-3">

                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={
                                            user?.name ||
                                            "User"
                                        }
                                        className="h-10 w-10 shrink-0 rounded-xl object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="shrink-0 text-3xl text-slate-500" />
                                )}

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-white">
                                        {user?.name ||
                                            "Student"}
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                        {user?.email ||
                                            ""}
                                    </p>
                                </div>

                            </div>

                            {/* Profile */}
                            <button
                                type="button"
                                onClick={() => {
                                    setProfileOpen(
                                        false
                                    );
                                    navigate(
                                        "/profile"
                                    );
                                }}
                                className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                            >
                                <FaUserCircle className="shrink-0 text-slate-500" />
                                Profile
                            </button>

                            {/* Logout */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                            >
                                <FaSignOutAlt className="shrink-0" />
                                Logout
                            </button>

                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Topbar;