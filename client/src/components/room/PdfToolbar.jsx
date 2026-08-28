import {
    FaFilePdf,
    FaUpload,
    FaSearchPlus,
    FaSearchMinus,
    FaUndo,
    FaChevronLeft,
    FaChevronRight,
    FaTrash,
    FaPlay,
    FaPause,
    FaCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
    /*
     * Responsive compact controls.
     *
     * Nothing related to PDF logic has been changed.
     * Only dimensions/spacing are reduced so the toolbar
     * can fit better on tablet/mobile screens.
     */
    const controlButton =
        "group relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 sm:h-8 sm:w-8";

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -8,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="
                relative
                z-40
                flex
                min-h-[54px]
                shrink-0
                flex-wrap
                items-center
                gap-2
                overflow-hidden
                border-b
                border-white/[0.07]
                bg-[#08080d]/95
                px-2
                py-2
                shadow-[0_12px_40px_rgba(0,0,0,.18)]
                backdrop-blur-2xl
                sm:min-h-[58px]
                sm:gap-2.5
                sm:px-3
                sm:py-2
                lg:min-h-[60px]
                lg:flex-nowrap
                lg:justify-between
                lg:px-4
            "
        >
            {/* ==========================================
                PREMIUM BACKGROUND
            ========================================== */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 80, 0],
                        opacity: [0.02, 0.06, 0.02],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -left-20 top-0 h-full w-72 bg-violet-500 blur-[80px]"
                />

                <motion.div
                    animate={{
                        x: [0, -70, 0],
                        opacity: [0.015, 0.045, 0.015],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -right-20 top-0 h-full w-64 bg-cyan-400 blur-[90px]"
                />

                <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            {/* ==========================================
                PDF INFORMATION
            ========================================== */}

            <motion.div
                whileHover={{
                    x: 2,
                }}
                className="
                    relative
                    flex
                    min-w-0
                    max-w-full
                    shrink
                    items-center
                    gap-2
                    sm:gap-2.5
                    lg:max-w-[35%]
                    lg:gap-3
                "
            >
                {/* PDF Icon */}

                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-red-400/10 bg-red-500/[0.07] sm:h-9 sm:w-9 sm:rounded-xl">
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.25, 0.5, 0.25],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                        }}
                        className="absolute inset-0 rounded-xl bg-red-500/10 blur-md"
                    />

                    <FaFilePdf className="relative text-xs text-red-400 sm:text-sm" />
                </div>

                {/* PDF Name */}

                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                        <span
                            className="
                                min-w-0
                                max-w-[150px]
                                truncate
                                text-[10px]
                                font-bold
                                tracking-tight
                                text-white
                                sm:max-w-[220px]
                                sm:text-xs
                                lg:max-w-[280px]
                            "
                            title={pdfName}
                        >
                            {pdfUrl ? pdfName : "No PDF Loaded"}
                        </span>

                        {pdfUrl && (
                            <motion.span
                                animate={{
                                    opacity: [0.45, 1, 0.45],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="
                                    hidden
                                    shrink-0
                                    items-center
                                    gap-1
                                    rounded-full
                                    border
                                    border-emerald-400/10
                                    bg-emerald-400/[0.06]
                                    px-1.5
                                    py-0.5
                                    text-[6px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-emerald-400
                                    sm:flex
                                    sm:px-2
                                    sm:text-[7px]
                                "
                            >
                                <FaCircle className="text-[3px] sm:text-[4px]" />
                                Live
                            </motion.span>
                        )}
                    </div>

                    {pdfUrl && (
                        <p className="mt-0.5 hidden text-[7px] text-zinc-600 sm:block sm:text-[8px]">
                            Collaborative study document
                        </p>
                    )}
                </div>
            </motion.div>

            {/* ==========================================
                CONTROLS
            ========================================== */}

            {pdfUrl && (
                <div
                    className="
                        relative
                        flex
                        min-w-0
                        max-w-full
                        flex-wrap
                        items-center
                        justify-start
                        gap-1.5
                        sm:gap-2
                        lg:flex-1
                        lg:justify-end
                    "
                >
                    {/* ==========================================
                        PAGE NAVIGATION
                    ========================================== */}

                    <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-0.5 sm:gap-1 sm:rounded-2xl sm:p-1">
                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={onPreviousPage}
                            disabled={pageNumber === 1}
                            className={controlButton}
                            title="Previous page"
                        >
                            <FaChevronLeft className="text-[8px] sm:text-[9px]" />
                        </motion.button>

                        <div className="flex items-center gap-1 px-0.5 sm:gap-1.5 sm:px-1">
                            <input
                                type="number"
                                min="1"
                                max={numPages}
                                value={pageInput}
                                onChange={onPageInputChange}
                                onKeyDown={onPageInputKeyDown}
                                className="
                                    h-7
                                    w-9
                                    rounded-md
                                    border
                                    border-white/[0.07]
                                    bg-black/30
                                    px-0.5
                                    text-center
                                    text-[10px]
                                    font-semibold
                                    text-white
                                    outline-none
                                    transition
                                    focus:border-violet-400/40
                                    focus:bg-violet-500/[0.04]
                                    sm:h-8
                                    sm:w-11
                                    sm:rounded-lg
                                    sm:px-1
                                    sm:text-[11px]
                                "
                                aria-label="Page number"
                            />

                            <span className="text-[8px] font-medium text-zinc-600 sm:text-[10px]">
                                / {numPages}
                            </span>

                            <motion.button
                                type="button"
                                whileHover={{
                                    scale: 1.05,
                                }}
                                whileTap={{
                                    scale: 0.95,
                                }}
                                onClick={() =>
                                    onGoToPage(pageInput)
                                }
                                className="
                                    h-7
                                    rounded-md
                                    bg-gradient-to-r
                                    from-violet-500
                                    to-cyan-400
                                    px-2
                                    text-[8px]
                                    font-black
                                    text-white
                                    shadow-[0_6px_20px_rgba(139,92,246,.18)]
                                    sm:h-8
                                    sm:rounded-lg
                                    sm:px-2.5
                                    sm:text-[9px]
                                "
                            >
                                Go
                            </motion.button>
                        </div>

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={onNextPage}
                            disabled={pageNumber === numPages}
                            className={controlButton}
                            title="Next page"
                        >
                            <FaChevronRight className="text-[8px] sm:text-[9px]" />
                        </motion.button>
                    </div>

                    {/* ==========================================
                        DIVIDER
                    ========================================== */}

                    <span className="hidden h-6 w-px bg-white/[0.07] xl:block" />

                    {/* ==========================================
                        ZOOM
                    ========================================== */}

                    <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-0.5 sm:gap-1 sm:rounded-2xl sm:p-1">
                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={onZoomOut}
                            className={controlButton}
                            title="Zoom out"
                        >
                            <FaSearchMinus className="text-[8px] sm:text-[9px]" />
                        </motion.button>

                        <motion.span
                            key={Math.round(zoom * 100)}
                            initial={{
                                opacity: 0,
                                y: -4,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="
                                w-9
                                text-center
                                text-[9px]
                                font-bold
                                text-zinc-400
                                sm:w-11
                                sm:text-[10px]
                            "
                        >
                            {Math.round(zoom * 100)}%
                        </motion.span>

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={onZoomIn}
                            className={controlButton}
                            title="Zoom in"
                        >
                            <FaSearchPlus className="text-[8px] sm:text-[9px]" />
                        </motion.button>

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                                rotate: -10,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={onResetZoom}
                            className={controlButton}
                            title="Fit to width"
                        >
                            <FaUndo className="text-[8px] sm:text-[9px]" />
                        </motion.button>
                    </div>

                    {/* ==========================================
                        FOLLOW HOST
                    ========================================== */}

                    {!isHost && (
                        <>
                            <span className="hidden h-6 w-px bg-white/[0.07] xl:block" />

                            <motion.button
                                type="button"
                                whileHover={{
                                    y: -1,
                                    scale: 1.02,
                                }}
                                whileTap={{
                                    scale: 0.97,
                                }}
                                onClick={onToggleFollowHost}
                                className={`
                                    relative
                                    flex
                                    h-8
                                    shrink-0
                                    items-center
                                    gap-1.5
                                    overflow-hidden
                                    rounded-lg
                                    border
                                    px-2
                                    text-[8px]
                                    font-bold
                                    transition-all
                                    sm:h-8
                                    sm:gap-2
                                    sm:rounded-xl
                                    sm:px-2.5
                                    sm:text-[9px]
                                    ${
                                        followHost
                                            ? "border-emerald-400/20 bg-emerald-500/[0.1] text-emerald-300 shadow-[0_6px_25px_rgba(16,185,129,.08)]"
                                            : "border-white/[0.07] bg-white/[0.035] text-zinc-400 hover:border-violet-400/20 hover:text-white"
                                    }
                                `}
                            >
                                {followHost ? (
                                    <>
                                        <motion.span
                                            animate={{
                                                scale: [1, 1.5, 1],
                                                opacity: [0.7, 0, 0.7],
                                            }}
                                            transition={{
                                                duration: 1.8,
                                                repeat: Infinity,
                                            }}
                                            className="absolute left-2 h-1.5 w-1.5 rounded-full bg-emerald-400 sm:left-2.5"
                                        />

                                        <span className="ml-2 sm:ml-3">
                                            Following Host
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FaPlay className="text-[7px]" />

                                        <span>
                                            Follow Host
                                        </span>
                                    </>
                                )}
                            </motion.button>
                        </>
                    )}

                    {/* ==========================================
                        HOST CONTROLS
                    ========================================== */}

                    {isHost && (
                        <>
                            <span className="hidden h-6 w-px bg-white/[0.07] xl:block" />

                            <motion.button
                                type="button"
                                whileHover={{
                                    y: -1,
                                    scale: 1.03,
                                }}
                                whileTap={{
                                    scale: 0.97,
                                }}
                                onClick={onUpload}
                                disabled={loading}
                                className="
                                    inline-flex
                                    h-8
                                    shrink-0
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-blue-400/15
                                    bg-blue-500/[0.09]
                                    px-2
                                    text-[8px]
                                    font-bold
                                    text-blue-300
                                    transition
                                    hover:border-blue-400/25
                                    hover:bg-blue-500/[0.15]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-30
                                    sm:gap-2
                                    sm:rounded-xl
                                    sm:px-2.5
                                    sm:text-[9px]
                                "
                                title="Replace PDF"
                            >
                                <motion.span
                                    animate={
                                        loading
                                            ? {
                                                  rotate: 360,
                                              }
                                            : {}
                                    }
                                    transition={{
                                        duration: 1,
                                        repeat: loading
                                            ? Infinity
                                            : 0,
                                        ease: "linear",
                                    }}
                                >
                                    <FaUpload className="text-[8px] sm:text-[9px]" />
                                </motion.span>

                                <span>
                                    {loading
                                        ? "Uploading..."
                                        : "Replace"}
                                </span>
                            </motion.button>

                            <motion.button
                                type="button"
                                whileHover={{
                                    y: -1,
                                    scale: 1.03,
                                }}
                                whileTap={{
                                    scale: 0.97,
                                }}
                                onClick={onDelete}
                                disabled={deleting}
                                className="
                                    inline-flex
                                    h-8
                                    shrink-0
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-red-400/15
                                    bg-red-500/[0.07]
                                    px-2
                                    text-[8px]
                                    font-bold
                                    text-red-300
                                    transition
                                    hover:border-red-400/25
                                    hover:bg-red-500/[0.13]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-30
                                    sm:gap-2
                                    sm:rounded-xl
                                    sm:px-2.5
                                    sm:text-[9px]
                                "
                                title="Delete PDF"
                            >
                                <motion.span
                                    animate={
                                        deleting
                                            ? {
                                                  rotate: [
                                                      0,
                                                      -8,
                                                      8,
                                                      0,
                                                  ],
                                              }
                                            : {}
                                    }
                                    transition={{
                                        duration: 0.5,
                                        repeat: deleting
                                            ? Infinity
                                            : 0,
                                    }}
                                >
                                    <FaTrash className="text-[8px] sm:text-[9px]" />
                                </motion.span>

                                <span>
                                    {deleting
                                        ? "Deleting..."
                                        : "Delete"}
                                </span>
                            </motion.button>
                        </>
                    )}
                </div>
            )}

            {/* ==========================================
                EMPTY PDF STATE
            ========================================== */}

            <AnimatePresence>
                {!pdfUrl && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        className="
                            relative
                            flex
                            min-w-0
                            max-w-full
                            items-center
                            gap-1.5
                            sm:gap-2
                        "
                    >
                        <span className="hidden text-[8px] text-zinc-600 xs:inline sm:text-[9px]">
                            No document loaded
                        </span>

                        {isHost && (
                            <motion.button
                                type="button"
                                whileHover={{
                                    scale: 1.04,
                                    y: -1,
                                }}
                                whileTap={{
                                    scale: 0.96,
                                }}
                                onClick={onUpload}
                                disabled={loading}
                                className="
                                    inline-flex
                                    h-8
                                    shrink-0
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    bg-gradient-to-r
                                    from-violet-500
                                    to-cyan-400
                                    px-2.5
                                    text-[8px]
                                    font-bold
                                    text-white
                                    shadow-[0_8px_25px_rgba(139,92,246,.18)]
                                    disabled:opacity-40
                                    sm:h-8
                                    sm:gap-2
                                    sm:rounded-xl
                                    sm:px-3
                                    sm:text-[9px]
                                "
                            >
                                <FaUpload className="text-[8px] sm:text-[9px]" />
                                Upload PDF
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom animated light */}

            <motion.div
                animate={{
                    x: ["-20%", "120%"],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="pointer-events-none absolute bottom-0 left-0 h-px w-1/4 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent blur-sm"
            />
        </motion.div>
    );
};

export default PdfToolbar;