const { Server } = require("socket.io");
const { CLIENT_URL } = require("../config/env");

const registerRoomSocket = require("./room.socket");
const registerChatSocket = require("./chat.socket");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: CLIENT_URL,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`Socket Connected: ${socket.id}`);

        registerRoomSocket(io, socket);
        registerChatSocket(io, socket);

        socket.on("disconnect", () => {
            console.log(`Socket Disconnected: ${socket.id}`);
        });
    });
};

module.exports = initializeSocket;