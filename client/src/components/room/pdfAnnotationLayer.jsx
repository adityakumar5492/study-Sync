import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import socket from "../../socket/socket";

// ===========================
// Tools
// ===========================

const TOOLS = {
    SELECT: "select",
    PEN: "pen",
    HIGHLIGHTER: "highlighter",
    LINE: "line",
    ERASER: "eraser",
};

const getToolConfig = (tool) => {
    switch (tool) {
        case TOOLS.HIGHLIGHTER:
            return {
                color: "#facc15",
                opacity: 0.35,
                lineWidth: 18,
            };

        case TOOLS.ERASER:
            return {
                color: null,
                opacity: 1,
                lineWidth: 24,
            };

        case TOOLS.LINE:
            return {
                color: "#22c55e",
                opacity: 1,
                lineWidth: 3,
            };

        case TOOLS.PEN:
        default:
            return {
                color: "#22c55e",
                opacity: 1,
                lineWidth: 3,
            };
    }
};

// ===========================
// Component
// ===========================

const PdfAnnotationLayer = ({
    roomId,
    pageNumber,
    containerRef,
    enabled = true,
    canDraw = true,
    currentUser,
    isHost = false,
}) => {
    const rootRef = useRef(null);
    const canvasRef = useRef(null);

    const drawingRef = useRef(false);
    const currentStrokeRef = useRef(null);
    const lineStartRef = useRef(null);
    const currentUserId =
    currentUser?._id?.toString();

    // Real-time drawing
    const remoteStrokesRef = useRef(new Map());
    const strokeIdRef = useRef(null);
    const syncTimerRef = useRef(null);

    // Drag-erase
    const erasingRef = useRef(false);
    const erasedInDragRef = useRef(new Set());

    // ===========================
    // Toolbar
    // ===========================

    const [annotationToolbarOpen, setAnnotationToolbarOpen] =
        useState(false);

    const [activeTool, setActiveTool] = useState(null);

    // Portal target.
    // This is the NON-SCROLLING PDF viewer wrapper.
    const [portalNode, setPortalNode] = useState(null);

    useEffect(() => {
        if (containerRef?.current) {
            setPortalNode(containerRef.current);
        }
    }, [containerRef]);

    // ===========================
    // PDF page size
    // ===========================

    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });

    // ===========================
    // Annotation storage
    // ===========================

    const annotationsRef = useRef({});

    const [, bumpTick] = useState(0);

    const bump = () => {
        bumpTick((n) => n + 1);
    };

    // ===========================
    // Page data
    // ===========================

    const getPageData = useCallback((page) => {
        if (!annotationsRef.current[page]) {
            annotationsRef.current[page] = {
                strokes: [],
                redo: [],
            };
        }

        return annotationsRef.current[page];
    }, []);

    const pageData = getPageData(pageNumber);

    // ===========================
    // Measure page
    // ===========================

    useEffect(() => {
        const element = rootRef.current;

        if (!element) return;

        const update = () => {
            setSize({
                width: element.clientWidth,
                height: element.clientHeight,
            });
        };

        update();

        const resizeObserver =
            new ResizeObserver(update);

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // ===========================
    // Draw stroke
    // ===========================

    const drawStroke = (
        ctx,
        stroke,
        width,
        height
    ) => {
        if (!stroke?.points?.length) {
            return;
        }

        ctx.save();

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (stroke.tool === TOOLS.ERASER) {
            ctx.globalCompositeOperation =
                "destination-out";

            ctx.globalAlpha = 1;
            ctx.lineWidth = stroke.lineWidth;
        } else {
            ctx.globalCompositeOperation =
                "source-over";

            ctx.strokeStyle = stroke.color;
            ctx.globalAlpha = stroke.opacity;
            ctx.lineWidth = stroke.lineWidth;
        }

        ctx.beginPath();

        const points = stroke.points;

        ctx.moveTo(
            points[0].x * width,
            points[0].y * height
        );

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(
                points[i].x * width,
                points[i].y * height
            );
        }

        ctx.stroke();

        ctx.restore();
    };

    // ===========================
    // Redraw
    // ===========================

    const redraw = useCallback(() => {
        const canvas = canvasRef.current;

        if (
            !canvas ||
            !size.width ||
            !size.height
        ) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const dpr =
            window.devicePixelRatio || 1;

        ctx.setTransform(
            1,
            0,
            0,
            1,
            0,
            0
        );

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.scale(dpr, dpr);

        const strokes =
            getPageData(pageNumber).strokes;

        strokes.forEach((stroke) => {
            drawStroke(
                ctx,
                stroke,
                size.width,
                size.height
            );
        });

        // Local stroke currently being drawn
        if (currentStrokeRef.current) {
            drawStroke(
                ctx,
                currentStrokeRef.current,
                size.width,
                size.height
            );
        }

        // Remote strokes currently being drawn
        remoteStrokesRef.current.forEach(
            ({ pageNumber: remotePage, stroke }) => {
                if (remotePage !== pageNumber) return;

                drawStroke(
                    ctx,
                    stroke,
                    size.width,
                    size.height
                );
            }
        );
    }, [
        pageNumber,
        size.width,
        size.height,
        getPageData,
    ]);

    // ===========================
    // REAL-TIME PDF ANNOTATIONS
    // ===========================

    useEffect(() => {
        if (!roomId) return;

        // Progressive remote drawing
        const handleRemoteDrawing = (annotation) => {
            
            if (
                !annotation ||
                !annotation.strokeId ||
                !annotation.pageNumber
            ) {
                return;
            }

            const {
                strokeId,
                pageNumber: remotePage,
                stroke,
                phase,
            } = annotation;

            if (phase === "end") {
                remoteStrokesRef.current.delete(
                    strokeId
                );
                if (remotePage === pageNumber) {
                    redraw();
            }
                return;
            } else if (stroke) {
                remoteStrokesRef.current.set(
                    strokeId,
                    {
                        pageNumber: remotePage,
                        stroke,
                    }
                );
            }

            if (remotePage === pageNumber) {
                redraw();
            }
        };

        // Completed remote annotation
        const handleRemoteAnnotation = (
            annotation
        ) => {
            if (!annotation) return;

            const data = getPageData(
                annotation.pageNumber
            );

            if (!annotation.stroke) {
                return;
            }

            data.strokes.push(
                annotation.stroke
            );

            if (
                annotation.pageNumber ===
                pageNumber
            ) {
                redraw();
            }

            bump();
        };

        // Remote clear
        const handleRemoteClear = ({
    pageNumber: clearedPage,
}) => {
    if (!clearedPage) return;

    const data = getPageData(clearedPage);

    data.strokes = [];
    data.redo = [];

    remoteStrokesRef.current.clear();

    if (clearedPage === pageNumber) {
        redraw();
    }

    bump();
};

        socket.on(
            "pdf:annotation",
            handleRemoteAnnotation
        );

        socket.on(
            "pdf:annotation-drawing",
            handleRemoteDrawing
        );

        socket.on(
            "pdf:clear-annotations",
            handleRemoteClear
        );
    const handleRemoteAnnotationsUpdate = ({
    pageNumber: updatedPage,
    action,
    strokeId,
    stroke,
}) => {
    if (!updatedPage || !action) {
        return;
    }

    const data =
        getPageData(updatedPage);

    if (action === "remove") {
        data.strokes =
            data.strokes.filter(
                (item) =>
                    item.id !== strokeId
            );

        data.redo = [];
    }

    if (action === "undo" && stroke) {
        data.strokes =
            data.strokes.filter(
                (item) =>
                    item.id !== stroke.id
            );

        data.redo.push(stroke);
    }

    if (action === "redo" && stroke) {
        const exists =
            data.strokes.some(
                (item) =>
                    item.id === stroke.id
            );

        if (!exists) {
            data.strokes.push(stroke);
        }

        data.redo =
            data.redo.filter(
                (item) =>
                    item.id !== stroke.id
            );
    }

    if (updatedPage === pageNumber) {
        redraw();
    }

    bump();
};
    socket.on(
    "pdf:annotations-update",
    handleRemoteAnnotationsUpdate
);

        return () => {
            socket.off(
                "pdf:annotation",
                handleRemoteAnnotation
            );

            socket.off(
                "pdf:annotation-drawing",
                handleRemoteDrawing
            );

            socket.off(
                "pdf:clear-annotations",
                handleRemoteClear
            );
            socket.off(
                "pdf:annotations-update",
                handleRemoteAnnotationsUpdate
            );
        };
    }, [
        roomId,
        pageNumber,
        getPageData,
        redraw,
    ]);

    // ===========================
    // Canvas size
    // ===========================

    useEffect(() => {
        const canvas = canvasRef.current;

        if (
            !canvas ||
            !size.width ||
            !size.height
        ) {
            return;
        }

        const dpr =
            window.devicePixelRatio || 1;

        canvas.width =
            size.width * dpr;

        canvas.height =
            size.height * dpr;

        canvas.style.width =
            `${size.width}px`;

        canvas.style.height =
            `${size.height}px`;

        redraw();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        size.width,
        size.height,
    ]);

    // ===========================
    // Page change
    // ===========================

    useEffect(() => {
        redraw();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber]);

    // ===========================
    // Normalized coordinates
    // ===========================

    const getNormalizedPosition = (
        event
    ) => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return {
                x: 0,
                y: 0,
            };
        }

        const rect =
            canvas.getBoundingClientRect();

        return {
            x:
                (event.clientX - rect.left) /
                rect.width,

            y:
                (event.clientY - rect.top) /
                rect.height,
        };
    };

    // ===========================
    // Erase at a given normalized position.
    // Used on pointer down AND while dragging,
    // so the eraser removes every eligible
    // stroke it passes over, not just the first.
    // ===========================

    const eraseAtPosition = (position) => {
        const data = getPageData(pageNumber);

        let targetIndex = -1;

        for (
            let i = data.strokes.length - 1;
            i >= 0;
            i--
        ) {
            const stroke = data.strokes[i];

            // Already removed earlier in this drag.
            if (erasedInDragRef.current.has(stroke.id)) {
                continue;
            }

            // Member can erase only own stroke.
            // Host can erase any stroke.
            if (
                !isHost &&
                stroke.userId !== currentUserId
            ) {
                continue;
            }

            const hit = stroke.points?.some((point) => {
                const dx = point.x - position.x;
                const dy = point.y - position.y;

                return Math.sqrt(dx * dx + dy * dy) < 0.04;
            });

            if (hit) {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex === -1) {
            return;
        }

        const [removedStroke] = data.strokes.splice(
            targetIndex,
            1
        );

        erasedInDragRef.current.add(removedStroke.id);

        data.redo = [];

        if (roomId && socket.connected) {
            socket.emit("pdf:annotations-update", {
                roomId,
                pageNumber,
                action: "remove",
                strokeId: removedStroke.id,
            });
        }

        redraw();
        bump();
    };

    // ===========================
    // Pointer Down
    // ===========================

    const handlePointerDown = (event) => {
    if (
        !enabled ||
        !canDraw ||
        !activeTool ||
        activeTool === TOOLS.SELECT
    ) {
        return;
    }

    const canvas = canvasRef.current;

    if (!canvas) return;

    const position =
        getNormalizedPosition(event);

    // =========================================
    // Eraser
    // =========================================

    if (activeTool === TOOLS.ERASER) {
        erasingRef.current = true;
        erasedInDragRef.current = new Set();

        canvas.setPointerCapture?.(event.pointerId);

        eraseAtPosition(position);

        return;
    }

    // =========================================
    // Normal Drawing
    // =========================================

    drawingRef.current = true;

    const config =
        getToolConfig(activeTool);

    const strokeId =
    `${socket.id}-${Date.now()}-${Math.random()}`;

strokeIdRef.current = strokeId;

if (activeTool === TOOLS.LINE) {
    lineStartRef.current = position;

    currentStrokeRef.current = {
        id: strokeId,
        userId: currentUserId,
        tool: TOOLS.LINE,
        points: [
            position,
            position,
        ],
        ...config,
    };
} else {
    currentStrokeRef.current = {
        id: strokeId,
        userId: currentUserId,
        tool: activeTool,
        points: [position],
        ...config,
    };
}

canvas.setPointerCapture?.(
    event.pointerId
);

// Send initial stroke
if (
    roomId &&
    socket.connected
) {
    socket.emit(
        "pdf:annotation-drawing",
        {
            roomId,
            annotation: {
                strokeId:
                    strokeIdRef.current,
                pageNumber,
                phase: "start",
                stroke: {
                    ...currentStrokeRef.current,
                    points: [
                        ...currentStrokeRef
                            .current
                            .points,
                    ],
                },
            },
        }
    );
}

redraw();
};

    // ===========================
    // Pointer Move
    // ===========================

    const handlePointerMove = (
        event
    ) => {
        if (erasingRef.current) {
            const position = getNormalizedPosition(event);

            eraseAtPosition(position);

            return;
        }

        if (
            !drawingRef.current ||
            !currentStrokeRef.current
        ) {
            return;
        }

        const position =
            getNormalizedPosition(event);

        if (activeTool === TOOLS.LINE) {
            currentStrokeRef.current.points = [
                lineStartRef.current,
                position,
            ];
        } else {
            currentStrokeRef.current.points.push(
                position
            );
        }

        // Throttle realtime updates
        if (
    roomId &&
    socket.connected
) {
    if (!syncTimerRef.current) {
        syncTimerRef.current = setTimeout(() => {
            syncTimerRef.current = null;

            if (!currentStrokeRef.current) {
                return;
            }

            socket.emit(
                "pdf:annotation-drawing",
                {
                    roomId,
                    annotation: {
                        strokeId:
                            strokeIdRef.current,
                        pageNumber,
                        phase: "move",
                        stroke: {
                            ...currentStrokeRef.current,
                            points: [
                                ...currentStrokeRef
                                    .current
                                    .points,
                            ],
                        },
                    },
                }
            );
        }, 30);
    }
}

        redraw();
    };

    // ===========================
    // Pointer Up
    // ===========================

    const handlePointerUp = (
        event
    ) => {
        if (erasingRef.current) {
            erasingRef.current = false;
            erasedInDragRef.current = new Set();

            canvasRef.current?.releasePointerCapture?.(
                event.pointerId
            );

            return;
        }

        if (!drawingRef.current) {
            return;
        }

        drawingRef.current = false;

        // Send the latest points before ending
        if (
            roomId &&
            socket.connected &&
            currentStrokeRef.current
        ) {
            if (syncTimerRef.current) {
                clearTimeout(
                    syncTimerRef.current
                );

                syncTimerRef.current = null;
            }

            socket.emit(
                "pdf:annotation-drawing",
                {
                    roomId,
                    annotation: {
                        strokeId:
                            strokeIdRef.current,
                        pageNumber,
                        phase: "move",
                        stroke: {
                            ...currentStrokeRef.current,
                            points: [
                                ...currentStrokeRef
                                    .current
                                    .points,
                            ],
                        },
                    },
                }
            );

            socket.emit(
                "pdf:annotation-drawing",
                {
                    roomId,
                    annotation: {
                        strokeId:
                            strokeIdRef.current,
                        pageNumber,
                        phase: "end",
                    },
                }
            );
        }

        canvasRef.current?.releasePointerCapture?.(
            event.pointerId
        );

        const stroke =
            currentStrokeRef.current;

        currentStrokeRef.current = null;
        lineStartRef.current = null;

        if (
            !stroke ||
            stroke.points.length === 0
        ) {
            redraw();
            return;
        }

        if (stroke.points.length === 1) {
            stroke.points.push({
                ...stroke.points[0],
            });
        }

        const data =
            getPageData(pageNumber);

        data.strokes.push(stroke);

        data.redo = [];

        // Existing completed annotation sync
        if (
            roomId &&
            socket.connected
        ) {
            socket.emit(
                "pdf:annotation",
                {
                    roomId,
                    annotation: {
                        pageNumber,
                        stroke,
                    },
                }
            );
        }

        redraw();
        bump();
    };

    // ===========================
    // Undo
    // ===========================

const undo = () => {
    const data = getPageData(pageNumber);

    if (data.strokes.length === 0) {
        return;
    }

    let index = -1;

    if (isHost) {
        index = data.strokes.length - 1;
    } else {
        for (let i = data.strokes.length - 1; i >= 0; i--) {
            if (
                data.strokes[i]?.userId ===
                currentUserId
            ) {
                index = i;
                break;
            }
        }
    }

    if (index === -1) {
        return;
    }

    const [removedStroke] =
        data.strokes.splice(index, 1);

    data.redo.push(removedStroke);

    if (roomId && socket.connected) {
        socket.emit(
    "pdf:annotations-update",
    {
        roomId,
        pageNumber,
        action: "undo",
        strokeId: removedStroke.id,
    }
);
    }

    redraw();
    bump();
};

    // ===========================
    // Redo
    // ===========================

const redo = () => {
    const data = getPageData(pageNumber);

    if (data.redo.length === 0) {
        return;
    }

    let index = -1;

    if (isHost) {
        index = data.redo.length - 1;
    } else {
        for (let i = data.redo.length - 1; i >= 0; i--) {
            if (
                data.redo[i]?.userId ===
                currentUserId
            ) {
                index = i;
                break;
            }
        }
    }

    if (index === -1) {
        return;
    }

    const [stroke] =
        data.redo.splice(index, 1);

    data.strokes.push(stroke);

    if (roomId && socket.connected) {
        socket.emit(
    "pdf:annotations-update",
    {
        roomId,
        pageNumber,
        action: "redo",
        strokeId: stroke.id,
    }
);
    }

    redraw();
    bump();
};

    // ===========================
    // Clear
    // ===========================

const clearAnnotations = () => {
    // Only host can clear everyone's annotations.
    if (!isHost) {
        return;
    }

    const data =
        getPageData(pageNumber);

    if (data.strokes.length === 0) {
        return;
    }

    data.strokes = [];
    data.redo = [];

    currentStrokeRef.current = null;
    lineStartRef.current = null;
    drawingRef.current = false;

    if (syncTimerRef.current) {
        clearTimeout(
            syncTimerRef.current
        );

        syncTimerRef.current = null;
    }

    if (
        roomId &&
        socket.connected
    ) {
        socket.emit(
            "pdf:clear-annotations",
            {
                roomId,
                pageNumber,
            }
        );
    }

    redraw();
    bump();
};

    // ===========================
    // Toolbar toggle
    // ===========================

    const toggleToolbar = () => {
        setAnnotationToolbarOpen(
            (open) => {
                const next = !open;

                if (!next) {
                    setActiveTool(null);
                }

                return next;
            }
        );
    };

    // ===========================
    // Select tool
    // ===========================

    const selectTool = (toolName) => {
        setActiveTool((current) =>
            current === toolName
                ? null
                : toolName
        );
    };

    // ===========================
    // Button state
    // ===========================

const canUndo =
    isHost ||
    pageData.strokes.some(
        (stroke) =>
            stroke.userId === currentUserId
    );

const canRedo =
    isHost ||
    pageData.redo.some(
        (stroke) =>
            stroke.userId === currentUserId
    );

    // ===========================
    // Button style
    // ===========================

    const toolButtonClass = (
        toolName
    ) =>
        `flex h-9 w-9 items-center justify-center rounded-lg text-base transition ${
            activeTool === toolName
                ? "bg-green-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`;

    // ===========================
    // Toolbar
    // ===========================

    const toolbar = (
        <div className="pointer-events-auto absolute right-4 top-3 z-[100] flex items-start gap-1.5">

            {/* Expanded tools */}
            {annotationToolbarOpen && (
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-sm">

                    {/* Select */}
                    <button
                        type="button"
                        onClick={() =>
                            selectTool(
                                TOOLS.SELECT
                            )
                        }
                        title="Select / normal PDF mode"
                        aria-label="Select / normal PDF mode"
                        className={toolButtonClass(
                            TOOLS.SELECT
                        )}
                    >
                        🖱️
                    </button>

                    {/* Pen */}
                    <button
                        type="button"
                        onClick={() =>
                            selectTool(
                                TOOLS.PEN
                            )
                        }
                        title="Pen"
                        aria-label="Pen"
                        className={toolButtonClass(
                            TOOLS.PEN
                        )}
                    >
                        ✏️
                    </button>

                    {/* Highlighter */}
                    <button
                        type="button"
                        onClick={() =>
                            selectTool(
                                TOOLS.HIGHLIGHTER
                            )
                        }
                        title="Highlighter"
                        aria-label="Highlighter"
                        className={toolButtonClass(
                            TOOLS.HIGHLIGHTER
                        )}
                    >
                        🖍️
                    </button>

                    {/* Line */}
                    <button
                        type="button"
                        onClick={() =>
                            selectTool(
                                TOOLS.LINE
                            )
                        }
                        title="Line"
                        aria-label="Line"
                        className={toolButtonClass(
                            TOOLS.LINE
                        )}
                    >
                        📏
                    </button>

                    {/* Eraser */}
                    <button
                        type="button"
                        onClick={() =>
                            selectTool(
                                TOOLS.ERASER
                            )
                        }
                        title="Eraser"
                        aria-label="Eraser"
                        className={toolButtonClass(
                            TOOLS.ERASER
                        )}
                    >
                        🧹
                    </button>

                    <span className="mx-1 h-6 w-px bg-slate-700" />

                    {/* Undo */}
                    <button
                        type="button"
                        onClick={undo}
                        disabled={!canUndo}
                        title="Undo"
                        aria-label="Undo"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-base text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        ↩️
                    </button>

                    {/* Redo */}
                    <button
                        type="button"
                        onClick={redo}
                        disabled={!canRedo}
                        title="Redo"
                        aria-label="Redo"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-base text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        ↪️
                    </button>

                    {/* Clear */}
                    <button
                        type="button"
                        onClick={clearAnnotations}
                        title="Clear annotations"
                        aria-label="Clear annotations"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/20 text-base text-red-400 transition hover:bg-red-500/30"
                    >
                        🗑️
                    </button>
                </div>
            )}

            {/* Toggle */}
            <button
                type="button"
                onClick={toggleToolbar}
                title={
                    annotationToolbarOpen
                        ? "Hide annotation tools"
                        : "Show annotation tools"
                }
                aria-label={
                    annotationToolbarOpen
                        ? "Hide annotation tools"
                        : "Show annotation tools"
                }
                aria-expanded={
                    annotationToolbarOpen
                }
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 text-base shadow-xl transition ${
                    annotationToolbarOpen
                        ? "bg-green-500 text-white"
                        : "bg-slate-900/95 text-slate-300 hover:bg-slate-800"
                }`}
            >
                {annotationToolbarOpen
                    ? "✕"
                    : "✏️"}
            </button>
        </div>
    );

    // ===========================
    // Render
    // ===========================

    return (
        <div
            ref={rootRef}
            className="pointer-events-none absolute inset-0"
        >
            {/* Annotation canvas */}
            <canvas
                ref={canvasRef}
                className="absolute left-0 top-0 z-20"
                style={{
                    touchAction: "none",

                    pointerEvents:
                        enabled &&
                        canDraw &&
                        activeTool &&
                        activeTool !==
                            TOOLS.SELECT
                            ? "auto"
                            : "none",
                }}
                onPointerDown={
                    handlePointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
                onPointerCancel={
                    handlePointerUp
                }
            />

            {/* Toolbar stays in the
                non-scrolling viewer wrapper */}
            {portalNode &&
                createPortal(
                    toolbar,
                    portalNode
                )}
        </div>
    );
};

export default PdfAnnotationLayer;