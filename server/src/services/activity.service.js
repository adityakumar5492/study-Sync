const Activity = require("../models/activity.model");

let io = null;

const setSocketIO = (socketIO) => {
    io = socketIO;
};

const getSocketIO = () => {
    return io;
};

const createActivity = async (
    userId,
    type,
    roomId
) => {
    const activity = await Activity.create({
        user: userId,
        type,
        room: roomId,
    });

    if (io) {
        io.emit("profile:activity-updated", {
            userId: userId.toString(),
        });
    }

    return activity;
};

const getUserActivities = async (
    userId,
    limit = 10
) => {
    return await Activity.find({
        user: userId,
    })
        .populate("room", "name")
        .sort({
            createdAt: -1,
        })
        .limit(limit);
};

module.exports = {
    setSocketIO,
    getSocketIO,
    createActivity,
    getUserActivities,
};