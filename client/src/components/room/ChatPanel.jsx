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

/* ================================================================
   STATIC BACKGROUND
================================================================ */

const AnimatedBackground = memo(function AnimatedBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* DESKTOP ATMOSPHERE */}

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
                        relative
                        flex h-10 w-10
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
   EMPTY STATE

   Shown ONLY when loading has finished AND there are genuinely
   zero messages. See ChatLoadingSkeleton below for the loading
   state, and MessageList for the state-selection logic.
================================================================ */

const EmptyChat = memo(function EmptyChat() {
    return (
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
                        mx-auto
                        flex h-16 w-16
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
                    mx-auto mt-2
                    max-w-[190px]
                    text-[11px]
                    leading-5
                    text-zinc-600
                ">
                    Start the discussion and turn
                    this quiet room into a live
                    study session.
                </p>

                <div className="mt-5 flex justify-center gap-1">
                    {[0, 1, 2, 3, 4].map(
                        (item) => (
                            <motion.span
                                key={item}
                                animate={{
                                    height: [
                                        4,
                                        10 + item * 2,
                                        4,
                                    ],
                                }}
                                transition={{
                                    duration:
                                        0.8 +
                                        item * 0.08,
                                    repeat: Infinity,
                                    delay:
                                        item * 0.08,
                                }}
                                className="
                                    w-1 rounded-full
                                    bg-gradient-to-t
                                    from-violet-500
                                    to-cyan-300
                                "
                            />
                        )
                    )}
                </div>
            </div>
        </motion.div>
    );
});

/* ================================================================
   LOADING SKELETON

   NEW. Shown while the initial message history request is in
   flight. This is what stops "No messages yet" from flashing
   before we actually know whether the room has messages.

   Deliberately CSS-only (Tailwind's animate-pulse) rather than
   Framer Motion -- it's on screen only briefly, but there's no
   reason to spin up JS-driven animation for a loading placeholder.
================================================================ */

const CHAT_SKELETON_ROWS = [
    { align: "start", width: "w-40" },
    { align: "end", width: "w-56" },
    { align: "start", width: "w-64" },
    { align: "start", width: "w-32" },
    { align: "end", width: "w-44" },
];

const ChatLoadingSkeleton = memo(function ChatLoadingSkeleton() {
    return (
        <div
            className="flex h-full flex-col justify-end gap-3 p-3"
            role="status"
            aria-label="Loading messages"
        >
            {CHAT_SKELETON_ROWS.map(
                (row, index) => (
                    <div
                        key={index}
                        className={`flex items-end gap-2 ${
                            row.align === "end"
                                ? "flex-row-reverse"
                                : ""
                        }`}
                    >
                        <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-white/[0.06]" />

                        <div
                            className={`h-10 ${row.width} animate-pulse rounded-2xl bg-white/[0.06]`}
                        />
                    </div>
                )
            )}
        </div>
    );
});

/* ================================================================
   TYPING INDICATOR ROW

   Split out from the message list on purpose.

   PERFORMANCE FIX:
   Previously, typingUser lived directly inside MessageList's
   props, so every remote "chat:user-typing" event (which fires
   frequently while someone else types) caused MessageList's memo
   check to fail and the ENTIRE messages.map() to re-render.

   By isolating the typing indicator into its own memoized
   component, a typingUser change now only re-renders this small
   row -- the (potentially long) message list underneath is
   completely unaffected.
================================================================ */

const TypingIndicatorRow = memo(function TypingIndicatorRow({
    typingUser,
    currentUserName,
}) {
    if (
        !typingUser ||
        typingUser === currentUserName
    ) {
        return null;
    }

    return (
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
            <div className="
                flex items-center
                gap-[3px]
                rounded-full
                border border-white/[0.06]
                bg-white/[0.025]
                px-3 py-2
            ">
                <span className="
                    text-[9px]
                    text-zinc-500
                ">
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
                                duration:
                                    0.7,
                                repeat:
                                    Infinity,
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
    );
});

/* ================================================================
   MESSAGES ONLY

   PERFORMANCE FIX:
   This is the expensive part of the list (the .map() creating one
   MessageBubble per message). It is now its own memoized
   component whose props are ONLY messages/currentUserId/isHost/
   onDelete -- none of which change when typingUser or the
   composer's input changes. That means React can bail out of
   re-rendering this subtree entirely whenever something unrelated
   (typing indicator, composer input) changes elsewhere in the
   tree.

   `onDelete` here is the STABLE useCallback from ChatPanel, passed
   straight through (no per-item inline arrow function). Combined
   with MessageBubble now being memoized and taking `messageId`
   instead of a pre-bound closure, unchanged messages genuinely
   skip re-rendering when new messages are appended.
================================================================ */

const MessagesOnly = memo(function MessagesOnly({
    messages,
    currentUserId,
    isHost,
    onDelete,
}) {
    return (
        <>
            {messages.map(
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
                                messageId={
                                    msg._id
                                }
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
                                isOwn={isOwn}
                                canDelete={
                                    canDelete
                                }
                                onDelete={
                                    onDelete
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
            )}
        </>
    );
});

/* ================================================================
   MESSAGE LIST

   Owns the scroll container + auto-scroll-on-new-message effect.

   Renders exactly one of three states:

   1. isLoading            -> ChatLoadingSkeleton
   2. !isLoading && empty  -> EmptyChat
   3. !isLoading && has    -> MessagesOnly

   This is the fix for Issue 5: previously the component only ever
   checked `messages.length === 0`, so "No messages yet" flashed
   during the initial fetch even when the room already had history.
================================================================ */

const MessageList = memo(function MessageList({
    messages,
    isLoading,
    typingUser,
    currentUserId,
    currentUserName,
    isHost,
    onDelete,
}) {
    const messagesContainerRef =
        useRef(null);

    const messagesEndRef =
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

    /* ------------------------------------------------------------
       SCROLL ONLY WHEN A REAL MESSAGE IS ADDED

       This is deliberately NOT dependent on typingUser or loading
       state. Typing indicators and loading transitions therefore
       cannot force scrolling, and the user's scroll position is
       never fought with unless a genuinely new message arrives.
    ------------------------------------------------------------ */

    useEffect(() => {
        const previousCount =
            previousMessageCountRef.current;

        const currentCount =
            messages.length;

        const lastMessage =
            messages[currentCount - 1];

        const currentLastMessageId =
            lastMessage?._id || null;

        const messageWasAdded =
            currentCount > previousCount ||
            currentLastMessageId !==
                previousLastMessageIdRef.current;

        previousMessageCountRef.current =
            currentCount;

        previousLastMessageIdRef.current =
            currentLastMessageId;

        if (!messageWasAdded) {
            return;
        }

        const container =
            messagesContainerRef.current;

        if (!container) {
            return;
        }

        /*
         * Always move to the latest message.
         * requestAnimationFrame waits until the new
         * message has actually been painted into layout.
         */
        requestAnimationFrame(() => {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "auto",
            });
        });
    }, [messages]);

    let content;

    if (isLoading) {
        content = <ChatLoadingSkeleton />;
    } else if (messages.length === 0) {
        content = <EmptyChat />;
    } else {
        content = (
            <MessagesOnly
                messages={messages}
                currentUserId={
                    currentUserId
                }
                isHost={isHost}
                onDelete={onDelete}
            />
        );
    }

    return (
        <div
            ref={messagesContainerRef}
            className="
                relative z-10
                min-h-0 flex-1
                space-y-3
                overflow-y-auto
                overflow-x-hidden
                overscroll-contain
                p-3
                scrollbar-thin
                scrollbar-track-transparent
                scrollbar-thumb-white/10
            "
        >
            {content}

            {/* --------------------------------------------------
                TYPING INDICATOR

                Isolated into its own memoized component -- see
                comment above TypingIndicatorRow for why.
            -------------------------------------------------- */}

            <TypingIndicatorRow
                typingUser={typingUser}
                currentUserName={
                    currentUserName
                }
            />

            <div ref={messagesEndRef} />
        </div>
    );
});

/* ================================================================
   MESSAGE COMPOSER

   NEW. Extracted from ChatPanel on purpose.

   PERFORMANCE FIX (Issue 2):
   `input` state, the emoji picker, typing-emit logic, and send
   logic all now live INSIDE this memoized component instead of
   in ChatPanel. That means:

   - Typing a character only re-renders THIS component. It cannot
     touch MessageList, ChatHeader, or AnimatedBackground, because
     those aren't even siblings inside this component's render
     scope -- they live in the parent and this component's props
     (roomId, isConnected, isMobile, userRef, syncMobileViewport)
     don't change on keystroke.
   - Conversely, a new message arriving (which changes `messages`
     in ChatPanel) cannot re-render the composer, because none of
     this component's props change either. React.memo bails out.

   syncMobileViewport is still owned by ChatPanel (it resizes the
   whole panel's root element, not just the composer), so it's
   passed down as a stable callback prop.
================================================================ */

const MessageComposer = memo(function MessageComposer({
    roomId,
    isConnected,
    isMobile,
    userRef,
    syncMobileViewport,
}) {
    const [input, setInput] =
        useState("");

    const [emojiOpen, setEmojiOpen] =
        useState(false);

    const [emojiPosition, setEmojiPosition] =
        useState({
            top: 0,
            left: 0,
            width: 300,
        });

    const inputRef =
        useRef(null);

    const typingTimeoutRef =
        useRef(null);

    const isTypingRef =
        useRef(false);

    const emojiButtonRef =
        useRef(null);

    const emojiPickerRef =
        useRef(null);

    /* ============================================================
       INPUT FOCUS (DESKTOP AUTOFOCUS)

       IMPORTANT:
       We DO NOT autofocus on mobile.

       Browser must receive the real user gesture (tap) before
       opening the keyboard.

       Desktop can still autofocus.
    ============================================================ */

    useEffect(() => {
        if (isMobile) {
            return;
        }

        const timeoutId =
            setTimeout(() => {
                if (
                    socket.connected &&
                    inputRef.current
                ) {
                    inputRef.current.focus();
                }
            }, 100);

        return () =>
            clearTimeout(timeoutId);
    }, [
        roomId,
        isMobile,
    ]);

    /* ============================================================
       INPUT FOCUS HANDLER (MOBILE KEYBOARD)

       PERFORMANCE FIX (Issue 1):
       Previously this triggered syncMobileViewport() immediately
       AND inside a nested triple requestAnimationFrame. At the
       moment of tapping, window.visualViewport.height has not yet
       changed (the OS keyboard animates in over time), so those
       extra calls did real layout work (getBoundingClientRect +
       style writes) for no benefit -- pure wasted cost exactly
       when responsiveness matters most.

       The authoritative resize is still caught by ChatPanel's
       visualViewport "resize" listener once the keyboard actually
       finishes opening. We keep one immediate call (harmless) plus
       a single follow-up frame for Android's slightly-delayed
       viewport update, instead of three redundant recomputations.
    ============================================================ */

    const handleInputFocus =
        useCallback(() => {
            if (!isMobile) {
                return;
            }

            syncMobileViewport();

            requestAnimationFrame(
                syncMobileViewport
            );
        }, [
            isMobile,
            syncMobileViewport,
        ]);

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

            /* Smaller desktop picker. */
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
       CLOSE DESKTOP EMOJI ON OUTSIDE CLICK
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
    }, [
        emojiOpen,
        isMobile,
    ]);

    /* ============================================================
       ESC CLOSE EMOJI
    ============================================================ */

    useEffect(() => {
        const handleEscape = (
            event
        ) => {
            if (
                event.key ===
                    "Escape" &&
                emojiOpen
            ) {
                setEmojiOpen(false);
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
       TYPING
    ============================================================ */

    const handleTyping =
        useCallback(
            (event) => {
                const value =
                    event.target.value;

                /*
                 * CRITICAL:
                 * Update React state immediately.
                 *
                 * This state is now local to the composer, so it
                 * can never cascade into the message list or the
                 * rest of ChatPanel.
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
                 * Empty input = stop typing.
                 */
                if (
                    !value.trim()
                ) {
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
                 * Emit typing ONLY when typing starts.
                 *
                 * Do NOT emit on every character.
                 * This is important for mobile performance.
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
                 * Refresh stop-typing timer.
                 */
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
                                user:
                                    currentUser?.name,
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
            [roomId, userRef]
        );

    /* ============================================================
       KEEP INPUT FOCUSED AFTER SEND
    ============================================================ */

    const restoreInputFocus =
        useCallback(() => {
            const inputElement =
                inputRef.current;

            if (!inputElement) {
                return;
            }

            /*
             * Focus immediately.
             */
            inputElement.focus({
                preventScroll: true,
            });

            /*
             * Android sometimes updates keyboard/visualViewport
             * one frame later. Sync again after focus.
             */
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
            isMobile,
            syncMobileViewport,
        ]);

    /* ============================================================
       SEND MESSAGE
    ============================================================ */

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
                    /*
                     * Even if nothing was sent, keep focus.
                     */
                    restoreInputFocus();
                    return;
                }

                if (
                    !socket.connected
                ) {
                    toast.error(
                        "Socket disconnected."
                    );

                    restoreInputFocus();
                    return;
                }

                const currentUser =
                    userRef.current;

                /*
                 * Send message.
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
                 * Stop typing.
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
                 * Clear input immediately.
                 *
                 * React will instantly render:
                 * "Type a message..."
                 */
                setInput("");

                /*
                 * Close desktop emoji picker only.
                 */
                setEmojiOpen(false);

                /*
                 * MOST IMPORTANT MOBILE BEHAVIOR:
                 *
                 * Keep input focused.
                 * Keyboard therefore remains open.
                 */
                restoreInputFocus();
            },
            [
                input,
                roomId,
                restoreInputFocus,
                userRef,
            ]
        );

    /* ============================================================
       ENTER SEND
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
                 * Emoji picker is desktop-only.
                 */
                requestAnimationFrame(
                    () => {
                        inputRef.current?.focus();
                    }
                );
            },
            []
        );

    /* ============================================================
       DESKTOP EMOJI TOGGLE
    ============================================================ */

    const toggleEmojiPicker =
        useCallback(() => {
            /*
             * Mobile has NO custom emoji picker.
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
                 * Prevent button from becoming the active element.
                 *
                 * This is critical on Android because tapping
                 * the send button can otherwise blur the input
                 * and close the keyboard.
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
                      <div className="
                          overflow-hidden
                          rounded-2xl
                          border border-white/10
                          shadow-[0_20px_70px_rgba(0,0,0,0.65)]
                      ">
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

    return (
        <>
            <form
                onSubmit={
                    handleSend
                }
                className="
                    relative z-20
                    shrink-0
                    border-t border-white/[0.07]
                    bg-[#08080e]/95
                    p-2.5
                    backdrop-blur-2xl
                    sm:p-3
                "
            >
                <div className="
                    relative
                    flex
                    items-center
                    gap-2
                ">
                    <div className="
                        pointer-events-none
                        absolute
                        -inset-2
                        rounded-2xl
                        bg-violet-500/[0.02]
                        blur-xl
                    " />

                    {/* ==================================================
                        DESKTOP EMOJI BUTTON

                        Completely absent on mobile.
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
                        <FaSmile size={15} />
                    </button>

                    {/* ==================================================
                        INPUT
                    ================================================== */}

                    <div className="
                        group
                        relative
                        flex
                        min-w-0
                        flex-1
                        items-center
                    ">
                        {/* Lightweight glow.
                            No motion animation here so typing
                            remains extremely cheap. */}
                        <div
                            className={`
                                pointer-events-none
                                absolute
                                inset-0
                                rounded-xl
                                bg-violet-500/5
                                blur-md
                                transition-opacity
                                duration-150
                                ${
                                    input.trim()
                                        ? "opacity-100"
                                        : "opacity-0"
                                }
                            `}
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
                            spellCheck={
                                true
                            }
                            enterKeyHint="send"
                            inputMode="text"
                            className="
                                relative
                                w-full
                                min-w-0
                                rounded-xl
                                border border-white/[0.08]
                                bg-white/[0.035]
                                px-4
                                py-3
                                text-xs
                                text-white
                                outline-none

                                placeholder:text-zinc-600

                                transition-[border-color,background-color,box-shadow]
                                duration-150

                                focus:border-violet-400/30
                                focus:bg-white/[0.05]
                                focus:ring-4
                                focus:ring-violet-500/5

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                touch-manipulation
                                text-[16px] sm:text-xs
                            "
                        />

                        {/* Desktop only */}
                        {input.trim() && (
                            <span className="
                                pointer-events-none
                                absolute
                                right-3
                                hidden
                                text-[8px]
                                font-bold
                                uppercase
                                tracking-widest
                                text-violet-400/70
                                sm:block
                            ">
                                ready
                            </span>
                        )}
                    </div>

                    {/* ==================================================
                        SEND BUTTON
                    ================================================== */}

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
                        className="
                            relative
                            flex
                            h-11 w-11
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

                            transition

                            disabled:cursor-not-allowed
                            disabled:bg-white/5
                            disabled:from-zinc-800
                            disabled:to-zinc-800
                            disabled:text-zinc-600
                            disabled:shadow-none

                            touch-manipulation
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
                    </motion.button>
                </div>

                {/* ==================================================
                    DESKTOP HELPER
                ================================================== */}

                <div className="
                    mt-2
                    hidden
                    items-center
                    justify-between
                    px-1
                    lg:flex
                ">
                    <div className="
                        flex
                        items-center
                        gap-2
                    ">
                        <span className="
                            text-[8px]
                            text-zinc-700
                        ">
                            Press
                        </span>

                        <kbd className="
                            rounded
                            border border-white/[0.06]
                            bg-white/[0.025]
                            px-1.5
                            py-0.5
                            text-[7px]
                            text-zinc-600
                        ">
                            ENTER
                        </kbd>

                        <span className="
                            text-[8px]
                            text-zinc-700
                        ">
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
                            flex
                            items-center
                            gap-1.5
                            text-[8px]
                            text-zinc-700
                        "
                    >
                        <span className="
                            h-1 w-1
                            rounded-full
                            bg-emerald-400"
                        />

                        real-time sync
                    </motion.div>
                </div>
            </form>

            {emojiPickerPortal}
        </>
    );
});

/* ================================================================
   MAIN CHAT PANEL
================================================================ */

const ChatPanel = ({
    roomId,
    isHost = false,
    isMember = false,
    onUnreadCountChange,
}) => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const [messages, setMessages] =
        useState([]);

    /*
     * NEW: real loading state (Issue 5 fix).
     *
     * Previously this was tracked only via a ref (roomLoadingRef)
     * that was never read anywhere, so the UI had no way to
     * distinguish "still fetching" from "fetched and empty" and
     * always fell back to messages.length === 0, flashing
     * "No messages yet" during every load.
     */
    const [isLoadingMessages, setIsLoadingMessages] =
        useState(true);

    const [typingUser, setTypingUser] =
        useState(null);

    const [isMobile, setIsMobile] =
        useState(false);

    const [isConnected, setIsConnected] =
        useState(socket.connected);

    /* ------------------------------------------------------------
       REFS
    ------------------------------------------------------------ */

    const chatRootRef =
        useRef(null);

    const userRef =
        useRef(user);

    /* Keep latest user available to socket callbacks. */
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    /* ============================================================
       CHAT OPEN / CLOSE STATE

       ChatPanel owns the actual chat-open lifecycle.
       RoomCommunication only displays the navigation badge.

       When this component mounts, tell the server that Chat is
       open so the server can mark existing unread messages as
       seen. When it unmounts, tell the server that Chat is closed
       so future messages remain unread.

       Re-emit chat:open after reconnect because the server-side
       socket state is lost when a Socket.IO connection is rebuilt.
    ============================================================ */

    useEffect(() => {
        if (
            !roomId ||
            (!isHost && !isMember)
        ) {
            return undefined;
        }

        const currentUser = userRef.current;
        const userId = currentUser?._id;

        if (!userId) {
            return undefined;
        }

        const openChat = () => {
            if (!socket.connected) {
                return;
            }

            socket.emit("chat:open", {
                roomId,
                userId,
            });
        };

        const handleConnect = () => {
            openChat();
        };

        socket.on("connect", handleConnect);

        openChat();

        return () => {
            socket.off("connect", handleConnect);

            if (socket.connected) {
                socket.emit("chat:close", {
                    roomId,
                });
            }
        };
    }, [roomId, isHost, isMember]);

    /*
     * Keep the optional parent callback synchronized with the
     * server unread-count event while ChatPanel is mounted.
     * The parent remains the owner of the navigation badge.
     */
    useEffect(() => {
        if (!onUnreadCountChange || !roomId) {
            return undefined;
        }

        const handleUnreadCount = ({
            roomId: eventRoomId,
            count,
        } = {}) => {
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

            onUnreadCountChange(normalizedCount);
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
    }, [
        roomId,
        onUnreadCountChange,
    ]);

    /* ============================================================
       DEVICE / BREAKPOINT
    ============================================================ */

    useEffect(() => {
        const mediaQuery =
            window.matchMedia(
                "(max-width: 639px)"
            );

        const updateMobileState = (
            event
        ) => {
            setIsMobile(
                event.matches
            );
        };

        setIsMobile(mediaQuery.matches);

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
       MOBILE VISUAL VIEWPORT

       THIS IS THE IMPORTANT MOBILE KEYBOARD FIX.

       The layout viewport can remain full-height while Android
       keyboard reduces the visual viewport.

       We therefore resize the ChatPanel itself to the visual
       viewport instead of trusting 100vh / 100dvh alone.

       Result:

       Keyboard closed:
          ChatPanel = full visible browser viewport

       Keyboard open:
          ChatPanel = area above keyboard

       The input form therefore remains directly above keyboard.

       PERFORMANCE / SMOOTHNESS FIX (Issue 1):
       root.style.height/maxHeight are still driven imperatively
       from JS (this has to stay JS-driven, since the panel's
       available height depends on the visual viewport and the
       panel's own offset inside the mobile drawer -- not
       something plain CSS alone can express here). What's new is
       a CSS transition applied to the root element (see the
       className below), so that whenever this function DOES
       change the height, the browser animates it smoothly instead
       of snapping instantly. That's what removes the jarring
       "jump after the fact" feeling -- the resize now visually
       tracks the keyboard animation instead of lagging behind it
       and then teleporting.
    ============================================================ */

    const syncMobileViewport =
        useCallback(() => {
            if (!isMobile) {
                return;
            }

            const root = chatRootRef.current;

            if (!root) {
                return;
            }

            const viewport = window.visualViewport;
            const viewportHeight =
                viewport?.height || window.innerHeight;

            /*
             * ChatPanel lives inside the mobile drawer.
             * Do NOT use the full visual viewport height here: that
             * makes the panel overlap the drawer header and causes
             * the input to jump behind/under the keyboard.
             *
             * Measure the panel's actual top and make its bottom line
             * up with the bottom of the visible viewport.
             */
            const top = root.getBoundingClientRect().top;
            const availableHeight = Math.max(0, viewportHeight - top);

            root.style.height = `${availableHeight}px`;
            root.style.maxHeight = `${availableHeight}px`;
            root.style.top = "0px";
        }, [isMobile]);

    useEffect(() => {
        if (!isMobile) {
            return;
        }

        const viewport = window.visualViewport;
        let frameId = null;

        const update = () => {
            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }

            frameId = requestAnimationFrame(() => {
                frameId = null;
                syncMobileViewport();
            });
        };

        update();

        viewport?.addEventListener("resize", update);
        viewport?.addEventListener("scroll", update);
        window.addEventListener("resize", update);

        return () => {
            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }

            viewport?.removeEventListener("resize", update);
            viewport?.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [isMobile, syncMobileViewport]);

    /* ============================================================
       LOAD CHAT + SOCKET EVENTS
    ============================================================ */

    useEffect(() => {
        if (
            !roomId ||
            (!isHost && !isMember)
        ) {
            return;
        }

        let active = true;

        /*
         * A new room/membership means a fresh fetch is starting --
         * show the loading skeleton, not a stale empty/messages
         * state from a previous room.
         */
        setIsLoadingMessages(true);

        const mergeMessages = (
            history,
            existing
        ) => {
            if (
                !existing.length
            ) {
                return history;
            }

            const historyMap =
                new Map();

            history.forEach(
                (message) => {
                    if (
                        message?._id
                    ) {
                        historyMap.set(
                            message._id,
                            message
                        );
                    }
                }
            );

            /*
             * History remains in server order.
             * Socket messages that arrived while history
             * was loading are appended if they don't already
             * exist in history.
             */
            const merged = [
                ...history,
            ];

            existing.forEach(
                (message) => {
                    if (
                        !message?._id ||
                        !historyMap.has(
                            message._id
                        )
                    ) {
                        merged.push(
                            message
                        );
                    }
                }
            );

            return merged;
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
                } catch (error) {
                    if (!active) {
                        return;
                    }

                    toast.error(
                        error.response
                            ?.data
                            ?.message ||
                            "Failed to load chat history"
                    );
                } finally {
                    if (active) {
                        setIsLoadingMessages(
                            false
                        );
                    }
                }
            };

        /* --------------------------------------------------------
           NEW MESSAGE
        -------------------------------------------------------- */

        const handleNewMessage = (
            message
        ) => {
            if (
                !active ||
                !message
            ) {
                return;
            }

            const normalizedMessage =
                {
                    ...message,

                    senderId:
                        message
                            .senderId
                            ?._id ||
                        message.senderId ||
                        message
                            .sender
                            ?._id ||
                        null,
                };

            setMessages(
                (previous) => {
                    /*
                     * Prevent duplicate socket messages.
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
           DELETE
        -------------------------------------------------------- */

        const handleMessageDeleted =
            ({
                messageId,
            }) => {
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
           MESSAGE STATUS (SEEN)

           The server emits this event:

           1. When ChatPanel opens and previously unread
              messages become seen (Scenario 3).
           2. Immediately, when the receiver already has
              ChatPanel open at send time (Scenario 4).

           We merge the seen userId into that message's
           seenBy (and deliveredTo, since seen implies
           delivered) arrays, guarding against duplicates the
           same way the backend does.

           IMPORTANT for perf: only the ONE affected message
           object gets a new reference here; all other messages
           in the array keep their existing object identity, so
           MessagesOnly's memoized MessageBubble children for
           unrelated messages do not re-render.
        -------------------------------------------------------- */

        const handleMessageStatus = ({
            messageId,
            userId,
            status,
        } = {}) => {
            if (
                !active ||
                !messageId ||
                !userId ||
                status !== "seen"
            ) {
                return;
            }

            const normalizedUserId =
                userId.toString();

            setMessages((previous) =>
                previous.map((message) => {
                    if (
                        message._id !==
                        messageId
                    ) {
                        return message;
                    }

                    const seenBy =
                        message.seenBy || [];

                    const alreadySeen =
                        seenBy.some(
                            (entry) =>
                                (
                                    entry?.user
                                        ?._id ||
                                    entry?.user
                                )?.toString() ===
                                normalizedUserId
                        );

                    if (alreadySeen) {
                        return message;
                    }

                    const deliveredTo =
                        message.deliveredTo ||
                        [];

                    const alreadyDelivered =
                        deliveredTo.some(
                            (entry) =>
                                (
                                    entry?.user
                                        ?._id ||
                                    entry?.user
                                )?.toString() ===
                                normalizedUserId
                        );

                    const now =
                        new Date().toISOString();

                    return {
                        ...message,

                        deliveredTo:
                            alreadyDelivered
                                ? deliveredTo
                                : [
                                      ...deliveredTo,
                                      {
                                          user: normalizedUserId,
                                          at: now,
                                      },
                                  ],

                        seenBy: [
                            ...seenBy,
                            {
                                user: normalizedUserId,
                                at: now,
                            },
                        ],
                    };
                })
            );
        };

        /* --------------------------------------------------------
           TYPING
        -------------------------------------------------------- */

        const handleUserTyping =
            ({
                user:
                    typingName,
                userId,
            }) => {
                const currentUser =
                    userRef.current;

                /*
                 * Ignore current user's own typing event.
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

                setTypingUser(
                    null
                );
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
            "chat:message-status",
            handleMessageStatus
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
         * Register listeners BEFORE fetching history.
         * This prevents missing a socket message during loading.
         */
        loadMessages();

        return () => {
            active = false;

            socket.off(
                "chat:new-message",
                handleNewMessage
            );

            socket.off(
                "chat:message-deleted",
                handleMessageDeleted
            );

            socket.off(
                "chat:message-status",
                handleMessageStatus
            );

            socket.off(
                "chat:user-typing",
                handleUserTyping
            );

            socket.off(
                "chat:user-stop-typing",
                handleUserStopTyping
            );

            setTypingUser(null);
        };
    }, [
        roomId,
        isHost,
        isMember,
    ]);

    /* ============================================================
       DELETE MESSAGE

       Stable across renders (deps: [roomId] only), so it never
       forces MessagesOnly to treat every MessageBubble as changed.
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

                if (
                    !socket.connected
                ) {
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
       RENDER
    ============================================================ */

    return (
        <div
            ref={chatRootRef}
            className={`
                relative
                flex
                min-h-0
                flex-col
                overflow-hidden
                bg-[#07070c]
                text-white

                ${
                    isMobile
                        ? "absolute inset-x-0 top-0 transition-[height,max-height] duration-150 ease-out"
                        : "h-full"
                }
            `}
        >
            <AnimatedBackground />

            {/* ==================================================
                HEADER
            ================================================== */}

            <ChatHeader
                isConnected={
                    isConnected
                }
            />

            {/* ==================================================
                MESSAGE LIST
            ================================================== */}

            <MessageList
                messages={
                    messages
                }
                isLoading={
                    isLoadingMessages
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
                COMPOSER

                This stays inside the resized visual viewport.
                Therefore it cannot fall behind Android keyboard.

                Extracted into its own memoized component -- see
                the comment above MessageComposer for why.
            ================================================== */}

            <MessageComposer
                roomId={roomId}
                isConnected={
                    isConnected
                }
                isMobile={isMobile}
                userRef={userRef}
                syncMobileViewport={
                    syncMobileViewport
                }
            />
        </div>
    );
};

export default ChatPanel;