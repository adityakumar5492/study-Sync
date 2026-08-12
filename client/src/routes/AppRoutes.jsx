import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Rooms from "../pages/Rooms";
import Room from "../pages/Room";
import Profile from "../pages/Profile";

import ProtectedRoute from "../components/auth/ProtectedRoute";

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
                Protected Routes
            =========================== */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/rooms"
                element={
                    <ProtectedRoute>
                        <Rooms />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/room/:id"
                element={
                    <ProtectedRoute>
                        <Room />
                    </ProtectedRoute>
                }
            />

            {/* Profile */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
};

export default AppRoutes;