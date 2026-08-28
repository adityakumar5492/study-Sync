import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import {
    FaPen,
    FaHighlighter,
    FaMinus,
    FaEraser,
    FaMousePointer,
    FaUndo,
    FaRedo,
    FaTrash,
    FaTimes,
    FaDrawPolygon,
    FaCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

    const remoteStrokesRef = useRef(new Map());
    const strokeIdRef = useRef(null);
    const syncTimerRef = useRef(null);

    const erasingRef = useRef(false);
    const erasedInDragRef = useRef(new Set());

    const [annotationToolbarOpen, setAnnotationToolbarOpen] =
        useState(false);

    const [activeTool, setActiveTool] =
        useState(null);

    const [portalNode, setPortalNode] =
        useState(null);

    useEffect(() => {
        if (containerRef?.current) {
            setPortalNode(containerRef.current);
        }
    }, [containerRef]);

    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });

    const annotationsRef = useRef({});
    const [, bumpTick] = useState(0);

    const bump = () => {
        bumpTick((n) => n + 1);
    };

    const getPageData = useCallback((page) => {
        if (!annotationsRef.current[page]) {
            annotationsRef.current[page] = {
                strokes: [],
                redo: [],
            };
        }

        return annotationsRef.current[page];
    }, []);

    const pageData =
        getPageData(pageNumber);

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

            ctx.strokeStyle =
                stroke.color;

            ctx.globalAlpha =
                stroke.opacity;

            ctx.lineWidth =
                stroke.lineWidth;
        }

        ctx.beginPath();

        const points = stroke.points;

        ctx.moveTo(
            points[0].x * width,
            points[0].y * height
        );

        for (
            let i = 1;
            i < points.length;
            i++
        ) {
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
        const canvas =
            canvasRef.current;

        if (
            !canvas ||
            !size.width ||
            !size.height
        ) {
            return;
        }

        const ctx =
            canvas.getContext("2d");

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
            getPageData(pageNumber)
                .strokes;

        strokes.forEach((stroke) => {
            drawStroke(
                ctx,
                stroke,
                size.width,
                size.height
            );
        });

        if (
            currentStrokeRef.current
        ) {
            drawStroke(
                ctx,
                currentStrokeRef.current,
                size.width,
                size.height
            );
        }

        remoteStrokesRef.current.forEach(
            ({
                pageNumber: remotePage,
                stroke,
            }) => {
                if (
                    remotePage !==
                    pageNumber
                ) {
                    return;
                }

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
    // Real-time annotations
    // ===========================

    useEffect(() => {
        if (!roomId) return;

        const handleRemoteDrawing = (
            annotation
        ) => {
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

                if (
                    remotePage ===
                    pageNumber
                ) {
                    redraw();
                }

                return;
            } else if (stroke) {
                remoteStrokesRef.current.set(
                    strokeId,
                    {
                        pageNumber:
                            remotePage,
                        stroke,
                    }
                );
            }

            if (
                remotePage ===
                pageNumber
            ) {
                redraw();
            }
        };

        const handleRemoteAnnotation = (
            annotation
        ) => {
            if (!annotation) return;

            const data =
                getPageData(
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

        const handleRemoteClear = ({
            pageNumber: clearedPage,
        }) => {
            if (!clearedPage) return;

            const data =
                getPageData(clearedPage);

            data.strokes = [];
            data.redo = [];

            remoteStrokesRef.current.clear();

            if (
                clearedPage ===
                pageNumber
            ) {
                redraw();
            }

            bump();
        };

        const handleRemoteAnnotationsUpdate =
            ({
                pageNumber: updatedPage,
                action,
                strokeId,
                stroke,
            }) => {
                if (
                    !updatedPage ||
                    !action
                ) {
                    return;
                }

                const data =
                    getPageData(
                        updatedPage
                    );

                if (
                    action === "remove"
                ) {
                    data.strokes =
                        data.strokes.filter(
                            (item) =>
                                item.id !==
                                strokeId
                        );

                    data.redo = [];
                }

                if (
                    action === "undo" &&
                    stroke
                ) {
                    data.strokes =
                        data.strokes.filter(
                            (item) =>
                                item.id !==
                                stroke.id
                        );

                    data.redo.push(
                        stroke
                    );
                }

                if (
                    action === "redo" &&
                    stroke
                ) {
                    const exists =
                        data.strokes.some(
                            (item) =>
                                item.id ===
                                stroke.id
                        );

                    if (!exists) {
                        data.strokes.push(
                            stroke
                        );
                    }

                    data.redo =
                        data.redo.filter(
                            (item) =>
                                item.id !==
                                stroke.id
                        );
                }

                if (
                    updatedPage ===
                    pageNumber
                ) {
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
        const canvas =
            canvasRef.current;

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
        const canvas =
            canvasRef.current;

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
                (event.clientX -
                    rect.left) /
                rect.width,

            y:
                (event.clientY -
                    rect.top) /
                rect.height,
        };
    };

    // ===========================
    // Erase
    // ===========================

    const eraseAtPosition = (
        position
    ) => {
        const data =
            getPageData(pageNumber);

        let targetIndex = -1;

        for (
            let i =
                data.strokes.length - 1;
            i >= 0;
            i--
        ) {
            const stroke =
                data.strokes[i];

            if (
                erasedInDragRef.current.has(
                    stroke.id
                )
            ) {
                continue;
            }

            if (
                !isHost &&
                stroke.userId !==
                    currentUserId
            ) {
                continue;
            }

            const hit =
                stroke.points?.some(
                    (point) => {
                        const dx =
                            point.x -
                            position.x;

                        const dy =
                            point.y -
                            position.y;

                        return (
                            Math.sqrt(
                                dx * dx +
                                    dy * dy
                            ) < 0.04
                        );
                    }
                );

            if (hit) {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex === -1) {
            return;
        }

        const [
            removedStroke,
        ] = data.strokes.splice(
            targetIndex,
            1
        );

        erasedInDragRef.current.add(
            removedStroke.id
        );

        data.redo = [];

        if (
            roomId &&
            socket.connected
        ) {
            socket.emit(
                "pdf:annotations-update",
                {
                    roomId,
                    pageNumber,
                    action: "remove",
                    strokeId:
                        removedStroke.id,
                }
            );
        }

        redraw();
        bump();
    };

    // ===========================
    // Pointer Down
    // ===========================

    const handlePointerDown = (
        event
    ) => {
        if (
            !enabled ||
            !canDraw ||
            !activeTool ||
            activeTool ===
                TOOLS.SELECT
        ) {
            return;
        }

        const canvas =
            canvasRef.current;

        if (!canvas) return;

        const position =
            getNormalizedPosition(
                event
            );

        if (
            activeTool ===
            TOOLS.ERASER
        ) {
            erasingRef.current = true;

            erasedInDragRef.current =
                new Set();

            canvas.setPointerCapture?.(
                event.pointerId
            );

            eraseAtPosition(
                position
            );

            return;
        }

        drawingRef.current = true;

        const config =
            getToolConfig(
                activeTool
            );

        const strokeId =
            `${socket.id}-${Date.now()}-${Math.random()}`;

        strokeIdRef.current =
            strokeId;

        if (
            activeTool ===
            TOOLS.LINE
        ) {
            lineStartRef.current =
                position;

            currentStrokeRef.current =
                {
                    id: strokeId,
                    userId:
                        currentUserId,
                    tool: TOOLS.LINE,
                    points: [
                        position,
                        position,
                    ],
                    ...config,
                };
        } else {
            currentStrokeRef.current =
                {
                    id: strokeId,
                    userId:
                        currentUserId,
                    tool: activeTool,
                    points: [position],
                    ...config,
                };
        }

        canvas.setPointerCapture?.(
            event.pointerId
        );

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
            const position =
                getNormalizedPosition(
                    event
                );

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
            getNormalizedPosition(
                event
            );

        if (
            activeTool ===
            TOOLS.LINE
        ) {
            currentStrokeRef.current.points =
                [
                    lineStartRef.current,
                    position,
                ];
        } else {
            currentStrokeRef.current.points.push(
                position
            );
        }

        if (
            roomId &&
            socket.connected
        ) {
            if (
                !syncTimerRef.current
            ) {
                syncTimerRef.current =
                    setTimeout(() => {
                        syncTimerRef.current =
                            null;

                        if (
                            !currentStrokeRef.current
                        ) {
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

            erasedInDragRef.current =
                new Set();

            canvasRef.current?.releasePointerCapture?.(
                event.pointerId
            );

            return;
        }

        if (!drawingRef.current) {
            return;
        }

        drawingRef.current = false;

        if (
            roomId &&
            socket.connected &&
            currentStrokeRef.current
        ) {
            if (
                syncTimerRef.current
            ) {
                clearTimeout(
                    syncTimerRef.current
                );

                syncTimerRef.current =
                    null;
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

        currentStrokeRef.current =
            null;

        lineStartRef.current =
            null;

        if (
            !stroke ||
            stroke.points.length ===
                0
        ) {
            redraw();
            return;
        }

        if (
            stroke.points.length ===
            1
        ) {
            stroke.points.push({
                ...stroke.points[0],
            });
        }

        const data =
            getPageData(pageNumber);

        data.strokes.push(stroke);

        data.redo = [];

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
        const data =
            getPageData(pageNumber);

        if (
            data.strokes.length ===
            0
        ) {
            return;
        }

        let index = -1;

        if (isHost) {
            index =
                data.strokes.length - 1;
        } else {
            for (
                let i =
                    data.strokes.length -
                    1;
                i >= 0;
                i--
            ) {
                if (
                    data.strokes[i]
                        ?.userId ===
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

        const [
            removedStroke,
        ] = data.strokes.splice(
            index,
            1
        );

        data.redo.push(
            removedStroke
        );

        if (
            roomId &&
            socket.connected
        ) {
            socket.emit(
                "pdf:annotations-update",
                {
                    roomId,
                    pageNumber,
                    action: "undo",
                    strokeId:
                        removedStroke.id,
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
        const data =
            getPageData(pageNumber);

        if (
            data.redo.length === 0
        ) {
            return;
        }

        let index = -1;

        if (isHost) {
            index =
                data.redo.length - 1;
        } else {
            for (
                let i =
                    data.redo.length - 1;
                i >= 0;
                i--
            ) {
                if (
                    data.redo[i]
                        ?.userId ===
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
            data.redo.splice(
                index,
                1
            );

        data.strokes.push(stroke);

        if (
            roomId &&
            socket.connected
        ) {
            socket.emit(
                "pdf:annotations-update",
                {
                    roomId,
                    pageNumber,
                    action: "redo",
                    strokeId:
                        stroke.id,
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
        if (!isHost) {
            return;
        }

        const data =
            getPageData(pageNumber);

        if (
            data.strokes.length ===
            0
        ) {
            return;
        }

        data.strokes = [];
        data.redo = [];

        currentStrokeRef.current =
            null;

        lineStartRef.current =
            null;

        drawingRef.current = false;

        if (
            syncTimerRef.current
        ) {
            clearTimeout(
                syncTimerRef.current
            );

            syncTimerRef.current =
                null;
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
    // Toolbar
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

    const selectTool = (
        toolName
    ) => {
        setActiveTool((current) =>
            current === toolName
                ? null
                : toolName
        );
    };

    const canUndo =
        isHost ||
        pageData.strokes.some(
            (stroke) =>
                stroke.userId ===
                currentUserId
        );

    const canRedo =
        isHost ||
        pageData.redo.some(
            (stroke) =>
                stroke.userId ===
                currentUserId
        );

    // ===========================
    // Premium tool button
    // ===========================

    const toolButtonClass = (
        toolName
    ) =>
        `group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border text-sm transition-all duration-300 ${
            activeTool === toolName
                ? "border-violet-400/30 bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-[0_8px_25px_rgba(139,92,246,.25)]"
                : "border-white/[0.07] bg-white/[0.04] text-zinc-400 hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white"
        }`;

    const toolIcon = (tool) => {
        if (tool === TOOLS.SELECT)
            return <FaMousePointer />;

        if (tool === TOOLS.PEN)
            return <FaPen />;

        if (
            tool ===
            TOOLS.HIGHLIGHTER
        )
            return <FaHighlighter />;

        if (tool === TOOLS.LINE)
            return <FaMinus />;

        return <FaEraser />;
    };

    // ===========================
    // Toolbar
    // ===========================

    const toolbar = (
             <div
        className="
            pointer-events-auto
            absolute
            right-3
            top-3
            z-[100]
            flex
            flex-col-reverse
            items-end
            gap-2

            sm:right-4
            sm:top-3

            lg:flex-row
            lg:items-start
        "
    >
            <AnimatePresence>
                {annotationToolbarOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 20,
                            scale: 0.92,
                            filter: "blur(6px)",
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            filter: "blur(0px)",
                        }}
                        exit={{
                            opacity: 0,
                            x: 20,
                            scale: 0.92,
                            filter: "blur(6px)",
                        }}
                        transition={{
                            duration: 0.25,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        className="
    flex
    max-w-[calc(100vw-4.5rem)]
    flex-wrap
    items-center
    justify-end
    gap-1.5
    rounded-2xl
    border
    border-white/[0.09]
    bg-[#09090f]/90
    p-1.5
    shadow-[0_20px_70px_rgba(0,0,0,.45)]
    backdrop-blur-2xl

    lg:max-w-none
    lg:flex-nowrap
"
                    >
                        {/* SELECT */}

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
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
                            {toolIcon(
                                TOOLS.SELECT
                            )}
                        </motion.button>

                        {/* PEN */}

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
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
                            {toolIcon(
                                TOOLS.PEN
                            )}

                            {activeTool ===
                                TOOLS.PEN && (
                                <motion.span
                                    layoutId="active-tool"
                                    className="absolute bottom-1 h-0.5 w-3 rounded-full bg-white"
                                />
                            )}
                        </motion.button>

                        {/* HIGHLIGHTER */}

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
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
                            {toolIcon(
                                TOOLS.HIGHLIGHTER
                            )}

                            {activeTool ===
                                TOOLS.HIGHLIGHTER && (
                                <motion.span
                                    layoutId="active-tool"
                                    className="absolute bottom-1 h-0.5 w-3 rounded-full bg-white"
                                />
                            )}
                        </motion.button>

                        {/* LINE */}

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
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
                            {toolIcon(
                                TOOLS.LINE
                            )}

                            {activeTool ===
                                TOOLS.LINE && (
                                <motion.span
                                    layoutId="active-tool"
                                    className="absolute bottom-1 h-0.5 w-3 rounded-full bg-white"
                                />
                            )}
                        </motion.button>

                        {/* ERASER */}

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
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
                            {toolIcon(
                                TOOLS.ERASER
                            )}

                            {activeTool ===
                                TOOLS.ERASER && (
                                <motion.span
                                    layoutId="active-tool"
                                    className="absolute bottom-1 h-0.5 w-3 rounded-full bg-white"
                                />
                            )}
                        </motion.button>

                        <span className="mx-1 h-7 w-px bg-white/[0.07]" />

                        {/* UNDO */}

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={undo}
                            disabled={!canUndo}
                            title="Undo"
                            aria-label="Undo"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-sm text-zinc-400 transition hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-25"
                        >
                            <FaUndo />
                        </motion.button>

                        {/* REDO */}

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={redo}
                            disabled={!canRedo}
                            title="Redo"
                            aria-label="Redo"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-sm text-zinc-400 transition hover:border-cyan-400/20 hover:bg-cyan-500/10 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-25"
                        >
                            <FaRedo />
                        </motion.button>

                        {/* CLEAR */}

                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.08,
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.92,
                            }}
                            onClick={
                                clearAnnotations
                            }
                            disabled={!isHost}
                            title={
                                isHost
                                    ? "Clear annotations"
                                    : "Only the host can clear annotations"
                            }
                            aria-label="Clear annotations"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/[0.06] text-sm text-red-400 transition hover:border-red-400/20 hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-20"
                        >
                            <FaTrash />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ==========================================
                TOOLBAR TOGGLE
            ========================================== */}

            <motion.button
                type="button"
                whileHover={{
                    scale: 1.08,
                    y: -2,
                }}
                whileTap={{
                    scale: 0.92,
                }}
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
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border shadow-[0_12px_40px_rgba(0,0,0,.35)] backdrop-blur-2xl transition-all duration-300 ${
                    annotationToolbarOpen
                        ? "border-violet-400/30 bg-gradient-to-br from-violet-500 to-cyan-400 text-white"
                        : "border-white/[0.09] bg-[#09090f]/90 text-zinc-300 hover:border-white/[0.15] hover:bg-[#11111a]"
                }`}
            >
                <motion.span
                    animate={
                        annotationToolbarOpen
                            ? {
                                  rotate: 180,
                              }
                            : {
                                  rotate: 0,
                              }
                    }
                    transition={{
                        duration: 0.35,
                    }}
                >
                    {annotationToolbarOpen ? (
                        <FaTimes />
                    ) : (
                        <FaDrawPolygon />
                    )}
                </motion.span>

                {!annotationToolbarOpen && (
                    <motion.span
                        animate={{
                            scale: [
                                1,
                                1.5,
                                1,
                            ],
                            opacity: [
                                0.5,
                                0,
                                0.5,
                            ],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                        }}
                        className="absolute inset-0 rounded-2xl border border-violet-400/20"
                    />
                )}
            </motion.button>
        </div>
    );

    // ===========================
    // Render
    // ===========================

    return (
        <div
            ref={rootRef}
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            {/* ==========================================
                PREMIUM ANNOTATION ATMOSPHERE
            ========================================== */}

            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 20, -15, 0],
                        y: [0, -15, 20, 0],
                        scale: [
                            1,
                            1.08,
                            0.96,
                            1,
                        ],
                    }}
                    transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -left-28 -top-28 h-64 w-64 rounded-full bg-violet-500/[0.035] blur-[100px]"
                />

                <motion.div
                    animate={{
                        x: [0, -20, 15, 0],
                        y: [0, 20, -15, 0],
                        scale: [
                            1,
                            0.94,
                            1.08,
                            1,
                        ],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -bottom-28 -right-28 h-64 w-64 rounded-full bg-cyan-400/[0.025] blur-[100px]"
                />

                <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(139,92,246,.8) 1px, transparent 1px)",
                        backgroundSize:
                            "24px 24px",
                    }}
                />
            </div>

            {/* ==========================================
                LIVE ANNOTATION STATUS
            ========================================== */}

            <AnimatePresence>
                {activeTool &&
                    activeTool !==
                        TOOLS.SELECT && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -15,
                                y: -8,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                x: -10,
                            }}
                            className="pointer-events-none absolute left-4 top-3 z-[80] flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#08080d]/85 px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,.3)] backdrop-blur-2xl"
                        >
                            <span className="relative flex h-2 w-2">
                                <motion.span
                                    animate={{
                                        scale: [
                                            1,
                                            1.7,
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
                                    className="absolute inset-0 rounded-full bg-violet-400"
                                />

                                <span className="relative h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,.8)]" />
                            </span>

                            <span className="text-[9px] font-bold text-zinc-300">
                                {activeTool ===
                                    TOOLS.PEN &&
                                    "Pen active"}

                                {activeTool ===
                                    TOOLS.HIGHLIGHTER &&
                                    "Highlighter active"}

                                {activeTool ===
                                    TOOLS.LINE &&
                                    "Line tool active"}

                                {activeTool ===
                                    TOOLS.ERASER &&
                                    "Eraser active"}
                            </span>

                            <span className="text-zinc-700">
                                •
                            </span>

                            <span className="text-[8px] text-zinc-600">
                                Page{" "}
                                {pageNumber}
                            </span>
                        </motion.div>
                    )}
            </AnimatePresence>

            {/* ==========================================
                ANNOTATION CANVAS
            ========================================== */}

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

            {/* ==========================================
                PORTALED TOOLBAR
            ========================================== */}

            {portalNode &&
                createPortal(
                    toolbar,
                    portalNode
                )}

            {/* ==========================================
                LIVE SYNC INDICATOR
            ========================================== */}

            <div className="pointer-events-none absolute bottom-4 left-4 z-[60] hidden items-center gap-2 rounded-full border border-white/[0.06] bg-[#08080d]/75 px-3 py-1.5 text-[8px] text-zinc-600 backdrop-blur-xl sm:flex">
                <motion.span
                    animate={{
                        opacity: [
                            0.35,
                            1,
                            0.35,
                        ],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                />

                <span>
                    Real-time annotations
                </span>

                <span className="text-zinc-800">
                    •
                </span>

                <span>
                    {pageData.strokes.length}{" "}
                    strokes
                </span>
            </div>

            {/* ==========================================
                HOST BADGE
            ========================================== */}

            {isHost && (
                <div className="pointer-events-none absolute bottom-4 right-4 z-[60] hidden items-center gap-2 rounded-full border border-yellow-400/10 bg-[#08080d]/75 px-3 py-1.5 text-[8px] text-yellow-400/60 backdrop-blur-xl sm:flex">
                    <FaCircle className="text-[4px]" />
                    Host controls enabled
                </div>
            )}
        </div>
    );
};

export default PdfAnnotationLayer;