const http = require("http");

const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");
const initializeSocket = require("./sockets");

const {
    expireExpiredRooms,
} = require("./services/room.service");

connectDB();

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

/**
 * Remove rooms that have already
 * passed their 24-hour lifetime.
 *
 * Runs immediately when the server starts
 * so rooms that expired while the server
 * was offline are also removed.
 */
const cleanupExpiredRooms = async () => {
    try {
        const expiredCount =
            await expireExpiredRooms();

        if (expiredCount > 0) {
            console.log(
                `🗑️ Expired rooms removed: ${expiredCount}`
            );
        }
    } catch (error) {
        console.error(
            "❌ Failed to cleanup expired rooms:",
            error
        );
    }
};

/**
 * Run cleanup immediately on startup.
 */
cleanupExpiredRooms();

/**
 * Check for expired rooms every minute.
 *
 * The actual expiration time is calculated
 * from createdAt + 24 hours, so a room is
 * never deleted before its 24-hour lifetime.
 */
setInterval(
    cleanupExpiredRooms,
    60 * 1000
);

server.listen(PORT, () => {
    console.log(
        `🚀 Server running on port ${PORT}`
    );
});