const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const isPdf =
        file.mimetype === "application/pdf" &&
        file.originalname
            .toLowerCase()
            .endsWith(".pdf");

    if (isPdf) {
        return cb(null, true);
    }

    cb(new Error("Only PDF files are allowed."));
};


const uploadPdf = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024,
        files: 10,
    },
});

module.exports = uploadPdf;