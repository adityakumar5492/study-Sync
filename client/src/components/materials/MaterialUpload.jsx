import { useState } from "react";
import { FaCloudUploadAlt, FaFilePdf } from "react-icons/fa";
import toast from "react-hot-toast";

const MaterialUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please select a PDF.");
            return;
        }

        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed.");
            return;
        }

        const formData = new FormData();

        formData.append("pdf", file);

        if (name.trim()) {
            formData.append("name", name.trim());
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

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Upload failed."
                );
            }

            toast.success("Material uploaded successfully.");

            setFile(null);
            setName("");

            // Reset file input
            e.target.reset();

            onUploadSuccess?.();
        } catch (error) {
            console.error("Upload material error:", error);

            toast.error(
                error.message || "Failed to upload material."
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <form
            onSubmit={handleUpload}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
        >
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                    <FaCloudUploadAlt />
                </div>

                <div>
                    <h2 className="text-sm font-bold text-white">
                        Upload Personal Material
                    </h2>

                    <p className="text-xs text-zinc-500">
                        Store a PDF privately for your own study.
                    </p>
                </div>
            </div>

            {/* Material Name */}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Material name (optional)"
                className="mb-3 w-full rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/30"
            />

            {/* File */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/[0.1] bg-black/20 p-4 transition hover:border-violet-400/30">
                <FaFilePdf className="text-lg text-red-400" />

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-300">
                        {file
                            ? file.name
                            : "Choose a PDF file"}
                    </p>

                    <p className="text-[11px] text-zinc-600">
                        Maximum size: 20 MB
                    </p>
                </div>

                <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) =>
                        setFile(e.target.files?.[0] || null)
                    }
                />
            </label>

            {/* Upload Button */}
            <button
                type="submit"
                disabled={uploading}
                className="mt-4 w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {uploading
                    ? "Uploading..."
                    : "Upload Material"}
            </button>
        </form>
    );
};

export default MaterialUpload;