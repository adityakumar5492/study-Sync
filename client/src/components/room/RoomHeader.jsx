import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
    FaArrowLeft,
    FaEllipsisV,
    FaLock,
    FaGlobe,
    FaUsers,
    FaCopy,
    FaTrash,
    FaSignOutAlt,
    FaBolt,
    FaCheck,
    FaExclamationTriangle,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppDispatch } from "../../redux/hooks";
import {
    deleteRoomThunk,
    leaveRoomThunk,
} from "../../redux/room/roomThunk";

const RoomHeader = ({
    room,
    currentUser,
    onMenuClick,
}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [menuOpen, setMenuOpen] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [leaving, setLeaving] =
        useState(false);

    const [copied, setCopied] =
        useState(false);

    const [showLeaveModal, setShowLeaveModal] =
        useState(false);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    if (!room) return null;

    // =========================================================
    // USER / HOST
    // =========================================================

    const hostId =
        typeof room.host === "object"
            ? room.host?._id?.toString()
            : room.host?.toString();

    const currentUserId =
        currentUser?._id?.toString();

    const isHost =
        hostId === currentUserId;

    const isMember =
        room.members?.some((member) => {
            const memberId =
                typeof member === "object"
                    ? member?._id?.toString()
                    : member?.toString();

            return (
                memberId === currentUserId
            );
        }) || false;

    // =========================================================
    // UNIQUE MEMBERS
    //
    // A user can reconnect/rejoin through sockets.
    // The same user must still count only once.
    // =========================================================

    const uniqueMembers = (() => {
        const members = Array.isArray(
            room.members
        )
            ? room.members
            : [];

        const seen = new Set();

        return members.filter((member) => {
            const memberId =
                typeof member === "object"
                    ? member?._id?.toString()
                    : member?.toString();

            /*
             * If there is no usable ID, keep the
             * member instead of accidentally removing
             * unrelated entries.
             */
            if (!memberId) {
                return true;
            }

            if (seen.has(memberId)) {
                return false;
            }

            seen.add(memberId);

            return true;
        });
    })();

    const uniqueMembersCount =
        uniqueMembers.length;

    // =========================================================
    // COPY INVITE CODE
    // =========================================================

    const copyInviteCode = async () => {
        if (!room.inviteCode) {
            toast.error(
                "Invite code is unavailable."
            );

            return;
        }

        try {
            await navigator.clipboard.writeText(
                room.inviteCode
            );

            setCopied(true);

            toast.success(
                "Invite code copied."
            );

            setTimeout(() => {
                setCopied(false);
            }, 1800);
        } catch {
            toast.error(
                "Failed to copy invite code."
            );
        }
    };

    // =========================================================
    // DELETE ROOM
    // =========================================================

    const handleDeleteRoom = () => {
        setMenuOpen(false);
        setShowDeleteModal(true);
    };

    const confirmDeleteRoom = async () => {
        if (!room?._id) {
            return;
        }

        setShowDeleteModal(false);
        setDeleting(true);

        try {
            await dispatch(
                deleteRoomThunk(room._id)
            ).unwrap();

            toast.success("Room deleted.");

            navigate("/rooms");
        } catch (err) {
            toast.error(
                typeof err === "string"
                    ? err
                    : err?.message ||
                          "Failed to delete room."
            );

            setDeleting(false);
        }
    };

    // =========================================================
    // LEAVE ROOM
    // =========================================================

    const handleLeaveRoom = async () => {
        setMenuOpen(false);

        /*
         * Public rooms can still be left directly.
         */

        if (!room.isPrivate) {
            setLeaving(true);

            try {
                await dispatch(
                    leaveRoomThunk(room._id)
                ).unwrap();

                toast.success(
                    "You left the room."
                );

                navigate("/rooms");
            } catch (err) {
                toast.error(
                    typeof err === "string"
                        ? err
                        : err?.message ||
                              "Failed to leave room."
                );

                setLeaving(false);
            }

            return;
        }

        /*
         * Private rooms show confirmation
         * before leaving.
         */

        setShowLeaveModal(true);
    };

    const confirmLeaveRoom = async () => {
        if (!room?._id) {
            return;
        }

        setShowLeaveModal(false);
        setLeaving(true);

        try {
            await dispatch(
                leaveRoomThunk(room._id)
            ).unwrap();

            toast.success(
                "You left the room."
            );

            navigate("/rooms");
        } catch (err) {
            toast.error(
                typeof err === "string"
                    ? err
                    : err?.message ||
                          "Failed to leave room."
            );

            setLeaving(false);
        }
    };

    // =========================================================
    // HEADER
    // =========================================================

    return (
        <>
            <motion.header
                initial={{
                    opacity: 0,
                    y: -10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.35,
                    ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                    ],
                }}
                className="
                    relative
                    z-50
                    flex
                    min-h-[58px]
                    shrink-0
                    items-center
                    justify-between
                    overflow-visible
                    border-b
                    border-white/[0.07]
                    bg-[#08080d]/95
                    px-2
                    shadow-[0_15px_50px_rgba(0,0,0,.28)]
                    backdrop-blur-2xl

                    sm:min-h-[62px]
                    sm:px-4
                "
            >
                {/* =====================================================
                    AMBIENT HEADER EFFECT
                ===================================================== */}

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            x: [
                                "-20%",
                                "120%",
                            ],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="
                            absolute
                            bottom-0
                            h-px
                            w-1/4
                            bg-gradient-to-r
                            from-transparent
                            via-violet-400/50
                            to-transparent
                            blur-sm
                        "
                    />

                    <motion.div
                        animate={{
                            opacity: [
                                0.02,
                                0.05,
                                0.02,
                            ],
                            scale: [
                                1,
                                1.1,
                                1,
                            ],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                        }}
                        className="
                            absolute
                            -left-20
                            -top-24
                            h-48
                            w-48
                            rounded-full
                            bg-violet-500
                            blur-[90px]
                        "
                    />

                    <div
                        className="
                            absolute
                            inset-0
                            opacity-[0.012]
                        "
                        style={{
                            backgroundImage:
                                "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
                            backgroundSize:
                                "24px 24px",
                        }}
                    />
                </div>

                {/* =====================================================
                    LEFT SIDE
                ===================================================== */}

                <div
                    className="
                        relative
                        flex
                        min-w-0
                        max-w-full
                        flex-1
                        items-center
                        gap-1.5

                        sm:gap-2.5
                    "
                >
                    {/* Back Button */}

                    <motion.div
                        whileHover={{
                            x: -2,
                        }}
                        whileTap={{
                            scale: 0.92,
                        }}
                        className="shrink-0"
                    >
                        <Link
                            to="/rooms"
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-transparent
                                text-zinc-500
                                transition

                                hover:border-white/[0.06]
                                hover:bg-white/[0.04]
                                hover:text-white

                                sm:h-9
                                sm:w-9
                            "
                            aria-label="Back to rooms"
                        >
                            <FaArrowLeft
                                size={12}
                            />
                        </Link>
                    </motion.div>

                    {/* =================================================
                        ROOM IDENTITY
                    ================================================= */}

                    <div
                        className="
                            min-w-0
                            flex-1
                            overflow-hidden
                        "
                    >
                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-1.5

                                sm:gap-2.5
                            "
                        >
                            {/* Room Icon */}

                            <motion.div
                                animate={{
                                    y: [
                                        0,
                                        -1.5,
                                        0,
                                    ],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="
                                    relative
                                    hidden
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-violet-400/10
                                    bg-gradient-to-br
                                    from-violet-500/[0.12]
                                    to-cyan-400/[0.06]

                                    sm:flex
                                "
                            >
                                <motion.div
                                    animate={{
                                        scale: [
                                            1,
                                            1.5,
                                            1,
                                        ],
                                        opacity: [
                                            0.15,
                                            0.4,
                                            0.15,
                                        ],
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                    }}
                                    className="
                                        absolute
                                        inset-0
                                        rounded-xl
                                        bg-violet-500/10
                                        blur-md
                                    "
                                />

                                <FaBolt className="relative text-[11px] text-violet-300" />
                            </motion.div>

                            {/* Name + metadata */}

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                "
                            >
                                {/* Name */}

                                <div
                                    className="
                                        flex
                                        min-w-0
                                        items-center
                                        gap-1.5

                                        sm:gap-2
                                    "
                                >
                                    <h1
                                        className="
                                            min-w-0
                                            max-w-[145px]
                                            truncate
                                            text-[11px]
                                            font-black
                                            tracking-tight
                                            text-white

                                            xs:max-w-[180px]
                                            sm:max-w-[260px]
                                            sm:text-sm
                                            md:max-w-[360px]
                                        "
                                    >
                                        {room.name}
                                    </h1>

                                    {/* Live */}

                                    <span
                                        className="
                                            hidden
                                            shrink-0
                                            items-center
                                            gap-1
                                            rounded-full
                                            border
                                            border-emerald-400/10
                                            bg-emerald-500/[0.05]
                                            px-2
                                            py-0.5
                                            text-[7px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-emerald-300

                                            sm:flex
                                        "
                                    >
                                        <span className="relative flex h-1.5 w-1.5">
                                            <motion.span
                                                animate={{
                                                    scale: [
                                                        1,
                                                        2,
                                                        1,
                                                    ],
                                                    opacity: [
                                                        0.7,
                                                        0,
                                                        0.7,
                                                    ],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                }}
                                                className="
                                                    absolute
                                                    inset-0
                                                    rounded-full
                                                    bg-emerald-400
                                                "
                                            />

                                            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        </span>

                                        Live
                                    </span>
                                </div>

                                {/* Metadata */}

                                <div
                                    className="
                                        mt-0.5
                                        flex
                                        min-w-0
                                        items-center
                                        gap-1.5

                                        sm:mt-1
                                        sm:gap-2.5
                                    "
                                >
                                    {/* Students */}

                                    <span
                                        className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-1
                                            truncate
                                            text-[7px]
                                            font-medium
                                            text-zinc-600

                                            sm:text-[8px]
                                        "
                                    >
                                        <FaUsers className="shrink-0 text-[6px] sm:text-[7px]" />

                                        <span className="truncate">
                                            {uniqueMembersCount}
                                            {room.maxMembers
                                                ? `/${room.maxMembers}`
                                                : ""}{" "}
                                            students
                                        </span>
                                    </span>

                                    <span className="h-2.5 w-px shrink-0 bg-white/[0.07]" />

                                    {/* Privacy */}

                                    <span
                                        className={`
                                            flex
                                            shrink-0
                                            items-center
                                            gap-1
                                            text-[7px]
                                            font-semibold

                                            sm:text-[8px]

                                            ${
                                                room.isPrivate
                                                    ? "text-amber-400/80"
                                                    : "text-cyan-400/80"
                                            }
                                        `}
                                    >
                                        {room.isPrivate ? (
                                            <>
                                                <FaLock className="text-[6px] sm:text-[7px]" />
                                                Private
                                            </>
                                        ) : (
                                            <>
                                                <FaGlobe className="text-[6px] sm:text-[7px]" />
                                                Public
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* =================================================
                                INVITE CODE
                                Desktop/tablet: full version
                                Mobile: compact version
                            ================================================= */}

                            {room.isPrivate && isHost && (
    <motion.div
        initial={{
            opacity: 0,
            scale: 0.95,
        }}
        animate={{
            opacity: 1,
            scale: 1,
        }}
        className="
            ml-0
            flex
            min-w-0
            shrink-0
            items-center
            gap-1

            sm:ml-1
            sm:gap-1.5
        "
    >
        <div
            className="
                flex
                min-w-0
                flex-col
                items-start
                justify-center
                rounded-xl
                border
                border-white/[0.06]
                bg-white/[0.025]
                px-2
                py-1

                sm:flex-row
                sm:items-center
                sm:gap-1.5
                sm:px-2
                sm:py-1.5
            "
        >
            <span
                className="
                    text-[6px]
                    font-bold
                    uppercase
                    leading-none
                    tracking-wider
                    text-zinc-600

                    sm:text-[7px]
                "
            >
                Invite Code
            </span>

            <span
                className="
                    max-w-[75px]
                    truncate
                    font-mono
                    text-[8px]
                    font-bold
                    tracking-[0.14em]
                    text-violet-300

                    sm:max-w-none
                    sm:text-[9px]
                    sm:tracking-[0.18em]
                "
            >
                {room.inviteCode}
            </span>
        </div>

        <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyInviteCode}
            className={`
                flex
                h-8
                shrink-0
                items-center
                gap-1.5
                rounded-xl
                border
                px-2
                text-[8px]
                font-bold
                transition-all

                sm:px-2.5

                ${
                    copied
                        ? "border-emerald-400/15 bg-emerald-500/[0.08] text-emerald-300"
                        : "border-violet-400/10 bg-violet-500/[0.06] text-violet-300 hover:border-violet-400/20 hover:bg-violet-500/[0.12]"
                }
            `}
        >
            {copied ? (
                <FaCheck className="text-[8px]" />
            ) : (
                <FaCopy className="text-[8px]" />
            )}

            <span className="hidden sm:inline">
                {copied ? "Copied" : "Copy"}
            </span>
        </motion.button>
    </motion.div>
)}
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    RIGHT SIDE / MENU
                ===================================================== */}

                <div className="relative ml-1 shrink-0 sm:ml-2">
                    <motion.button
                        type="button"
                        onClick={() =>
                            setMenuOpen(
                                (open) => !open
                            )
                        }
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.9,
                        }}
                        className={`
                            relative
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-xl
                            border
                            transition-all

                            sm:h-9
                            sm:w-9

                            ${
                                menuOpen
                                    ? "border-violet-400/20 bg-violet-500/[0.1] text-white"
                                    : "border-white/[0.06] bg-white/[0.025] text-zinc-500 hover:border-white/[0.1] hover:bg-white/[0.05] hover:text-white"
                            }
                        `}
                        aria-label="Room options"
                        aria-expanded={
                            menuOpen
                        }
                    >
                        <motion.div
                            animate={{
                                rotate: menuOpen
                                    ? 90
                                    : 0,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                        >
                            <FaEllipsisV size={11} />
                        </motion.div>
                    </motion.button>

                    {/* =================================================
                        ROOM OPTIONS PORTAL
                    ================================================= */}

                    {createPortal(
                        <AnimatePresence>
                            {menuOpen && (
                                <>
                                    {/* Backdrop */}

                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                        }}
                                        className="
                                            fixed
                                            inset-0
                                            z-[9998]
                                        "
                                        onClick={() =>
                                            setMenuOpen(
                                                false
                                            )
                                        }
                                    />

                                    {/* Menu */}

                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -8,
                                            scale: 0.96,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -6,
                                            scale: 0.97,
                                        }}
                                        transition={{
                                            duration: 0.18,
                                        }}
                                        className="
                                            fixed
                                            right-2
                                            top-[54px]
                                            z-[9999]
                                            w-[calc(100vw-16px)]
                                            max-w-56
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            border-white/[0.08]
                                            bg-[#0b0b11]/95
                                            p-1.5
                                            shadow-[0_25px_80px_rgba(0,0,0,.55)]
                                            backdrop-blur-2xl

                                            sm:right-3
                                            sm:top-[58px]
                                        "
                                    >
                                        <div className="border-b border-white/[0.05] px-3 py-2.5">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-700">
                                                Room options
                                            </p>
                                        </div>

                                        {/* =================================================
                                            DELETE
                                        ================================================= */}

                                        {isHost && (
                                            <motion.button
                                                type="button"
                                                onClick={
                                                    handleDeleteRoom
                                                }
                                                disabled={
                                                    deleting
                                                }
                                                whileHover={{
                                                    x: 2,
                                                }}
                                                whileTap={{
                                                    scale: 0.98,
                                                }}
                                                className="
                                                    group
                                                    mt-1
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    rounded-xl
                                                    px-3
                                                    py-3
                                                    text-left
                                                    transition
                                                    hover:bg-red-500/[0.08]
                                                    disabled:opacity-50
                                                "
                                            >
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/[0.07] text-red-400 transition group-hover:bg-red-500/10">
                                                    <FaTrash className="text-[10px]" />
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-[10px] font-bold text-zinc-300 group-hover:text-red-300">
                                                        {deleting
                                                            ? "Deleting..."
                                                            : "Delete Room"}
                                                    </span>

                                                    <span className="mt-0.5 block text-[7px] text-zinc-700">
                                                        Permanently remove this room
                                                    </span>
                                                </span>
                                            </motion.button>
                                        )}

                                        {/* =================================================
                                            LEAVE
                                        ================================================= */}

                                        {!isHost &&
                                            isMember && (
                                                <motion.button
                                                    type="button"
                                                    onClick={
                                                        handleLeaveRoom
                                                    }
                                                    disabled={
                                                        leaving
                                                    }
                                                    whileHover={{
                                                        x: 2,
                                                    }}
                                                    whileTap={{
                                                        scale: 0.98,
                                                    }}
                                                    className="
                                                        group
                                                        flex
                                                        w-full
                                                        items-center
                                                        gap-3
                                                        rounded-xl
                                                        px-3
                                                        py-3
                                                        text-left
                                                        transition
                                                        hover:bg-amber-500/[0.07]
                                                        disabled:opacity-50
                                                    "
                                                >
                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/[0.07] text-amber-400">
                                                        <FaSignOutAlt className="text-[10px]" />
                                                    </span>

                                                    <span className="min-w-0 flex-1">
                                                        <span className="block text-[10px] font-bold text-zinc-300 group-hover:text-amber-300">
                                                            {leaving
                                                                ? "Leaving..."
                                                                : "Leave Room"}
                                                        </span>

                                                        <span className="mt-0.5 block text-[7px] text-zinc-700">
                                                            Exit this study session
                                                        </span>
                                                    </span>
                                                </motion.button>
                                            )}

                                        {/* =================================================
                                            NO ACTIONS
                                        ================================================= */}

                                        {!isHost &&
                                            !isMember && (
                                                <div className="px-3 py-4 text-center">
                                                    <FaLock className="mx-auto mb-2 text-xs text-zinc-800" />

                                                    <p className="text-[9px] font-semibold text-zinc-600">
                                                        No actions available
                                                    </p>
                                                </div>
                                            )}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>,
                        document.body
                    )}
                </div>

                {/* Bottom animated line */}

                <motion.div
                    animate={{
                        x: [
                            "-100%",
                            "400%",
                        ],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="
                        pointer-events-none
                        absolute
                        bottom-0
                        left-0
                        h-px
                        w-1/4
                        bg-gradient-to-r
                        from-transparent
                        via-violet-400/50
                        to-transparent
                        blur-sm
                    "
                />
            </motion.header>

            {/* =========================================================
                LEAVE CONFIRMATION MODAL
            ========================================================= */}

            {createPortal(
                <AnimatePresence>
                    {showLeaveModal && (
                        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4">
                            {/* Overlay */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                }}
                                className="
                                    absolute
                                    inset-0
                                    bg-black/70
                                    backdrop-blur-sm
                                "
                                onClick={() =>
                                    !leaving &&
                                    setShowLeaveModal(
                                        false
                                    )
                                }
                            />

                            {/* Modal */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                    scale: 0.94,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.96,
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: [
                                        0.22,
                                        1,
                                        0.36,
                                        1,
                                    ],
                                }}
                                className="
                                    relative
                                    w-full
                                    max-w-sm
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-white/[0.08]
                                    bg-[#0c0c12]
                                    shadow-[0_30px_100px_rgba(0,0,0,.65)]
                                "
                            >
                                <div className="p-4 sm:p-5">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-500/[0.08] text-amber-400">
                                            <FaSignOutAlt className="text-sm" />
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="text-sm font-black text-white">
                                                Leave Study Room?
                                            </h2>

                                            <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">
                                                You will leave "
                                                {
                                                    room.name
                                                }
                                                " and need the invite code to join this private room again.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-4 rounded-xl border border-amber-400/[0.08] bg-amber-500/[0.04] px-3 py-2.5">
                                        <div className="flex items-start gap-2">
                                            <FaExclamationTriangle className="mt-0.5 shrink-0 text-[9px] text-amber-400/70" />

                                            <p className="text-[9px] leading-relaxed text-zinc-500">
                                                Make sure you have the invite code before leaving.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowLeaveModal(
                                                    false
                                                )
                                            }
                                            disabled={
                                                leaving
                                            }
                                            className="
                                                flex-1
                                                rounded-xl
                                                border
                                                border-white/[0.07]
                                                bg-white/[0.03]
                                                px-4
                                                py-2.5
                                                text-[9px]
                                                font-bold
                                                text-zinc-400
                                                transition

                                                hover:bg-white/[0.06]
                                                hover:text-white

                                                disabled:opacity-50
                                            "
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                confirmLeaveRoom
                                            }
                                            disabled={
                                                leaving
                                            }
                                            className="
                                                flex-1
                                                rounded-xl
                                                border
                                                border-amber-400/10
                                                bg-amber-500/[0.09]
                                                px-4
                                                py-2.5
                                                text-[9px]
                                                font-bold
                                                text-amber-300
                                                transition

                                                hover:bg-amber-500/[0.15]

                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        >
                                            {leaving
                                                ? "Leaving..."
                                                : "Leave Room"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* =========================================================
                DELETE CONFIRMATION MODAL
            ========================================================= */}

            {createPortal(
                <AnimatePresence>
                    {showDeleteModal && (
                        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4">
                            {/* Overlay */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                }}
                                className="
                                    absolute
                                    inset-0
                                    bg-black/70
                                    backdrop-blur-sm
                                "
                                onClick={() =>
                                    !deleting &&
                                    setShowDeleteModal(
                                        false
                                    )
                                }
                            />

                            {/* Modal */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                    scale: 0.94,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.96,
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: [
                                        0.22,
                                        1,
                                        0.36,
                                        1,
                                    ],
                                }}
                                className="
                                    relative
                                    w-full
                                    max-w-sm
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-red-400/[0.08]
                                    bg-[#0c0c12]
                                    shadow-[0_30px_100px_rgba(0,0,0,.65)]
                                "
                            >
                                <div className="p-4 sm:p-5">
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/[0.08] text-red-400">
                                            <FaTrash className="text-sm" />
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="text-sm font-black text-white">
                                                Delete Study Room?
                                            </h2>

                                            <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">
                                                Delete "
                                                {
                                                    room.name
                                                }
                                                " permanently? All members will lose access immediately.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-4 rounded-xl border border-red-400/[0.08] bg-red-500/[0.04] px-3 py-2.5">
                                        <div className="flex items-start gap-2">
                                            <FaExclamationTriangle className="mt-0.5 shrink-0 text-[9px] text-red-400/70" />

                                            <p className="text-[9px] leading-relaxed text-zinc-500">
                                                This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowDeleteModal(
                                                    false
                                                )
                                            }
                                            disabled={
                                                deleting
                                            }
                                            className="
                                                flex-1
                                                rounded-xl
                                                border
                                                border-white/[0.07]
                                                bg-white/[0.03]
                                                px-4
                                                py-2.5
                                                text-[9px]
                                                font-bold
                                                text-zinc-400
                                                transition

                                                hover:bg-white/[0.06]
                                                hover:text-white

                                                disabled:opacity-50
                                            "
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                confirmDeleteRoom
                                            }
                                            disabled={
                                                deleting
                                            }
                                            className="
                                                flex-1
                                                rounded-xl
                                                border
                                                border-red-400/10
                                                bg-red-500/[0.09]
                                                px-4
                                                py-2.5
                                                text-[9px]
                                                font-bold
                                                text-red-300
                                                transition

                                                hover:bg-red-500/[0.15]

                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        >
                                            {deleting
                                                ? "Deleting..."
                                                : "Delete Room"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default RoomHeader;