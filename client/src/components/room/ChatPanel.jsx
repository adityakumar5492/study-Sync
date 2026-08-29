import {
    useCallback,
    useEffect,
    useRef,
    useState,
    memo,
} from "react";
import { createPortal } from "react-dom";
import {
    FaPaperPlane,
    FaCircle,
    FaSmile,
} from "react-icons/fa";
import {
    BsThreeDots,
    BsLightningChargeFill,
} from "react-icons/bs";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import { useAppSelector } from "../../redux/hooks";
import socket from "../../socket/socket";
import { getRoomMessages } from "../../api/room.api";
import MessageBubble from "./MessageBubble";

const AnimatedBackground = memo(
    function AnimatedBackground() {
        return (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -20, 30, 0],
                        scale: [1, 1.08, 0.96, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/[0.07] blur-[90px]"
                />

                <motion.div
                    animate={{
                        x: [0, -25, 15, 0],
                        y: [0, 20, -15, 0],
                    }}
                    transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/[0.05] blur-[90px]"
                />

                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
                        backgroundSize: "42px 42px",
                    }}
                />
            </div>
        );
    }
);

const ChatHeader = memo(function ChatHeader({
    isConnected,
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -15,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="relative z-10 flex h-[68px] shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#09090f]/80 px-4 backdrop-blur-2xl"
        >
            <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-cyan-400/10">
                    <BsThreeDots className="text-sm text-violet-300" />
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold tracking-tight text-white">
                            Live Chat
                        </h3>

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </div>

                    <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-600">
                            Study together
                        </span>

                        <span className="text-zinc-800">
                            •
                        </span>

                        <span
                            className={`text-[10px] ${
                                isConnected
                                    ? "text-emerald-400/80"
                                    : "text-red-400/80"
                            }`}
                        >
                            {isConnected
                                ? "Connected"
                                : "Offline"}
                        </span>
                    </div>
                </div>
            </div>

            <div
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-bold ${
                    isConnected
                        ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300"
                        : "border-red-400/15 bg-red-400/[0.06] text-red-300"
                }`}
            >
                <FaCircle className="text-[5px]" />

                {isConnected
                    ? "LIVE"
                    : "OFFLINE"}
            </div>
        </motion.div>
    );
});

const EmptyChat = memo(function EmptyChat() {
    return (
        <div className="flex h-full items-center justify-center px-4 text-center">
            <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/10 to-cyan-400/10 text-violet-300">
                    <BsLightningChargeFill />
                </div>

                <p className="mt-5 text-sm font-bold text-zinc-300">
                    No messages yet.
                </p>

                <p className="mx-auto mt-2 max-w-[190px] text-[11px] leading-5 text-zinc-600">
                    Start the discussion and turn this quiet room into a live study session.
                </p>
            </div>
        </div>
    );
});

const MessageList = memo(
    function MessageList({
        messages,
        typingUser,
        currentUserId,
        currentUserName,
        isHost,
        onDelete,
    }) {
        const messagesContainerRef =
            useRef(null);

        const previousMessageCountRef =
            useRef(messages.length);

        const previousLastMessageIdRef =
            useRef(
                messages.length
                    ? messages[
                          messages.length - 1
                      ]?._id
                    : null
            );

        useEffect(() => {
            const previousCount =
                previousMessageCountRef.current;

            const currentCount =
                messages.length;

            const currentLastMessageId =
                messages[
                    currentCount - 1
                ]?._id || null;

            const messageWasAdded =
                currentCount > previousCount ||
                currentLastMessageId !==
                    previousLastMessageIdRef.current;

            previousMessageCountRef.current =
                currentCount;

            previousLastMessageIdRef.current =
                currentLastMessageId;

            if (
                !messageWasAdded ||
                !messagesContainerRef.current
            ) {
                return;
            }

            requestAnimationFrame(() => {
                const container =
                    messagesContainerRef.current;

                if (container) {
                    container.scrollTo({
                        top: container.scrollHeight,
                        behavior: "auto",
                    });
                }
            });
        }, [messages]);

        return (
            <div
                ref={messagesContainerRef}
                className="relative z-10 min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden overscroll-contain p-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
            >
                {messages.length === 0 ? (
                    <EmptyChat />
                ) : (
                    messages.map(
                        (msg, index) => {
                            const messageSenderId =
                                msg.senderId?._id ||
                                msg.senderId ||
                                msg.sender?._id;

                            const isOwn =
                                messageSenderId
                                    ?.toString() ===
                                currentUserId?.toString();

                            const canDelete =
                                isHost || isOwn;

                            return (
                                <div
                                    key={
                                        msg._id ||
                                        `${msg.sender}-${msg.createdAt}-${index}`
                                    }
                                    className="group"
                                >
                                    <MessageBubble
                                        sender={
                                            msg.sender
                                                ?.name ||
                                            msg.sender
                                        }
                                        text={
                                            msg.message
                                        }
                                        avatar={
                                            msg.avatar ||
                                            msg.sender
                                                ?.avatar
                                        }
                                        time={
                                            msg.createdAt
                                                ? new Date(
                                                      msg.createdAt
                                                  ).toLocaleTimeString(
                                                      [],
                                                      {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      }
                                                  )
                                                : ""
                                        }
                                        isOwn={
                                            isOwn
                                        }
                                        canDelete={
                                            canDelete
                                        }
                                        onDelete={() =>
                                            onDelete(
                                                msg._id
                                            )
                                        }
                                        status={
                                            msg.status
                                        }
                                        deliveredTo={
                                            msg.deliveredTo
                                        }
                                        seenBy={
                                            msg.seenBy
                                        }
                                    />
                                </div>
                            );
                        }
                    )
                )}

                {typingUser &&
                    typingUser !==
                        currentUserName && (
                        <div className="flex items-center gap-2 px-2 py-1">
                            <div className="flex items-center gap-[3px] rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-2">
                                <span className="text-[9px] text-zinc-500">
                                    {typingUser}
                                </span>

                                {[0, 1, 2].map(
                                    (dot) => (
                                        <motion.span
                                            key={
                                                dot
                                            }
                                            animate={{
                                                y: [
                                                    0,
                                                    -3,
                                                    0,
                                                ],
                                                opacity: [
                                                    0.3,
                                                    1,
                                                    0.3,
                                                ],
                                            }}
                                            transition={{
                                                duration: 0.7,
                                                repeat: Infinity,
                                                delay:
                                                    dot *
                                                    0.12,
                                            }}
                                            className="h-1 w-1 rounded-full bg-violet-400"
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}
            </div>
        );
    }
);

const ChatPanel = ({
    roomId,
    isHost = false,
    isMember = false,
}) => {
    const { user } =
        useAppSelector(
            (state) => state.auth
        );

    const [messages, setMessages] =
        useState([]);

    const [input, setInput] =
        useState("");

    const [typingUser, setTypingUser] =
        useState(null);

    const [emojiOpen, setEmojiOpen] =
        useState(false);

    const [emojiPosition, setEmojiPosition] =
        useState({
            top: 0,
            left: 0,
            width: 300,
        });

    const [isMobile, setIsMobile] =
        useState(false);

    const [isConnected, setIsConnected] =
        useState(socket.connected);

    const chatRootRef =
        useRef(null);

    const inputRef =
        useRef(null);

    const typingTimeoutRef =
        useRef(null);

    const isTypingRef =
        useRef(false);

    const userRef =
        useRef(user);

    const emojiButtonRef =
        useRef(null);

    const emojiPickerRef =
        useRef(null);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    // =========================================================
    // Mobile detection
    // =========================================================

    useEffect(() => {
        const mediaQuery =
            window.matchMedia(
                "(max-width: 639px)"
            );

        const update = (event) =>
            setIsMobile(
                event.matches
            );

        setIsMobile(
            mediaQuery.matches
        );

        mediaQuery.addEventListener(
            "change",
            update
        );

        return () =>
            mediaQuery.removeEventListener(
                "change",
                update
            );
    }, []);

    // =========================================================
    // Socket connection status
    // =========================================================

    useEffect(() => {
        const handleConnect =
            () => setIsConnected(true);

        const handleDisconnect =
            () => setIsConnected(false);

        socket.on(
            "connect",
            handleConnect
        );

        socket.on(
            "disconnect",
            handleDisconnect
        );

        setIsConnected(
            socket.connected
        );

        return () => {
            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "disconnect",
                handleDisconnect
            );
        };
    }, []);

    // =========================================================
    // Mobile keyboard / viewport handling
    // =========================================================

    const syncMobileViewport =
        useCallback(() => {
            if (
                !isMobile ||
                !chatRootRef.current
            ) {
                return;
            }

            const viewport =
                window.visualViewport;

            const viewportHeight =
                viewport?.height ||
                window.innerHeight;

            const root =
                chatRootRef.current;

            const top =
                root.getBoundingClientRect()
                    .top;

            const height = Math.max(
                0,
                viewportHeight - top
            );

            root.style.height =
                `${height}px`;

            root.style.maxHeight =
                `${height}px`;
        }, [isMobile]);

    useEffect(() => {
        if (!isMobile) return;

        let frameId = null;

        const update = () => {
            if (frameId !== null) {
                cancelAnimationFrame(
                    frameId
                );
            }

            frameId =
                requestAnimationFrame(
                    () => {
                        frameId = null;
                        syncMobileViewport();
                    }
                );
        };

        update();

        window.visualViewport?.addEventListener(
            "resize",
            update
        );

        window.visualViewport?.addEventListener(
            "scroll",
            update
        );

        window.addEventListener(
            "resize",
            update
        );

        return () => {
            if (frameId !== null) {
                cancelAnimationFrame(
                    frameId
                );
            }

            window.visualViewport?.removeEventListener(
                "resize",
                update
            );

            window.visualViewport?.removeEventListener(
                "scroll",
                update
            );

            window.removeEventListener(
                "resize",
                update
            );
        };
    }, [
        isMobile,
        syncMobileViewport,
    ]);

    const handleInputFocus =
        useCallback(() => {
            if (!isMobile) return;

            syncMobileViewport();

            requestAnimationFrame(() => {
                syncMobileViewport();

                requestAnimationFrame(
                    syncMobileViewport
                );
            });
        }, [
            isMobile,
            syncMobileViewport,
        ]);

    // =========================================================
    // Desktop auto focus
    // =========================================================

    useEffect(() => {
        if (isMobile) return;

        const timeoutId =
            setTimeout(() => {
                if (socket.connected) {
                    inputRef.current?.focus();
                }
            }, 100);

        return () =>
            clearTimeout(timeoutId);
    }, [roomId, isMobile]);

    // =========================================================
    // Emoji picker positioning
    // =========================================================

    const updateEmojiPosition =
        useCallback(() => {
            if (
                isMobile ||
                !emojiButtonRef.current
            ) {
                return;
            }

            const button =
                emojiButtonRef.current.getBoundingClientRect();

            const viewportWidth =
                window.innerWidth;

            const viewportHeight =
                window.visualViewport
                    ?.height ||
                window.innerHeight;

            const pickerWidth = 300;
            const pickerHeight = 360;

            let left =
                button.left +
                button.width / 2 -
                pickerWidth / 2;

            left = Math.max(
                10,
                Math.min(
                    left,
                    viewportWidth -
                        pickerWidth -
                        10
                )
            );

            let top =
                button.top -
                pickerHeight -
                10;

            if (top < 10) {
                top = Math.min(
                    button.bottom + 10,
                    viewportHeight -
                        pickerHeight -
                        10
                );
            }

            top = Math.max(
                10,
                top
            );

            setEmojiPosition({
                top,
                left,
                width: pickerWidth,
            });
        }, [isMobile]);

    useEffect(() => {
        if (
            !emojiOpen ||
            isMobile
        ) {
            return;
        }

        const update = () =>
            requestAnimationFrame(
                updateEmojiPosition
            );

        update();

        window.addEventListener(
            "resize",
            update
        );

        window.addEventListener(
            "scroll",
            update,
            true
        );

        return () => {
            window.removeEventListener(
                "resize",
                update
            );

            window.removeEventListener(
                "scroll",
                update,
                true
            );
        };
    }, [
        emojiOpen,
        isMobile,
        updateEmojiPosition,
    ]);

    useEffect(() => {
        if (
            !emojiOpen ||
            isMobile
        ) {
            return;
        }

        const handleOutsideClick =
            (event) => {
                if (
                    emojiButtonRef.current?.contains(
                        event.target
                    )
                ) {
                    return;
                }

                if (
                    emojiPickerRef.current?.contains(
                        event.target
                    )
                ) {
                    return;
                }

                setEmojiOpen(false);
            };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
    }, [emojiOpen, isMobile]);

    useEffect(() => {
        const handleEscape =
            (event) => {
                if (
                    event.key ===
                    "Escape"
                ) {
                    setEmojiOpen(false);
                }
            };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () =>
            document.removeEventListener(
                "keydown",
                handleEscape
            );
    }, []);

    // =========================================================
    // Load messages + chat socket events
    // =========================================================

    useEffect(() => {
        if (
            !roomId ||
            (!isHost && !isMember)
        ) {
            return;
        }

        let active = true;

        const mergeMessages = (
            history,
            existing
        ) => {
            if (!existing.length) {
                return history;
            }

            const historyIds =
                new Set(
                    history
                        .map(
                            (message) =>
                                message?._id
                        )
                        .filter(Boolean)
                );

            return [
                ...history,
                ...existing.filter(
                    (message) =>
                        !message?._id ||
                        !historyIds.has(
                            message._id
                        )
                ),
            ];
        };

        const loadMessages =
            async () => {
                try {
                    const {
                        data,
                    } =
                        await getRoomMessages(
                            roomId
                        );

                    if (!active) {
                        return;
                    }

                    const history =
                        data?.messages ||
                        [];

                    setMessages(
                        (previous) =>
                            mergeMessages(
                                history,
                                previous
                            )
                    );

                    // Mark messages from other users as
                    // delivered + seen because this chat
                    // panel is currently open.
                    const currentUser =
                        userRef.current;

                    if (
                        currentUser?._id &&
                        socket.connected
                    ) {
                        history.forEach(
                            (message) => {
                                const senderId =
                                    message.senderId?._id ||
                                    message.senderId ||
                                    message.sender?._id;

                                if (
                                    !message?._id ||
                                    !senderId ||
                                    senderId
                                        .toString() ===
                                        currentUser._id.toString()
                                ) {
                                    return;
                                }

                                socket.emit(
                                    "chat:message-delivered",
                                    {
                                        roomId,
                                        messageId:
                                            message._id,
                                        userId:
                                            currentUser._id,
                                    }
                                );

                                socket.emit(
                                    "chat:message-seen",
                                    {
                                        roomId,
                                        messageId:
                                            message._id,
                                        userId:
                                            currentUser._id,
                                    }
                                );
                            }
                        );
                    }
                } catch (error) {
                    if (active) {
                        toast.error(
                            error.response
                                ?.data
                                ?.message ||
                                "Failed to load chat history"
                        );
                    }
                }
            };

        // =====================================================
        // New Message
        // =====================================================

        const handleNewMessage =
            (message) => {
                if (
                    !active ||
                    !message
                ) {
                    return;
                }

                const normalizedMessage = {
                    ...message,

                    senderId:
                        message.senderId?._id ||
                        message.senderId ||
                        message.sender?._id ||
                        null,

                    deliveredTo:
                        Array.isArray(
                            message.deliveredTo
                        )
                            ? message.deliveredTo
                            : [],

                    seenBy:
                        Array.isArray(
                            message.seenBy
                        )
                            ? message.seenBy
                            : [],
                };

                const currentUser =
                    userRef.current;

                const senderId =
                    normalizedMessage.senderId;

                const isOwn =
                    senderId
                        ?.toString() ===
                    currentUser?._id?.toString();

                setMessages(
                    (previous) => {
                        if (
                            normalizedMessage._id &&
                            previous.some(
                                (item) =>
                                    item._id ===
                                    normalizedMessage._id
                            )
                        ) {
                            return previous;
                        }

                        return [
                            ...previous,
                            normalizedMessage,
                        ];
                    }
                );

                // Recipient received the message.
                if (
                    !isOwn &&
                    currentUser?._id &&
                    normalizedMessage._id
                ) {
                    socket.emit(
                        "chat:message-delivered",
                        {
                            roomId,
                            messageId:
                                normalizedMessage._id,
                            userId:
                                currentUser._id,
                        }
                    );

                    // ChatPanel is open, so the message
                    // is considered read immediately.
                    socket.emit(
                        "chat:message-seen",
                        {
                            roomId,
                            messageId:
                                normalizedMessage._id,
                            userId:
                                currentUser._id,
                        }
                    );
                }
            };

        // =====================================================
        // Message Status
        // =====================================================

        const handleMessageStatus =
            ({
                messageId,
                userId,
                status,
            } = {}) => {
                if (
                    !active ||
                    !messageId ||
                    !userId ||
                    !status
                ) {
                    return;
                }

                const currentUser =
                    userRef.current;

                if (
                    !currentUser?._id
                ) {
                    return;
                }

                // Status events coming from ourselves
                // do not need to update our own status
                // unless another recipient generated them.
                setMessages(
                    (previous) =>
                        previous.map(
                            (message) => {
                                if (
                                    message._id !==
                                    messageId
                                ) {
                                    return message;
                                }

                                const deliveredTo =
                                    Array.isArray(
                                        message.deliveredTo
                                    )
                                        ? [
                                              ...message.deliveredTo,
                                          ]
                                        : [];

                                const seenBy =
                                    Array.isArray(
                                        message.seenBy
                                    )
                                        ? [
                                              ...message.seenBy,
                                          ]
                                        : [];

                                if (
                                    status ===
                                    "delivered"
                                ) {
                                    const exists =
                                        deliveredTo.some(
                                            (
                                                entry
                                            ) =>
                                                (
                                                    entry?.user?._id ||
                                                    entry?.user ||
                                                    entry
                                                )
                                                    ?.toString() ===
                                                userId.toString()
                                        );

                                    if (!exists) {
                                        deliveredTo.push(
                                            {
                                                user:
                                                    userId,
                                                at: new Date(),
                                            }
                                        );
                                    }
                                }

                                if (
                                    status ===
                                    "seen"
                                ) {
                                    const deliveredExists =
                                        deliveredTo.some(
                                            (
                                                entry
                                            ) =>
                                                (
                                                    entry?.user?._id ||
                                                    entry?.user ||
                                                    entry
                                                )
                                                    ?.toString() ===
                                                userId.toString()
                                        );

                                    if (
                                        !deliveredExists
                                    ) {
                                        deliveredTo.push(
                                            {
                                                user:
                                                    userId,
                                                at: new Date(),
                                            }
                                        );
                                    }

                                    const seenExists =
                                        seenBy.some(
                                            (
                                                entry
                                            ) =>
                                                (
                                                    entry?.user?._id ||
                                                    entry?.user ||
                                                    entry
                                                )
                                                    ?.toString() ===
                                                userId.toString()
                                        );

                                    if (
                                        !seenExists
                                    ) {
                                        seenBy.push(
                                            {
                                                user:
                                                    userId,
                                                at: new Date(),
                                            }
                                        );
                                    }
                                }

                                return {
                                    ...message,
                                    deliveredTo,
                                    seenBy,
                                };
                            }
                        )
                );
            };

        // =====================================================
        // Message Deleted
        // =====================================================

        const handleMessageDeleted =
            ({
                messageId,
            } = {}) => {
                if (!messageId) {
                    return;
                }

                setMessages(
                    (previous) =>
                        previous.filter(
                            (message) =>
                                message._id !==
                                messageId
                        )
                );
            };

        // =====================================================
        // Typing
        // =====================================================

        const handleUserTyping =
            ({
                user: typingName,
                userId,
            } = {}) => {
                const currentUser =
                    userRef.current;

                if (
                    userId &&
                    currentUser?._id &&
                    userId.toString() ===
                        currentUser._id.toString()
                ) {
                    return;
                }

                if (
                    typingName &&
                    typingName !==
                        currentUser?.name
                ) {
                    setTypingUser(
                        typingName
                    );
                }
            };

        const handleUserStopTyping =
            ({
                userId,
            } = {}) => {
                const currentUser =
                    userRef.current;

                if (
                    userId &&
                    currentUser?._id &&
                    userId.toString() ===
                        currentUser._id.toString()
                ) {
                    return;
                }

                setTypingUser(null);
            };

        socket.on(
            "chat:new-message",
            handleNewMessage
        );

        socket.on(
            "chat:message-status",
            handleMessageStatus
        );

        socket.on(
            "chat:message-deleted",
            handleMessageDeleted
        );

        socket.on(
            "chat:user-typing",
            handleUserTyping
        );

        socket.on(
            "chat:user-stop-typing",
            handleUserStopTyping
        );

        loadMessages();

        return () => {
            active = false;

            socket.off(
                "chat:new-message",
                handleNewMessage
            );

            socket.off(
                "chat:message-status",
                handleMessageStatus
            );

            socket.off(
                "chat:message-deleted",
                handleMessageDeleted
            );

            socket.off(
                "chat:user-typing",
                handleUserTyping
            );

            socket.off(
                "chat:user-stop-typing",
                handleUserStopTyping
            );

            if (
                typingTimeoutRef.current
            ) {
                clearTimeout(
                    typingTimeoutRef.current
                );
            }

            typingTimeoutRef.current =
                null;

            isTypingRef.current =
                false;

            setTypingUser(null);
        };
    }, [
        roomId,
        isHost,
        isMember,
    ]);

    // =========================================================
    // Delete Message
    // =========================================================

    const handleDeleteMessage =
        useCallback(
            (messageId) => {
                const currentUser =
                    userRef.current;

                if (
                    !messageId ||
                    !roomId ||
                    !currentUser?._id
                ) {
                    return;
                }

                if (!socket.connected) {
                    toast.error(
                        "Socket disconnected."
                    );
                    return;
                }

                socket.emit(
                    "chat:delete-message",
                    {
                        roomId,
                        messageId,
                        senderId:
                            currentUser._id,
                    }
                );
            },
            [roomId]
        );

    // =========================================================
    // Typing
    // =========================================================

    const handleTyping =
        useCallback(
            (event) => {
                const value =
                    event.target.value;

                setInput(value);

                if (
                    !socket.connected ||
                    !roomId
                ) {
                    return;
                }

                const currentUser =
                    userRef.current;

                if (!value.trim()) {
                    if (
                        isTypingRef.current
                    ) {
                        socket.emit(
                            "chat:stop-typing",
                            {
                                roomId,
                                user: currentUser?.name,
                                userId:
                                    currentUser?._id,
                            }
                        );

                        isTypingRef.current =
                            false;
                    }

                    if (
                        typingTimeoutRef.current
                    ) {
                        clearTimeout(
                            typingTimeoutRef.current
                        );
                    }

                    typingTimeoutRef.current =
                        null;

                    return;
                }

                if (
                    !isTypingRef.current
                ) {
                    socket.emit(
                        "chat:typing",
                        {
                            roomId,
                            user: currentUser?.name,
                            userId:
                                currentUser?._id,
                        }
                    );

                    isTypingRef.current =
                        true;
                }

                if (
                    typingTimeoutRef.current
                ) {
                    clearTimeout(
                        typingTimeoutRef.current
                    );
                }

                typingTimeoutRef.current =
                    setTimeout(() => {
                        socket.emit(
                            "chat:stop-typing",
                            {
                                roomId,
                                user: currentUser?.name,
                                userId:
                                    currentUser?._id,
                            }
                        );

                        isTypingRef.current =
                            false;

                        typingTimeoutRef.current =
                            null;
                    }, 1200);
            },
            [roomId]
        );

    // =========================================================
    // Restore input focus
    // =========================================================

    const restoreInputFocus =
        useCallback(() => {
            const inputElement =
                inputRef.current;

            if (
                !inputElement ||
                !isConnected
            ) {
                return;
            }

            inputElement.focus({
                preventScroll: true,
            });

            if (isMobile) {
                requestAnimationFrame(
                    () => {
                        inputElement.focus({
                            preventScroll: true,
                        });

                        syncMobileViewport();
                    }
                );
            }
        }, [
            isConnected,
            isMobile,
            syncMobileViewport,
        ]);

    // =========================================================
    // Send Message
    // =========================================================

    const handleSend =
        useCallback(
            (event) => {
                event?.preventDefault();

                const currentInput =
                    inputRef.current
                        ?.value ?? input;

                const text =
                    currentInput.trim();

                if (!text) {
                    restoreInputFocus();
                    return;
                }

                if (!socket.connected) {
                    toast.error(
                        "Socket disconnected."
                    );

                    restoreInputFocus();
                    return;
                }

                const currentUser =
                    userRef.current;

                socket.emit(
                    "chat:send-message",
                    {
                        roomId,
                        sender:
                            currentUser?.name,
                        senderId:
                            currentUser?._id,
                        avatar:
                            currentUser?.avatar,
                        message: text,
                    }
                );

                socket.emit(
                    "chat:stop-typing",
                    {
                        roomId,
                        user:
                            currentUser?.name,
                        userId:
                            currentUser?._id,
                    }
                );

                isTypingRef.current =
                    false;

                if (
                    typingTimeoutRef.current
                ) {
                    clearTimeout(
                        typingTimeoutRef.current
                    );
                }

                typingTimeoutRef.current =
                    null;

                setInput("");

                setEmojiOpen(false);

                restoreInputFocus();
            },
            [
                input,
                roomId,
                restoreInputFocus,
            ]
        );

    // =========================================================
    // Enter to send
    // =========================================================

    const handleKeyDown =
        useCallback(
            (event) => {
                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {
                    event.preventDefault();
                    handleSend(event);
                }
            },
            [handleSend]
        );

    // =========================================================
    // Emoji
    // =========================================================

    const handleEmojiClick =
        useCallback(
            (emojiData) => {
                const emoji =
                    emojiData?.emoji;

                if (!emoji) {
                    return;
                }

                setInput(
                    (previous) =>
                        previous + emoji
                );

                requestAnimationFrame(
                    () =>
                        inputRef.current?.focus(
                            {
                                preventScroll:
                                    true,
                            }
                        )
                );
            },
            []
        );

    const toggleEmojiPicker =
        useCallback(() => {
            if (isMobile) {
                return;
            }

            setEmojiOpen(
                (previous) =>
                    !previous
            );

            requestAnimationFrame(
                updateEmojiPosition
            );
        }, [
            isMobile,
            updateEmojiPosition,
        ]);

    const preventFocusSteal =
        useCallback((event) => {
            event.preventDefault();
        }, []);

    // =========================================================
    // Emoji Portal
    // =========================================================

    const emojiPickerPortal =
        emojiOpen &&
        !isMobile &&
        typeof document !==
            "undefined"
            ? createPortal(
                  <div
                      ref={
                          emojiPickerRef
                      }
                      className="fixed z-[99999]"
                      style={{
                          top: emojiPosition.top,
                          left: emojiPosition.left,
                          width: emojiPosition.width,
                      }}
                  >
                      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.65)]">
                          <EmojiPicker
                              onEmojiClick={
                                  handleEmojiClick
                              }
                              width="100%"
                              height={360}
                              previewConfig={{
                                  showPreview:
                                      false,
                              }}
                              skinTonesDisabled={
                                  false
                              }
                              searchDisabled={
                                  false
                              }
                              lazyLoadEmojis
                              theme="dark"
                          />
                      </div>
                  </div>,
                  document.body
              )
            : null;

    // =========================================================
    // Render
    // =========================================================

    return (
        <>
            <div
                ref={chatRootRef}
                className={`relative flex min-h-0 flex-col overflow-hidden bg-[#07070c] text-white ${
                    isMobile
                        ? "absolute inset-x-0 top-0"
                        : "h-full"
                }`}
            >
                <AnimatedBackground />

                <ChatHeader
                    isConnected={
                        isConnected
                    }
                />

                <MessageList
                    messages={messages}
                    typingUser={
                        typingUser
                    }
                    currentUserId={
                        user?._id
                    }
                    currentUserName={
                        user?.name
                    }
                    isHost={isHost}
                    onDelete={
                        handleDeleteMessage
                    }
                />

                <form
                    onSubmit={handleSend}
                    className="relative z-20 shrink-0 border-t border-white/[0.07] bg-[#08080e]/95 p-2.5 backdrop-blur-2xl sm:p-3"
                >
                    <div className="relative flex items-center gap-2">
                        <button
                            ref={
                                emojiButtonRef
                            }
                            type="button"
                            onPointerDown={
                                preventFocusSteal
                            }
                            onClick={
                                toggleEmojiPicker
                            }
                            disabled={
                                !isConnected
                            }
                            className={`relative hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 sm:flex ${
                                emojiOpen
                                    ? "border-violet-400/30 bg-violet-500/15 text-violet-300"
                                    : "border-white/[0.08] bg-white/[0.035] text-zinc-500 hover:border-violet-400/20 hover:bg-white/[0.06] hover:text-violet-300"
                            }`}
                            aria-label={
                                emojiOpen
                                    ? "Close emoji picker"
                                    : "Open emoji picker"
                            }
                        >
                            <FaSmile
                                size={15}
                            />
                        </button>

                        <div className="group relative flex min-w-0 flex-1 items-center">
                            <input
                                ref={
                                    inputRef
                                }
                                type="text"
                                value={input}
                                disabled={
                                    !isConnected
                                }
                                onFocus={
                                    handleInputFocus
                                }
                                onKeyDown={
                                    handleKeyDown
                                }
                                onChange={
                                    handleTyping
                                }
                                placeholder={
                                    isConnected
                                        ? "Type a message..."
                                        : "Connecting..."
                                }
                                autoComplete="off"
                                autoCorrect="on"
                                autoCapitalize="sentences"
                                spellCheck
                                enterKeyHint="send"
                                inputMode="text"
                                className="relative w-full min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-[16px] text-white outline-none placeholder:text-zinc-600 transition-[border-color,background-color,box-shadow] duration-150 focus:border-violet-400/30 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/5 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation sm:text-xs"
                            />

                            {input.trim() && (
                                <span className="pointer-events-none absolute right-3 hidden text-[8px] font-bold uppercase tracking-widest text-violet-400/70 sm:block">
                                    ready
                                </span>
                            )}
                        </div>

                        <motion.button
                            type="submit"
                            onPointerDown={
                                preventFocusSteal
                            }
                            disabled={
                                !isConnected ||
                                !input.trim()
                            }
                            whileHover={
                                !isConnected ||
                                !input.trim()
                                    ? {}
                                    : {
                                          scale: 1.05,
                                          rotate: -3,
                                      }
                            }
                            whileTap={
                                !isConnected ||
                                !input.trim()
                                    ? {}
                                    : {
                                          scale: 0.94,
                                      }
                            }
                            className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-[0_10px_35px_rgba(139,92,246,.18)] transition disabled:cursor-not-allowed disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:shadow-none touch-manipulation"
                            aria-label="Send message"
                        >
                            <motion.span
                                animate={
                                    input.trim()
                                        ? {
                                              x: [
                                                  -35,
                                                  45,
                                              ],
                                          }
                                        : {}
                                }
                                transition={{
                                    duration: 1.3,
                                    repeat: Infinity,
                                }}
                                className="absolute h-10 w-3 rotate-12 bg-white/30 blur-md"
                            />

                            <FaPaperPlane
                                size={13}
                                className="relative"
                            />
                        </motion.button>
                    </div>

                    <div className="mt-2 hidden items-center justify-between px-1 lg:flex">
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] text-zinc-700">
                                Press
                            </span>

                            <kbd className="rounded border border-white/[0.06] bg-white/[0.025] px-1.5 py-0.5 text-[7px] text-zinc-600">
                                ENTER
                            </kbd>

                            <span className="text-[8px] text-zinc-700">
                                to send
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[8px] text-zinc-700">
                            <span className="h-1 w-1 rounded-full bg-emerald-400" />
                            real-time sync
                        </div>
                    </div>
                </form>
            </div>

            {emojiPickerPortal}
        </>
    );
};

export default ChatPanel;