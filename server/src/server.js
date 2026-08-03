const http = require("http");

const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");
const initializeSocket = require("./sockets");

connectDB();

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});