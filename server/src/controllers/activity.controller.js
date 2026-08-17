const {
    getUserActivities,
} = require("../services/activity.service");

const getActivities = async (req, res) => {
    try {
        const activities =
            await getUserActivities(
                req.user._id
            );

        res.status(200).json({
            success: true,
            activities,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getActivities,
};