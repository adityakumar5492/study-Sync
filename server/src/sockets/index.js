const { Server } = require("socket.io");
const { CLIENT_URL } = require("../config/env");
const registerAnnotationSocket = require("./annotation.socket");
const {
    setSocketIO,
} = require("../services/activity.service");
const registerRoomSocket = require("./room.socket");
const registerChatSocket = require("./chat.socket");
const registerVoiceSocket = require("./voice.socket");

const initializeSocket = (server) => {
    const io = new Server(server, {
        
        cors: {
            origin: CLIENT_URL,
            credentials: true,
        },
    });
    setSocketIO(io);

    io.on("connection", (socket) => {
        console.log(`Socket Connected: ${socket.id}`);

        registerRoomSocket(io, socket);
        registerChatSocket(io, socket);
        registerAnnotationSocket(io, socket);
        registerVoiceSocket(io, socket);
        
        socket.on("disconnect", () => {
            console.log(`Socket Disconnected: ${socket.id}`);
        });
    });
};

module.exports = initializeSocket;