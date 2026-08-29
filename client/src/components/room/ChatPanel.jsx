import {
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
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

/* ================================================================
   ANIMATED BACKGROUND
================================================================ */

const AnimatedBackground = memo(function AnimatedBackground({
    isMobile,
}) {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
                animate={
                    isMobile
                        ? { opacity: 1 }
                        : {
                              x: [0, 30, -20, 0],
                              y: [0, -20, 30, 0],
                              scale: [1, 1.08, 0.96, 1],
                          }
                }
                transition={{
                    duration: 18,
                    repeat: isMobile ? 0 : Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/[0.07] blur-[90px]"
            />

            <motion.div
                animate={
                    isMobile
                        ? { opacity: 1 }
                        : {
                              x: [0, -25, 15, 0],
                              y: [0, 20, -15, 0],
                          }
                }
                transition={{
                    duration: 16,
                    repeat: isMobile ? 0 : Infinity,
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
});

/* ================================================================
   CHAT HEADER
================================================================ */

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
            className="
                relative z-10
                flex h-[68px] shrink-0
                items-center justify-between
                border-b border-white/[0.07]
                bg-[#09090f]/80
                px-4
                backdrop-blur-2xl
            "
        >
            <div className="flex items-center gap-3">
                <motion.div
                    animate={{
                        boxShadow: [
                            "0 0 0 rgba(139,92,246,0)",
                            "0 0 22px rgba(139,92,246,.25)",
                            "0 0 0 rgba(139,92,246,0)",
                        ],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                    }}
                    className="
                        relative flex h-10 w-10
                        items-center justify-center
                        rounded-xl
                        border border-violet-400/15
                        bg-gradient-to-br
                        from-violet-500/15
                        to-cyan-400/10
                    "
                >
                    <BsThreeDots className="text-sm text-violet-300" />

                    <motion.span
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.7, 0, 0.7],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                        className="
                            absolute inset-0
                            rounded-xl
                            border border-violet-400/20
                        "
                    />
                </motion.div>

                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold tracking-tight text-white">
                            Live Chat
                        </h3>

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
                            className="
                                h-1.5 w-1.5
                                rounded-full
                                bg-emerald-400
                                shadow-[0_0_10px_#34d399]
                            "
                        />
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

            <div className="flex items-center gap-2">
                <motion.div
                    animate={{
                        scale: [1, 1.04, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
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
                </motion.div>
            </div>
        </motion.div>
    );
});

/* ================================================================
   MESSAGE LIST
================================================================ */

const MessageList = memo(function MessageList({
    messages,
    typingUser,
    currentUserId,
    currentUserName,
    isHost,
    onDelete,
}) {
    const messagesEndRef = useRef(null);

    /*
     * Keep scrolling isolated from the input state.
     *
     * IMPORTANT:
     * This effect only runs when the actual message array
     * changes. Typing does not trigger scrolling.
     */
    useEffect(() => {
        const node = messagesEndRef.current;

        if (!node) {
            return;
        }

        requestAnimationFrame(() => {
            node.scrollIntoView({
                behavior: "auto",
                block: "end",
            });
        });
    }, [messages]);

    return (
        <div
            className="
                relative z-10
                min-h-0 flex-1
                space-y-3
                overflow-y-auto
                overscroll-contain
                p-3
                scrollbar-thin
                scrollbar-track-transparent
                scrollbar-thumb-white/10
            "
        >
            {messages.length === 0 ? (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.94,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                    className="
                        flex h-full
                        items-center justify-center
                        px-4 text-center
                    "
                >
                    <div className="relative">
                        <motion.div
                            animate={{
                                scale: [
                                    1,
                                    1.12,
                                    1,
                                ],
                                rotate: [
                                    0,
                                    3,
                                    -3,
                                    0,
                                ],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="
                                mx-auto flex h-16 w-16
                                items-center justify-center
                                rounded-2xl
                                border border-violet-400/10
                                bg-gradient-to-br
                                from-violet-500/10
                                to-cyan-400/10
                                text-violet-300
                                shadow-[0_0_50px_rgba(139,92,246,.12)]
                            "
                        >
                            <BsLightningChargeFill />
                        </motion.div>

                        <p className="mt-5 text-sm font-bold text-zinc-300">
                            No messages yet.
                        </p>

                        <p className="
                            mx-auto mt-2 max-w-[190px]
                            text-[11px] leading-5
                            text-zinc-600
                        ">
                            Start the discussion
                            and turn this quiet
                            room into a live
                            study session.
                        </p>
                    </div>
                </motion.div>
            ) : (
                messages.map((msg, index) => {
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
                        /*
                         * Intentionally NOT using motion/AnimatePresence
                         * here. Existing messages must remain stable.
                         */
                        <div
                            key={
                                msg._id ||
                                `${msg.sender}-${msg.createdAt}-${index}`
                            }
                            className="group"
                        >
                            <MessageBubble
                                sender={
                                    msg.sender?.name ||
                                    msg.sender
                                }
                                text={msg.message}
                                avatar={
                                    msg.avatar ||
                                    msg.sender?.avatar
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
                                isOwn={isOwn}
                                canDelete={
                                    canDelete
                                }
                                onDelete={() =>
                                    onDelete(
                                        msg._id
                                    )
                                }
                            />
                        </div>
                    );
                })
            )}

            {/* TYPING INDICATOR */}

            {typingUser &&
                typingUser !== currentUserName && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 5,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="
                            flex items-center
                            gap-2 px-2 py-1
                        "
                    >
                        <div
                            className="
                                flex items-center
                                gap-[3px]
                                rounded-full
                                border border-white/[0.06]
                                bg-white/[0.025]
                                px-3 py-2
                            "
                        >
                            <span className="text-[9px] text-zinc-500">
                                {typingUser}
                            </span>

                            {[0, 1, 2].map(
                                (dot) => (
                                    <motion.span
                                        key={dot}
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
                                        className="
                                            h-1 w-1
                                            rounded-full
                                            bg-violet-400
                                        "
                                    />
                                )
                            )}
                        </div>
                    </motion.div>
                )}

            <div ref={messagesEndRef} />
        </div>
    );
});

/* ================================================================
   MAIN CHAT PANEL
================================================================ */

const ChatPanel = ({
    roomId,
    isHost = false,
    isMember = false,
}) => {
    const { user } = useAppSelector(
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

    /* ============================================================
       REFS
    ============================================================ */

    const inputRef = useRef(null);

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

    /*
     * Keep latest user available to socket callbacks
     * without recreating listeners.
     */
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    /* ============================================================
       RESPONSIVE
    ============================================================ */

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(max-width: 639px)"
        );

        const updateMobileState = (
            event
        ) => {
            setIsMobile(
                event.matches
            );
        };

        setIsMobile(
            mediaQuery.matches
        );

        mediaQuery.addEventListener(
            "change",
            updateMobileState
        );

        return () => {
            mediaQuery.removeEventListener(
                "change",
                updateMobileState
            );
        };
    }, []);

    /* ============================================================
       SOCKET CONNECTION STATE
    ============================================================ */

    useEffect(() => {
        const handleConnect = () => {
            setIsConnected(true);
        };

        const handleDisconnect = () => {
            setIsConnected(false);
        };

        socket.on(
            "connect",
            handleConnect
        );

        socket.on(
            "disconnect",
            handleDisconnect
        );

        /*
         * Socket can already be connected when component mounts.
         */
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

    /* ============================================================
       MOBILE CHAT INPUT FOCUS
    ============================================================ */

    useEffect(() => {
        if (!isMobile) {
            return;
        }

        /*
         * Do not repeatedly focus on every render.
         *
         * This only runs when the room changes or mobile mode
         * changes.
         */
        const timer = window.setTimeout(
            () => {
                if (
                    socket.connected &&
                    inputRef.current
                ) {
                    inputRef.current.focus({
                        preventScroll: true,
                    });
                }
            },
            120
        );

        return () => {
            window.clearTimeout(
                timer
            );
        };
    }, [roomId, isMobile]);

    /* ============================================================
       DESKTOP EMOJI POSITION
    ============================================================ */

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

    /* ============================================================
       EMOJI POSITION EVENTS
    ============================================================ */

    useEffect(() => {
        if (
            !emojiOpen ||
            isMobile
        ) {
            return;
        }

        const update = () => {
            requestAnimationFrame(
                updateEmojiPosition
            );
        };

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

        window.visualViewport?.addEventListener(
            "resize",
            update
        );

        window.visualViewport?.addEventListener(
            "scroll",
            update
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

            window.visualViewport?.removeEventListener(
                "resize",
                update
            );

            window.visualViewport?.removeEventListener(
                "scroll",
                update
            );
        };
    }, [
        emojiOpen,
        isMobile,
        updateEmojiPosition,
    ]);

    /* ============================================================
       OUTSIDE EMOJI CLICK
    ============================================================ */

    useEffect(() => {
        if (
            !emojiOpen ||
            isMobile
        ) {
            return;
        }

        const handleOutsideClick = (
            event
        ) => {
            const target =
                event.target;

            if (
                emojiButtonRef.current?.contains(
                    target
                )
            ) {
                return;
            }

            if (
                emojiPickerRef.current?.contains(
                    target
                )
            ) {
                return;
            }

            setEmojiOpen(false);

            /*
             * Restore desktop input focus after picker closes.
             */
            requestAnimationFrame(
                () => {
                    inputRef.current?.focus({
                        preventScroll: true,
                    });
                }
            );
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, [emojiOpen, isMobile]);

    /* ============================================================
       ESCAPE
    ============================================================ */

    useEffect(() => {
        const handleEscape = (
            event
        ) => {
            if (
                event.key === "Escape" &&
                emojiOpen
            ) {
                setEmojiOpen(false);

                requestAnimationFrame(
                    () => {
                        inputRef.current?.focus({
                            preventScroll: true,
                        });
                    }
                );
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [emojiOpen]);

    /* ============================================================
       LOAD MESSAGES + SOCKET
    ============================================================ */

    useEffect(() => {
        if (
            !roomId ||
            (!isHost && !isMember)
        ) {
            return;
        }

        let mounted = true;

        const loadMessages =
            async () => {
                try {
                    const { data } =
                        await getRoomMessages(
                            roomId
                        );

                    if (!mounted) {
                        return;
                    }

                    setMessages(
                        data.messages || []
                    );
                } catch (error) {
                    if (!mounted) {
                        return;
                    }

                    toast.error(
                        error.response
                            ?.data
                            ?.message ||
                            "Failed to load chat history"
                    );
                }
            };

        /* --------------------------------------------------------
           NEW MESSAGE
        -------------------------------------------------------- */

        const handleNewMessage = (
            message
        ) => {
            if (!message) {
                return;
            }

            const currentUser =
                userRef.current;

            const normalizedMessage = {
                ...message,

                senderId:
                    message.senderId
                        ?._id ||
                    message.senderId ||
                    message.sender?._id ||
                    currentUser?._id ||
                    null,
            };

            setMessages(
                (previous) => {
                    /*
                     * Prevent duplicate message insertion.
                     */
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
        };

        /* --------------------------------------------------------
           DELETE MESSAGE
        -------------------------------------------------------- */

        const handleMessageDeleted =
            ({ messageId }) => {
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

        /* --------------------------------------------------------
           USER TYPING
        -------------------------------------------------------- */

        const handleUserTyping = ({
            user: typingName,
            userId,
        }) => {
            const currentUser =
                userRef.current;

            /*
             * Never show our own typing indicator.
             */
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

        /* --------------------------------------------------------
           STOP TYPING
        -------------------------------------------------------- */

        const handleUserStopTyping =
            ({ userId } = {}) => {
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

        /*
         * Register listeners before loading history.
         * This reduces the chance of missing a message that
         * arrives during the HTTP request.
         */
        loadMessages();

        return () => {
            mounted = false;

            socket.off(
                "chat:new-message",
                handleNewMessage
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

                typingTimeoutRef.current =
                    null;
            }

            isTypingRef.current =
                false;

            setTypingUser(null);
        };
    }, [
        roomId,
        isHost,
        isMember,
    ]);

    /* ============================================================
       DELETE MESSAGE
    ============================================================ */

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

    /* ============================================================
       TYPING
    ============================================================ */

    const handleTyping =
        useCallback(
            (event) => {
                const value =
                    event.target.value;

                /*
                 * CRITICAL:
                 * Local input state updates FIRST and immediately.
                 *
                 * Socket work never controls the visual input.
                 */
                setInput(value);

                if (
                    !socket.connected ||
                    !roomId
                ) {
                    return;
                }

                const currentUser =
                    userRef.current;

                /*
                 * EMPTY INPUT
                 */
                if (!value.trim()) {
                    if (
                        isTypingRef.current
                    ) {
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
                    }

                    if (
                        typingTimeoutRef.current
                    ) {
                        clearTimeout(
                            typingTimeoutRef.current
                        );

                        typingTimeoutRef.current =
                            null;
                    }

                    return;
                }

                /*
                 * Emit typing only once when the user
                 * starts typing.
                 *
                 * This is much lighter on mobile.
                 */
                if (
                    !isTypingRef.current
                ) {
                    socket.emit(
                        "chat:typing",
                        {
                            roomId,
                            user:
                                currentUser?.name,
                            userId:
                                currentUser?._id,
                        }
                    );

                    isTypingRef.current =
                        true;
                }

                /*
                 * Reset stop-typing timer.
                 */
                if (
                    typingTimeoutRef.current
                ) {
                    clearTimeout(
                        typingTimeoutRef.current
                    );
                }

                typingTimeoutRef.current =
                    window.setTimeout(
                        () => {
                            const latestUser =
                                userRef.current;

                            socket.emit(
                                "chat:stop-typing",
                                {
                                    roomId,
                                    user:
                                        latestUser?.name,
                                    userId:
                                        latestUser?._id,
                                }
                            );

                            isTypingRef.current =
                                false;

                            typingTimeoutRef.current =
                                null;
                        },
                        1200
                    );
            },
            [roomId]
        );

    /* ============================================================
       RESTORE INPUT FOCUS
    ============================================================ */

    const restoreInputFocus =
        useCallback(() => {
            if (!inputRef.current) {
                return;
            }

            /*
             * First frame.
             */
            requestAnimationFrame(
                () => {
                    inputRef.current?.focus({
                        preventScroll: true,
                    });

                    /*
                     * Mobile browsers sometimes need a second
                     * focus attempt after the click event.
                     */
                    if (isMobile) {
                        window.setTimeout(
                            () => {
                                inputRef.current?.focus({
                                    preventScroll: true,
                                });
                            },
                            30
                        );
                    }
                }
            );
        }, [isMobile]);

    /* ============================================================
       SEND MESSAGE
    ============================================================ */

    const handleSend =
        useCallback(
            (event) => {
                event?.preventDefault();

                const text =
                    input.trim();

                if (!text) {
                    /*
                     * Even if there is no text, keep the
                     * mobile input focused.
                     */
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

                /*
                 * SEND
                 */
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

                /*
                 * STOP TYPING
                 */
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

                    typingTimeoutRef.current =
                        null;
                }

                /*
                 * IMPORTANT:
                 *
                 * Clear input immediately.
                 *
                 * This makes:
                 * "Type a message..."
                 *
                 * appear immediately again.
                 */
                setInput("");

                /*
                 * Desktop emoji picker closes.
                 * Mobile picker doesn't exist.
                 */
                setEmojiOpen(false);

                /*
                 * Keep cursor in the input.
                 * This is especially important on mobile.
                 */
                restoreInputFocus();
            },
            [
                input,
                roomId,
                restoreInputFocus,
            ]
        );

    /* ============================================================
       ENTER TO SEND
    ============================================================ */

    const handleKeyDown =
        useCallback(
            (event) => {
                if (
                    event.key ===
                        "Enter" &&
                    !event.shiftKey
                ) {
                    event.preventDefault();

                    handleSend(event);
                }
            },
            [handleSend]
        );

    /* ============================================================
       EMOJI SELECT
    ============================================================ */

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

                /*
                 * Emoji selection must return focus
                 * to the text field.
                 */
                requestAnimationFrame(
                    () => {
                        inputRef.current?.focus({
                            preventScroll: true,
                        });
                    }
                );
            },
            []
        );

    /* ============================================================
       TOGGLE DESKTOP EMOJI
    ============================================================ */

    const toggleEmojiPicker =
        useCallback(() => {
            /*
             * Mobile does not use the custom picker.
             */
            if (isMobile) {
                return;
            }

            setEmojiOpen(
                (previous) =>
                    !previous
            );

            requestAnimationFrame(
                () => {
                    updateEmojiPosition();
                }
            );
        }, [
            isMobile,
            updateEmojiPosition,
        ]);

    /* ============================================================
       PREVENT BUTTON FOCUS STEAL
    ============================================================ */

    const preventFocusSteal =
        useCallback(
            (event) => {
                /*
                 * PointerDown is more reliable than only
                 * mouseDown for touch devices.
                 *
                 * This prevents the send/emoji button from
                 * stealing focus from the input.
                 */
                event.preventDefault();
            },
            []
        );

    /* ============================================================
       DESKTOP EMOJI PORTAL
    ============================================================ */

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
                      className="
                          fixed z-[99999]
                      "
                      style={{
                          top:
                              emojiPosition.top,
                          left:
                              emojiPosition.left,
                          width:
                              emojiPosition.width,
                      }}
                  >
                      <div
                          className="
                              overflow-hidden
                              rounded-2xl
                              border border-white/10
                              shadow-[0_20px_70px_rgba(0,0,0,0.65)]
                          "
                      >
                          <EmojiPicker
                              onEmojiClick={
                                  handleEmojiClick
                              }
                              width="100%"
                              height={
                                  360
                              }
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
                              lazyLoadEmojis={
                                  true
                              }
                              theme="dark"
                          />
                      </div>
                  </div>,
                  document.body
              )
            : null;

    /* ============================================================
       RENDER
    ============================================================ */

    return (
        <>
            <div
                className="
                    relative flex
                    h-full min-h-0
                    flex-col
                    overflow-hidden
                    bg-[#07070c]
                    text-white
                "
            >
                <AnimatedBackground
                    isMobile={
                        isMobile
                    }
                />

                <ChatHeader
                    isConnected={
                        isConnected
                    }
                />

                <MessageList
                    messages={
                        messages
                    }
                    typingUser={
                        typingUser
                    }
                    currentUserId={
                        user?._id
                    }
                    currentUserName={
                        user?.name
                    }
                    isHost={
                        isHost
                    }
                    onDelete={
                        handleDeleteMessage
                    }
                />

                {/* ==================================================
                    MESSAGE INPUT
                ================================================== */}

                <form
                    onSubmit={
                        handleSend
                    }
                    className="
                        relative z-20
                        shrink-0
                        border-t
                        border-white/[0.07]
                        bg-[#08080e]/95
                        p-2.5
                        pb-[calc(0.625rem+env(safe-area-inset-bottom))]
                        backdrop-blur-2xl
                        sm:p-3
                        sm:pb-3
                    "
                >
                    <div
                        className="
                            relative flex
                            items-center
                            gap-2
                        "
                    >
                        <div
                            className="
                                pointer-events-none
                                absolute -inset-2
                                rounded-2xl
                                bg-violet-500/[0.02]
                                blur-xl
                            "
                        />

                        {/* ==================================================
                            DESKTOP EMOJI BUTTON
                        ================================================== */}

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
                            className={`
                                relative
                                hidden
                                h-11 w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                transition-all
                                duration-200
                                sm:flex
                                ${
                                    emojiOpen
                                        ? "border-violet-400/30 bg-violet-500/15 text-violet-300 shadow-[0_0_25px_rgba(139,92,246,.15)]"
                                        : "border-white/[0.08] bg-white/[0.035] text-zinc-500 hover:border-violet-400/20 hover:bg-white/[0.06] hover:text-violet-300"
                                }
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            `}
                            aria-label={
                                emojiOpen
                                    ? "Close emoji picker"
                                    : "Open emoji picker"
                            }
                            title="Emoji"
                        >
                            <FaSmile
                                size={15}
                            />
                        </button>

                        {/* ==================================================
                            INPUT
                        ================================================== */}

                        <div
                            className="
                                group relative
                                flex min-w-0
                                flex-1
                                items-center
                            "
                        >
                            <motion.div
                                animate={{
                                    opacity:
                                        input.trim()
                                            ? 1
                                            : 0,
                                }}
                                className="
                                    pointer-events-none
                                    absolute inset-0
                                    rounded-xl
                                    bg-violet-500/5
                                    blur-md
                                "
                            />

                            <input
                                ref={
                                    inputRef
                                }
                                type="text"
                                value={
                                    input
                                }
                                disabled={
                                    !isConnected
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
                                spellCheck="true"
                                inputMode="text"
                                enterKeyHint="send"
                                className="
                                    relative
                                    w-full min-w-0
                                    rounded-xl
                                    border
                                    border-white/[0.08]
                                    bg-white/[0.035]
                                    px-4 py-3
                                    text-xs
                                    text-white
                                    outline-none
                                    placeholder:text-zinc-600
                                    transition-colors
                                    duration-150
                                    focus:border-violet-400/30
                                    focus:bg-white/[0.05]
                                    focus:ring-4
                                    focus:ring-violet-500/5
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            />

                            {/* DESKTOP READY INDICATOR */}

                            {input.trim() && (
                                <span
                                    className="
                                        pointer-events-none
                                        absolute right-3
                                        hidden
                                        text-[8px]
                                        font-bold
                                        uppercase
                                        tracking-widest
                                        text-violet-400/70
                                        sm:block
                                    "
                                >
                                    ready
                                </span>
                            )}
                        </div>

                        {/* ==================================================
                            SEND BUTTON
                        ================================================== */}

                        <button
                            type="submit"
                            onPointerDown={
                                preventFocusSteal
                            }
                            disabled={
                                !isConnected ||
                                !input.trim()
                            }
                            className="
                                relative
                                flex h-11 w-11
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-xl
                                bg-gradient-to-br
                                from-violet-500
                                to-cyan-400
                                text-white
                                shadow-[0_10px_35px_rgba(139,92,246,.18)]
                                transition-transform
                                duration-150
                                active:scale-95
                                disabled:cursor-not-allowed
                                disabled:bg-white/5
                                disabled:from-zinc-800
                                disabled:to-zinc-800
                                disabled:text-zinc-600
                                disabled:shadow-none
                            "
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
                                className="
                                    absolute
                                    h-10 w-3
                                    rotate-12
                                    bg-white/30
                                    blur-md
                                "
                            />

                            <FaPaperPlane
                                size={13}
                                className="relative"
                            />
                        </button>
                    </div>

                    {/* ==================================================
                        DESKTOP HELPER
                    ================================================== */}

                    <div
                        className="
                            mt-2
                            hidden
                            items-center
                            justify-between
                            px-1
                            lg:flex
                        "
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] text-zinc-700">
                                Press
                            </span>

                            <kbd
                                className="
                                    rounded
                                    border border-white/[0.06]
                                    bg-white/[0.025]
                                    px-1.5 py-0.5
                                    text-[7px]
                                    text-zinc-600
                                "
                            >
                                ENTER
                            </kbd>

                            <span className="text-[8px] text-zinc-700">
                                to send
                            </span>
                        </div>

                        <motion.div
                            animate={{
                                opacity: [
                                    0.4,
                                    0.8,
                                    0.4,
                                ],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                            }}
                            className="
                                flex items-center
                                gap-1.5
                                text-[8px]
                                text-zinc-700
                            "
                        >
                            <span
                                className="
                                    h-1 w-1
                                    rounded-full
                                    bg-emerald-400
                                "
                            />

                            real-time sync
                        </motion.div>
                    </div>
                </form>
            </div>

            {emojiPickerPortal}
        </>
    );
};

export default ChatPanel;