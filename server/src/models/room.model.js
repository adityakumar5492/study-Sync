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