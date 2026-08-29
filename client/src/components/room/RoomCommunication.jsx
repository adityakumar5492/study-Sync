import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    FaUsers,
    FaComments,
    FaMicrophone,
    FaPen,
    FaTimes,
} from "react-icons/fa";

import Participants from "./Participants";
import ChatPanel from "./ChatPanel";
import VoicePanel from "./voice/VoicePanel";
import socket from "../../socket/socket";

const RoomCommunication = ({
    room,
    roomId,
    currentUser,
    onlineUsers,
    isHost,
    isMember,
    onRemoveMember,
    drawingPermission,
    onDrawingPermissionChange,
}) => {
    const [activePanel, setActivePanel] =
        useState("participants");

    const [mobileOpen, setMobileOpen] =
        useState(false);

    /*
     * =========================================================
     * UNREAD CHAT MESSAGES
     *
     * The unread count belongs to the current user/socket.
     *
     * The backend sends:
     *
     *     chat:unread-count
     *
     * whenever this user's unread count changes.
     *
     * RoomCommunication listens to that event even when
     * ChatPanel is closed, so the Chat tab can continue showing
     * the unread badge.
     *
     * ChatPanel remains responsible for opening the chat and
     * marking messages as actually seen.
     * =========================================================
     */

    const [unreadMessageCount, setUnreadMessageCount] =
        useState(0);

    /*
     * =========================================================
     * SOCKET UNREAD COUNT LISTENER
     *
     * IMPORTANT:
     *
     * Do NOT mark anything as seen here.
     *
     * This listener only receives the unread count belonging
     * to this socket/user and updates the navigation badge.
     * =========================================================
     */

    useEffect(() => {
        if (!socket || !roomId) {
            return undefined;
        }

        const handleUnreadCount = ({
            roomId: eventRoomId,
            count,
        } = {}) => {
            /*
             * Ignore unread-count events belonging to another
             * room.
             */
            if (
                eventRoomId?.toString() !==
                roomId?.toString()
            ) {
                return;
            }

            const normalizedCount =
                Number.isFinite(Number(count))
                    ? Math.max(0, Number(count))
                    : 0;

            setUnreadMessageCount(
                normalizedCount
            );
        };

        socket.on(
            "chat:unread-count",
            handleUnreadCount
        );

        return () => {
            socket.off(
                "chat:unread-count",
                handleUnreadCount
            );
        };
    }, [roomId]);

    const handleUnreadCountChange = useCallback(
        (count) => {
            const normalizedCount =
                Number.isFinite(Number(count))
                    ? Math.max(0, Number(count))
                    : 0;

            setUnreadMessageCount(
                normalizedCount
            );
        },
        []
    );

    /*
     * =========================================================
     * MOBILE KEYBOARD / VISUAL VIEWPORT
     * =========================================================
     */

    const [visualViewportHeight, setVisualViewportHeight] =
        useState(null);

    const [visualViewportOffsetTop, setVisualViewportOffsetTop] =
        useState(0);

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        const visualViewport = window.visualViewport;

        if (!visualViewport) {
            return undefined;
        }

        let frameId = null;

        const updateVisualViewport = () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }

            frameId = requestAnimationFrame(() => {
                setVisualViewportHeight(
                    Math.round(visualViewport.height)
                );

                setVisualViewportOffsetTop(
                    Math.round(visualViewport.offsetTop)
                );
            });
        };

        updateVisualViewport();

        visualViewport.addEventListener(
            "resize",
            updateVisualViewport
        );

        visualViewport.addEventListener(
            "scroll",
            updateVisualViewport
        );

        window.addEventListener(
            "orientationchange",
            updateVisualViewport
        );

        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }

            visualViewport.removeEventListener(
                "resize",
                updateVisualViewport
            );

            visualViewport.removeEventListener(
                "scroll",
                updateVisualViewport
            );

            window.removeEventListener(
                "orientationchange",
                updateVisualViewport
            );
        };
    }, []);

    /*
     * =========================================================
     * MOBILE BODY SCROLL LOCK
     * =========================================================
     */

    useEffect(() => {
        if (!mobileOpen) {
            return undefined;
        }

        const previousOverflow =
            document.body.style.overflow;

        const previousTouchAction =
            document.body.style.touchAction;

        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";

        return () => {
            document.body.style.overflow =
                previousOverflow;

            document.body.style.touchAction =
                previousTouchAction;
        };
    }, [mobileOpen]);

    // ===========================
    // NORMALIZE USER ID
    // ===========================

    const getUserId = useCallback((user) => {
        if (!user) {
            return null;
        }

        if (typeof user === "string") {
            return user.toString();
        }

        if (typeof user === "object") {
            return (
                user._id?.toString() ||
                user.id?.toString() ||
                user.userId?.toString() ||
                null
            );
        }

        return user?.toString() || null;
    }, []);

    // ===========================
    // UNIQUE ROOM MEMBERS
    // ===========================

    const uniqueMembers = useMemo(() => {
        const members = Array.isArray(room?.members)
            ? room.members
            : [];

        const map = new Map();

        members.forEach((member) => {
            const userId = getUserId(member);

            if (!userId) {
                return;
            }

            if (!map.has(userId)) {
                map.set(userId, member);
            }
        });

        return Array.from(map.values());
    }, [room?.members, getUserId]);

    // ===========================
    // UNIQUE ONLINE USERS
    // ===========================

    const uniqueOnlineUsers = useMemo(() => {
        const users = Array.isArray(onlineUsers)
            ? onlineUsers
            : [];

        const map = new Map();

        users.forEach((onlineUser) => {
            const userId = getUserId(onlineUser);

            if (!userId) {
                return;
            }

            if (!map.has(userId)) {
                map.set(userId, onlineUser);
            }
        });

        return Array.from(map.values());
    }, [onlineUsers, getUserId]);

    // ===========================
    // COUNTS
    // ===========================

    const participantsCount =
        uniqueMembers.length;

    const onlineCount =
        uniqueOnlineUsers.length;

    // ===========================
    // CURRENT USER
    // ===========================

    const currentUserId =
        currentUser?._id?.toString();

    const canDraw =
        isHost ||
        drawingPermission?.mode === "everyone" ||
        (
            drawingPermission?.mode === "selected" &&
            drawingPermission?.allowedUsers?.some(
                (id) =>
                    id?.toString() ===
                    currentUserId
            )
        );

    // ===========================
    // MOBILE PANEL CHANGE
    // ===========================

    const handlePanelChange = useCallback(
        (panel) => {
            if (activePanel === panel) {
                setMobileOpen(
                    (previous) => !previous
                );

                return;
            }

            setActivePanel(panel);
            setMobileOpen(true);
        },
        [activePanel]
    );

    // ===========================
    // DESKTOP PANEL CHANGE
    // ===========================

    const handleDesktopPanelChange =
        useCallback((panel) => {
            setActivePanel(panel);
        }, []);

    // ===========================
    // MOBILE CLOSE
    // ===========================

    const closeMobilePanel = useCallback(() => {
        setMobileOpen(false);
    }, []);

    // ===========================
    // DRAWING CONTENT
    // ===========================

    const drawingContent = (
        <div className="h-full min-h-0 min-w-0 overflow-y-auto overflow-x-hidden p-2.5 sm:p-3 lg:p-4">
            <div className="mb-3 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3 shadow-sm sm:mb-4 sm:p-4">
                <h3 className="text-sm font-semibold tracking-tight text-white sm:text-base">
                    Drawing Access
                </h3>

                <p className="mt-1 text-[9px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
                    Choose who can annotate the PDF.
                </p>
            </div>

            {isHost && (
                <div className="space-y-1.5 rounded-xl border border-slate-800/80 bg-slate-950/40 p-1.5 sm:space-y-2 sm:p-2">
                    {/* HOST ONLY */}

                    <button
                        type="button"
                        onClick={() =>
                            onDrawingPermissionChange({
                                mode: "none",
                                allowedUsers: [],
                            })
                        }
                        className="flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-left text-[11px] text-slate-300 transition-colors hover:border-slate-700/70 hover:bg-slate-800/80 hover:text-white sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm"
                    >
                        <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                                drawingPermission?.mode ===
                                "none"
                                    ? "border-green-500"
                                    : "border-slate-600"
                            }`}
                        >
                            {drawingPermission?.mode ===
                                "none" && (
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                            )}
                        </span>

                        <span className="truncate">
                            Host Only
                        </span>
                    </button>

                    {/* EVERYONE */}

                    <button
                        type="button"
                        onClick={() =>
                            onDrawingPermissionChange({
                                mode: "everyone",
                                allowedUsers: [],
                            })
                        }
                        className="flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-left text-[11px] text-slate-300 transition-colors hover:border-slate-700/70 hover:bg-slate-800/80 hover:text-white sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm"
                    >
                        <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                                drawingPermission?.mode ===
                                "everyone"
                                    ? "border-green-500"
                                    : "border-slate-600"
                            }`}
                        >
                            {drawingPermission?.mode ===
                                "everyone" && (
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                            )}
                        </span>

                        <span className="truncate">
                            Everyone
                        </span>
                    </button>

                    {/* SELECTED */}

                    <button
                        type="button"
                        onClick={() =>
                            onDrawingPermissionChange({
                                mode: "selected",
                                allowedUsers:
                                    drawingPermission?.allowedUsers ||
                                    [],
                            })
                        }
                        className="flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-left text-[11px] text-slate-300 transition-colors hover:border-slate-700/70 hover:bg-slate-800/80 hover:text-white sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm"
                    >
                        <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                                drawingPermission?.mode ===
                                "selected"
                                    ? "border-green-500"
                                    : "border-slate-600"
                            }`}
                        >
                            {drawingPermission?.mode ===
                                "selected" && (
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                            )}
                        </span>

                        <span className="truncate">
                            Selected Users
                        </span>
                    </button>

                    {drawingPermission?.mode ===
                        "selected" && (
                        <div className="mt-2 border-t border-slate-800/80 pt-3 sm:mt-3 sm:pt-4">
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <p className="truncate text-[10px] font-semibold text-slate-400 sm:text-xs">
                                    Select users
                                </p>

                                <span className="shrink-0 text-[8px] text-slate-600">
                                    {
                                        drawingPermission
                                            ?.allowedUsers
                                            ?.length
                                    }{" "}
                                    selected
                                </span>
                            </div>

                            <div className="max-h-[min(14rem,30vh)] space-y-1 overflow-y-auto overflow-x-hidden pr-1">
                                {uniqueMembers.map(
                                    (member) => {
                                        const userId =
                                            getUserId(
                                                member
                                            );

                                        if (!userId) {
                                            return null;
                                        }

                                        const selected =
                                            drawingPermission
                                                ?.allowedUsers
                                                ?.some(
                                                    (id) =>
                                                        id?.toString() ===
                                                        userId
                                                );

                                        const name =
                                            member?.name ||
                                            member?.username ||
                                            member?.email ||
                                            "User";

                                        return (
                                            <button
                                                key={userId}
                                                type="button"
                                                onClick={() => {
                                                    const current =
                                                        drawingPermission
                                                            ?.allowedUsers ||
                                                        [];

                                                    const next =
                                                        selected
                                                            ? current.filter(
                                                                  (
                                                                      id
                                                                  ) =>
                                                                      id?.toString() !==
                                                                      userId
                                                              )
                                                            : [
                                                                  ...current,
                                                                  userId,
                                                              ];

                                                    onDrawingPermissionChange(
                                                        {
                                                            mode: "selected",
                                                            allowedUsers:
                                                                next,
                                                        }
                                                    );
                                                }}
                                                className="flex w-full min-w-0 items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-left text-[11px] text-slate-300 transition-colors hover:border-slate-700/70 hover:bg-slate-800/80 hover:text-white sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm"
                                            >
                                                <span
                                                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                                        selected
                                                            ? "border-green-500 bg-green-500"
                                                            : "border-slate-600"
                                                    }`}
                                                >
                                                    {selected && (
                                                        <span className="text-[9px] font-bold text-white">
                                                            ✓
                                                        </span>
                                                    )}
                                                </span>

                                                <span className="min-w-0 truncate">
                                                    {name}
                                                </span>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!isHost && (
                <div className="rounded-xl border border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 p-3 shadow-lg shadow-black/10 sm:rounded-2xl sm:p-4 lg:p-5">
                    <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl sm:mb-4 sm:h-11 sm:w-11 ${
                            canDraw
                                ? "bg-green-500/10 text-green-400"
                                : "bg-slate-800 text-slate-500"
                        }`}
                    >
                        <FaPen size={14} />
                    </div>

                    <p className="text-sm font-semibold text-white">
                        {canDraw
                            ? "Drawing allowed"
                            : "Drawing restricted"}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
                        {canDraw
                            ? "The host has allowed you to annotate the PDF."
                            : "The host has not allowed you to annotate the PDF."}
                    </p>
                </div>
            )}
        </div>
    );

    // ===========================
    // CHAT BADGE
    // ===========================

    const chatBadge =
        unreadMessageCount > 0 && (
            <span className="shrink-0 rounded-full bg-green-500 px-1.5 py-0.5 text-[8px] font-bold leading-none text-slate-950">
                {unreadMessageCount > 99
                    ? "99+"
                    : unreadMessageCount}
            </span>
        );

    // ===========================
    // MOBILE ACTIVE PANEL
    // ===========================

    const mobilePanelContent = (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {activePanel === "participants" && (
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                    <div className="flex shrink-0 items-center justify-between border-b border-slate-800/70 px-3 py-2.5">
                        <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                                <FaUsers className="text-[10px]" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-[10px] font-bold text-white">
                                    Live Participants
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
                        <Participants
                            room={room}
                            roomId={roomId}
                            participants={uniqueMembers}
                            onlineUsers={uniqueOnlineUsers}
                            onRemoveMember={onRemoveMember}
                        />
                    </div>
                </div>
            )}

            {activePanel === "chat" && (
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                    <ChatPanel
                        roomId={roomId}
                        isHost={isHost}
                        isMember={isMember}
                        onUnreadCountChange={
                            handleUnreadCountChange
                        }
                    />
                </div>
            )}

            {activePanel === "voice" && (
                <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
                    <VoicePanel
                        roomId={roomId}
                        currentUser={currentUser}
                    />
                </div>
            )}

            {activePanel === "drawing" && (
                <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
                    {drawingContent}
                </div>
            )}
        </div>
    );

    /*
     * =========================================================
     * MOBILE DRAWER STYLE
     * =========================================================
     */

    const mobileDrawerStyle =
        visualViewportHeight
            ? {
                  height: `${visualViewportHeight}px`,
                  top: `${visualViewportOffsetTop}px`,
              }
            : {
                  height: "100dvh",
                  top: 0,
              };

    return (
        <>
            {/* =====================================================
                MOBILE COMMUNICATION
            ====================================================== */}

            <div className="lg:hidden">
                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            {/* BACKDROP */}

                            <motion.button
                                type="button"
                                aria-label="Close communication panel"
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 0.15,
                                }}
                                onClick={
                                    closeMobilePanel
                                }
                                className="fixed inset-0 z-[100] cursor-default bg-black/60 backdrop-blur-[2px]"
                            />

                            {/* MOBILE DRAWER */}

                            <motion.section
                                initial={{
                                    x: "100%",
                                }}
                                animate={{
                                    x: 0,
                                }}
                                exit={{
                                    x: "100%",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 420,
                                    damping: 38,
                                    mass: 0.8,
                                }}
                                style={
                                    mobileDrawerStyle
                                }
                                className="
                                    fixed right-0 z-[110]
                                    flex
                                    w-[88vw]
                                    max-w-[420px]
                                    flex-col
                                    overflow-hidden
                                    border-l
                                    border-slate-700/80
                                    bg-slate-950
                                    shadow-[-20px_0_60px_rgba(0,0,0,0.55)]
                                "
                            >
                                {/* DRAWER HEADER */}

                                <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/95 px-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                                        <span className="truncate text-xs font-semibold text-white">
                                            {activePanel ===
                                                "participants" &&
                                                "Participants"}

                                            {activePanel ===
                                                "chat" &&
                                                "Live Chat"}

                                            {activePanel ===
                                                "voice" &&
                                                "Voice"}

                                            {activePanel ===
                                                "drawing" &&
                                                "Drawing"}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            closeMobilePanel
                                        }
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-95"
                                        aria-label="Close communication panel"
                                    >
                                        <FaTimes className="text-sm" />
                                    </button>
                                </div>

                                {/* CONTENT */}

                                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                                    {mobilePanelContent}
                                </div>
                            </motion.section>
                        </>
                    )}
                </AnimatePresence>

                {/* =================================================
                    MOBILE BOTTOM DOCK
                ================================================== */}

                {!mobileOpen && (
                    <div className="fixed inset-x-0 bottom-0 z-[90] px-2 pb-2 sm:px-3 sm:pb-3">
                        <div className="mx-auto flex w-full max-w-xl items-stretch gap-1 rounded-2xl border border-slate-700/80 bg-slate-900/98 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
                            {/* PARTICIPANTS */}

                            <button
                                type="button"
                                onClick={() =>
                                    handlePanelChange(
                                        "participants"
                                    )
                                }
                                className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 text-[10px] font-semibold text-slate-400 transition-all duration-200 hover:bg-slate-800/80 hover:text-slate-200 sm:px-1.5 sm:py-2.5 sm:text-[10px]"
                                aria-label="Open participants"
                            >
                                <FaUsers className="shrink-0 text-[10px]" />

                                <span className="hidden truncate xs:inline sm:inline">
                                    participants
                                </span>

                                <span className="shrink-0 rounded-full bg-slate-800 px-1.5 py-0.5 text-[8px] leading-none text-slate-500">
                                    {participantsCount}
                                </span>
                            </button>

                            {/* CHAT */}

                            <button
                                type="button"
                                onClick={() =>
                                    handlePanelChange(
                                        "chat"
                                    )
                                }
                                className="relative flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 text-[10px] font-semibold text-slate-400 transition-all duration-200 hover:bg-slate-800/80 hover:text-slate-200 sm:px-1.5 sm:py-2.5 sm:text-[10px]"
                                aria-label="Open chat"
                            >
                                <FaComments className="shrink-0 text-[10px]" />

                                <span className="hidden truncate xs:inline sm:inline">
                                    Chat
                                </span>

                                {chatBadge}
                            </button>

                            {/* VOICE */}

                            <button
                                type="button"
                                onClick={() =>
                                    handlePanelChange(
                                        "voice"
                                    )
                                }
                                className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 text-[10px] font-semibold text-slate-400 transition-all duration-200 hover:bg-slate-800/80 hover:text-slate-200 sm:px-1.5 sm:py-2.5 sm:text-[10px]"
                                aria-label="Open voice"
                            >
                                <FaMicrophone className="shrink-0 text-[10px]" />

                                <span className="hidden truncate xs:inline sm:inline">
                                    Voice
                                </span>
                            </button>

                            {/* DRAWING */}

                            <button
                                type="button"
                                onClick={() =>
                                    handlePanelChange(
                                        "drawing"
                                    )
                                }
                                className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 text-[10px] font-semibold text-slate-400 transition-all duration-200 hover:bg-slate-800/80 hover:text-slate-200 sm:px-1.5 sm:py-2.5 sm:text-[10px]"
                                aria-label="Open drawing"
                            >
                                <FaPen className="shrink-0 text-[10px]" />

                                <span className="hidden truncate xs:inline sm:inline">
                                    Drawing Access
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* =====================================================
                DESKTOP COMMUNICATION SIDEBAR
            ====================================================== */}

            <div className="hidden h-full min-h-0 min-w-0 flex-col overflow-hidden bg-slate-950 lg:flex">
                {/* DESKTOP TABS */}

                <div className="grid shrink-0 grid-cols-4 gap-px border-b border-slate-800/80 bg-slate-900/95 px-0.5 pt-0.5 shadow-lg shadow-black/10">
                    {/* PARTICIPANTS */}

                    <button
                        type="button"
                        onClick={() =>
                            handleDesktopPanelChange(
                                "participants"
                            )
                        }
                        className={`flex min-w-0 items-center justify-center gap-1 overflow-hidden rounded-t-lg px-1 py-2.5 text-[10px] font-semibold transition-colors sm:gap-1.5 sm:px-1.5 sm:py-3 sm:text-[11px] ${
                            activePanel ===
                            "participants"
                                ? "bg-slate-800 text-green-400 shadow-sm"
                                : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                        }`}
                    >
                        <FaUsers className="shrink-0 text-[10px] sm:text-[11px]" />

                        <span className="min-w-0 truncate">
                            Participants
                        </span>

                        <span className="shrink-0 rounded-full bg-slate-800 px-1.5 py-0.5 text-[8px] font-bold leading-none text-slate-500">
                            {participantsCount}
                        </span>
                    </button>

                    {/* CHAT */}

                    <button
                        type="button"
                        onClick={() =>
                            handleDesktopPanelChange(
                                "chat"
                            )
                        }
                        className={`flex min-w-0 items-center justify-center gap-1.5 overflow-hidden rounded-t-lg px-1 py-2.5 text-[10px] font-semibold transition-colors sm:px-1.5 sm:py-3 sm:text-[11px] ${
                            activePanel ===
                            "chat"
                                ? "bg-slate-800 text-green-400 shadow-sm"
                                : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                        }`}
                    >
                        <FaComments className="shrink-0 text-[10px] sm:text-[11px]" />

                        <span className="truncate">
                            Chat
                        </span>

                        {chatBadge}
                    </button>

                    {/* VOICE */}

                    <button
                        type="button"
                        onClick={() =>
                            handleDesktopPanelChange(
                                "voice"
                            )
                        }
                        className={`flex min-w-0 items-center justify-center gap-1.5 overflow-hidden rounded-t-lg px-1 py-2.5 text-[10px] font-semibold transition-colors sm:px-1.5 sm:py-3 sm:text-[11px] ${
                            activePanel ===
                            "voice"
                                ? "bg-slate-800 text-green-400 shadow-sm"
                                : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                        }`}
                    >
                        <FaMicrophone className="shrink-0 text-[10px] sm:text-[11px]" />

                        <span className="truncate">
                            Voice
                        </span>
                    </button>

                    {/* DRAWING */}

                    <button
                        type="button"
                        onClick={() =>
                            handleDesktopPanelChange(
                                "drawing"
                            )
                        }
                        className={`flex min-w-0 items-center justify-center gap-1.5 overflow-hidden rounded-t-lg px-1 py-2.5 text-[10px] font-semibold transition-colors sm:px-1.5 sm:py-3 sm:text-[11px] ${
                            activePanel ===
                            "drawing"
                                ? "bg-slate-800 text-green-400 shadow-sm"
                                : "text-slate-500 hover:bg-slate-800/80 hover:text-slate-200"
                        }`}
                    >
                        <FaPen className="shrink-0 text-[9px] sm:text-[10px]" />

                        <span className="truncate">
                            Drawing
                        </span>
                    </button>
                </div>

                {/* DESKTOP ACTIVE PANEL */}

                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-slate-900/70">
                    {/* PARTICIPANTS */}

                    {activePanel ===
                        "participants" && (
                        <div className="flex h-full min-h-0 min-w-0 flex-col">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-800/70 px-3 py-2.5 sm:px-4 sm:py-3">
                                <div className="flex min-w-0 items-center gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                                        <FaUsers className="text-[10px]" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-[10px] font-bold text-white sm:text-[11px]">
                                            Live Participants
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
                                <Participants
                                    room={room}
                                    roomId={roomId}
                                    participants={
                                        uniqueMembers
                                    }
                                    onlineUsers={
                                        uniqueOnlineUsers
                                    }
                                    onRemoveMember={
                                        onRemoveMember
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {/* CHAT */}

                    {activePanel === "chat" && (
                        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                            <ChatPanel
                                roomId={roomId}
                                isHost={isHost}
                                isMember={isMember}
                                onUnreadCountChange={
                                    handleUnreadCountChange
                                }
                            />
                        </div>
                    )}

                    {/* VOICE */}

                    {activePanel === "voice" && (
                        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                            <VoicePanel
                                roomId={roomId}
                                currentUser={
                                    currentUser
                                }
                            />
                        </div>
                    )}

                    {/* DRAWING */}

                    {activePanel === "drawing" &&
                        drawingContent}
                </div>
            </div>
        </>
    );
};

export default RoomCommunication;