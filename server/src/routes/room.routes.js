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
    deleteStudyMaterial,
    getMessages,
    requestRoomRejoin,
    approveRoomRejoin,
    rejectRoomRejoin,
} = require("../controllers/room.controller");

const router = express.Router();

// Create Study Room
router.post("/", auth, createStudyRoom);
router.get("/", auth, getRooms);

// Join Study Room (must be declared before any "/:id" routes)
router.post("/join", auth, joinStudyRoom);

// Upload Study Material (PDF)
router.post("/:id/pdf",auth,uploadPdf.single("pdf"),uploadStudyMaterial);

// Delete Study Material (PDF)
router.delete("/:id/pdf",auth,deleteStudyMaterial);

router.get("/:id/messages", auth, getMessages);

router.post(
    "/:id/rejoin-request",
    auth,
    requestRoomRejoin
);

router.post(
    "/:id/rejoin-request/approve",
    auth,
    approveRoomRejoin
);

router.post(
    "/:id/rejoin-request/reject",
    auth,
    rejectRoomRejoin
);
router.get("/:id", auth, getRoom);
router.post("/:id/leave", auth, leaveStudyRoom);
router.delete("/:id", auth, deleteStudyRoom);
router.put("/:id", auth, updateStudyRoom);

module.exports = router;

