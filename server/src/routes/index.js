const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const roomRoutes = require("./room.routes");
const activityRoutes = require("./activity.routes");
const materialRoutes = require("./material.routes");

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/rooms", roomRoutes);

router.use("/activities", activityRoutes);

router.use("/materials", materialRoutes);

module.exports = router;