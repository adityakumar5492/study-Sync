import { useRef, useState } from "react";
import {
    FaCloudUploadAlt,
    FaFilePdf,
    FaPlus,
    FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";

const MaterialUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile =
            e.target.files?.[0] || null;

        if (!selectedFile) return;

        if (
            selectedFile.type !==
            "application/pdf"
        ) {
            toast.error(
                "Only PDF files are allowed."
            );

            e.target.value = "";
            return;
        }

        if (
            selectedFile.size >
            20 * 1024 * 1024
        ) {
            toast.error(
                "PDF must be smaller than 20 MB."
            );

            e.target.value = "";
            return;
        }

        setFile(selectedFile);

        // Automatically use filename as material name
        if (!name.trim()) {
            setName(
                selectedFile.name.replace(
                    /\.pdf$/i,
                    ""
                )
            );
        }
    };

    const clearFile = () => {
        setFile(null);
        setName("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error(
                "Please select a PDF."
            );
            return;
        }

        if (
            file.type !==
            "application/pdf"
        ) {
            toast.error(
                "Only PDF files are allowed."
            );
            return;
        }

        if (
            file.size >
            20 * 1024 * 1024
        ) {
            toast.error(
                "PDF must be smaller than 20 MB."
            );
            return;
        }

        const formData = new FormData();

        formData.append(
            "pdf",
            file
        );

        if (name.trim()) {
            formData.append(
                "name",
                name.trim()
            );
        }

        try {
            setUploading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/materials`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data =
                await response.json();

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
                "Material uploaded successfully."
            );

            clearFile();

            onUploadSuccess?.();
        } catch (error) {
            console.error(
                "Upload material error:",
                error
            );

            toast.error(
                error.message ||
                    "Failed to upload material."
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

                {/* Small Add Button */}
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
                    Add PDF
                </button>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* ================================
                MATERIAL NAME
            ================================= */}

            <div className="mt-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    placeholder="Material name (optional)"
                    disabled={uploading}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-white/[0.07]
                        bg-black/20
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-zinc-600
                        focus:border-violet-400/30
                        disabled:opacity-50
                    "
                />
            </div>

            {/* ================================
                FILE DROP / SELECT AREA
            ================================= */}

            {!file ? (
                <button
                    type="button"
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                    disabled={uploading}
                    className="
                        mt-3
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
                            Choose a PDF
                        </p>

                        <p className="mt-0.5 text-[11px] text-zinc-600">
                            Maximum size: 20 MB
                        </p>
                    </div>
                </button>
            ) : (
                <div
                    className="
                        mt-3
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
                        onClick={clearFile}
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
                        aria-label="Remove selected PDF"
                    >
                        <FaTimes className="text-xs" />
                    </button>
                </div>
            )}

            {/* ================================
                UPLOAD ACTION
            ================================= */}

            {file && (
                <button
                    type="submit"
                    disabled={uploading}
                    className="
                        mt-3
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
                        : "Save Personal PDF"}
                </button>
            )}
        </form>
    );
};

export default MaterialUpload;