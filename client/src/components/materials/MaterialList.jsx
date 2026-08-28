import { useEffect, useState } from "react";
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
    FaLayerGroup,
    FaChevronRight,
    FaCircleNotch,
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

    const [selectionMode, setSelectionMode] =
        useState(false);

    // =========================================
    // ESCAPE KEY
    // =========================================

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key !== "Escape") return;

            if (selectedMaterial) {
                setSelectedMaterial(null);
                return;
            }

            if (deleteTarget) {
                setDeleteTarget(null);
                return;
            }

            if (selectionMode) {
                cancelSelection();
            }
        };

        window.addEventListener(
            "keydown",
            handleEscape
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleEscape
            );
    }, [
        selectedMaterial,
        deleteTarget,
        selectionMode,
    ]);

    // =========================================
    // SELECTION MODE
    // =========================================

    const enterSelectionMode = (
        initialId = null
    ) => {
        setSelectionMode(true);

        if (initialId) {
            setSelectedIds([initialId]);
        }
    };

    const cancelSelection = () => {
        setSelectionMode(false);
        setSelectedIds([]);
    };

    const toggleSelection = (id) => {
        setSelectedIds((current) => {
            if (current.includes(id)) {
                return current.filter(
                    (item) => item !== id
                );
            }

            return [...current, id];
        });
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

    const allSelected =
        materials.length > 0 &&
        selectedIds.length ===
            materials.length;

    // =========================================
    // PDF VIEWER
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
    // SINGLE DELETE
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

            if (
                selectedIds.length <= 1
            ) {
                setSelectionMode(false);
            }

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
    // BULK DELETE
    // =========================================

    const openBulkDeleteConfirmation = () => {
        if (!selectedIds.length) return;

        setDeleteTarget({
            _id: "__bulk__",
            name: `${selectedIds.length} selected ${
                selectedIds.length === 1
                    ? "material"
                    : "materials"
            }`,
            isBulk: true,
        });
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
                `${data.deletedCount} ${
                    data.deletedCount === 1
                        ? "material"
                        : "materials"
                } deleted successfully.`
            );

            setDeleteTarget(null);
            setSelectedIds([]);
            setSelectionMode(false);

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
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.018] p-10 sm:p-14">
                <div className="mx-auto flex max-w-xs flex-col items-center text-center">
                    <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.07]">
                        <FaFilePdf className="text-xl text-violet-300" />

                        <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.7)]" />
                    </div>

                    <p className="text-sm font-bold text-zinc-300">
                        Loading your library
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                        Preparing your personal materials...
                    </p>
                </div>
            </div>
        );
    }

    // =========================================
    // EMPTY STATE
    // =========================================

    if (!materials?.length) {
        return (
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 py-16 text-center">
                <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-violet-500/[0.05] blur-3xl" />

                <div className="relative">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025] text-violet-300/70 shadow-xl">
                        <FaLayerGroup className="text-2xl" />
                    </div>

                    <h3 className="text-base font-bold text-zinc-300">
                        Your library is empty
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                        Upload your first PDF to start
                        building your personal study
                        library.
                    </p>
                </div>
            </div>
        );
    }

    // =========================================
    // MAIN UI
    // =========================================

    return (
        <>
            {/* =====================================
                HEADER
            ===================================== */}

            <div className="mb-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/[0.09] text-violet-300">
                                <FaLayerGroup className="text-xs" />
                            </div>

                            <h2 className="text-lg font-black tracking-tight text-white sm:text-xl">
                                Your Materials
                            </h2>

                            <span className="rounded-full border border-violet-400/10 bg-violet-500/[0.07] px-2.5 py-1 text-[10px] font-bold text-violet-300">
                                {materials.length}
                            </span>
                        </div>

                        <p className="mt-1.5 text-xs text-zinc-600">
                            Your private study library,
                            organized in one place.
                        </p>
                    </div>

                    {/* Desktop controls */}

                    {!selectionMode ? (
                        <button
                            type="button"
                            onClick={() =>
                                enterSelectionMode()
                            }
                            className="
                                group
                                flex
                                h-10
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-white/[0.07]
                                bg-white/[0.025]
                                px-4
                                text-[11px]
                                font-bold
                                text-zinc-400
                                transition-all
                                hover:border-violet-400/20
                                hover:bg-violet-500/[0.06]
                                hover:text-violet-300
                                sm:w-auto
                            "
                        >
                            <FaCheckCircle className="text-[10px] transition-transform group-hover:scale-110" />
                            Select materials
                        </button>
                    ) : (
                        <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-violet-400/10 bg-violet-500/[0.045] p-2 sm:w-auto">
                            <div className="flex h-8 items-center gap-2 rounded-lg px-2.5 text-[10px] font-bold text-violet-300">
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 text-[9px] text-white">
                                    {
                                        selectedIds.length
                                    }
                                </span>

                                selected
                            </div>

                            <button
                                type="button"
                                onClick={selectAll}
                                className="flex h-8 items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 text-[10px] font-bold text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
                            >
                                {allSelected ? (
                                    <FaCheckCircle />
                                ) : (
                                    <FaRegSquare />
                                )}

                                {allSelected
                                    ? "Unselect all"
                                    : "Select all"}
                            </button>

                            <button
                                type="button"
                                onClick={
                                    cancelSelection
                                }
                                className="flex h-8 items-center gap-2 rounded-lg border border-white/[0.06] px-3 text-[10px] font-bold text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-200"
                            >
                                <FaTimes />
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={
                                    selectedIds.length ===
                                    0
                                }
                                onClick={
                                    openBulkDeleteConfirmation
                                }
                                className="flex h-8 items-center gap-2 rounded-lg bg-red-500/90 px-3 text-[10px] font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FaTrash className="text-[9px]" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Selection information */}

                <AnimatePresence>
                    {selectionMode && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                height: 0,
                            }}
                            animate={{
                                opacity: 1,
                                height: "auto",
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                            }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.018] px-3 py-2.5 text-[10px] text-zinc-500">
                                <FaCheckCircle className="text-violet-400" />

                                Select the materials you
                                want to delete.
                                <span className="hidden text-zinc-700 sm:inline">
                                    •
                                </span>
                                <span className="hidden sm:inline">
                                    Click Cancel to exit
                                    selection mode.
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* =====================================
                MATERIAL GRID
            ===================================== */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
                                    y: 14,
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
                                            ? "border-violet-400/30 bg-violet-500/[0.065] shadow-[0_15px_50px_rgba(124,58,237,0.09)]"
                                            : "border-white/[0.06] bg-white/[0.018] hover:border-white/[0.11] hover:bg-white/[0.028]"
                                    }
                                `}
                            >
                                {/* Top highlight */}

                                <div
                                    className={`
                                        absolute
                                        inset-x-0
                                        top-0
                                        h-px
                                        ${
                                            isSelected
                                                ? "bg-violet-400/50"
                                                : "bg-gradient-to-r from-transparent via-white/[0.09] to-transparent"
                                        }
                                    `}
                                />

                                {/* Selected overlay */}

                                {selectionMode &&
                                    isSelected && (
                                        <div className="pointer-events-none absolute inset-0 bg-violet-500/[0.025]" />
                                    )}

                                <div className="relative p-4">
                                    {/* Card header */}

                                    <div className="flex items-start gap-3">
                                        {/* Selection checkbox */}

                                        <AnimatePresence>
                                            {selectionMode && (
                                                <motion.button
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.8,
                                                        width: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                        width: 24,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0.8,
                                                        width: 0,
                                                    }}
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
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        overflow-hidden
                                                        rounded-lg
                                                        border
                                                        transition-all
                                                        ${
                                                            isSelected
                                                                ? "border-violet-400 bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
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
                                                </motion.button>
                                            )}
                                        </AnimatePresence>

                                        {/* PDF icon */}

                                        <div
                                            className={`
                                                flex
                                                h-11
                                                w-11
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                transition-all
                                                ${
                                                    isSelected
                                                        ? "bg-violet-500/[0.12] text-violet-300 ring-1 ring-inset ring-violet-400/10"
                                                        : "bg-red-500/[0.07] text-red-400 ring-1 ring-inset ring-red-400/[0.06] group-hover:bg-red-500/[0.1]"
                                                }
                                            `}
                                        >
                                            <FaFilePdf />
                                        </div>

                                        {/* Name */}

                                        <div className="min-w-0 flex-1">
                                            <h3
                                                title={
                                                    material.name
                                                }
                                                className="truncate text-[13px] font-bold text-zinc-200"
                                            >
                                                {
                                                    material.name
                                                }
                                            </h3>

                                            <div className="mt-1.5 flex items-center gap-2">
                                                <span className="rounded-md bg-red-500/[0.06] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-400/70">
                                                    PDF
                                                </span>

                                                <span className="text-[10px] text-zinc-600">
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
                                                </span>
                                            </div>
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
                                                h-10
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
                                                text-[10px]
                                                font-bold
                                                text-violet-300
                                                transition-all
                                                hover:border-violet-400/20
                                                hover:bg-violet-500/[0.12]
                                                hover:text-violet-200
                                            "
                                        >
                                            <FaExternalLinkAlt className="text-[8px]" />
                                            View PDF

                                            <FaChevronRight className="ml-auto text-[7px] opacity-40" />
                                        </button>

                                        {!selectionMode && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    enterSelectionMode(
                                                        material._id
                                                    )
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
                                                    border-white/[0.06]
                                                    bg-white/[0.018]
                                                    text-zinc-500
                                                    transition-all
                                                    hover:border-red-400/20
                                                    hover:bg-red-500/[0.07]
                                                    hover:text-red-400
                                                "
                                                aria-label="Select material for deletion"
                                                title="Select for deletion"
                                            >
                                                <FaTrash className="text-[10px]" />
                                            </button>
                                        )}

                                        {selectionMode && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleSelection(
                                                        material._id
                                                    )
                                                }
                                                className={`
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    border
                                                    transition
                                                    ${
                                                        isSelected
                                                            ? "border-violet-400/20 bg-violet-500/[0.1] text-violet-300"
                                                            : "border-white/[0.06] bg-white/[0.018] text-zinc-600 hover:border-violet-400/20 hover:text-violet-300"
                                                    }
                                                `}
                                                aria-label={
                                                    isSelected
                                                        ? "Unselect material"
                                                        : "Select material"
                                                }
                                            >
                                                {isSelected ? (
                                                    <FaCheckCircle className="text-xs" />
                                                ) : (
                                                    <FaRegSquare className="text-xs" />
                                                )}
                                            </button>
                                        )}
                                    </div>
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
                            <div className="flex min-h-[60px] shrink-0 items-center gap-3 border-b border-white/[0.07] bg-[#0b0f17] px-3 sm:px-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/[0.09] text-red-400">
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
                                        className="truncate text-xs font-bold text-zinc-200 sm:text-sm"
                                    >
                                        {
                                            selectedMaterial.name
                                        }
                                    </h2>
                                </div>

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

                                <button
                                    type="button"
                                    onClick={closePdf}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-500 transition hover:border-red-400/15 hover:bg-red-500/[0.06] hover:text-red-300"
                                    aria-label="Close PDF viewer"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="relative min-h-0 flex-1 bg-[#1d1d1f]">
                                <iframe
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
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
                        onClick={() =>
                            !bulkDeleting &&
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
                            className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d1119] shadow-[0_25px_100px_rgba(0,0,0,0.6)]"
                        >
                            <div className="p-5 sm:p-6">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/10 bg-red-500/[0.08] text-red-400">
                                    <FaExclamationTriangle />
                                </div>

                                <h3 className="text-base font-bold text-white">
                                    {deleteTarget.isBulk
                                        ? "Delete selected materials?"
                                        : "Delete material?"}
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-zinc-500">
                                    {deleteTarget.isBulk ? (
                                        <>
                                            You are about
                                            to permanently
                                            delete{" "}
                                            <span className="font-bold text-zinc-300">
                                                {
                                                    selectedIds.length
                                                }{" "}
                                                {selectedIds.length ===
                                                1
                                                    ? "material"
                                                    : "materials"}
                                            </span>
                                            .
                                        </>
                                    ) : (
                                        <>
                                            This will
                                            permanently
                                            delete{" "}
                                            <span className="font-semibold text-zinc-300">
                                                "
                                                {
                                                    deleteTarget.name
                                                }
                                                "
                                            </span>
                                            .
                                        </>
                                    )}
                                </p>

                                <div className="mt-6 flex gap-2">
                                    <button
                                        type="button"
                                        disabled={
                                            bulkDeleting
                                        }
                                        onClick={() =>
                                            setDeleteTarget(
                                                null
                                            )
                                        }
                                        className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs font-bold text-zinc-400 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            bulkDeleting ||
                                            deletingId !==
                                                null
                                        }
                                        onClick={
                                            deleteTarget.isBulk
                                                ? handleBulkDelete
                                                : handleDelete
                                        }
                                        className="flex-1 rounded-xl border border-red-400/10 bg-red-500/90 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {bulkDeleting ||
                                        deletingId ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <FaCircleNotch className="animate-spin" />
                                                Deleting...
                                            </span>
                                        ) : (
                                            "Delete permanently"
                                        )}
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