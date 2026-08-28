const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },

        startedAt: {
            type: Date,
            required: true,
        },

        endedAt: {
            type: Date,
            required: true,
        },

        durationSeconds: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

studySessionSchema.index({
    user: 1,
    startedAt: -1,
});

module.exports =
    mongoose.model(
        "StudySession",
        studySessionSchema
    );