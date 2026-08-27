const express = require("express");

const auth = require("../middleware/auth.middleware");

const uploadPdf = require("../middleware/pdfUpload.middleware");

const {
    uploadMaterial,
    getMyMaterials,
    viewMaterial,
    deleteMaterial,
    deleteMaterialsBulk,
} = require("../controllers/material.controller");

const router = express.Router();

// =========================================
// Get My Personal Materials
// =========================================

router.get(
    "/",
    auth,
    getMyMaterials
);

// =========================================
// View PDF
// IMPORTANT: Keep this BEFORE /:id
// =========================================

router.get(
    "/:id/view",
    auth,
    viewMaterial
);

// =========================================
// Upload One / Multiple PDFs
// =========================================

router.post(
    "/",
    auth,
    uploadPdf.array("pdf", 10),
    uploadMaterial
);

// =========================================
// Delete Multiple Materials
// =========================================

router.delete(
    "/bulk",
    auth,
    deleteMaterialsBulk
);

// =========================================
// Delete Single Material
// =========================================

router.delete(
    "/:id",
    auth,
    deleteMaterial
);

module.exports = router;