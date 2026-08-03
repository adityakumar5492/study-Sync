const {
    getProfile,
    updateProfile,
    updateAvatar,
} = require("../services/user.service");
const formatUserResponse = require("../utils/formatUserResponse");

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

        const avatar = `/uploads/avatars/${req.file.filename}`;

        const user = await updateAvatar(req.user._id, avatar);

        res.status(200).json({
            success: true,
            message: "Avatar uploaded successfully.",
            user: formatUserResponse(user),
        });
    } catch (error) {
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