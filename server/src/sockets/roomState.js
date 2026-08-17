// Shared across socket handler modules.
// Node's require cache makes these Maps singletons
// for the whole server process.

// roomId -> socket.id of current host
const hostSocketId = new Map();

// roomId -> drawing permission
// {
//     mode: "none" | "everyone" | "selected",
//     allowedUsers: []
// }
const drawingPermission = new Map();

module.exports = {
    hostSocketId,
    drawingPermission,
};