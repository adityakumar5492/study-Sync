import { useRef, useState } from "react";
import {
    FaCloudUploadAlt,
    FaFilePdf,
    FaPlus,
    FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const MaterialUpload = ({ onUploadSuccess }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    const validateFiles = (selectedFiles) => {
        const validFiles = [];

        for (const file of selectedFiles) {
            if (
                file.type !== "application/pdf" ||
                !file.name.toLowerCase().endsWith(".pdf")
            ) {
                toast.error(
                    `${file.name}: Only PDF files are allowed.`
                );
                continue;
            }

            if (file.size > MAX_FILE_SIZE) {
                toast.error(
                    `${file.name}: PDF must be smaller than 20 MB.`
                );
                continue;
            }

            validFiles.push(file);
        }

        return validFiles;
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(
            e.target.files || []
        );

        if (!selectedFiles.length) {
            return;
        }

        const validFiles = validateFiles(
            selectedFiles
        );

        if (validFiles.length) {
            setFiles((previousFiles) => [
                ...previousFiles,
                ...validFiles,
            ]);
        }

        e.target.value = "";
    };

    const removeFile = (index) => {
        setFiles((previousFiles) =>
            previousFiles.filter(
                (_, fileIndex) => fileIndex !== index
            )
        );
    };

    const clearFiles = () => {
        setFiles([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!files.length) {
            toast.error("Please select at least one PDF.");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();

            files.forEach((file) => {
                formData.append("pdf", file);
            });

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/materials`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                        "Upload failed."
                );
            }

            toast.success(
                `${files.length} ${
                    files.length === 1
                        ? "PDF"
                        : "PDFs"
                } uploaded successfully.`
            );

            clearFiles();

            onUploadSuccess?.();
        } catch (error) {
            console.error(
                "Upload materials error:",
                error
            );

            toast.error(
                error.message ||
                    "Failed to upload materials."
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <form
            onSubmit={handleUpload}
            className="
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                p-4
                sm:p-5
            "
        >
            {/* ================================
                HEADER
            ================================= */}

            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-violet-500/10
                            text-violet-300
                        "
                    >
                        <FaCloudUploadAlt />
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-sm font-bold text-white">
                            Personal Materials
                        </h2>

                        <p className="text-xs text-zinc-500">
                            Private PDFs for your own study.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                    disabled={uploading}
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-violet-400/15
                        bg-violet-500/[0.08]
                        px-3
                        py-2
                        text-xs
                        font-bold
                        text-violet-300
                        transition
                        hover:border-violet-400/25
                        hover:bg-violet-500/[0.14]
                        hover:text-violet-200
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <FaPlus className="text-[9px]" />
                    Add PDFs
                </button>
            </div>

            {/* Hidden File Input */}

            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                multiple
                className="hidden"
                onChange={handleFileChange}
            />

            {/* ================================
                SELECT AREA
            ================================= */}

            {!files.length ? (
                <button
                    type="button"
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                    disabled={uploading}
                    className="
                        mt-4
                        flex
                        w-full
                        items-center
                        gap-4
                        rounded-xl
                        border
                        border-dashed
                        border-white/[0.1]
                        bg-black/20
                        p-4
                        text-left
                        transition
                        hover:border-violet-400/30
                        hover:bg-violet-500/[0.025]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-red-500/[0.08]
                            text-red-400
                        "
                    >
                        <FaFilePdf />
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-300">
                            Choose PDF files
                        </p>

                        <p className="mt-0.5 text-[11px] text-zinc-600">
                            You can select multiple PDFs •
                            Maximum 20 MB per PDF
                        </p>
                    </div>
                </button>
            ) : (
                <div className="mt-4 space-y-2">
                    {/* File Count */}

                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-zinc-400">
                            {files.length}{" "}
                            {files.length === 1
                                ? "PDF selected"
                                : "PDFs selected"}
                        </p>

                        <button
                            type="button"
                            onClick={clearFiles}
                            disabled={uploading}
                            className="
                                text-xs
                                font-semibold
                                text-zinc-600
                                transition
                                hover:text-red-400
                                disabled:opacity-50
                            "
                        >
                            Clear all
                        </button>
                    </div>

                    {/* Selected Files */}

                    <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                        {files.map((file, index) => (
                            <div
                                key={`${file.name}-${file.lastModified}-${index}`}
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-violet-400/15
                                    bg-violet-500/[0.04]
                                    p-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-red-500/[0.08]
                                        text-red-400
                                    "
                                >
                                    <FaFilePdf />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-zinc-300">
                                        {file.name}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-zinc-600">
                                        {(
                                            file.size /
                                            (1024 * 1024)
                                        ).toFixed(2)}{" "}
                                        MB
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeFile(index)
                                    }
                                    disabled={uploading}
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        text-zinc-600
                                        transition
                                        hover:bg-red-500/10
                                        hover:text-red-400
                                        disabled:opacity-50
                                    "
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <FaTimes className="text-xs" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add More */}

                    <button
                        type="button"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        disabled={uploading}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-dashed
                            border-white/[0.08]
                            bg-black/10
                            px-4
                            py-2.5
                            text-xs
                            font-semibold
                            text-zinc-500
                            transition
                            hover:border-violet-400/25
                            hover:bg-violet-500/[0.025]
                            hover:text-violet-300
                            disabled:opacity-50
                        "
                    >
                        <FaPlus className="text-[9px]" />
                        Add more PDFs
                    </button>
                </div>
            )}

            {/* ================================
                UPLOAD ACTION
            ================================= */}

            {files.length > 0 && (
                <button
                    type="submit"
                    disabled={uploading}
                    className="
                        mt-4
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-violet-500
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-violet-400
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <FaCloudUploadAlt />

                    {uploading
                        ? "Uploading..."
                        : `Upload ${
                              files.length
                          } ${
                              files.length === 1
                                  ? "PDF"
                                  : "PDFs"
                          }`}
                </button>
            )}
        </form>
    );
};

export default MaterialUpload;