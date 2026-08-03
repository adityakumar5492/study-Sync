const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

const { CLIENT_URL } = require("./config/env");
const routes = require("./routes");

const app = express();

// Security
app.use(helmet());

// Logging
app.use(morgan("dev"));

// Rate Limiting
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: "Too many requests. Please try again later.",
    })
);

// CORS
app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
);

// Body Parser
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Cookies
app.use(cookieParser());

// Serve Uploaded Files
app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
);

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "StudySync Backend Running 🚀",
    });
});

// API Routes
app.use("/api", routes);

module.exports = app;