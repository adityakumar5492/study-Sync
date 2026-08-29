const mongoose = require("mongoose");

const messageRecipientSchema = new mongoose.Schema(
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

        /*
         * =========================================================
         * MESSAGE DELIVERY / READ STATUS
         *
         * deliveredTo:
         * User is connected to the room and has received the
         * message, but may not have opened the Chat panel.
         *
         * seenBy:
         * User has actually opened/entered the Chat panel and
         * the message has been marked as read.
         * =========================================================
         */

        deliveredTo: {
            type: [messageRecipientSchema],
            default: [],
        },

        seenBy: {
            type: [messageRecipientSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({
    room: 1,
    createdAt: 1,
});

messageSchema.index({
    room: 1,
    "deliveredTo.user": 1,
});

messageSchema.index({
    room: 1,
    "seenBy.user": 1,
});

module.exports = mongoose.model(
    "Message",
    messageSchema
);