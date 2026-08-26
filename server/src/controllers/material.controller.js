const Material = require("../models/Material.model");
const cloudinary = require("../config/cloudinary");

// =========================================
// Upload Personal Material
// =========================================

const uploadMaterial = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "PDF file is required.",
            });
        }

        const result = await new Promise(
            (resolve, reject) => {
                const stream =
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "studysync/materials",
                            resource_type: "raw",
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );

                stream.end(req.file.buffer);
            }
        );

        const material = await Material.create({
            name:
                req.body.name ||
                req.file.originalname,

            owner: req.user._id,

            pdfUrl: result.secure_url,

            pdfPublicId: result.public_id,
        });

        return res.status(201).json({
            success: true,
            message:
                "Material uploaded successfully.",
            material,
        });
    } catch (error) {
        console.error(
            "Upload material error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to upload material.",
        });
    }
};

// =========================================
// Get My Materials
// =========================================

const getMyMaterials = async (req, res) => {
    try {
        const materials =
            await Material.find({
                owner: req.user._id,
            }).sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            materials,
        });
    } catch (error) {
        console.error(
            "Get materials error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch materials.",
        });
    }
};

// =========================================
// Delete Material
// =========================================

const deleteMaterial = async (req, res) => {
    try {
        const material =
            await Material.findOne({
                _id: req.params.id,
                owner: req.user._id,
            });

        if (!material) {
            return res.status(404).json({
                success: false,
                message: "Material not found.",
            });
        }

        await cloudinary.uploader.destroy(
            material.pdfPublicId,
            {
                resource_type: "raw",
            }
        );

        await material.deleteOne();

        return res.status(200).json({
            success: true,
            message:
                "Material deleted successfully.",
        });
    } catch (error) {
        console.error(
            "Delete material error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete material.",
        });
    }
};

module.exports = {
    uploadMaterial,
    getMyMaterials,
    deleteMaterial,
};