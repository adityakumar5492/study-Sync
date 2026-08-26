const express = require("express");

const auth = require("../middleware/auth.middleware");
const uploadPdf = require("../middleware/pdfUpload.middleware");

const {
    uploadMaterial,
    getMyMaterials,
    deleteMaterial,
} = require("../controllers/material.controller");

const router = express.Router();

// Get my personal materials
router.get(
    "/",
    auth,
    getMyMaterials
);

// Upload personal PDF
router.post(
    "/",
    auth,
    uploadPdf.single("pdf"),
    uploadMaterial
);

// Delete personal material
router.delete(
    "/:id",
    auth,
    deleteMaterial
);

module.exports = router;