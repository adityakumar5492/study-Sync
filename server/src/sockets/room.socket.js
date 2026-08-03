const onlineUsers = new Map();

module.exports = (io, socket) => {
    // Join Room
    socket.on("room:join", ({ roomId, user }) => {
        socket.join(roomId);

        if (!onlineUsers.has(roomId)) {
            onlineUsers.set(roomId, new Map());
        }

        onlineUsers.get(roomId).set(socket.id, user);

        io.to(roomId).emit("room:online-users", {
            users: Array.from(onlineUsers.get(roomId).values()),
        });

        io.to(roomId).emit("room:user-joined", {
            user,
            message: `${user.name} joined the room.`,
        });
    });

    // Leave Room
    socket.on("room:leave", ({ roomId, user }) => {
        socket.leave(roomId);

        if (onlineUsers.has(roomId)) {
    const users = onlineUsers.get(roomId);

    users.delete(socket.id);

    if (users.size === 0) {
        onlineUsers.delete(roomId);
    } else {
        io.to(roomId).emit("room:online-users", {
            users: Array.from(users.values()),
        });
    }
}

        io.to(roomId).emit("room:user-left", {
            user,
            message: `${user.name} left the room.`,
        });
    });

    // Disconnect
    socket.on("disconnecting", () => {
        socket.rooms.forEach((roomId) => {
            if (roomId === socket.id) return;

            if (onlineUsers.has(roomId)) {
    const users = onlineUsers.get(roomId);

    users.delete(socket.id);

    if (users.size === 0) {
        onlineUsers.delete(roomId);
    } else {
        io.to(roomId).emit("room:online-users", {
            users: Array.from(users.values()),
        });
    }
}
        });
    });
};