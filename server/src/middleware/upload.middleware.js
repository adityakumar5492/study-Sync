const multer = require("multer");

const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;

    const isValidExt = allowedTypes.test(
        file.originalname.split(".").pop().toLowerCase()
    );

    const isValidMime = allowedTypes.test(file.mimetype);

    if (isValidExt && isValidMime) {
        return cb(null, true);
    }

    cb(
        new Error(
            "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
    );
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
});

module.exports = upload;