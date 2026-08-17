const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        description: {
            type: String,
            default: "",
            maxlength: 500,
        },

        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        // Users who were previously removed from this room.
        // They are not allowed to rejoin directly.
        removedMembers: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                removedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        rejoinRequests: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                requestedAt: {
                    type: Date,
                    default: Date.now,
                },
                status: {
                    type: String,
                    enum: ["pending", "approved", "rejected"],
                    default: "pending",
                },
            },
        ],

        pdfUrl: {
            type: String,
            default: "",
        },

        inviteCode: {
            type: String,
            required: true,
            unique: true,
        },

        isPrivate: {
            type: Boolean,
            default: false,
        },

        maxMembers: {
            type: Number,
            default: 50,
            min: 2,
            max: 500,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Room", roomSchema);