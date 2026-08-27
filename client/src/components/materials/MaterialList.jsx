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
    FaCheckCircle,
    FaRegSquare,
    FaCalendarAlt,
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

    // =========================================
    // Selection
    // =========================================

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
            return;
        }

        setSelectedIds(
            materials.map(
                (material) => material._id
            )
        );
    };

    // =========================================
    // PDF Viewer
    // =========================================

    const getPdfViewUrl = (material) => {
        return `${import.meta.env.VITE_API_URL}/api/materials/${material._id}/view`;
    };

    const openPdf = (material) => {
        setSelectedMaterial(material);
    };

    const closePdf = () => {
        setSelectedMaterial(null);
    };

    const openPdfSeparately = () => {
        if (!selectedMaterial) return;

        const url =
            getPdfViewUrl(selectedMaterial);

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    };

    // =========================================
    // Single Delete
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
                "Material deleted successfully."
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

    // =========================================
    // Bulk Delete
    // =========================================

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
                `${data.deletedCount} ${
                    data.deletedCount === 1
                        ? "material"
                        : "materials"
                } deleted successfully.`
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

    // =========================================
    // Loading
    // =========================================

    if (loading) {
        return (
            <div
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.06]
                    bg-[#0b1018]/70
                "
            >
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                h-10
                                w-10
                                animate-pulse
                                rounded-xl
                                bg-white/[0.05]
                            "
                        />

                        <div className="space-y-2">
                            <div className="h-3 w-32 animate-pulse rounded bg-white/[0.05]" />
                            <div className="h-2 w-48 animate-pulse rounded bg-white/[0.04]" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 border-t border-white/[0.05] p-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map(
                        (item) => (
                            <div
                                key={item}
                                className="h-32 animate-pulse rounded-2xl bg-white/[0.025]"
                            />
                        )
                    )}
                </div>
            </div>
        );
    }

    // =========================================
    // Empty State
    // =========================================

    if (!materials?.length) {
        return (
            <div
                className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-dashed
                    border-white/[0.08]
                    bg-[#0b1018]/60
                    px-6
                    py-16
                    text-center
                "
            >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />

                <div
                    className="
                        mx-auto
                        mb-5
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-violet-400/10
                        bg-violet-500/[0.06]
                        text-violet-300/70
                        shadow-[0_10px_40px_rgba(124,58,237,0.08)]
                    "
                >
                    <FaFilePdf className="text-2xl" />
                </div>

                <h3 className="text-sm font-bold text-zinc-300">
                    Your library is empty
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                    Upload your study PDFs above
                    and they will appear here as
                    your private material library.
                </p>
            </div>
        );
    }

    const allSelected =
        selectedIds.length ===
        materials.length;

    return (
        <>
            {/* =====================================
                HEADER
            ===================================== */}

            <div
                className="
                    mb-5
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                "
            >
                <div>
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-lg font-black tracking-tight text-white">
                            Your Materials
                        </h2>

                        <span
                            className="
                                rounded-full
                                border
                                border-violet-400/10
                                bg-violet-500/[0.08]
                                px-2
                                py-0.5
                                text-[10px]
                                font-bold
                                text-violet-300
                            "
                        >
                            {materials.length}
                        </span>
                    </div>

                    <p className="mt-1 text-xs text-zinc-600">
                        Your private study library.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={selectAll}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-white/[0.07]
                            bg-white/[0.025]
                            px-3
                            py-2.5
                            text-[10px]
                            font-bold
                            text-zinc-400
                            transition-all
                            hover:border-violet-400/20
                            hover:bg-violet-500/[0.05]
                            hover:text-violet-300
                        "
                    >
                        {allSelected ? (
                            <FaCheckCircle />
                        ) : (
                            <FaRegSquare />
                        )}

                        {allSelected
                            ? "Unselect All"
                            : "Select All"}
                    </button>

                    <AnimatePresence>
                        {selectedIds.length >
                            0 && (
                            <motion.button
                                initial={{
                                    opacity: 0,
                                    x: 8,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: 8,
                                }}
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
                                    border-red-400/15
                                    bg-red-500/[0.08]
                                    px-3
                                    py-2.5
                                    text-[10px]
                                    font-bold
                                    text-red-400
                                    transition
                                    hover:bg-red-500/[0.13]
                                    hover:text-red-300
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <FaTrash />

                                {bulkDeleting
                                    ? "Deleting..."
                                    : `Delete ${selectedIds.length}`}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* =====================================
                MATERIAL GRID
            ===================================== */}

            <div
                className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-3
                "
            >
                {materials.map(
                    (material, index) => {
                        const isSelected =
                            selectedIds.includes(
                                material._id
                            );

                        return (
                            <motion.article
                                key={
                                    material._id
                                }
                                initial={{
                                    opacity: 0,
                                    y: 12,
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
                                    transition-all
                                    duration-200
                                    ${
                                        isSelected
                                            ? "border-violet-400/30 bg-violet-500/[0.065] shadow-[0_12px_40px_rgba(124,58,237,0.08)]"
                                            : "border-white/[0.065] bg-[#0b1018]/70 hover:border-white/[0.11] hover:bg-[#0d131d]"
                                    }
                                `}
                            >
                                {/* Top line */}

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

                                <div className="p-4">
                                    {/* Card top */}

                                    <div className="flex items-start gap-3">
                                        {/* Checkbox */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleSelection(
                                                    material._id
                                                )
                                            }
                                            className={`
                                                mt-0.5
                                                flex
                                                h-6
                                                w-6
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                transition-all
                                                ${
                                                    isSelected
                                                        ? "border-violet-400 bg-violet-500 text-white shadow-[0_4px_15px_rgba(124,58,237,0.25)]"
                                                        : "border-white/[0.1] bg-black/20 text-transparent hover:border-violet-400/30 hover:bg-violet-500/[0.05]"
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

                                        <div
                                            className="
                                                relative
                                                flex
                                                h-11
                                                w-11
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-red-400/[0.08]
                                                bg-red-500/[0.07]
                                                text-red-400
                                            "
                                        >
                                            <FaFilePdf />

                                            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-400/70 ring-2 ring-[#0b1018]" />
                                        </div>

                                        {/* Details */}

                                        <div className="min-w-0 flex-1">
                                            <h3
                                                title={
                                                    material.name
                                                }
                                                className="
                                                    truncate
                                                    text-sm
                                                    font-bold
                                                    text-zinc-200
                                                "
                                            >
                                                {
                                                    material.name
                                                }
                                            </h3>

                                            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-zinc-600">
                                                <FaCalendarAlt className="text-[8px]" />

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
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}

                                    <div className="my-4 h-px bg-white/[0.045]" />

                                    {/* Actions */}

                                    <div className="flex gap-2">
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
                                                bg-violet-500/[0.07]
                                                px-3
                                                py-2.5
                                                text-[11px]
                                                font-bold
                                                text-violet-300
                                                transition-all
                                                hover:border-violet-400/20
                                                hover:bg-violet-500/[0.13]
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
                                                material._id
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
                                                bg-red-500/[0.035]
                                                text-red-400/80
                                                transition-all
                                                hover:border-red-400/20
                                                hover:bg-red-500/[0.1]
                                                hover:text-red-300
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                            aria-label="Delete material"
                                        >
                                            <FaTrash className="text-[10px]" />
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    }
                )}
            </div>

            {/* =====================================
                PDF VIEWER
            ===================================== */}

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
                            bg-black/85
                            p-2
                            backdrop-blur-md
                            sm:p-4
                            lg:p-6
                        "
                        onClick={closePdf}
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 16,
                                scale: 0.985,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 16,
                                scale: 0.985,
                            }}
                            transition={{
                                duration: 0.22,
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
                                bg-[#080b11]
                                shadow-[0_30px_100px_rgba(0,0,0,0.7)]
                            "
                        >
                            {/* Viewer Header */}

                            <div
                                className="
                                    flex
                                    min-h-[62px]
                                    shrink-0
                                    items-center
                                    gap-3
                                    border-b
                                    border-white/[0.06]
                                    bg-[#0b1018]
                                    px-3
                                    sm:px-5
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
                                        border
                                        border-red-400/[0.08]
                                        bg-red-500/[0.08]
                                        text-red-400
                                    "
                                >
                                    <FaFilePdf />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                                        Personal Material
                                    </p>

                                    <h2
                                        title={
                                            selectedMaterial.name
                                        }
                                        className="
                                            truncate
                                            text-xs
                                            font-bold
                                            text-zinc-200
                                            sm:text-sm
                                        "
                                    >
                                        {
                                            selectedMaterial.name
                                        }
                                    </h2>
                                </div>

                                {/* Open separately */}

                                <button
                                    type="button"
                                    onClick={
                                        openPdfSeparately
                                    }
                                    className="
                                        hidden
                                        h-10
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        px-3
                                        text-[10px]
                                        font-bold
                                        text-zinc-400
                                        transition-all
                                        hover:border-violet-400/20
                                        hover:bg-violet-500/[0.06]
                                        hover:text-violet-300
                                        sm:flex
                                    "
                                >
                                    <FaExpand className="text-[9px]" />
                                    Open separately
                                </button>

                                {/* Close */}

                                <button
                                    type="button"
                                    onClick={closePdf}
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        text-zinc-500
                                        transition-all
                                        hover:border-red-400/15
                                        hover:bg-red-500/[0.06]
                                        hover:text-red-300
                                    "
                                    aria-label="Close PDF viewer"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {/* PDF */}

                            <div className="relative min-h-0 flex-1 bg-[#1d1d1f]">
                                <iframe
                                    key={
                                        selectedMaterial._id
                                    }
                                    src={getPdfViewUrl(
                                        selectedMaterial
                                    )}
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

            {/* =====================================
                DELETE CONFIRMATION
            ===================================== */}

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
                            bg-black/75
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
                                y: 12,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 12,
                                scale: 0.96,
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
                                bg-[#0d1119]
                                shadow-[0_25px_80px_rgba(0,0,0,0.6)]
                            "
                        >
                            <div className="border-b border-white/[0.06] p-5">
                                <div
                                    className="
                                        mb-4
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-red-400/10
                                        bg-red-500/[0.08]
                                        text-red-400
                                    "
                                >
                                    <FaExclamationTriangle />
                                </div>

                                <h3 className="text-sm font-bold text-white">
                                    Delete material?
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-zinc-500">
                                    This will permanently
                                    delete{" "}
                                    <span className="font-semibold text-zinc-300">
                                        "{deleteTarget.name}"
                                    </span>
                                    .
                                </p>
                            </div>

                            <div className="flex gap-2 p-4">
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
                                        bg-white/[0.025]
                                        px-4
                                        py-2.5
                                        text-xs
                                        font-bold
                                        text-zinc-400
                                        transition
                                        hover:bg-white/[0.05]
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
                                        border
                                        border-red-400/10
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MaterialList;