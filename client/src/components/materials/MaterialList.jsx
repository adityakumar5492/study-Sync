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
        if (!selectedIds.length) return;

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

    const openPdf = (material) => {
        setSelectedMaterial(material);
    };

    const closePdf = () => {
        setSelectedMaterial(null);
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-14 text-center">
                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />

                <p className="text-sm text-zinc-500">
                    Loading your materials...
                </p>
            </div>
        );
    }

    if (!materials?.length) {
        return (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] py-14 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/[0.06] text-red-400/70">
                    <FaFilePdf className="text-xl" />
                </div>

                <p className="text-sm font-semibold text-zinc-400">
                    No personal materials yet.
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                    Upload your first PDF above.
                </p>
            </div>
        );
    }

    const allSelected =
        selectedIds.length === materials.length;

    return (
        <>
            <div>
                {/* =========================================
                    SECTION HEADER
                ========================================= */}

                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />

                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400/80">
                                Library
                            </span>
                        </div>

                        <h2 className="mt-2 text-xl font-black tracking-tight text-white">
                            Your Materials
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            Private PDFs available only
                            to you.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="mr-1 hidden text-[10px] font-semibold text-zinc-600 sm:block">
                            {materials.length}{" "}
                            {materials.length === 1
                                ? "PDF"
                                : "PDFs"}
                        </span>

                        <button
                            type="button"
                            onClick={selectAll}
                            disabled={bulkDeleting}
                            className="
                                rounded-xl
                                border
                                border-white/[0.07]
                                bg-white/[0.025]
                                px-3
                                py-2
                                text-[10px]
                                font-bold
                                text-zinc-400
                                transition
                                hover:border-violet-400/20
                                hover:bg-violet-500/[0.06]
                                hover:text-violet-300
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {allSelected
                                ? "Unselect All"
                                : "Select All"}
                        </button>

                        {selectedIds.length > 0 && (
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
                                    rounded-xl
                                    border
                                    border-red-400/10
                                    bg-red-500/[0.08]
                                    px-3
                                    py-2
                                    text-[10px]
                                    font-bold
                                    text-red-400
                                    transition
                                    hover:border-red-400/20
                                    hover:bg-red-500/[0.14]
                                    hover:text-red-300
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <FaTrash className="text-[9px]" />

                                {bulkDeleting
                                    ? "Deleting..."
                                    : `Delete ${selectedIds.length}`}
                            </button>
                        )}
                    </div>
                </div>

                {/* =========================================
                    MATERIAL CARDS
                ========================================= */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {materials.map(
                        (material, index) => {
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
                                        y: 10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        delay:
                                            index *
                                            0.035,
                                    }}
                                    className={`
                                        group
                                        relative
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        p-4
                                        transition-all
                                        duration-200
                                        ${
                                            isSelected
                                                ? "border-violet-400/30 bg-violet-500/[0.07] shadow-[0_10px_40px_rgba(124,58,237,0.08)]"
                                                : "border-white/[0.065] bg-white/[0.025] hover:-translate-y-0.5 hover:border-white/[0.11] hover:bg-white/[0.035]"
                                        }
                                    `}
                                >
                                    {/* Top accent */}
                                    <div
                                        className={`
                                            absolute
                                            inset-x-0
                                            top-0
                                            h-px
                                            ${
                                                isSelected
                                                    ? "bg-violet-400/40"
                                                    : "bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
                                            }
                                        `}
                                    />

                                    <div className="flex items-start gap-3">
                                        {/* Selection */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleSelection(
                                                    material._id
                                                )
                                            }
                                            disabled={
                                                bulkDeleting
                                            }
                                            className={`
                                                mt-0.5
                                                flex
                                                h-5
                                                w-5
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-md
                                                border
                                                transition
                                                ${
                                                    isSelected
                                                        ? "border-violet-400 bg-violet-500 text-white"
                                                        : "border-white/[0.12] bg-black/20 text-transparent hover:border-violet-400/40"
                                                }
                                            `}
                                            aria-label={
                                                isSelected
                                                    ? "Unselect material"
                                                    : "Select material"
                                            }
                                        >
                                            <FaCheck className="text-[8px]" />
                                        </button>

                                        {/* PDF Icon */}
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/[0.08] text-red-400 ring-1 ring-red-400/[0.06]">
                                            <FaFilePdf className="text-lg" />
                                        </div>

                                        {/* Material Info */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-bold text-zinc-200">
                                                {
                                                    material.name
                                                }
                                            </h3>

                                            <p className="mt-1 text-[10px] text-zinc-600">
                                                {new Date(
                                                    material.createdAt
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openPdf(
                                                    material
                                                )
                                            }
                                            className="
                                                flex
                                                min-w-0
                                                flex-1
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                border
                                                border-violet-400/10
                                                bg-violet-500/[0.06]
                                                px-3
                                                py-2.5
                                                text-xs
                                                font-bold
                                                text-violet-300
                                                transition
                                                hover:border-violet-400/20
                                                hover:bg-violet-500/[0.12]
                                                hover:text-violet-200
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
                                                material._id ||
                                                bulkDeleting
                                            }
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-red-400/10
                                                bg-red-500/[0.05]
                                                text-red-400
                                                transition
                                                hover:border-red-400/20
                                                hover:bg-red-500/[0.1]
                                                disabled:cursor-not-allowed
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

            {/* =========================================
                PDF VIEWER
            ========================================= */}

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
                            bg-[#020308]/90
                            p-2
                            backdrop-blur-xl
                            sm:p-4
                            lg:p-6
                        "
                        onClick={closePdf}
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 12,
                                scale: 0.98,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 12,
                                scale: 0.98,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                            className="
                                flex
                                h-[96vh]
                                w-full
                                max-w-[1500px]
                                flex-col
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/[0.1]
                                bg-[#090c13]
                                shadow-[0_30px_100px_rgba(0,0,0,0.6)]
                            "
                        >
                            {/* Viewer Header */}
                            <div className="flex min-h-[64px] shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] bg-[#0b0f17] px-3 sm:px-5">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/[0.08] text-red-400">
                                        <FaFilePdf className="text-sm" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                                            Personal Material
                                        </p>

                                        <h2 className="truncate text-sm font-bold text-white sm:text-[15px]">
                                            {
                                                selectedMaterial.name
                                            }
                                        </h2>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <a
                                        href={
                                            selectedMaterial.pdfUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            hidden
                                            h-9
                                            items-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.025]
                                            px-3
                                            text-[10px]
                                            font-bold
                                            text-zinc-400
                                            transition
                                            hover:bg-white/[0.06]
                                            hover:text-white
                                            sm:flex
                                        "
                                    >
                                        <FaExpand className="text-[9px]" />
                                        Open separately
                                    </a>

                                    <button
                                        type="button"
                                        onClick={
                                            closePdf
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
                                            bg-white/[0.025]
                                            text-zinc-500
                                            transition
                                            hover:border-red-400/20
                                            hover:bg-red-500/[0.08]
                                            hover:text-red-400
                                        "
                                        aria-label="Close PDF viewer"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>

                            {/* PDF Content */}
                            <div className="relative min-h-0 flex-1 bg-[#1d1d1f]">
                                <iframe
                                    src={`https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
                                        selectedMaterial.pdfUrl
                                    )}`}
                                    title={
                                        selectedMaterial.name
                                    }
                                    className="h-full w-full border-0"
                                    allow="fullscreen"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* =========================================
                DELETE CONFIRMATION
            ========================================= */}

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
                        className="
                            fixed
                            inset-0
                            z-[10000]
                            flex
                            items-center
                            justify-center
                            bg-black/70
                            p-4
                            backdrop-blur-md
                        "
                        onClick={() =>
                            setDeleteTarget(null)
                        }
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.94,
                                y: 8,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.94,
                                y: 8,
                            }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                            className="
                                w-full
                                max-w-sm
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/[0.08]
                                bg-[#10141d]
                                shadow-[0_25px_80px_rgba(0,0,0,0.5)]
                            "
                        >
                            <div className="p-5">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/[0.08] text-red-400">
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
                                        className="
                                            flex-1
                                            rounded-xl
                                            border
                                            border-white/[0.07]
                                            bg-white/[0.03]
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-bold
                                            text-zinc-400
                                            transition
                                            hover:bg-white/[0.06]
                                            hover:text-white
                                        "
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
                                        className="
                                            flex-1
                                            rounded-xl
                                            bg-red-500/90
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-bold
                                            text-white
                                            transition
                                            hover:bg-red-500
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        {deletingId ===
                                        deleteTarget._id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MaterialList;