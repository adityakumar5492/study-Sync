import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import {
    FaFilePdf,
    FaUpload,
    FaChevronDown,
    FaUsers,
    FaBookOpen,
    FaCircle,

} from "react-icons/fa";

import {
    useAppDispatch,
    useAppSelector,
} from "../../redux/hooks";

import {
    uploadRoomPdfThunk,
    deleteRoomPdfThunk,
    getRoomThunk,
} from "../../redux/room/roomThunk";

import PdfAnnotationLayer from "./PdfAnnotationLayer";
import PdfToolbar from "./PdfToolbar";

import socket from "../../socket/socket";

import {
    Document,
    Page,
    pdfjs,
} from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
    new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
    ).toString();

const PdfViewer = ({
    roomId,
    room,
    currentUser,
    drawingPermission:
        externalDrawingPermission,
}) => {
    const dispatch = useAppDispatch();

    const {
        currentRoom,
        loading,
    } = useAppSelector(
        (state) => state.room
    );

    // ===========================
    // Host
    // ===========================

    const hostId =
        typeof room?.host === "object"
            ? room.host?._id?.toString()
            : room?.host?.toString();

    const currentUserId =
        currentUser?._id?.toString();

    const isHost =
        hostId === currentUserId;

    // ===========================
    // Refs
    // ===========================

    const fileInputRef =
        useRef(null);

    const measureRef =
        useRef(null);

    const viewerRef =
        useRef(null);

    const toolbarLayerRef =
        useRef(null);

    // ===========================
    // PDF State
    // ===========================

    const [pdfUrl, setPdfUrl] =
        useState("");

    const [pdfName, setPdfName] =
        useState("");

    const [numPages, setNumPages] =
        useState(0);

    const [pageNumber, setPageNumber] =
        useState(1);

    const [pageInput, setPageInput] =
        useState("1");

    const activeDrawingPermission =
        externalDrawingPermission || {
            mode: "everyone",
            allowedUsers: [],
        };

    const canDraw =
        isHost ||
        activeDrawingPermission.mode ===
            "everyone" ||
        (
            activeDrawingPermission.mode ===
                "selected" &&
            activeDrawingPermission.allowedUsers.includes(
                currentUserId
            )
        );

    // ===========================
    // Follow Host
    // ===========================

    const [followHost, setFollowHost] =
        useState(() => {
            return (
                sessionStorage.getItem(
                    `studysync-follow-host-${roomId}`
                ) !== "false"
            );
        });

    useEffect(() => {
        sessionStorage.setItem(
            `studysync-follow-host-${roomId}`,
            String(followHost)
        );
    }, [roomId, followHost]);

    useEffect(() => {
        if (!roomId || isHost) return;

        const handleHostPageChange = ({
            pageNumber,
        }) => {
            if (!followHost) return;

            setPageNumber(pageNumber);
            setPageInput(
                String(pageNumber)
            );
        };

        socket.on(
            "pdf:host-page-change",
            handleHostPageChange
        );

        return () => {
            socket.off(
                "pdf:host-page-change",
                handleHostPageChange
            );
        };
    }, [
        roomId,
        isHost,
        followHost,
    ]);

    // ===========================
    // Current Page Sync
    // ===========================

    useEffect(() => {
        if (!roomId) return;

        const handleCurrentPage = ({
            pageNumber,
        }) => {
            if (
                typeof pageNumber !==
                    "number" ||
                pageNumber < 1
            ) {
                return;
            }

            setPageNumber(pageNumber);
            setPageInput(
                String(pageNumber)
            );
        };

        socket.on(
            "pdf:current-page",
            handleCurrentPage
        );

        const requestCurrentPage = () => {
            socket.emit(
                "pdf:request-current-page",
                {
                    roomId,
                }
            );
        };

        if (socket.connected) {
            requestCurrentPage();
        } else {
            socket.once(
                "connect",
                requestCurrentPage
            );
        }

        return () => {
            socket.off(
                "pdf:current-page",
                handleCurrentPage
            );

            socket.off(
                "connect",
                requestCurrentPage
            );
        };
    }, [roomId]);

    // ===========================
    // PDF Replacement Sync
    // ===========================

    useEffect(() => {
        if (!roomId) return;

        const handlePdfUpdated = ({
            pdfUrl,
        }) => {
            if (!pdfUrl) return;

            const newUrl =
                `${import.meta.env.VITE_API_URL}${pdfUrl}`;

            setPdfUrl(newUrl);

            setPdfName(
                pdfUrl
                    .split("/")
                    .pop()
            );

            setPageNumber(1);
            setPageInput("1");
            setNumPages(0);

            setZoom(1);
            setRenderZoom(1);

            if (viewerRef.current) {
                viewerRef.current.scrollTop = 0;
            }
        };

        socket.on(
            "pdf:updated",
            handlePdfUpdated
        );

        return () => {
            socket.off(
                "pdf:updated",
                handlePdfUpdated
            );
        };
    }, [roomId]);
    // ===========================
// PDF Delete Sync
// ===========================

useEffect(() => {
    if (!roomId) return;

    const handlePdfDeleted = () => {
        setPdfUrl("");
        setPdfName("");

        setPageNumber(1);
        setPageInput("1");
        setNumPages(0);

        setZoom(1);
        setRenderZoom(1);

        if (viewerRef.current) {
            viewerRef.current.scrollTop = 0;
        }

        dispatch(getRoomThunk(roomId));
    };

    socket.on(
        "pdf:deleted",
        handlePdfDeleted
    );

    return () => {
        socket.off(
            "pdf:deleted",
            handlePdfDeleted
        );
    };
}, [roomId, dispatch]);

    // ===========================
    // Zoom
    // ===========================

    const [zoom, setZoom] =
        useState(1);

    const [renderZoom, setRenderZoom] =
        useState(1);

    const zoomCommitTimeoutRef =
        useRef(null);

    useEffect(() => {
        if (
            zoomCommitTimeoutRef.current
        ) {
            clearTimeout(
                zoomCommitTimeoutRef.current
            );
        }

        zoomCommitTimeoutRef.current =
            setTimeout(() => {
                setRenderZoom(zoom);
            }, 150);

        return () => {
            if (
                zoomCommitTimeoutRef.current
            ) {
                clearTimeout(
                    zoomCommitTimeoutRef.current
                );
            }
        };
    }, [zoom]);

    // ===========================
    // Touchpad Pinch Zoom
    // ===========================

    useEffect(() => {
        const element =
            viewerRef.current;

        if (!element) return;

        let accumulatedDelta = 0;

        const handleWheel = (e) => {
            if (!e.ctrlKey) return;

            e.preventDefault();

            accumulatedDelta += e.deltaY;

            if (
                Math.abs(
                    accumulatedDelta
                ) < 8
            ) {
                return;
            }

            const direction =
                accumulatedDelta > 0
                    ? -1
                    : 1;

            accumulatedDelta = 0;

            setZoom((currentZoom) => {
                const nextZoom =
                    currentZoom +
                    direction * 0.02;

                return Number(
                    Math.min(
                        3,
                        Math.max(
                            0.5,
                            nextZoom
                        )
                    ).toFixed(2)
                );
            });
        };

        element.addEventListener(
            "wheel",
            handleWheel,
            {
                passive: false,
            }
        );

        return () => {
            element.removeEventListener(
                "wheel",
                handleWheel
            );
        };
    }, []);

    // ===========================
    // Host Scroll Sync
    // ===========================

    useEffect(() => {
        if (!roomId || !isHost) return;

        const element =
            viewerRef.current;

        if (!element) return;

        let throttleTimer = null;

        const handleScroll = () => {
            if (throttleTimer) return;

            throttleTimer =
                setTimeout(() => {
                    throttleTimer = null;

                    const maxScroll =
                        element.scrollHeight -
                        element.clientHeight;

                    const scrollPercent =
                        maxScroll > 0
                            ? element.scrollTop /
                              maxScroll
                            : 0;

                    socket.emit(
                        "pdf:host-scroll",
                        {
                            roomId,
                            scrollPercent,
                            isHost,
                        }
                    );
                }, 150);
        };

        element.addEventListener(
            "scroll",
            handleScroll
        );

        return () => {
            element.removeEventListener(
                "scroll",
                handleScroll
            );

            if (throttleTimer) {
                clearTimeout(
                    throttleTimer
                );
            }
        };
    }, [
        roomId,
        isHost,
    ]);

    // ===========================
    // Receive Host Scroll
    // ===========================

    useEffect(() => {
        if (!roomId || isHost) return;

        const handleHostScrollChange = ({
            scrollPercent,
        }) => {
            if (!followHost) return;

            if (
                typeof scrollPercent !==
                "number"
            ) {
                return;
            }

            const element =
                viewerRef.current;

            if (!element) return;

            const maxScroll =
                element.scrollHeight -
                element.clientHeight;

            element.scrollTop =
                maxScroll *
                scrollPercent;
        };

        socket.on(
            "pdf:host-scroll-change",
            handleHostScrollChange
        );

        return () => {
            socket.off(
                "pdf:host-scroll-change",
                handleHostScrollChange
            );
        };
    }, [
        roomId,
        isHost,
        followHost,
    ]);

    const [deleting, setDeleting] =
        useState(false);

    const [viewerWidth, setViewerWidth] =
        useState(0);

    // ===========================
    // Measure Workspace
    // ===========================

    useEffect(() => {
        const element =
            measureRef.current;

        if (!element) return;

        const updateWidth = () => {
            const width =
                element.clientWidth;

            setViewerWidth(
                Math.max(300, width)
            );
        };

        updateWidth();

        const resizeObserver =
            new ResizeObserver(
                updateWidth
            );

        resizeObserver.observe(
            element
        );

        window.addEventListener(
            "resize",
            updateWidth
        );

        return () => {
            resizeObserver.disconnect();

            window.removeEventListener(
                "resize",
                updateWidth
            );
        };
    }, []);

    // ===========================
    // Load PDF
    // ===========================

    useEffect(() => {
        if (currentRoom?.pdfUrl) {
           const url = currentRoom.pdfUrl.startsWith("http")
                ? currentRoom.pdfUrl
                : `${import.meta.env.VITE_API_URL}${currentRoom.pdfUrl}`;
                console.log("PDF URL:", url);
            setPdfUrl(url);

            setPdfName(
                currentRoom.pdfUrl
                    .split("/")
                    .pop()
            );

            setZoom(1);
            setRenderZoom(1);
        } else {
            setPdfUrl("");
            setPdfName("");

            setPageNumber(1);
            setPageInput("1");

            setNumPages(0);

            setZoom(1);
            setRenderZoom(1);
        }
    }, [currentRoom]);

    // ===========================
    // Upload
    // ===========================

    const handleUploadClick = () => {
        if (!isHost) {
            toast.error(
                "Only the host can upload study material."
            );
            return;
        }

        fileInputRef.current?.click();
    };

    const handlePdfChange = async (
        e
    ) => {
        const file =
            e.target.files?.[0];

        if (!file) return;

        if (!isHost) {
            toast.error(
                "Only the host can upload study material."
            );
            return;
        }

        if (!roomId) {
            toast.error(
                "Room not found."
            );
            return;
        }

        if (
            file.type !==
            "application/pdf"
        ) {
            toast.error(
                "Please upload a PDF file."
            );
            return;
        }

        try {
            const formData =
                new FormData();

            formData.append(
                "pdf",
                file
            );

            const result =
                await dispatch(
                    uploadRoomPdfThunk({
                        roomId,
                        formData,
                    })
                ).unwrap();

            const uploadedPdfUrl =
                result?.room?.pdfUrl;

            if (uploadedPdfUrl) {
                socket.emit(
                    "pdf:updated",
                    {
                        roomId,
                        pdfUrl:
                            uploadedPdfUrl,
                    }
                );
            }

            toast.success(
                pdfUrl
                    ? "PDF replaced successfully."
                    : "PDF uploaded successfully."
            );

            setPageNumber(1);
            setPageInput("1");
            setZoom(1);
            setRenderZoom(1);

            if (isHost) {
                socket.emit(
                    "pdf:page-change",
                    {
                        roomId,
                        pageNumber: 1,
                        isHost,
                    }
                );
            }

            if (
                fileInputRef.current
            ) {
                fileInputRef.current.value =
                    "";
            }
        } catch (err) {
            toast.error(
                err?.message ||
                    "Failed to upload PDF."
            );
        }
    };

    // ===========================
    // Delete
    // ===========================

   const handleDeletePdf = async () => {
    if (!isHost) {
        toast.error(
            "Only the host can delete study material."
        );
        return;
    }

    if (!roomId) {
        toast.error(
            "Room not found."
        );
        return;
    }

    toast.custom(
        (t) => (
            <div className="w-[360px] rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
                <div className="mb-3">
                    <h3 className="text-base font-semibold text-white">
                        Delete PDF?
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                        This will remove the shared PDF for everyone
                        in this room.
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => toast.dismiss(t.id)}
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={deleting}
                        onClick={async () => {
                            try {
                                setDeleting(true);

                                await dispatch(
                                    deleteRoomPdfThunk(roomId)
                                ).unwrap();

                                socket.emit(
                                    "pdf:deleted",
                                    {
                                        roomId,
                                    }
                                );

                                setPdfUrl("");
                                setPdfName("");
                                setPageNumber(1);
                                setPageInput("1");
                                setNumPages(0);
                                setZoom(1);
                                setRenderZoom(1);

                                toast.dismiss(t.id);

                                toast.success(
                                    "PDF deleted successfully."
                                );
                            } catch (err) {
                                toast.error(
                                    err?.message ||
                                        "Failed to delete PDF."
                                );
                            } finally {
                                setDeleting(false);
                            }
                        }}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        ),
        {
            duration: Infinity,
        }
    );
};

    // ===========================
    // Document Loaded
    // ===========================

    const onDocumentLoadSuccess = ({
        numPages,
    }) => {
        setNumPages(numPages);
    };

    // ===========================
    // Page Navigation
    // ===========================

    const goToPage = (page) => {
        const pageValue =
            Number(page);

        if (
            !Number.isInteger(
                pageValue
            )
        ) {
            toast.error(
                "Enter a valid page number."
            );

            setPageInput(
                String(pageNumber)
            );

            return;
        }

        if (
            pageValue < 1 ||
            pageValue > numPages
        ) {
            toast.error(
                `Enter a page between 1 and ${numPages}.`
            );

            setPageInput(
                String(pageNumber)
            );

            return;
        }

        setPageNumber(
            pageValue
        );

        setPageInput(
            String(pageValue)
        );

        if (isHost) {
            socket.emit(
                "pdf:page-change",
                {
                    roomId,
                    pageNumber:
                        pageValue,
                    isHost,
                }
            );
        }
    };

    const handlePageInputChange =
        (e) => {
            setPageInput(
                e.target.value
            );
        };

    const handlePageInputKeyDown =
        (e) => {
            if (e.key === "Enter") {
                goToPage(pageInput);
            }
        };

    const handlePreviousPage =
        () => {
            if (pageNumber > 1) {
                const newPage =
                    pageNumber - 1;

                setPageNumber(
                    newPage
                );

                setPageInput(
                    String(newPage)
                );

                if (isHost) {
                    socket.emit(
                        "pdf:page-change",
                        {
                            roomId,
                            pageNumber:
                                newPage,
                            isHost,
                        }
                    );
                }
            }
        };

    const handleNextPage = () => {
        if (
            pageNumber <
            numPages
        ) {
            const newPage =
                pageNumber + 1;

            setPageNumber(
                newPage
            );

            setPageInput(
                String(newPage)
            );

            if (isHost) {
                socket.emit(
                    "pdf:page-change",
                    {
                        roomId,
                        pageNumber:
                            newPage,
                        isHost,
                    }
                );
            }
        }
    };

    // ===========================
    // Keyboard Navigation
    // ===========================

    useEffect(() => {
        if (!pdfUrl) return;

        const handleKeyboardScroll =
            (e) => {
                const target =
                    e.target;

                if (
                    target instanceof
                        HTMLInputElement ||
                    target instanceof
                        HTMLTextAreaElement ||
                    target instanceof
                        HTMLButtonElement ||
                    target.isContentEditable
                ) {
                    return;
                }

                const viewer =
                    viewerRef.current;

                if (!viewer) return;

                if (
                    e.key ===
                    "ArrowUp"
                ) {
                    e.preventDefault();

                    viewer.scrollBy({
                        top: -150,
                        behavior:
                            "smooth",
                    });

                    return;
                }

                if (
                    e.key ===
                    "ArrowDown"
                ) {
                    e.preventDefault();

                    viewer.scrollBy({
                        top: 150,
                        behavior:
                            "smooth",
                    });

                    return;
                }

                if (
                    e.key ===
                        "ArrowLeft" ||
                    e.key ===
                        "PageUp"
                ) {
                    e.preventDefault();

                    handlePreviousPage();

                    return;
                }

                if (
                    e.key ===
                        "ArrowRight" ||
                    e.key ===
                        "PageDown"
                ) {
                    e.preventDefault();

                    handleNextPage();

                    return;
                }

                if (
                    e.key === "Home"
                ) {
                    e.preventDefault();

                    goToPage(1);

                    return;
                }

                if (
                    e.key === "End"
                ) {
                    e.preventDefault();

                    goToPage(numPages);
                }
            };

        window.addEventListener(
            "keydown",
            handleKeyboardScroll
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyboardScroll
            );
        };
    }, [
        pdfUrl,
        numPages,
        pageNumber,
    ]);

    // ===========================
    // Calculated Width
    // ===========================

    const pdfWidth =
        viewerWidth > 0
            ? Math.max(
                  300,
                  viewerWidth *
                      renderZoom
              )
            : undefined;

    const liveScale =
        renderZoom > 0
            ? zoom / renderZoom
            : 1;

    // ===========================
    // RENDER
    // ===========================

    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.985,
            }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            transition={{
                duration: 0.45,
                ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                ],
            }}
            className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#050509] shadow-[0_30px_100px_rgba(0,0,0,.35)]"
        >
            {/* ==========================================
                AMBIENT BACKGROUND
            ========================================== */}

            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [
                            "-10%",
                            "20%",
                            "-10%",
                        ],
                        y: [
                            "0%",
                            "8%",
                            "0%",
                        ],
                        scale: [
                            1,
                            1.15,
                            1,
                        ],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/[0.035] blur-[120px]"
                />

                <motion.div
                    animate={{
                        x: [
                            "10%",
                            "-15%",
                            "10%",
                        ],
                        y: [
                            "0%",
                            "-8%",
                            "0%",
                        ],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-cyan-500/[0.025] blur-[120px]"
                />

                <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
                        backgroundSize:
                            "26px 26px",
                    }}
                />
            </div>

            {/* ==========================================
                FILE INPUT
            ========================================== */}

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                hidden
                onChange={
                    handlePdfChange
                }
            />

            {/* ==========================================
                TOOLBAR
            ========================================== */}

            <div className="relative z-50">
                <PdfToolbar
                    pdfUrl={pdfUrl}
                    pdfName={pdfName}
                    pageNumber={pageNumber}
                    pageInput={pageInput}
                    numPages={numPages}
                    zoom={zoom}
                    isHost={isHost}
                    loading={loading}
                    deleting={deleting}
                    followHost={
                        followHost
                    }
                    onToggleFollowHost={() => {
                        setFollowHost(
                            (prev) => {
                                const next =
                                    !prev;

                                if (next) {
                                    socket.emit(
                                        "pdf:request-current-page",
                                        {
                                            roomId,
                                        }
                                    );
                                }

                                return next;
                            }
                        );
                    }}
                    onUpload={
                        handleUploadClick
                    }
                    onDelete={
                        handleDeletePdf
                    }
                    onPreviousPage={
                        handlePreviousPage
                    }
                    onNextPage={
                        handleNextPage
                    }
                    onPageInputChange={
                        handlePageInputChange
                    }
                    onPageInputKeyDown={
                        handlePageInputKeyDown
                    }
                    onGoToPage={
                        goToPage
                    }
                    onZoomOut={() =>
                        setZoom((z) =>
                            Math.max(
                                0.5,
                                z - 0.1
                            )
                        )
                    }
                    onZoomIn={() =>
                        setZoom((z) =>
                            Math.min(
                                3,
                                z + 0.1
                            )
                        )
                    }
                    onResetZoom={() =>
                        setZoom(1)
                    }
                />
            </div>

            {/* ==========================================
                PDF WORKSPACE
            ========================================== */}

            <div
                ref={measureRef}
                className="relative min-h-0 flex-1 overflow-hidden bg-[#030306]"
            >
                {/* Animated top glow */}

                <motion.div
                    animate={{
                        x: [
                            "-30%",
                            "130%",
                        ],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="pointer-events-none absolute left-0 top-0 z-30 h-px w-1/3 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent blur-sm"
                />

                {/* ======================================
                    SCROLL AREA
                ====================================== */}

                <div
                    ref={viewerRef}
                    className="absolute inset-0 overflow-auto bg-[#030306] p-2 sm:p-3 md:p-4 lg:p-5"
                    style={{
                        overscrollBehavior:
                            "contain",
                        scrollbarWidth:
                            "thin",
                    }}
                >
                    {pdfUrl ? (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 12,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.5,
                            }}
                            className="flex min-w-full justify-center py-3 sm:py-5 md:py-7"
                        >
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={
                                    onDocumentLoadSuccess
                                }
                                loading={
                                    <div className="flex min-h-[400px] items-center justify-center">
                                        <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] px-10 py-12 text-center shadow-2xl backdrop-blur-xl">
                                            <motion.div
                                                animate={{
                                                    rotate: 360,
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                className="mx-auto mb-5 h-10 w-10 rounded-full border-2 border-white/10 border-t-violet-400"
                                            />

                                            <p className="text-sm font-semibold text-zinc-300">
                                                Loading document
                                            </p>

                                            <p className="mt-1 text-[10px] text-zinc-600">
                                                Preparing your collaborative workspace
                                            </p>
                                        </div>
                                    </div>
                                }
                                error={
                                    <div className="flex min-h-[400px] items-center justify-center">
                                        <div className="rounded-3xl border border-red-400/10 bg-red-500/[0.04] px-10 py-12 text-center">
                                            <FaFilePdf className="mx-auto mb-4 text-4xl text-red-400/70" />

                                            <p className="text-sm font-bold text-red-300">
                                                Failed to load PDF
                                            </p>

                                            <p className="mt-1 text-[10px] text-zinc-600">
                                                Check the document and try again.
                                            </p>
                                        </div>
                                    </div>
                                }
                            >
                                {pdfWidth && (
                                    <motion.div
                                        animate={{
                                            scale:
                                                liveScale,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 180,
                                            damping: 24,
                                            mass: 0.45,
                                        }}
                                        style={{
                                            transformOrigin:
                                                "top center",
                                        }}
                                    >
                                        <div
                                            className="relative overflow-hidden rounded-sm shadow-[0_35px_100px_rgba(0,0,0,.55)]"
                                            style={{
                                                width: pdfWidth,
                                            }}
                                        >
                                            {/* PDF Page */}

                                            <Page
                                                pageNumber={
                                                    pageNumber
                                                }
                                                width={
                                                    pdfWidth
                                                }
                                            />

                                            {/* Annotation layer */}

                                            <PdfAnnotationLayer
                                                roomId={
                                                    roomId
                                                }
                                                pageNumber={
                                                    pageNumber
                                                }
                                                containerRef={
                                                    toolbarLayerRef
                                                }
                                                enabled={
                                                    canDraw
                                                }
                                                canDraw={
                                                    canDraw
                                                }
                                                currentUser={
                                                    currentUser
                                                }
                                                isHost={
                                                    isHost
                                                }
                                            />

                                            {/* Page edge glow */}

                                            <div className="pointer-events-none absolute inset-0 border border-black/10" />

                                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/[0.04] to-transparent" />
                                        </div>
                                    </motion.div>
                                )}
                            </Document>
                        </motion.div>
                    ) : (
                        /* ==================================
                           EMPTY STATE
                        ================================== */

                        <div className="flex h-full min-h-[500px] items-center justify-center px-4 py-10">
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 25,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    duration: 0.6,
                                }}
                                className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/[0.07] bg-white/[0.025] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,.3)] backdrop-blur-2xl sm:p-12"
                            >
                                {/* Decorative glow */}

                                <motion.div
                                    animate={{
                                        scale: [
                                            1,
                                            1.15,
                                            1,
                                        ],
                                        opacity: [
                                            0.15,
                                            0.3,
                                            0.15,
                                        ],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                    }}
                                    className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-violet-500/20 blur-[80px]"
                                />

                                <div className="relative">
                                    <motion.div
                                        animate={{
                                            y: [
                                                0,
                                                -8,
                                                0,
                                            ],
                                            rotate: [
                                                0,
                                                2,
                                                -2,
                                                0,
                                            ],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-red-400/10 bg-gradient-to-br from-red-500/[0.1] to-violet-500/[0.06] shadow-[0_20px_60px_rgba(239,68,68,.08)]"
                                    >
                                        <FaFilePdf className="text-4xl text-red-400/80" />
                                    </motion.div>

                                    <div className="mt-7">
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/10 bg-violet-500/[0.05] px-3 py-1.5">
                                            <FaBookOpen className="text-[8px] text-violet-300" />

                                            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-violet-300/70">
                                                Collaborative workspace
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                            No PDF Loaded
                                        </h2>

                                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
                                            Upload a study document and turn this room into a shared workspace where everyone can read, annotate and learn together.
                                        </p>
                                    </div>

                                    {/* Feature pills */}

                                    <div className="mt-7 flex flex-wrap justify-center gap-2">
                                        {[
                                            "Live annotations",
                                            "Page sync",
                                            "Study together",
                                        ].map(
                                            (
                                                feature,
                                                index
                                            ) => (
                                                <motion.div
                                                    key={
                                                        feature
                                                    }
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            0.15 +
                                                            index *
                                                                0.08,
                                                    }}
                                                    className="rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[9px] font-medium text-zinc-600"
                                                >
                                                    {feature}
                                                </motion.div>
                                            )
                                        )}
                                    </div>

                                    {isHost ? (
                                        <motion.button
                                            type="button"
                                            disabled={
                                                loading
                                            }
                                            onClick={
                                                handleUploadClick
                                            }
                                            whileHover={{
                                                scale: 1.03,
                                                y: -2,
                                            }}
                                            whileTap={{
                                                scale: 0.97,
                                            }}
                                            className="relative mt-8 inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 px-7 py-3.5 text-sm font-bold text-white shadow-[0_15px_40px_rgba(99,102,241,.22)] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <motion.span
                                                animate={{
                                                    x: [
                                                        "-100%",
                                                        "200%",
                                                    ],
                                                }}
                                                transition={{
                                                    duration: 2.5,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                className="absolute inset-y-0 w-10 bg-white/20 blur-md"
                                            />

                                            <FaUpload className="relative" />

                                            <span className="relative">
                                                {loading
                                                    ? "Uploading..."
                                                    : "Upload PDF"}
                                            </span>
                                        </motion.button>
                                    ) : (
                                        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-4 py-2 text-[9px] text-zinc-600">
                                            <motion.span
                                                animate={{
                                                    opacity:
                                                        [
                                                            0.3,
                                                            1,
                                                            0.3,
                                                        ],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                }}
                                                className="h-1.5 w-1.5 rounded-full bg-violet-400"
                                            />

                                            Waiting for the host to upload study material
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* ==========================================
                    ANNOTATION TOOLBAR LAYER
                ========================================== */}

                <div
                    ref={toolbarLayerRef}
                    className="pointer-events-none absolute inset-0 z-40"
                />

                {/* ==========================================
                    LIVE WORKSPACE STATUS
                ========================================== */}

                {pdfUrl && (
                    <AnimatePresence>
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="pointer-events-none absolute bottom-4 left-4 z-30 hidden items-center gap-2 rounded-full border border-white/[0.07] bg-[#08080d]/80 px-3 py-2 text-[8px] text-zinc-600 shadow-xl backdrop-blur-xl sm:flex"
                        >
                            <motion.span
                                animate={{
                                    scale: [
                                        1,
                                        1.5,
                                        1,
                                    ],
                                    opacity: [
                                        0.6,
                                        0,
                                        0.6,
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                            />

                            <span>
                                Live document
                            </span>

                            <span className="text-zinc-800">
                                •
                            </span>

                            <span>
                                Page{" "}
                                {pageNumber}{" "}
                                of{" "}
                                {numPages}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Host / follower indicator */}

                {pdfUrl && (
                    <div className="pointer-events-none absolute bottom-4 right-4 z-30 hidden items-center gap-2 rounded-full border border-white/[0.07] bg-[#08080d]/80 px-3 py-2 text-[8px] shadow-xl backdrop-blur-xl md:flex">
                        <FaUsers className="text-[8px] text-violet-400" />

                        <span className="text-zinc-600">
                            {isHost
                                ? "You control the session"
                                : followHost
                                  ? "Following host"
                                  : "Independent view"}
                        </span>

                        <FaCircle
                            className={`text-[4px] ${
                                followHost ||
                                isHost
                                    ? "text-emerald-400"
                                    : "text-zinc-700"
                            }`}
                        />
                    </div>
                )}

                {/* Scroll progress */}

                {pdfUrl && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-50 h-px bg-white/[0.03]">
                        <motion.div
                            animate={{
                                width:
                                    numPages >
                                    0
                                        ? `${
                                              (pageNumber /
                                                  numPages) *
                                              100
                                          }%`
                                        : "0%",
                            }}
                            transition={{
                                duration: 0.35,
                            }}
                            className="h-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 shadow-[0_0_12px_rgba(139,92,246,.6)]"
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PdfViewer;