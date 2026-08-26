import { useState } from "react";
import {
    motion,
    AnimatePresence,
} from "framer-motion";
import {
    FaFilePdf,
    FaExternalLinkAlt,
    FaTrash,
    FaTimes,
    FaExclamationTriangle,
    FaCheck,
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

    const [selectedIds, setSelectedIds] =
        useState([]);

    const [bulkDeleting, setBulkDeleting] =
        useState(false);

    const toggleSelection = (id) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter(
                      (item) => item !== id
                  )
                : [...current, id]
        );
    };

    const selectAll = () => {
        if (
            selectedIds.length ===
            materials.length
        ) {
            setSelectedIds([]);
        } else {
            setSelectedIds(
                materials.map(
                    (material) =>
                        material._id
                )
            );
        }
    };

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

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                        "Failed to delete material."
                );
            }

            toast.success(
                "Material deleted."
            );

            setDeleteTarget(null);

            setSelectedIds((current) =>
                current.filter(
                    (item) => item !== id
                )
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

    const handleBulkDelete = async () => {
        if (!selectedIds.length) {
            return;
        }

        try {
            setBulkDeleting(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/materials/bulk`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        ids: selectedIds,
                    }),
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
                        "Failed to delete materials."
                );
            }

            toast.success(
                `${data.deletedCount} materials deleted.`
            );

            setSelectedIds([]);

            onDelete?.();
        } catch (error) {
            console.error(
                "Bulk delete error:",
                error
            );

            toast.error(
                error.message ||
                    "Failed to delete materials."
            );
        } finally {
            setBulkDeleting(false);
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
        <>
            <div>
                {/* Section Header */}

                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-white">
                            Your Materials
                        </h2>

                        <p className="text-xs text-zinc-600">
                            Private PDFs available only to you.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={selectAll}
                            className="
                                rounded-lg
                                border
                                border-white/[0.07]
                                bg-white/[0.03]
                                px-3
                                py-2
                                text-[10px]
                                font-bold
                                text-zinc-400
                                hover:bg-white/[0.06]
                                hover:text-white
                            "
                        >
                            {selectedIds.length ===
                            materials.length
                                ? "Unselect All"
                                : "Select All"}
                        </button>

                        {selectedIds.length >
                            0 && (
                            <button
                                type="button"
                                onClick={
                                    handleBulkDelete
                                }
                                disabled={
                                    bulkDeleting
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-red-500/90
                                    px-3
                                    py-2
                                    text-[10px]
                                    font-bold
                                    text-white
                                    hover:bg-red-500
                                    disabled:opacity-50
                                "
                            >
                                <FaTrash />

                                {bulkDeleting
                                    ? "Deleting..."
                                    : `Delete ${selectedIds.length}`}
                            </button>
                        )}
                    </div>
                </div>

                {/* Material Cards */}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {materials.map(
                        (material) => {
                            const isSelected =
                                selectedIds.includes(
                                    material._id
                                );

                            return (
                                <motion.div
                                    key={
                                        material._id
                                    }
                                    initial={{
                                        opacity: 0,
                                        y: 8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    className={`
                                        group
                                        rounded-2xl
                                        border
                                        p-4
                                        transition
                                        ${
                                            isSelected
                                                ? "border-violet-400/40 bg-violet-500/[0.08]"
                                                : "border-white/[0.07] bg-white/[0.025] hover:border-violet-400/20"
                                        }
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleSelection(
                                                    material._id
                                                )
                                            }
                                            className={`
                                                flex
                                                h-6
                                                w-6
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-md
                                                border
                                                ${
                                                    isSelected
                                                        ? "border-violet-400 bg-violet-500 text-white"
                                                        : "border-white/[0.12] bg-black/20 text-transparent"
                                                }
                                            `}
                                            aria-label={
                                                isSelected
                                                    ? "Unselect material"
                                                    : "Select material"
                                            }
                                        >
                                            <FaCheck className="text-[9px]" />
                                        </button>

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                            <FaFilePdf />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-bold text-zinc-200">
                                                {
                                                    material.name
                                                }
                                            </h3>

                                            <p className="mt-1 text-[10px] text-zinc-600">
                                                {new Date(
                                                    material.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedMaterial(
                                                    material
                                                )
                                            }
                                            className="
                                                flex
                                                flex-1
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                border
                                                border-violet-400/10
                                                bg-violet-500/[0.06]
                                                px-3
                                                py-2
                                                text-xs
                                                font-bold
                                                text-violet-300
                                                hover:bg-violet-500/[0.12]
                                            "
                                        >
                                            <FaExternalLinkAlt className="text-[9px]" />
                                            View PDF
                                        </button>

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
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-red-400/10
                                                bg-red-500/[0.05]
                                                text-red-400
                                                hover:bg-red-500/[0.1]
                                                disabled:opacity-50
                                            "
                                            aria-label="Delete material"
                                        >
                                            <FaTrash className="text-[10px]" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        }
                    )}
                </div>
            </div>

            {/* PDF VIEWER */}

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
                        className="
                            fixed
                            inset-0
                            z-[9999]
                            flex
                            items-center
                            justify-center
                            bg-black/80
                            p-3
                            backdrop-blur-md
                            sm:p-5
                        "
                        onClick={() =>
                            setSelectedMaterial(
                                null
                            )
                        }
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.96,
                            }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                            className="
                                flex
                                h-[92vh]
                                w-full
                                max-w-6xl
                                flex-col
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/[0.1]
                                bg-[#0b0b11]
                            "
                        >
                            <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] px-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <FaFilePdf className="shrink-0 text-red-400" />

                                    <h2 className="truncate text-sm font-bold text-white">
                                        {
                                            selectedMaterial.name
                                        }
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedMaterial(
                                            null
                                        )
                                    }
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-white/[0.07]
                                        text-zinc-500
                                        hover:bg-white/[0.06]
                                        hover:text-white
                                    "
                                >
                                    <FaTimes />
                                </button>
                            </div>

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

            {/* SINGLE DELETE CONFIRMATION */}

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
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.94,
                            }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                            className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#101017] p-5"
                        >
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                <FaExclamationTriangle />
                            </div>

                            <h3 className="text-sm font-bold text-white">
                                Delete material?
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-zinc-500">
                                This will permanently
                                delete{" "}
                                <span className="font-semibold text-zinc-300">
                                    "
                                    {
                                        deleteTarget.name
                                    }
                                    "
                                </span>
                                .
                            </p>

                            <div className="mt-5 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDeleteTarget(
                                            null
                                        )
                                    }
                                    className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-zinc-400"
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
                                    className="flex-1 rounded-xl bg-red-500/90 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
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