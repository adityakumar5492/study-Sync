import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    uploadRoomPdfThunk,
    deleteRoomPdfThunk,
} from "../../redux/room/roomThunk";
import PdfAnnotationLayer from "./PdfAnnotationLayer";
import PdfToolbar from "./PdfToolbar";

import { FaFilePdf,FaUpload, } from "react-icons/fa";
import socket from "../../socket/socket";


import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const PdfViewer = ({ roomId, room, currentUser }) => {
    const dispatch = useAppDispatch();

    const { currentRoom, loading } = useAppSelector(
        (state) => state.room
    );

    // ===========================
    // Host
    // ===========================

    const hostId =
        typeof room?.host === "object"
            ? room.host?._id?.toString()
            : room?.host?.toString();

    const currentUserId = currentUser?._id?.toString();

    const isHost = hostId === currentUserId;

    // ===========================
    // Refs
    // ===========================

    const fileInputRef = useRef(null);

    // measureRef: non-scrolling wrapper, used ONLY to measure available width.
    const measureRef = useRef(null);

    // viewerRef: the actual scrollable element (scrolling + wheel/pinch handling).
    const viewerRef = useRef(null);

    // toolbarLayerRef: non-scrolling overlay for the annotation toolbar.
    const toolbarLayerRef = useRef(null);

    // ===========================
    // PDF State
    // ===========================

    const [pdfUrl, setPdfUrl] = useState("");
    const [pdfName, setPdfName] = useState("");

    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageInput, setPageInput] = useState("1");
    
    const [drawingAllowed, setDrawingAllowed] = useState(true);

    useEffect(() => {
    const handlePermissionChange = ({ allowed }) => {
        setDrawingAllowed(Boolean(allowed));
    };

    socket.on("drawing:permission-change", handlePermissionChange);

    return () => {
        socket.off("drawing:permission-change", handlePermissionChange);
    };
    }, []);

    const handleToggleDrawing = () => {
    if (!isHost) return;

    socket.emit("drawing:toggle", {
        roomId,
        allowed: !drawingAllowed,
        isHost,
    });
};

// Host can always draw; members only when host has allowed it.
const canDraw = isHost || drawingAllowed;


    const [followHost, setFollowHost] = useState(() => {
        return sessionStorage.getItem(
        `studysync-follow-host-${roomId}`
        ) !== "false";
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
        setPageInput(String(pageNumber));
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
}, [roomId, isHost, followHost]);

    // FIX (Issue #1 / #2): this now applies to the host too, so a
    // reloading host resumes at their last saved page, and a follower
    // that just requested the current page jumps to it immediately.
useEffect(() => {
    if (!roomId) return;

    const handleCurrentPage = ({ pageNumber }) => {
        if (
            typeof pageNumber !== "number" ||
            pageNumber < 1
        ) {
            return;
        }

        setPageNumber(pageNumber);
        setPageInput(String(pageNumber));
    };

    // Register listener FIRST
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

    // Socket already connected
    if (socket.connected) {
        requestCurrentPage();
    } else {
        // Wait for socket connection
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

    const handlePdfUpdated = ({ pdfUrl }) => {
        if (!pdfUrl) return;

        const newUrl = `http://localhost:5000${pdfUrl}`;

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
    // "zoom" = live value, updates instantly (drives CSS transform for
    // smooth pinch/button feedback, no PDF re-render).
    const [zoom, setZoom] = useState(1);

    // "renderZoom" = committed value, updates only after zoom settles.
    const [renderZoom, setRenderZoom] = useState(1);

    const zoomCommitTimeoutRef = useRef(null);

    useEffect(() => {
        if (zoomCommitTimeoutRef.current) {
            clearTimeout(zoomCommitTimeoutRef.current);
        }

        zoomCommitTimeoutRef.current = setTimeout(() => {
            setRenderZoom(zoom);
        }, 150);

        return () => {
            if (zoomCommitTimeoutRef.current) {
                clearTimeout(zoomCommitTimeoutRef.current);
            }
        };
    }, [zoom]);

    // ===========================
    // Touchpad pinch zoom (wheel + ctrlKey)
    // ===========================

    useEffect(() => {
        const element = viewerRef.current;

        if (!element) return;

        let accumulatedDelta = 0;

        const handleWheel = (e) => {
            if (!e.ctrlKey) return;

            e.preventDefault();

            accumulatedDelta += e.deltaY;

            if (Math.abs(accumulatedDelta) < 8) {
                return;
            }

            const direction =
                accumulatedDelta > 0 ? -1 : 1;

            accumulatedDelta = 0;

            setZoom((currentZoom) => {
                const nextZoom =
                    currentZoom + direction * 0.02;

                return Number(
                    Math.min(
                        3,
                        Math.max(0.5, nextZoom)
                    ).toFixed(2)
                );
            });
        };

        element.addEventListener(
            "wheel",
            handleWheel,
            { passive: false }
        );

        return () => {
            element.removeEventListener(
                "wheel",
                handleWheel
            );
        };
    }, []);

    // ===========================
    // NEW (Issue #3): Host Scroll Sync — emit
    // Host's scroll position, throttled, broadcast to the room.
    // Only the host emits, so followers can never trigger a loop.
    // ===========================

    useEffect(() => {
        if (!roomId || !isHost) return;

        const element = viewerRef.current;

        if (!element) return;

        let throttleTimer = null;

        const handleScroll = () => {
            if (throttleTimer) return;

            throttleTimer = setTimeout(() => {
                throttleTimer = null;

                const maxScroll =
                    element.scrollHeight - element.clientHeight;

                const scrollPercent =
                    maxScroll > 0
                        ? element.scrollTop / maxScroll
                        : 0;

                socket.emit("pdf:host-scroll", {
                    roomId,
                    scrollPercent,
                    isHost,
                });
            }, 150);
        };

        element.addEventListener("scroll", handleScroll);

        return () => {
            element.removeEventListener("scroll", handleScroll);

            if (throttleTimer) {
                clearTimeout(throttleTimer);
            }
        };
    }, [roomId, isHost]);

    // ===========================
    // NEW (Issue #3): Host Scroll Sync — receive
    // Only applied when Follow Host is on. When it's off, the
    // listener still runs but bails out immediately, so scrolling
    // stays fully independent.
    // ===========================

    useEffect(() => {
        if (!roomId || isHost) return;

        const handleHostScrollChange = ({ scrollPercent }) => {
            if (!followHost) return;
            if (typeof scrollPercent !== "number") return;

            const element = viewerRef.current;

            if (!element) return;

            const maxScroll =
                element.scrollHeight - element.clientHeight;

            element.scrollTop = maxScroll * scrollPercent;
        };

        socket.on("pdf:host-scroll-change", handleHostScrollChange);

        return () => {
            socket.off("pdf:host-scroll-change", handleHostScrollChange);
        };
    }, [roomId, isHost, followHost]);

    const [deleting, setDeleting] = useState(false);

    // Width available for PDF page
    const [viewerWidth, setViewerWidth] = useState(0);

    // ===========================
    // Measure PDF workspace
    // ===========================

    useEffect(() => {
        const element = measureRef.current;

        if (!element) return;

        const updateWidth = () => {
            const width = element.clientWidth;

            setViewerWidth(Math.max(300, width));
        };

        updateWidth();

        const resizeObserver = new ResizeObserver(
            updateWidth
        );

        resizeObserver.observe(element);

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
            const url = `http://localhost:5000${currentRoom.pdfUrl}`;

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
    // Upload / Replace PDF
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

    const handlePdfChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!isHost) {
            toast.error(
                "Only the host can upload study material."
            );
            return;
        }

        if (!roomId) {
            toast.error("Room not found.");
            return;
        }

        if (file.type !== "application/pdf") {
            toast.error(
                "Please upload a PDF file."
            );
            return;
        }

        try {
            const formData = new FormData();

            formData.append("pdf", file);

            const result = await dispatch(
    uploadRoomPdfThunk({
        roomId,
        formData,
    })
).unwrap();

const uploadedPdfUrl = result?.room?.pdfUrl;

if (uploadedPdfUrl) {
    socket.emit("pdf:updated", {
        roomId,
        pdfUrl: uploadedPdfUrl,
    });
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

            // FIX: keep the server's saved page in sync with the new
            // document, otherwise a reload could restore a stale page
            // number from before the replacement.
            if (isHost) {
                socket.emit("pdf:page-change", {
                    roomId,
                    pageNumber: 1,
                    isHost,
                });
            }

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            toast.error(
                err?.message ||
                    "Failed to upload PDF."
            );
        }
    };

    // ===========================
    // Delete PDF
    // ===========================

    const handleDeletePdf = async () => {
        if (!isHost) {
            toast.error(
                "Only the host can delete study material."
            );
            return;
        }

        if (!roomId) {
            toast.error("Room not found.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this PDF? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            await dispatch(
                deleteRoomPdfThunk(roomId)
            ).unwrap();

            toast.success(
                "PDF deleted successfully."
            );

            setPdfUrl("");
            setPdfName("");

            setPageNumber(1);
            setPageInput("1");

            setNumPages(0);
            setZoom(1);
            setRenderZoom(1);
        } catch (err) {
            toast.error(
                err?.message ||
                    "Failed to delete PDF."
            );
        } finally {
            setDeleting(false);
        }
    };

    // ===========================
    // PDF Loaded
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
        const pageValue = Number(page);

        if (!Number.isInteger(pageValue)) {
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

                setPageNumber(pageValue);
                setPageInput(String(pageValue));

                if (isHost) {
                    socket.emit("pdf:page-change", {
                        roomId,
                        pageNumber: pageValue,
                        isHost,
                    });
                }
    };

    const handlePageInputChange = (e) => {
        setPageInput(e.target.value);
    };

    const handlePageInputKeyDown = (e) => {
        if (e.key === "Enter") {
            goToPage(pageInput);
        }
    };

    const handlePreviousPage = () => {
    if (pageNumber > 1) {
        const newPage = pageNumber - 1;

        setPageNumber(newPage);
        setPageInput(String(newPage));

        if (isHost) {
            socket.emit("pdf:page-change", {
                roomId,
                pageNumber: newPage,
                isHost,
            });
        }
    }
};

    const handleNextPage = () => {
    if (pageNumber < numPages) {
        const newPage = pageNumber + 1;

        setPageNumber(newPage);
        setPageInput(String(newPage));

        if (isHost) {
            socket.emit("pdf:page-change", {
                roomId,
                pageNumber: newPage,
                isHost,
            });
        }
    }
    };

    // ===========================
    // Keyboard Navigation
    // ===========================

    useEffect(() => {
        if (!pdfUrl) return;

        const handleKeyboardScroll = (e) => {
            const target = e.target;

            if (
                target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement ||
                target instanceof HTMLButtonElement ||
                target.isContentEditable
            ) {
                return;
            }

            const viewer = viewerRef.current;

            if (!viewer) return;

            if (e.key === "ArrowUp") {
                e.preventDefault();

                viewer.scrollBy({
                    top: -150,
                    behavior: "smooth",
                });

                return;
            }

            if (e.key === "ArrowDown") {
                e.preventDefault();

                viewer.scrollBy({
                    top: 150,
                    behavior: "smooth",
                });

                return;
            }

            if (
                e.key === "ArrowLeft" ||
                e.key === "PageUp"
            ) {
                e.preventDefault();

                handlePreviousPage();

                return;
            }

            if (
    e.key === "ArrowRight" ||
    e.key === "PageDown"
) {
    e.preventDefault();

    handleNextPage();

    return;
}

            if (e.key === "Home") {
    e.preventDefault();

    goToPage(1);

    return;
}

            if (e.key === "End") {
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
    }, [pdfUrl, numPages]);

    // ===========================
    // Calculated PDF Width
    // ===========================

    const pdfWidth =
        viewerWidth > 0
            ? Math.max(
                  300,
                  viewerWidth * renderZoom
              )
            : undefined;

    const liveScale = renderZoom > 0 ? zoom / renderZoom : 1;

    // ===========================
    // Render
    // ===========================

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                hidden
                onChange={handlePdfChange}
            />

                   <PdfToolbar
                        pdfUrl={pdfUrl}
                        pdfName={pdfName}
                        pageNumber={pageNumber}
                        pageInput={pageInput}
                        numPages={numPages}
                        zoom={zoom}
                        isHost={isHost}
                        followHost={followHost}
                        onToggleFollowHost={() => {
                            setFollowHost((prev) => {
                            const next = !prev;

                                if (next) {
                                        socket.emit("pdf:request-current-page", {
                                            roomId,
                                        });
                                    }

                                    return next;
                                });
                        }}

                        drawingAllowed={drawingAllowed}
                        onToggleDrawing={handleToggleDrawing}
                        loading={loading}
                        deleting={deleting}
                        onUpload={handleUploadClick}
                        onDelete={handleDeletePdf}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        onPageInputChange={handlePageInputChange}
                        onPageInputKeyDown={handlePageInputKeyDown}
                        onGoToPage={goToPage}
                        onZoomOut={() =>
                            setZoom((z) => Math.max(0.5, z - 0.1))
                        }
                        onZoomIn={() =>
                            setZoom((z) => Math.min(3, z + 0.1))
                        }
                        onResetZoom={() => setZoom(1)}
                    />

            <div
                ref={measureRef}
                className="relative min-h-0 flex-1 overflow-hidden"
            >

                <div
                    ref={viewerRef}
                    className="absolute inset-0 overflow-auto bg-slate-950 p-4"
                    style={{
                        overscrollBehavior: "contain",
                    }}
                >

                    {pdfUrl ? (
                        <div className="flex min-w-full justify-center">

                            <Document
                                file={pdfUrl}
                                onLoadSuccess={
                                    onDocumentLoadSuccess
                                }
                                loading={
                                    <div className="py-10 text-center text-slate-400">
                                        Loading PDF...
                                    </div>
                                }
                                error={
                                    <div className="py-10 text-center text-red-400">
                                        Failed to load PDF.
                                    </div>
                                }
                            >

                                {pdfWidth && (
                                <div
    style={{
        transform: `scale(${liveScale})`,
        transformOrigin: "top center",
    }}
>
    <div
        className="relative"
        style={{
            width: pdfWidth,
        }}
    >
        <Page
            pageNumber={pageNumber}
            width={pdfWidth}
        />

        <PdfAnnotationLayer
            roomId={roomId}
            pageNumber={pageNumber}
            containerRef={toolbarLayerRef}
            enabled={canDraw}
        />
    </div>
</div>
)}  

                            </Document>

                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
                                    <FaFilePdf className="text-4xl text-red-500" />
                                </div>

                                <h2 className="mb-3 text-2xl font-bold">
                                    No PDF Loaded
                                </h2>

                                <p className="mb-8 max-w-md text-slate-400">
                                    Upload a PDF to study collaboratively with your team.
                                </p>

                                {isHost ? (
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={
                                            handleUploadClick
                                        }
                                        className="inline-flex items-center gap-3 rounded-xl bg-green-500 px-6 py-3 font-semibold transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <FaUpload />

                                        {loading
                                            ? "Uploading..."
                                            : "Upload PDF"}
                                    </button>
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        Waiting for the host to upload study material.
                                    </p>
                                )}

                            </div>

                        </div>
                    )}

                </div>

                <div
                    ref={toolbarLayerRef}
                    className="pointer-events-none absolute inset-0 z-20"
                />

            </div>

        </div>
    );
};

export default PdfViewer;