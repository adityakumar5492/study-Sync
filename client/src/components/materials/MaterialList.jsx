import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaFilePdf,
    FaExternalLinkAlt,
    FaTrash,
    FaTimes,
    FaExclamationTriangle,
    FaExpand,
} from "react-icons/fa";
import toast from "react-hot-toast";

const MaterialList = ({
    materials,
    loading,
    onDelete,
}) => {
    const [deletingId, setDeletingId] =
        useState(null);

    const [deleteTarget, setDeleteTarget] =
        useState(null);

    const [selectedMaterial, setSelectedMaterial] =
        useState(null);

    // =========================================
    // Delete Material
    // =========================================

    const handleDelete = async () => {
        if (!deleteTarget) return;

        const id = deleteTarget._id;

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

            setDeleteTarget(null);

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

    // =========================================
    // Loading
    // =========================================

    if (loading) {
        return (
            <div className="py-10 text-center text-sm text-zinc-600">
                Loading your materials...
            </div>
        );
    }

    // =========================================
    // Empty State
    // =========================================

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

    // =========================================
    // Materials
    // =========================================

    return (
        <>
            <div>
                {/* Section Header */}

                <div className="mb-4">
                    <h2 className="text-lg font-bold text-white">
                        Your Materials
                    </h2>

                    <p className="text-xs text-zinc-600">
                        Private PDFs available only to you.
                    </p>
                </div>

                {/* Material Cards */}

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
                            {/* Material Info */}

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

                            {/* Actions */}

                            <div className="mt-4 flex gap-2">
                                {/* Open PDF */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedMaterial(
                                            material
                                        )
                                    }
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-400/10 bg-violet-500/[0.06] px-3 py-2 text-xs font-bold text-violet-300 transition hover:bg-violet-500/[0.12]"
                                >
                                    <FaExternalLinkAlt className="text-[9px]" />

                                    Open PDF
                                </button>

                                {/* Delete */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setDeleteTarget(
                                            material
                                        )
                                    }
                                    disabled={
                                        deletingId ===
                                        material._id
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/[0.05] text-red-400 transition hover:bg-red-500/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Delete material"
                                >
                                    <FaTrash className="text-[10px]" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* =====================================================
                PDF VIEWER MODAL
            ====================================================== */}

            <AnimatePresence>
                {selectedMaterial && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-5"
                        onClick={() =>
                            setSelectedMaterial(null)
                        }
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.96,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.96,
                                y: 10,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                            className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0b0b11] shadow-[0_30px_100px_rgba(0,0,0,.7)]"
                        >
                            {/* PDF Header */}

                            <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#0b0b11] px-3 sm:px-5">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                                        <FaFilePdf className="text-sm" />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="truncate text-xs font-bold text-white sm:text-sm">
                                            {
                                                selectedMaterial.name
                                            }
                                        </h2>

                                        <p className="text-[9px] text-zinc-600">
                                            Personal material
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Open in New Tab */}

                                    <a
                                        href={
                                            selectedMaterial.pdfUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hidden h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 text-[10px] font-semibold text-zinc-400 transition hover:bg-white/[0.06] hover:text-white sm:flex"
                                    >
                                        <FaExpand className="text-[9px]" />
                                        Full Screen
                                    </a>

                                    {/* Close */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedMaterial(
                                                null
                                            )
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
                                        aria-label="Close PDF"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </div>
                            </div>

                            {/* PDF */}

                            <div className="min-h-0 flex-1 bg-zinc-900">
                                <iframe
                                    src={`${selectedMaterial.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                                    title={
                                        selectedMaterial.name
                                    }
                                    className="h-full w-full border-0"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* =====================================================
                DELETE CONFIRMATION MODAL
            ====================================================== */}

            <AnimatePresence>
                {deleteTarget && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                        onClick={() =>
                            setDeleteTarget(null)
                        }
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.94,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.94,
                                y: 10,
                            }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                            className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#101017] p-5 shadow-[0_25px_80px_rgba(0,0,0,.6)]"
                        >
                            {/* Icon */}

                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                <FaExclamationTriangle className="text-sm" />
                            </div>

                            {/* Text */}

                            <h3 className="text-sm font-bold text-white">
                                Delete material?
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-zinc-500">
                                This will permanently delete{" "}
                                <span className="font-semibold text-zinc-300">
                                    "{deleteTarget.name}"
                                </span>
                                . This action cannot be undone.
                            </p>

                            {/* Buttons */}

                            <div className="mt-5 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDeleteTarget(
                                            null
                                        )
                                    }
                                    disabled={
                                        deletingId ===
                                        deleteTarget._id
                                    }
                                    className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={
                                        deletingId ===
                                        deleteTarget._id
                                    }
                                    className="flex-1 rounded-xl bg-red-500/90 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {deletingId ===
                                    deleteTarget._id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MaterialList;