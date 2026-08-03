/**
 * formatUserResponse
 * One consistent shape for a "user" object everywhere it's sent to the client.
 */
const formatUserResponse = (user) => {
    if (!user) return null;

    const userObj = typeof user.toObject === "function" ? user.toObject() : user;

    return {
        _id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        avatar: userObj.avatar || "",
        bio: userObj.bio || "",
        role: userObj.role,
        isVerified: userObj.isVerified,
        createdAt: userObj.createdAt,
    };
};

module.exports = formatUserResponse;