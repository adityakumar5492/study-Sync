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
        } else {
            setSelectedIds(
                materials.map(
                    (material) =>
                        material._id
                )
            );
        }
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

        window.open(
            getPdfViewUrl(selectedMaterial),
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
                    rounded-2xl
                    border
                    border-white/[0.06]
                    bg-white/[0.018]
                    px-6
                    py-14
                    text-center
                "
            >
                <div
                    className="
                        mx-auto
                        mb-4
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        bg-violet-500/[0.08]
                        text-violet-300
                    "
                >
                    <FaFilePdf />
                </div>

                <p className="text-sm font-semibold text-zinc-400">
                    Loading your materials...
                </p>
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
                    rounded-2xl
                    border
                    border-dashed
                    border-white/[0.08]
                    bg-white/[0.015]
                    px-6
                    py-14
                    text-center
                "
            >
                <div
                    className="
                        mx-auto
                        mb-4
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-violet-500/[0.07]
                        text-violet-300/70
                    "
                >
                    <FaFilePdf className="text-xl" />
                </div>

                <h3 className="text-sm font-bold text-zinc-400">
                    No personal materials yet
                </h3>

                <p className="mt-1 text-xs text-zinc-600">
                    Upload your first PDF above to
                    start building your study library.
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
                SECTION HEADER
            ===================================== */}

            <div className="mb-5">
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >
                    <div>
                        <div className="flex items-center gap-2">
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
                                py-2
                                text-[10px]
                                font-bold
                                text-zinc-400
                                transition
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
                                        scale: 0.95,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.95,
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
                                        py-2
                                        text-[10px]
                                        font-bold
                                        text-red-400
                                        transition
                                        hover:bg-red-500/[0.14]
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
            </div>

            {/* =====================================
                MATERIAL CARDS
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
                            <motion.div
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
                                    duration: 0.35,
                                    delay:
                                        index *
                                        0.04,
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
                                            ? "border-violet-400/30 bg-violet-500/[0.07] shadow-[0_12px_40px_rgba(124,58,237,0.08)]"
                                            : "border-white/[0.065] bg-white/[0.022] hover:border-violet-400/15 hover:bg-white/[0.035]"
                                    }
                                `}
                            >
                                {/* Top accent */}

                                <div
                                    className={`
                                        absolute
                                        left-0
                                        right-0
                                        top-0
                                        h-px
                                        transition
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
                                            transition
                                            ${
                                                isSelected
                                                    ? "border-violet-400 bg-violet-500 text-white"
                                                    : "border-white/[0.1] bg-black/20 text-transparent hover:border-violet-400/30"
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
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-red-500/[0.08]
                                            text-red-400
                                            ring-1
                                            ring-inset
                                            ring-red-400/[0.06]
                                        "
                                    >
                                        <FaFilePdf />
                                    </div>

                                    {/* Info */}

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
                                            bg-red-500/[0.04]
                                            text-red-400/80
                                            transition
                                            hover:border-red-400/20
                                            hover:bg-red-500/[0.1]
                                            hover:text-red-300
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
                            bg-black/80
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
                                y: 12,
                                scale: 0.985,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 12,
                                scale: 0.985,
                            }}
                            transition={{
                                duration: 0.2,
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
                                shadow-[0_30px_100px_rgba(0,0,0,0.65)]
                            "
                        >
                            {/* Viewer Header */}

                            <div
                                className="
                                    flex
                                    min-h-[60px]
                                    shrink-0
                                    items-center
                                    gap-3
                                    border-b
                                    border-white/[0.07]
                                    bg-[#0b0f17]
                                    px-3
                                    sm:px-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-red-500/[0.09]
                                        text-red-400
                                    "
                                >
                                    <FaFilePdf className="text-sm" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-600">
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

                                {/* Desktop open separately */}

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
                                        transition
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
                                        transition
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

                            <div
                                className="
                                    relative
                                    min-h-0
                                    flex-1
                                    bg-[#1d1d1f]
                                "
                            >
                                <iframe
                                    src={getPdfViewUrl(
                                        selectedMaterial
                                    )}
                                    title={
                                        selectedMaterial.name
                                    }
                                    className="
                                        h-full
                                        w-full
                                        border-0
                                    "
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
                                y: 10,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 10,
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
                                shadow-[0_25px_80px_rgba(0,0,0,0.55)]
                            "
                        >
                            <div className="p-5">
                                <div
                                    className="
                                        mb-4
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
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
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MaterialList;