import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Rooms from "../pages/Rooms";
import Room from "../pages/Room";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/rooms" element={<Rooms />} />

      <Route path="/room/:id" element={<Room />} />
    </Routes>
  );
};

export default AppRoutes;