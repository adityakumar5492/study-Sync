module.exports = (io, socket) => {
    // Send Message
    socket.on("chat:send-message", (data) => {
        const {
            roomId,
            message,
            sender,
        } = data;

        io.to(roomId).emit("chat:new-message", {
            id: Date.now().toString(),
            sender,
            message,
            createdAt: new Date(),
        });
    });

    // Typing Started
    socket.on("chat:typing", ({ roomId, user }) => {
        socket.to(roomId).emit("chat:user-typing", {
            user,
        });
    });

    // Typing Stopped
    socket.on("chat:stop-typing", ({ roomId, user }) => {
        socket.to(roomId).emit("chat:user-stop-typing", {
            user,
        });
    });
};