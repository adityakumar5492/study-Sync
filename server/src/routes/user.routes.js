const express = require("express");

const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
    getUserProfile,
    updateUserProfile,
    uploadAvatar,
} = require("../controllers/user.controller");

const router = express.Router();

// Profile
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);

// Avatar Upload
router.put(
    "/avatar",
    auth,
    upload.single("avatar"),
    uploadAvatar
);

module.exports = router;