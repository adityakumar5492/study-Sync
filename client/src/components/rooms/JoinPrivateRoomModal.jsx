import { useState } from "react";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FaLock,
    FaArrowRight,
    FaTimes,
    FaKey,
    FaCheck,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
    useAppDispatch,
    useAppSelector,
} from "../../redux/hooks";

import { joinRoomThunk } from "../../redux/room/roomThunk";

const JoinPrivateRoomModal = ({
    isOpen,
    room,
    onClose,
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();

    const { loading } = useAppSelector(
        (state) => state.room
    );

    const [inviteCode, setInviteCode] = useState("");

    if (!isOpen) return null;

    const handleJoin = async () => {
        const code = inviteCode.trim();

        if (!code) {
            toast.error(
                "Invite code is required."
            );
            return;
        }

        try {
            const response = await dispatch(
                joinRoomThunk(code)
            ).unwrap();

            toast.success(
                response.message ||
                    "Joined room successfully."
            );

            setInviteCode("");
            onClose();

            const joinedRoomId =
                response.room?._id;

            if (joinedRoomId) {
                navigate(
                    `/room/${joinedRoomId}`
                );
            } else {
                navigate("/rooms");
            }
        } catch (err) {
            toast.error(
                typeof err === "string"
                    ? err
                    : err?.message ||
                          "Invalid invite code."
            );
        }
    };

    const handleClose = () => {
        if (loading) return;

        setInviteCode("");
        onClose();
    };

    const handleInputChange = (event) => {
        setInviteCode(
            event.target.value
                .replace(/\s/g, "")
                .toUpperCase()
        );
    };

    const overlayVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.25,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.2,
                ease: "easeIn",
            },
        },
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 18,
            scale: shouldReduceMotion ? 1 : 0.97,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
            },
        },
        exit: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 10,
            scale: shouldReduceMotion ? 1 : 0.985,
            transition: {
                duration: 0.2,
                ease: "easeIn",
            },
        },
    };

    const contentVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 8,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.08,
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <AnimatePresence>
            <motion.div
                key="join-private-room-overlay"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
                className="
                    fixed
                    inset-0
                    z-[60]
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    overflow-y-auto
                    bg-[#02040a]/80
                    px-3
                    py-4
                    backdrop-blur-md
                    sm:px-4
                    sm:py-6
                "
                onMouseDown={(event) => {
                    if (
                        event.target ===
                            event.currentTarget &&
                        !loading
                    ) {
                        handleClose();
                    }
                }}
            >
                <motion.div
                    key="join-private-room-modal"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                    className="
                        relative
                        my-auto
                        flex
                        max-h-[94vh]
                        w-full
                        max-w-md
                        flex-col
                        overflow-hidden
                        rounded-[28px]
                        border
                        border-white/[0.08]
                        bg-[#0a0f1c]
                        shadow-[0_35px_120px_rgba(0,0,0,0.7)]
                        sm:max-h-[92vh]
                        sm:rounded-[32px]
                    "
                >
                    {/* =================================
                        AMBIENT GLOW
                    ================================= */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-24
                            -top-24
                            h-64
                            w-64
                            rounded-full
                            bg-indigo-500/[0.09]
                            blur-[100px]
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-32
                            -left-28
                            h-64
                            w-64
                            rounded-full
                            bg-violet-500/[0.05]
                            blur-[100px]
                        "
                    />

                    {/* Top highlight */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-x-10
                            top-0
                            h-px
                            bg-gradient-to-r
                            from-transparent
                            via-indigo-400/40
                            to-transparent
                        "
                    />

                    {/* =================================
                        HEADER
                    ================================= */}

                    <div
                        className="
                            relative
                            flex
                            shrink-0
                            items-start
                            justify-between
                            gap-4
                            border-b
                            border-white/[0.06]
                            px-4
                            py-4
                            sm:px-6
                            sm:py-5
                        "
                    >
                        <motion.div
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex min-w-0 items-center gap-3"
                        >
                            <div
                                className="
                                    relative
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-indigo-400/10
                                    bg-indigo-500/[0.08]
                                    text-indigo-400
                                    shadow-[0_12px_35px_rgba(99,102,241,0.08)]
                                "
                            >
                                <motion.div
                                    animate={
                                        shouldReduceMotion
                                            ? undefined
                                            : {
                                                  rotate: [
                                                      0,
                                                      -4,
                                                      4,
                                                      0,
                                                  ],
                                              }
                                    }
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <FaLock className="text-sm" />
                                </motion.div>
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h2 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
                                        Join Private Room
                                    </h2>

                                    <span className="hidden rounded-full border border-indigo-400/10 bg-indigo-500/[0.05] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-indigo-400 min-[380px]:inline-flex">
                                        Invite
                                    </span>
                                </div>

                                <p className="mt-1 truncate text-xs text-slate-600">
                                    Enter your invitation
                                    code
                                </p>
                            </div>
                        </motion.div>

                        <motion.button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            whileHover={
                                shouldReduceMotion
                                    ? undefined
                                    : {
                                          scale: 1.05,
                                      }
                            }
                            whileTap={
                                shouldReduceMotion
                                    ? undefined
                                    : {
                                          scale: 0.92,
                                      }
                            }
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-transparent
                                text-slate-600
                                transition-all
                                duration-200
                                hover:border-white/[0.06]
                                hover:bg-white/[0.04]
                                hover:text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                            aria-label="Close"
                        >
                            <FaTimes className="text-sm" />
                        </motion.button>
                    </div>

                    {/* =================================
                        CONTENT
                    ================================= */}

                    <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        className="
                            relative
                            overflow-y-auto
                            px-4
                            py-5
                            sm:px-6
                            sm:py-6
                        "
                    >
                        {/* =================================
                            DESCRIPTION
                        ================================= */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-white/[0.055]
                                bg-white/[0.02]
                                p-4
                            "
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-indigo-500/[0.07]
                                        text-indigo-400
                                    "
                                >
                                    <FaKey className="text-xs" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-300">
                                        Invitation required
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                        {room?.name ? (
                                            <>
                                                Enter the invite
                                                code to join{" "}
                                                <span className="font-medium text-slate-400">
                                                    "{room.name}"
                                                </span>
                                                .
                                            </>
                                        ) : (
                                            "Enter the invite code to join this room."
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* =================================
                            INVITE CODE
                        ================================= */}

                        <div className="mt-5">
                            <div className="mb-2.5 flex items-center justify-between">
                                <label
                                    htmlFor="invite-code"
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.08em]
                                        text-slate-400
                                    "
                                >
                                    Invite code
                                </label>

                                {inviteCode && (
                                    <motion.span
                                        initial={{
                                            opacity: 0,
                                            scale: 0.9,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400"
                                    >
                                        <FaCheck className="text-[8px]" />
                                        Ready
                                    </motion.span>
                                )}
                            </div>

                            <div className="group relative">
                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-0
                                        rounded-2xl
                                        bg-indigo-500/[0.04]
                                        opacity-0
                                        blur-xl
                                        transition-opacity
                                        duration-300
                                        group-focus-within:opacity-100
                                    "
                                />

                                <input
                                    id="invite-code"
                                    type="text"
                                    value={inviteCode}
                                    onChange={
                                        handleInputChange
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key ===
                                                "Enter" &&
                                            !loading
                                        ) {
                                            event.preventDefault();
                                            handleJoin();
                                        }
                                    }}
                                    placeholder="ENTER INVITE CODE"
                                    autoFocus
                                    autoComplete="off"
                                    spellCheck="false"
                                    disabled={loading}
                                    className="
                                        relative
                                        min-h-14
                                        w-full
                                        rounded-2xl
                                        border
                                        border-white/[0.08]
                                        bg-slate-950/80
                                        px-4
                                        py-3.5
                                        text-center
                                        text-lg
                                        font-black
                                        tracking-[0.18em]
                                        text-indigo-300
                                        uppercase
                                        outline-none
                                        placeholder:tracking-[0.08em]
                                        placeholder:text-slate-700
                                        transition-all
                                        duration-300
                                        hover:border-white/[0.12]
                                        focus:border-indigo-400/40
                                        focus:bg-slate-950
                                        focus:ring-4
                                        focus:ring-indigo-500/[0.07]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                        sm:min-h-16
                                        sm:text-xl
                                        sm:tracking-[0.22em]
                                    "
                                />

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        bottom-0
                                        left-8
                                        right-8
                                        h-px
                                        origin-center
                                        scale-x-0
                                        bg-gradient-to-r
                                        from-transparent
                                        via-indigo-400/60
                                        to-transparent
                                        transition-transform
                                        duration-300
                                        group-focus-within:scale-x-100
                                    "
                                />
                            </div>

                            <p className="mt-2 text-[10px] leading-5 text-slate-700">
                                Paste the code exactly as
                                shared by the room owner.
                            </p>
                        </div>

                        {/* =================================
                            ACTIONS
                        ================================= */}

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <motion.button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                whileHover={
                                    shouldReduceMotion
                                        ? undefined
                                        : {
                                              y: -1,
                                          }
                                }
                                whileTap={
                                    shouldReduceMotion
                                        ? undefined
                                        : {
                                              scale: 0.98,
                                          }
                                }
                                className="
                                    min-h-12
                                    rounded-2xl
                                    border
                                    border-white/[0.07]
                                    bg-white/[0.025]
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-slate-400
                                    transition-all
                                    duration-200
                                    hover:border-white/[0.12]
                                    hover:bg-white/[0.05]
                                    hover:text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                type="button"
                                disabled={
                                    loading ||
                                    !inviteCode.trim()
                                }
                                onClick={handleJoin}
                                whileHover={
                                    shouldReduceMotion ||
                                    loading ||
                                    !inviteCode.trim()
                                        ? undefined
                                        : {
                                              y: -2,
                                          }
                                }
                                whileTap={
                                    shouldReduceMotion ||
                                    loading ||
                                    !inviteCode.trim()
                                        ? undefined
                                        : {
                                              scale: 0.98,
                                          }
                                }
                                className="
                                    group
                                    relative
                                    flex
                                    min-h-12
                                    items-center
                                    justify-center
                                    gap-2.5
                                    overflow-hidden
                                    rounded-2xl
                                    bg-indigo-500
                                    px-5
                                    py-3
                                    text-sm
                                    font-bold
                                    text-white
                                    shadow-[0_15px_40px_rgba(99,102,241,0.16)]
                                    transition-all
                                    duration-300
                                    hover:bg-indigo-400
                                    hover:shadow-[0_18px_45px_rgba(99,102,241,0.25)]
                                    disabled:cursor-not-allowed
                                    disabled:bg-slate-800
                                    disabled:text-slate-600
                                    disabled:shadow-none
                                "
                            >
                                {!loading && (
                                    <span
                                        className="
                                            pointer-events-none
                                            absolute
                                            inset-0
                                            -translate-x-full
                                            bg-gradient-to-r
                                            from-transparent
                                            via-white/10
                                            to-transparent
                                            transition-transform
                                            duration-700
                                            group-hover:translate-x-full
                                        "
                                    />
                                )}

                                {loading ? (
                                    <span className="relative flex items-center gap-2.5">
                                        <motion.span
                                            animate={
                                                shouldReduceMotion
                                                    ? undefined
                                                    : {
                                                          rotate: 360,
                                                      }
                                            }
                                            transition={{
                                                duration: 0.9,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="
                                                h-4
                                                w-4
                                                rounded-full
                                                border-2
                                                border-white/20
                                                border-t-white
                                            "
                                        />

                                        <span>
                                            Joining...
                                        </span>
                                    </span>
                                ) : (
                                    <span className="relative flex items-center gap-2.5">
                                        <span>
                                            Join Room
                                        </span>

                                        <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                                    </span>
                                )}
                            </motion.button>
                        </div>

                        {/* =================================
                            FOOTER HINT
                        ================================= */}

                        <div className="mt-5 flex items-center justify-center gap-2">
                            <span className="h-px flex-1 bg-white/[0.04]" />

                            <p className="shrink-0 text-[10px] text-slate-700">
                                Press{" "}
                                <kbd className="rounded-md border border-white/[0.06] bg-white/[0.025] px-1.5 py-0.5 text-slate-500">
                                    Enter
                                </kbd>{" "}
                                to join
                            </p>

                            <span className="h-px flex-1 bg-white/[0.04]" />
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default JoinPrivateRoomModal;