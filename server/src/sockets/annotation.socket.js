const {
    hostSocketId,
    drawingPermission,
} = require("./roomState");

// roomId -> pageNumber -> { strokes, redo }
const annotationState = new Map();

const getPageState = (roomId, pageNumber) => {
    if (!annotationState.has(roomId)) {
        annotationState.set(roomId, new Map());
    }

    const roomPages = annotationState.get(roomId);

    if (!roomPages.has(pageNumber)) {
        roomPages.set(pageNumber, {
            strokes: [],
            redo: [],
        });
    }

    return roomPages.get(pageNumber);
};

const getSocketUserId = (socket) => {
    return (
        socket.data?.userId?.toString() ||
        null
    );
};

const isHost = (roomId, socket) => {
    return (
        hostSocketId.get(roomId) === socket.id
    );
};

const canDraw = (roomId, socket) => {
    if (isHost(roomId, socket)) {
        return true;
    }

    const userId = getSocketUserId(socket);

    if (!userId) {
        return false;
    }

    const permission =
        drawingPermission.get(roomId) || {
            mode: "everyone",
            allowedUsers: [],
        };

    if (permission.mode === "everyone") {
        return true;
    }

    if (permission.mode === "selected") {
        return permission.allowedUsers.includes(
            userId
        );
    }

    return false;
};

const canModifyStroke = (
    roomId,
    socket,
    stroke
) => {
    if (!stroke) {
        return false;
    }

    if (isHost(roomId, socket)) {
        return true;
    }

    const userId = getSocketUserId(socket);

    return (
        Boolean(userId) &&
        stroke.userId === userId
    );
};

const registerAnnotationSocket = (
    io,
    socket
) => {
    // =========================================
    // Real-time drawing preview
    // =========================================

    socket.on(
        "pdf:annotation-drawing",
        ({ roomId, annotation }) => {
            if (
                !roomId ||
                !annotation ||
                !annotation.strokeId ||
                !annotation.pageNumber
            ) {
                return;
            }

            if (!canDraw(roomId, socket)) {
                return;
            }

            const userId =
                getSocketUserId(socket);

            const host = isHost(
                roomId,
                socket
            );

            if (!userId && !host) {
                return;
            }

            const safeStroke = annotation.stroke
                ? {
                      ...annotation.stroke,
                      id:
                          annotation.stroke.id ||
                          annotation.strokeId,
                      userId:
                          userId || "host",
                  }
                : undefined;

            const safeAnnotation = {
                strokeId:
                    annotation.strokeId,
                pageNumber:
                    annotation.pageNumber,
                phase:
                    annotation.phase,
            };

            if (safeStroke) {
                safeAnnotation.stroke =
                    safeStroke;
            }

            socket
                .to(roomId)
                .emit(
                    "pdf:annotation-drawing",
                    safeAnnotation
                );
        }
    );

    // =========================================
    // Completed annotation
    // =========================================

    socket.on(
        "pdf:annotation",
        ({ roomId, annotation }) => {
            if (
                !roomId ||
                !annotation?.stroke ||
                !annotation.pageNumber
            ) {
                return;
            }

            if (!canDraw(roomId, socket)) {
                return;
            }

            const userId =
                getSocketUserId(socket);

            const host = isHost(
                roomId,
                socket
            );

            if (!userId && !host) {
                return;
            }

            const safeStroke = {
                ...annotation.stroke,

                id:
                    annotation.stroke.id ||
                    annotation.strokeId,

                // NEVER trust frontend ownership.
                userId:
                    userId || "host",
            };

            if (!safeStroke.id) {
                return;
            }

            const data = getPageState(
                roomId,
                annotation.pageNumber
            );

            const existingIndex =
                data.strokes.findIndex(
                    (stroke) =>
                        stroke.id ===
                        safeStroke.id
                );

            if (existingIndex === -1) {
                data.strokes.push(
                    safeStroke
                );
            } else {
                data.strokes[
                    existingIndex
                ] = safeStroke;
            }

            data.redo = [];

            socket
                .to(roomId)
                .emit(
                    "pdf:annotation",
                    {
                        pageNumber:
                            annotation.pageNumber,
                        stroke:
                            safeStroke,
                    }
                );
        }
    );

    // =========================================
    // Annotation operations
    // =========================================

    socket.on(
        "pdf:annotations-update",
        ({
            roomId,
            pageNumber,
            action,
            strokeId,
        }) => {
            if (
                !roomId ||
                !pageNumber ||
                !action ||
                !strokeId
            ) {
                return;
            }

            const data = getPageState(
                roomId,
                pageNumber
            );

            // =====================================
            // REMOVE
            // =====================================

            if (action === "remove") {
                const index =
                    data.strokes.findIndex(
                        (stroke) =>
                            stroke.id ===
                            strokeId
                    );

                if (index === -1) {
                    return;
                }

                const stroke =
                    data.strokes[index];

                if (
                    !canModifyStroke(
                        roomId,
                        socket,
                        stroke
                    )
                ) {
                    return;
                }

                data.strokes.splice(
                    index,
                    1
                );

                data.redo.push(stroke);

                socket
                    .to(roomId)
                    .emit(
                        "pdf:annotations-update",
                        {
                            pageNumber,
                            action: "remove",
                            strokeId,
                        }
                    );

                return;
            }

            // =====================================
            // UNDO
            // =====================================

            if (action === "undo") {
                const index =
                    data.strokes.findIndex(
                        (stroke) =>
                            stroke.id ===
                            strokeId
                    );

                if (index === -1) {
                    return;
                }

                const stroke =
                    data.strokes[index];

                if (
                    !canModifyStroke(
                        roomId,
                        socket,
                        stroke
                    )
                ) {
                    return;
                }

                data.strokes.splice(
                    index,
                    1
                );

                data.redo.push(stroke);

                socket
                    .to(roomId)
                    .emit(
                        "pdf:annotations-update",
                        {
                            pageNumber,
                            action: "undo",
                            stroke,
                        }
                    );

                return;
            }

            // =====================================
            // REDO
            // =====================================

            if (action === "redo") {
                const index =
                    data.redo.findIndex(
                        (stroke) =>
                            stroke.id ===
                            strokeId
                    );

                if (index === -1) {
                    return;
                }

                const stroke =
                    data.redo[index];

                if (
                    !canModifyStroke(
                        roomId,
                        socket,
                        stroke
                    )
                ) {
                    return;
                }

                data.redo.splice(
                    index,
                    1
                );

                data.strokes.push(
                    stroke
                );

                socket
                    .to(roomId)
                    .emit(
                        "pdf:annotations-update",
                        {
                            pageNumber,
                            action: "redo",
                            stroke,
                        }
                    );
            }
        }
    );

    // =========================================
    // Clear — HOST ONLY
    // =========================================

    socket.on(
        "pdf:clear-annotations",
        ({ roomId, pageNumber }) => {
            if (
                !roomId ||
                !pageNumber
            ) {
                return;
            }

            if (
                !isHost(
                    roomId,
                    socket
                )
            ) {
                return;
            }

            const data = getPageState(
                roomId,
                pageNumber
            );

            data.strokes = [];
            data.redo = [];

            socket
                .to(roomId)
                .emit(
                    "pdf:clear-annotations",
                    {
                        pageNumber,
                    }
                );
        }
    );
};

module.exports =
    registerAnnotationSocket;