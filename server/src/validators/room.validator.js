const validateCreateRoom = (data) => {
    const { name, description, isPrivate, maxMembers } = data;

    if (!name || name.trim() === "") {
        return "Room name is required.";
    }

    if (name.trim().length < 3 || name.trim().length > 100) {
        return "Room name must be between 3 and 100 characters.";
    }

    if (description && description.length > 500) {
        return "Description cannot exceed 500 characters.";
    }

    if (
        maxMembers !== undefined &&
        (maxMembers < 2 || maxMembers > 500)
    ) {
        return "Max members must be between 2 and 500.";
    }

    if (
        isPrivate !== undefined &&
        typeof isPrivate !== "boolean"
    ) {
        return "isPrivate must be a boolean.";
    }

    return null;
};
const validateJoinRoom = (data) => {
    const { inviteCode } = data;

    if (!inviteCode || inviteCode.trim() === "") {
        return "Invite code is required.";
    }

    return null;
};

module.exports = {
    validateCreateRoom,
    validateJoinRoom,
};