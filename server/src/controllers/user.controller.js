const {
    getProfile,
    updateProfile,
    updateAvatar,
} = require("../services/user.service");
const formatUserResponse = require("../utils/formatUserResponse");
const cloudinary = require("../config/cloudinary");

const getUserProfile = async (req, res) => {
    try {
        const user = await getProfile(req.user._id);

        res.status(200).json({
            success: true,
            user: formatUserResponse(user),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await updateProfile(req.user._id, req.body);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: formatUserResponse(user),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an avatar image.",
            });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "studysync/avatars",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        const avatar = result.secure_url;

        const user = await updateAvatar(
            req.user._id,
            avatar
        );

        res.status(200).json({
            success: true,
            message: "Avatar uploaded successfully.",
            user: formatUserResponse(user),
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    uploadAvatar,
};