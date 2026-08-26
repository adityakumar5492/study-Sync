const express = require("express");

const auth = require("../middleware/auth.middleware");
const uploadPdf = require("../middleware/pdfUpload.middleware");

const {
    uploadMaterial,
    getMyMaterials,
    deleteMaterial,
    deleteMaterialsBulk,
} = require("../controllers/material.controller");

const router = express.Router();

// Get my personal materials
router.get(
    "/",
    auth,
    getMyMaterials
);

// Upload one or multiple personal PDFs
router.post(
    "/",
    auth,
    uploadPdf.array("pdf", 10),
    uploadMaterial
);

// Delete multiple materials
router.delete(
    "/bulk",
    auth,
    deleteMaterialsBulk
);

// Delete single material
router.delete(
    "/:id",
    auth,
    deleteMaterial
);

module.exports = router;