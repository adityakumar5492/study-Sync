const mongoose = require("mongoose");

const messageStatusSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);

const messageSchema = new mongoose.Schema(
    {
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        // Users whose socket has received this message.
        deliveredTo: {
            type: [messageStatusSchema],
            default: [],
        },

        // Users who have actually opened/read this message.
        seenBy: {
            type: [messageStatusSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({ room: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);