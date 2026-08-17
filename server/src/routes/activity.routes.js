const express = require("express");

const auth = require("../middleware/auth.middleware");

const {
    getActivities,
} = require("../controllers/activity.controller");

const router = express.Router();

router.get(
    "/",
    auth,
    getActivities
);

module.exports = router;