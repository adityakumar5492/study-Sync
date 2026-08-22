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
    const controlButton =
        "group relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25";

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
            className="relative z-40 flex min-h-[62px] shrink-0 flex-wrap items-center justify-between gap-3 overflow-hidden border-b border-white/[0.07] bg-[#08080d]/95 px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,.18)] backdrop-blur-2xl"
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
                        backgroundSize:
                            "32px 32px",
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
                className="relative flex min-w-0 items-center gap-3"
            >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-red-400/10 bg-red-500/[0.07]">
                    <motion.div
                        animate={{
                            scale: [
                                1,
                                1.15,
                                1,
                            ],
                            opacity: [
                                0.25,
                                0.5,
                                0.25,
                            ],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                        }}
                        className="absolute inset-0 rounded-xl bg-red-500/10 blur-md"
                    />

                    <FaFilePdf className="relative text-sm text-red-400" />
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span
                            className="max-w-[220px] truncate text-xs font-bold tracking-tight text-white sm:max-w-[280px]"
                            title={pdfName}
                        >
                            {pdfUrl
                                ? pdfName
                                : "No PDF Loaded"}
                        </span>

                        {pdfUrl && (
                            <motion.span
                                animate={{
                                    opacity: [
                                        0.45,
                                        1,
                                        0.45,
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="hidden items-center gap-1 rounded-full border border-emerald-400/10 bg-emerald-400/[0.06] px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-emerald-400 sm:flex"
                            >
                                <FaCircle className="text-[4px]" />
                                Live
                            </motion.span>
                        )}
                    </div>

                    {pdfUrl && (
                        <p className="mt-0.5 text-[8px] text-zinc-600">
                            Collaborative study document
                        </p>
                    )}
                </div>
            </motion.div>

            {/* ==========================================
                CONTROLS
            ========================================== */}

            {pdfUrl && (
                <div className="relative flex flex-wrap items-center gap-2">

                    {/* PAGE NAVIGATION */}

                    <div className="flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-1">
                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={
                                onPreviousPage
                            }
                            disabled={
                                pageNumber === 1
                            }
                            className={controlButton}
                            title="Previous page"
                        >
                            <FaChevronLeft className="text-[10px]" />
                        </motion.button>

                        <div className="flex items-center gap-1.5 px-1">
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
                                className="h-8 w-12 rounded-lg border border-white/[0.07] bg-black/30 px-1 text-center text-[11px] font-semibold text-white outline-none transition focus:border-violet-400/40 focus:bg-violet-500/[0.04]"
                                aria-label="Page number"
                            />

                            <span className="text-[10px] font-medium text-zinc-600">
                                /{" "}
                                {numPages}
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
                                    onGoToPage(
                                        pageInput
                                    )
                                }
                                className="h-8 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-400 px-2.5 text-[9px] font-black text-white shadow-[0_6px_20px_rgba(139,92,246,.18)]"
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
                            onClick={
                                onNextPage
                            }
                            disabled={
                                pageNumber ===
                                numPages
                            }
                            className={controlButton}
                            title="Next page"
                        >
                            <FaChevronRight className="text-[10px]" />
                        </motion.button>
                    </div>

                    {/* DIVIDER */}

                    <span className="hidden h-7 w-px bg-white/[0.07] lg:block" />

                    {/* ZOOM */}

                    <div className="flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-1">
                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={
                                onZoomOut
                            }
                            className={controlButton}
                            title="Zoom out"
                        >
                            <FaSearchMinus className="text-[10px]" />
                        </motion.button>

                        <motion.span
                            key={Math.round(
                                zoom * 100
                            )}
                            initial={{
                                opacity: 0,
                                y: -4,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="w-12 text-center text-[10px] font-bold text-zinc-400"
                        >
                            {Math.round(
                                zoom * 100
                            )}
                            %
                        </motion.span>

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={
                                onZoomIn
                            }
                            className={controlButton}
                            title="Zoom in"
                        >
                            <FaSearchPlus className="text-[10px]" />
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
                            onClick={
                                onResetZoom
                            }
                            className={controlButton}
                            title="Fit to width"
                        >
                            <FaUndo className="text-[10px]" />
                        </motion.button>
                    </div>

                    {/* ==========================================
                        FOLLOW HOST
                    ========================================== */}

                    {!isHost && (
                        <>
                            <span className="hidden h-7 w-px bg-white/[0.07] xl:block" />

                            <motion.button
                                type="button"
                                whileHover={{
                                    y: -1,
                                    scale: 1.02,
                                }}
                                whileTap={{
                                    scale: 0.97,
                                }}
                                onClick={
                                    onToggleFollowHost
                                }
                                className={`relative flex h-9 items-center gap-2 overflow-hidden rounded-xl border px-3 text-[9px] font-bold transition-all ${
                                    followHost
                                        ? "border-emerald-400/20 bg-emerald-500/[0.1] text-emerald-300 shadow-[0_6px_25px_rgba(16,185,129,.08)]"
                                        : "border-white/[0.07] bg-white/[0.035] text-zinc-400 hover:border-violet-400/20 hover:text-white"
                                }`}
                            >
                                {followHost ? (
                                    <>
                                        <motion.span
                                            animate={{
                                                scale: [
                                                    1,
                                                    1.5,
                                                    1,
                                                ],
                                                opacity: [
                                                    0.7,
                                                    0,
                                                    0.7,
                                                ],
                                            }}
                                            transition={{
                                                duration: 1.8,
                                                repeat: Infinity,
                                            }}
                                            className="absolute left-3 h-1.5 w-1.5 rounded-full bg-emerald-400"
                                        />

                                        <span className="ml-3">
                                            Following Host
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FaPlay className="text-[8px]" />
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
                            <span className="hidden h-7 w-px bg-white/[0.07] xl:block" />

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
                                className="inline-flex h-9 items-center gap-2 rounded-xl border border-blue-400/15 bg-blue-500/[0.09] px-3 text-[9px] font-bold text-blue-300 transition hover:border-blue-400/25 hover:bg-blue-500/[0.15] disabled:cursor-not-allowed disabled:opacity-30"
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
                                    <FaUpload />
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
                                className="inline-flex h-9 items-center gap-2 rounded-xl border border-red-400/15 bg-red-500/[0.07] px-3 text-[9px] font-bold text-red-300 transition hover:border-red-400/25 hover:bg-red-500/[0.13] disabled:cursor-not-allowed disabled:opacity-30"
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
                                    <FaTrash />
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
                        className="relative flex items-center gap-2"
                    >
                        <span className="text-[9px] text-zinc-600">
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
                                className="inline-flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-3 text-[9px] font-bold text-white shadow-[0_8px_25px_rgba(139,92,246,.18)] disabled:opacity-40"
                            >
                                <FaUpload />
                                Upload PDF
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom animated light */}
            <motion.div
                animate={{
                    x: [
                        "-20%",
                        "120%",
                    ],
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