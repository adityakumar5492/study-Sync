const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "room_created",
                "room_joined",
                "room_left",
                "room_rejoined",
            ],
            required: true,
        },

        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

activitySchema.index({
    user: 1,
    createdAt: -1,
});

module.exports =
    mongoose.model("Activity", activitySchema);