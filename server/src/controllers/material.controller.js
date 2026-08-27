const Material = require("../models/Material.model");
const cloudinary = require("../config/cloudinary");

// =========================================
// Upload Personal Material(s)
// =========================================

const uploadMaterial = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one PDF file is required.",
            });
        }

        const uploadedMaterials = [];

        for (const file of req.files) {
            const result = await new Promise(
                (resolve, reject) => {
                    const stream =
                        cloudinary.uploader.upload_stream(
                            {
                                folder: "studysync/materials",
                                resource_type: "image",
                            },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );

                    stream.end(file.buffer);
                }
            );

            const material = await Material.create({
                name: file.originalname.replace(
                    /\.pdf$/i,
                    ""
                ),

                owner: req.user._id,

                pdfUrl: result.secure_url,

                pdfPublicId: result.public_id,
            });

            uploadedMaterials.push(material);
        }

        return res.status(201).json({
            success: true,
            message:
                uploadedMaterials.length === 1
                    ? "Material uploaded successfully."
                    : `${uploadedMaterials.length} materials uploaded successfully.`,

            materials: uploadedMaterials,
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
// View Personal PDF
// =========================================

const viewMaterial = async (req, res) => {
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

        if (!material.pdfUrl) {
            return res.status(404).json({
                success: false,
                message: "PDF file not found.",
            });
        }

        const pdfResponse = await fetch(
            material.pdfUrl
        );

        if (!pdfResponse.ok) {
            console.error(
                "Cloudinary PDF fetch failed:",
                pdfResponse.status,
                pdfResponse.statusText
            );

            return res.status(502).json({
                success: false,
                message:
                    "Unable to load PDF file.",
            });
        }

        const pdfBuffer = Buffer.from(
            await pdfResponse.arrayBuffer()
        );

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `inline; filename="${encodeURIComponent(
                material.name
            )}.pdf"`
        );

        res.setHeader(
            "Content-Length",
            pdfBuffer.length
        );

        res.setHeader(
            "Cache-Control",
            "private, no-cache, no-store, must-revalidate"
        );

        return res.send(pdfBuffer);
    } catch (error) {
        console.error(
            "View material error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load PDF.",
        });
    }
};

// =========================================
// Delete Cloudinary Material
// =========================================

const destroyMaterialFile = async (material) => {
    const imageResult =
        await cloudinary.uploader.destroy(
            material.pdfPublicId,
            {
                resource_type: "image",
            }
        );

    if (
        imageResult.result === "not found"
    ) {
        await cloudinary.uploader.destroy(
            material.pdfPublicId,
            {
                resource_type: "raw",
            }
        );
    }
};

// =========================================
// Delete Single Material
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

        await destroyMaterialFile(material);

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

// =========================================
// Delete Multiple Materials
// =========================================

const deleteMaterialsBulk = async (
    req,
    res
) => {
    try {
        const { ids } = req.body;

        if (
            !Array.isArray(ids) ||
            ids.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Material IDs are required.",
            });
        }

        const materials =
            await Material.find({
                _id: {
                    $in: ids,
                },
                owner: req.user._id,
            });

        if (materials.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "No materials found.",
            });
        }

        await Promise.all(
            materials.map(
                destroyMaterialFile
            )
        );

        await Material.deleteMany({
            _id: {
                $in: materials.map(
                    (material) =>
                        material._id
                ),
            },
            owner: req.user._id,
        });

        return res.status(200).json({
            success: true,
            message: `${materials.length} materials deleted successfully.`,
            deletedCount: materials.length,
        });
    } catch (error) {
        console.error(
            "Bulk delete materials error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete materials.",
        });
    }
};

module.exports = {
    uploadMaterial,
    getMyMaterials,
    viewMaterial,
    deleteMaterial,
    deleteMaterialsBulk,
};