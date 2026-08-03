const User = require("../models/User");

const getProfile = async (userId) => {
    return await User.findById(userId).select("-password");
};

const updateProfile = async (userId, data) => {
    const { name, bio } = data;

    const user = await User.findByIdAndUpdate(
        userId,
        { name, bio },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password");

    return user;
};

const updateAvatar = async (userId, avatar) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    user.avatar = avatar;

    await user.save();

    return await User.findById(userId).select("-password");
};

module.exports = {
    getProfile,
    updateProfile,
    updateAvatar,
};