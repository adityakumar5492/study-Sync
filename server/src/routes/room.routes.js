const express = require("express");

const auth = require("../middleware/auth.middleware");
const uploadPdf = require("../middleware/pdfUpload.middleware");

const {
    createStudyRoom,
    getRooms,
    getRoom,
    joinStudyRoom,
    leaveStudyRoom,
    deleteStudyRoom,
    updateStudyRoom,
    uploadStudyMaterial,
} = require("../controllers/room.controller");

const router = express.Router();

// Create Study Room
router.post("/", auth, createStudyRoom);
router.get("/", auth, getRooms);

// Join Study Room (must be declared before any "/:id" routes)
router.post("/join", auth, joinStudyRoom);

// Upload Study Material (PDF)
router.post(
    "/:id/pdf",
    auth,
    uploadPdf.single("pdf"),
    uploadStudyMaterial
);

router.get("/:id", auth, getRoom);
router.post("/:id/leave", auth, leaveStudyRoom);
router.delete("/:id", auth, deleteStudyRoom);
router.put("/:id", auth, updateStudyRoom);

module.exports = router;

