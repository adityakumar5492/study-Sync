const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads/pdfs folder automatically
const uploadPath = path.join(__dirname, "../../uploads/pdfs");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

// Allow only PDF files
const fileFilter = (req, file, cb) => {
    const isPdf =
        file.mimetype === "application/pdf" &&
        path.extname(file.originalname).toLowerCase() === ".pdf";

    if (isPdf) {
        return cb(null, true);
    }

    cb(new Error("Only PDF files are allowed."));
};

// Multer instance
const uploadPdf = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB
    },
});

module.exports = uploadPdf;