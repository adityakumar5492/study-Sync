import {
    FaFilePdf,
    FaUpload,
    FaSearchPlus,
    FaSearchMinus,
    FaUndo,
    FaChevronLeft,
    FaChevronRight,
    FaTrash,
} from "react-icons/fa";

const PdfToolbar = ({
    pdfUrl,
    pdfName,
    pageNumber,
    pageInput,
    numPages,
    zoom,
    isHost,
    loading,
    deleting,

    // Follow Host
    followHost,
    onToggleFollowHost,

    // PDF controls
    onUpload,
    onDelete,
    onPreviousPage,
    onNextPage,
    onPageInputChange,
    onPageInputKeyDown,
    onGoToPage,
    onZoomOut,
    onZoomIn,
    onResetZoom,
}) => {
    return (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2">

            {/* ===========================
                PDF Information
            =========================== */}

            <div className="flex min-w-0 items-center gap-2">
                <FaFilePdf className="shrink-0 text-lg text-red-500" />

                <span
                    className="max-w-[220px] truncate text-sm font-medium text-white"
                    title={pdfName}
                >
                    {pdfUrl
                        ? pdfName
                        : "No PDF Loaded"}
                </span>
            </div>

            {/* ===========================
                Controls
            =========================== */}

            {pdfUrl && (
                <div className="flex flex-wrap items-center gap-3">

                    {/* Previous Page */}

                    <button
                        type="button"
                        onClick={onPreviousPage}
                        disabled={pageNumber === 1}
                        className="text-white transition hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Previous page"
                    >
                        <FaChevronLeft />
                    </button>

                    {/* Page Input */}

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="1"
                            max={numPages}
                            value={pageInput}
                            onChange={
                                onPageInputChange
                            }
                            onKeyDown={
                                onPageInputKeyDown
                            }
                            className="w-14 rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-center text-sm text-white outline-none focus:border-green-500"
                            aria-label="Page number"
                        />

                        <span className="text-sm text-slate-300">
                            / {numPages}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                onGoToPage(
                                    pageInput
                                )
                            }
                            className="rounded-md bg-green-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-green-600"
                        >
                            Go
                        </button>
                    </div>

                    {/* Next Page */}

                    <button
                        type="button"
                        onClick={onNextPage}
                        disabled={
                            pageNumber ===
                            numPages
                        }
                        className="text-white transition hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Next page"
                    >
                        <FaChevronRight />
                    </button>

                    {/* Zoom Out */}

                    <button
                        type="button"
                        onClick={onZoomOut}
                        className="text-white transition hover:text-green-400"
                        title="Zoom out"
                    >
                        <FaSearchMinus />
                    </button>

                    {/* Zoom */}

                    <span className="w-12 text-center text-sm text-slate-300">
                        {Math.round(
                            zoom * 100
                        )}
                        %
                    </span>

                    {/* Zoom In */}

                    <button
                        type="button"
                        onClick={onZoomIn}
                        className="text-white transition hover:text-green-400"
                        title="Zoom in"
                    >
                        <FaSearchPlus />
                    </button>

                    {/* Reset Zoom */}

                    <button
                        type="button"
                        onClick={onResetZoom}
                        className="text-white transition hover:text-green-400"
                        title="Fit to width"
                    >
                        <FaUndo />
                    </button>

                    {/* ===========================
                        Follow Host
                    =========================== */}

                    {!isHost && (
                        <button
                            type="button"
                            onClick={
                                onToggleFollowHost
                            }
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                followHost
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            }`}
                        >
                            {followHost
                                ? "Following Host"
                                : "Follow Host"}
                        </button>
                    )}

                    {/* ===========================
                        Host Controls
                    =========================== */}

                    {isHost && (
                        <>
                            <button
                                type="button"
                                onClick={onUpload}
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Replace PDF"
                            >
                                <FaUpload />
                                Replace
                            </button>

                            <button
                                type="button"
                                onClick={onDelete}
                                disabled={deleting}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Delete PDF"
                            >
                                <FaTrash />

                                {deleting
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default PdfToolbar;