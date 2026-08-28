const { Readable } = require("stream");
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
// VIEW PDF
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

        /*
         * Fetch the PDF from Cloudinary.
         *
         * We proxy it through our backend instead
         * of exposing Cloudinary directly to the
         * browser PDF viewer.
         */

        let response;

        try {
            response = await fetch(material.pdfUrl);
        } catch (fetchError) {
            console.error(
                "Cloudinary PDF fetch threw:",
                {
                    materialId: material._id.toString(),
                    pdfUrl: material.pdfUrl,
                    error: fetchError.message,
                }
            );

            return res.status(502).json({
                success: false,
                message:
                    "Unable to reach file storage.",
            });
        }

        if (!response.ok) {
            const errorBody = await response
                .text()
                .catch(() => "");

            /*
             * Log the FULL diagnostic — this is what
             * tells us whether Cloudinary is blocking
             * delivery, or something else is wrong.
             */

            console.error(
                "Cloudinary PDF fetch failed:",
                {
                    materialId: material._id.toString(),
                    pdfUrl: material.pdfUrl,
                    status: response.status,
                    statusText: response.statusText,
                    bodySnippet: errorBody.slice(0, 500),
                }
            );

            return res.status(502).json({
                success: false,
                message:
                    "Unable to retrieve PDF from storage.",
                cloudinaryStatus: response.status,
            });
        }

        /*
         * Stream the response straight through instead
         * of buffering the whole file into memory first.
         * Buffering large PDFs can be slow enough on
         * Render's free tier to trigger a real platform
         * timeout/502, independent of this code.
         */

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
            "Cache-Control",
            "private, max-age=3600"
        );

        const contentLength =
            response.headers.get("content-length");

        if (contentLength) {
            res.setHeader(
                "Content-Length",
                contentLength
            );
        }

        const nodeStream = Readable.fromWeb(
            response.body
        );

        nodeStream.on("error", (streamError) => {
            console.error(
                "PDF stream error:",
                {
                    materialId: material._id.toString(),
                    error: streamError.message,
                }
            );

            if (!res.headersSent) {
                res.status(502).json({
                    success: false,
                    message:
                        "PDF stream interrupted.",
                });
            } else {
                res.end();
            }
        });

        nodeStream.pipe(res);
    } catch (error) {
        console.error(
            "View material error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to open PDF.",
        });
    }
};

// =========================================
// Delete Cloudinary Material
// =========================================

const destroyMaterialFile = async (
    material
) => {
    /*
     * New materials are stored as raw PDFs.
     */

    const rawResult =
        await cloudinary.uploader.destroy(
            material.pdfPublicId,
            {
                resource_type: "raw",
            }
        );

    /*
     * Some older materials were incorrectly
     * uploaded as image resources.
     *
     * Try image deletion as fallback.
     */

    if (
        rawResult.result === "not found"
    ) {
        await cloudinary.uploader.destroy(
            material.pdfPublicId,
            {
                resource_type: "image",
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

        await destroyMaterialFile(
            material
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

            deletedCount:
                materials.length,
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