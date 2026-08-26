import { useState } from "react";
import { motion } from "framer-motion";
import {
    FaFilePdf,
    FaExternalLinkAlt,
    FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";

const MaterialList = ({
    materials,
    loading,
    onDelete,
}) => {
    const [deletingId, setDeletingId] =
        useState(null);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Delete this personal material?"
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/materials/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        "Failed to delete material."
                );
            }

            toast.success(
                "Material deleted."
            );

            onDelete?.();
        } catch (error) {
            console.error(
                "Delete material error:",
                error
            );

            toast.error(
                error.message ||
                    "Failed to delete material."
            );
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="py-10 text-center text-sm text-zinc-600">
                Loading your materials...
            </div>
        );
    }

    if (!materials?.length) {
        return (
            <div className="rounded-2xl border border-dashed border-white/[0.08] py-12 text-center">
                <FaFilePdf className="mx-auto mb-3 text-2xl text-zinc-700" />

                <p className="text-sm font-semibold text-zinc-500">
                    No personal materials yet.
                </p>

                <p className="mt-1 text-xs text-zinc-700">
                    Upload your first PDF above.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-bold text-white">
                    Your Materials
                </h2>

                <p className="text-xs text-zinc-600">
                    Private PDFs available only to you.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {materials.map((material) => (
                    <motion.div
                        key={material._id}
                        initial={{
                            opacity: 0,
                            y: 8,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-violet-400/20"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                <FaFilePdf />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="truncate text-sm font-bold text-zinc-200">
                                    {material.name}
                                </h3>

                                <p className="mt-1 text-[10px] text-zinc-600">
                                    {new Date(
                                        material.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <a
                                href={material.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-400/10 bg-violet-500/[0.06] px-3 py-2 text-xs font-bold text-violet-300 transition hover:bg-violet-500/[0.12]"
                            >
                                <FaExternalLinkAlt className="text-[9px]" />
                                Open PDF
                            </a>

                            <button
                                type="button"
                                onClick={() =>
                                    handleDelete(
                                        material._id
                                    )
                                }
                                disabled={
                                    deletingId ===
                                    material._id
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/[0.05] text-red-400 transition hover:bg-red-500/[0.1] disabled:opacity-50"
                                aria-label="Delete material"
                            >
                                <FaTrash className="text-[10px]" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MaterialList;