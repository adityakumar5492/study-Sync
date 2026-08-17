import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Rooms from "../pages/Rooms";
import Room from "../pages/Room";
import Profile from "../pages/Profile";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

const AppRoutes = () => {
    return (
        <Routes>

            {/* ===========================
                Public Routes
            =========================== */}

            <Route
                path="/"
                element={<Landing />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* ===========================
                Dashboard Layout Routes
                Sidebar appears here
            =========================== */}

            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/rooms"
                    element={<Rooms />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />
            </Route>

            {/* ===========================
                Collaborative Room
                No Sidebar
            =========================== */}

            <Route
                path="/room/:id"
                element={
                    <ProtectedRoute>
                        <Room />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
};

export default AppRoutes;