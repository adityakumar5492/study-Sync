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

// =========================================
// Security
// =========================================

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
    })
);

// =========================================
// CORS
// IMPORTANT: Must come before rate limiting
// =========================================

app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
);

// =========================================
// Logging
// =========================================

app.use(morgan("dev"));

// =========================================
// Body Parser
// =========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// =========================================
// Cookies
// =========================================

app.use(cookieParser());

// =========================================
// Serve Uploaded Files
// IMPORTANT: Do NOT apply API rate limiter
// to static PDF files.
// =========================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "../uploads")
    )
);

// =========================================
// API Rate Limiting
// Only API requests should be rate limited.
// =========================================

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        success: false,
        message:
            "Too many requests. Please try again later.",
    },
});

// =========================================
// Health Check
// =========================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "StudySync Backend Running 🚀",
    });
});

// =========================================
// API Routes
// =========================================

app.use(
    "/api",
    apiLimiter,
    routes
);

module.exports = app;