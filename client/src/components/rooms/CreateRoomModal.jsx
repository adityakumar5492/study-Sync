import { useEffect, useState } from "react";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";
import {
    FaTimes,
    FaLock,
    FaGlobe,
    FaUsers,
    FaCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppDispatch } from "../../redux/hooks";
import { createRoomThunk } from "../../redux/room/roomThunk";
import InviteCodeModal from "./InviteCodeModal";

const initialState = {
    name: "",
    description: "",
    isPrivate: false,
    maxMembers: 20,
};

const CreateRoomModal = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();

    const [formData, setFormData] =
        useState(initialState);

    const [loading, setLoading] =
        useState(false);

    const [createdRoom, setCreatedRoom] =
        useState(null);

    const [showInviteModal, setShowInviteModal] =
        useState(false);

    // =========================================
    // RESET MODAL
    // =========================================

    useEffect(() => {
        if (!isOpen) {
            setFormData(initialState);
            setLoading(false);
            setCreatedRoom(null);
            setShowInviteModal(false);
        }
    }, [isOpen]);

    // =========================================
    // ESCAPE KEY
    // =========================================

    useEffect(() => {
        if (!isOpen || loading) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isOpen, loading, onClose]);

    // =========================================
    // FORM CHANGE
    // =========================================

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "number"
                    ? Number(value)
                    : value,
        }));
    };

    // =========================================
    // MAX MEMBERS
    // =========================================

    const handleMaxMembersChange = (event) => {
        const value = event.target.value;

        if (value === "") {
            setFormData((prev) => ({
                ...prev,
                maxMembers: "",
            }));

            return;
        }

        const cleanedValue =
            value.replace(/^0+/, "");

        setFormData((prev) => ({
            ...prev,
            maxMembers: cleanedValue
                ? Number(cleanedValue)
                : 0,
        }));
    };

    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        if (!formData.name.trim()) {
            toast.error(
                "Room name is required."
            );
            return;
        }

        if (!formData.description.trim()) {
            toast.error(
                "Description is required."
            );
            return;
        }

        if (
            !formData.maxMembers ||
            formData.maxMembers < 2 ||
            formData.maxMembers > 500
        ) {
            toast.error(
                "Maximum members must be between 2 and 500."
            );
            return;
        }

        setLoading(true);

        try {
            const result = await dispatch(
                createRoomThunk(formData)
            ).unwrap();

            toast.success(result.message);

            if (result.room.isPrivate) {
                setCreatedRoom(result.room);
                setShowInviteModal(true);
            } else {
                onClose();
                navigate(
                    `/room/${result.room._id}`
                );
            }
        } catch (err) {
            toast.error(
                typeof err === "string"
                    ? err
                    : err?.message ||
                          "Failed to create room."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================
    // MOTION
    // =========================================

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
                duration: 0.38,
                ease: [0.16, 1, 0.3, 1],
            },
        },
        exit: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 10,
            scale: shouldReduceMotion ? 1 : 0.985,
            transition: {
                duration: 0.22,
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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {/* =========================================
                OVERLAY
            ========================================= */}

            <motion.div
                key="create-room-overlay"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
                className="
                    fixed
                    inset-0
                    z-50
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
                        onClose();
                    }
                }}
            >
                {/* =====================================
                    MODAL
                ===================================== */}

                <motion.div
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="
                        relative
                        my-auto
                        flex
                        max-h-[94vh]
                        w-full
                        max-w-xl
                        flex-col
                        overflow-hidden
                        rounded-[26px]
                        border
                        border-white/[0.08]
                        bg-[#0a0f1c]
                        shadow-[0_35px_120px_rgba(0,0,0,0.65)]
                        sm:max-h-[92vh]
                        sm:rounded-[30px]
                    "
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
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
                            bg-indigo-500/[0.10]
                            blur-[100px]
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-32
                            -left-32
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
                            sm:px-7
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
                                    shadow-[0_10px_30px_rgba(99,102,241,0.08)]
                                "
                            >
                                <FaUsers className="text-sm" />
                            </div>

                            <div className="min-w-0">
                                <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                                    Create Study Room
                                </h2>

                                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 sm:text-sm">
                                    Build a focused space for
                                    your study group.
                                </p>
                            </div>
                        </motion.div>

                        <motion.button
                            type="button"
                            onClick={onClose}
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
                                text-slate-500
                                transition-colors
                                duration-200
                                hover:border-white/[0.06]
                                hover:bg-white/[0.04]
                                hover:text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                sm:h-10
                                sm:w-10
                            "
                            aria-label="Close modal"
                        >
                            <FaTimes className="text-sm" />
                        </motion.button>
                    </div>

                    {/* =================================
                        FORM
                    ================================= */}

                    <motion.form
                        onSubmit={handleSubmit}
                        initial="hidden"
                        animate="visible"
                        variants={contentVariants}
                        className="
                            relative
                            overflow-y-auto
                            px-4
                            py-5
                            sm:px-7
                            sm:py-6
                        "
                    >
                        <div className="space-y-5 sm:space-y-6">

                            {/* =================================
                                ROOM NAME
                            ================================= */}

                            <div>
                                <label
                                    htmlFor="room-name"
                                    className="
                                        mb-2
                                        block
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.08em]
                                        text-slate-400
                                    "
                                >
                                    Room name
                                </label>

                                <div className="group relative">
                                    <input
                                        id="room-name"
                                        type="text"
                                        name="name"
                                        required
                                        disabled={loading}
                                        placeholder="e.g. Operating Systems Revision"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="
                                            min-h-12
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-slate-950/70
                                            px-4
                                            py-3
                                            text-sm
                                            text-white
                                            outline-none
                                            placeholder:text-slate-700
                                            transition-all
                                            duration-200
                                            hover:border-white/[0.10]
                                            focus:border-indigo-400/40
                                            focus:bg-slate-950
                                            focus:ring-4
                                            focus:ring-indigo-500/[0.07]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />

                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            bottom-0
                                            left-4
                                            right-4
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
                            </div>

                            {/* =================================
                                DESCRIPTION
                            ================================= */}

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="room-description"
                                        className="
                                            block
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-[0.08em]
                                            text-slate-400
                                        "
                                    >
                                        Description
                                    </label>

                                    <span className="text-[10px] font-medium text-slate-700">
                                        {formData.description.length}
                                        /500
                                    </span>
                                </div>

                                <div className="group relative">
                                    <textarea
                                        id="room-description"
                                        rows={3}
                                        maxLength={500}
                                        name="description"
                                        required
                                        disabled={loading}
                                        placeholder="What will your group study in this room?"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="
                                            min-h-28
                                            w-full
                                            resize-none
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-slate-950/70
                                            px-4
                                            py-3
                                            text-sm
                                            leading-6
                                            text-white
                                            outline-none
                                            placeholder:text-slate-700
                                            transition-all
                                            duration-200
                                            hover:border-white/[0.10]
                                            focus:border-indigo-400/40
                                            focus:bg-slate-950
                                            focus:ring-4
                                            focus:ring-indigo-500/[0.07]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />

                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            bottom-0
                                            left-4
                                            right-4
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
                            </div>

                            {/* =================================
                                MAX MEMBERS
                            ================================= */}

                            <div>
                                <label
                                    htmlFor="max-members"
                                    className="
                                        mb-2
                                        block
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.08em]
                                        text-slate-400
                                    "
                                >
                                    Maximum members
                                </label>

                                <div className="relative">
                                    <input
                                        id="max-members"
                                        type="text"
                                        name="maxMembers"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        disabled={loading}
                                        value={
                                            formData.maxMembers
                                        }
                                        onChange={
                                            handleMaxMembersChange
                                        }
                                        className="
                                            min-h-12
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/[0.07]
                                            bg-slate-950/70
                                            px-4
                                            pr-20
                                            text-sm
                                            font-medium
                                            text-white
                                            outline-none
                                            transition-all
                                            duration-200
                                            hover:border-white/[0.10]
                                            focus:border-indigo-400/40
                                            focus:ring-4
                                            focus:ring-indigo-500/[0.07]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    />

                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            right-3
                                            top-1/2
                                            flex
                                            -translate-y-1/2
                                            items-center
                                            gap-1.5
                                            rounded-lg
                                            bg-white/[0.035]
                                            px-2
                                            py-1
                                            text-[10px]
                                            font-semibold
                                            text-slate-600
                                        "
                                    >
                                        <FaUsers className="text-[8px]" />
                                        members
                                    </div>
                                </div>

                                <p className="mt-2 text-[11px] leading-5 text-slate-600">
                                    Set a capacity between 2
                                    and 500 members.
                                </p>
                            </div>

                            {/* =================================
                                PRIVACY
                            ================================= */}

                            <div>
                                <div className="mb-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                                        Room privacy
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-600">
                                        Choose who can access
                                        your study room.
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">

                                    {/* PUBLIC */}
                                    <motion.button
                                        type="button"
                                        disabled={loading}
                                        onClick={() =>
                                            setFormData(
                                                (
                                                    prev
                                                ) => ({
                                                    ...prev,
                                                    isPrivate:
                                                        false,
                                                })
                                            )
                                        }
                                        whileHover={
                                            shouldReduceMotion
                                                ? undefined
                                                : {
                                                      y: -2,
                                                  }
                                        }
                                        whileTap={
                                            shouldReduceMotion
                                                ? undefined
                                                : {
                                                      scale: 0.985,
                                                  }
                                        }
                                        className={`
                                            group
                                            relative
                                            min-h-[86px]
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            p-4
                                            text-left
                                            transition-all
                                            duration-300
                                            ${
                                                !formData.isPrivate
                                                    ? "border-indigo-400/25 bg-indigo-500/[0.07] shadow-[0_12px_35px_rgba(99,102,241,0.08)]"
                                                    : "border-white/[0.06] bg-slate-950/50 hover:border-white/[0.10] hover:bg-white/[0.025]"
                                            }
                                        `}
                                        aria-pressed={
                                            !formData.isPrivate
                                        }
                                    >
                                        {!formData.isPrivate && (
                                            <motion.div
                                                layoutId="privacy-active"
                                                className="
                                                    absolute
                                                    inset-0
                                                    rounded-2xl
                                                    border
                                                    border-indigo-400/20
                                                "
                                                transition={{
                                                    duration: 0.25,
                                                }}
                                            />
                                        )}

                                        <div className="relative flex items-center gap-3">
                                            <div
                                                className={`
                                                    flex
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    transition-all
                                                    duration-300
                                                    ${
                                                        !formData.isPrivate
                                                            ? "bg-indigo-500/15 text-indigo-400"
                                                            : "bg-slate-800/70 text-slate-600 group-hover:text-slate-400"
                                                    }
                                                `}
                                            >
                                                <FaGlobe className="text-sm" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-white">
                                                        Public
                                                    </p>

                                                    {!formData.isPrivate && (
                                                        <motion.span
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.7,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white"
                                                        >
                                                            <FaCheck className="text-[7px]" />
                                                        </motion.span>
                                                    )}
                                                </div>

                                                <p className="mt-1 text-[11px] text-slate-600">
                                                    Anyone can join
                                                </p>
                                            </div>
                                        </div>
                                    </motion.button>

                                    {/* PRIVATE */}
                                    <motion.button
                                        type="button"
                                        disabled={loading}
                                        onClick={() =>
                                            setFormData(
                                                (
                                                    prev
                                                ) => ({
                                                    ...prev,
                                                    isPrivate:
                                                        true,
                                                })
                                            )
                                        }
                                        whileHover={
                                            shouldReduceMotion
                                                ? undefined
                                                : {
                                                      y: -2,
                                                  }
                                        }
                                        whileTap={
                                            shouldReduceMotion
                                                ? undefined
                                                : {
                                                      scale: 0.985,
                                                  }
                                        }
                                        className={`
                                            group
                                            relative
                                            min-h-[86px]
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                            p-4
                                            text-left
                                            transition-all
                                            duration-300
                                            ${
                                                formData.isPrivate
                                                    ? "border-indigo-400/25 bg-indigo-500/[0.07] shadow-[0_12px_35px_rgba(99,102,241,0.08)]"
                                                    : "border-white/[0.06] bg-slate-950/50 hover:border-white/[0.10] hover:bg-white/[0.025]"
                                            }
                                        `}
                                        aria-pressed={
                                            formData.isPrivate
                                        }
                                    >
                                        {formData.isPrivate && (
                                            <motion.div
                                                layoutId="privacy-active"
                                                className="
                                                    absolute
                                                    inset-0
                                                    rounded-2xl
                                                    border
                                                    border-indigo-400/20
                                                "
                                                transition={{
                                                    duration: 0.25,
                                                }}
                                            />
                                        )}

                                        <div className="relative flex items-center gap-3">
                                            <div
                                                className={`
                                                    flex
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    transition-all
                                                    duration-300
                                                    ${
                                                        formData.isPrivate
                                                            ? "bg-indigo-500/15 text-indigo-400"
                                                            : "bg-slate-800/70 text-slate-600 group-hover:text-slate-400"
                                                    }
                                                `}
                                            >
                                                <FaLock className="text-sm" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-white">
                                                        Private
                                                    </p>

                                                    {formData.isPrivate && (
                                                        <motion.span
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.7,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white"
                                                        >
                                                            <FaCheck className="text-[7px]" />
                                                        </motion.span>
                                                    )}
                                                </div>

                                                <p className="mt-1 text-[11px] text-slate-600">
                                                    Invite code
                                                    required
                                                </p>
                                            </div>
                                        </div>
                                    </motion.button>
                                </div>
                            </div>

                            {/* =================================
                                SUBMIT
                            ================================= */}

                            <div className="pt-1">
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={
                                        shouldReduceMotion ||
                                        loading
                                            ? undefined
                                            : {
                                                  y: -2,
                                              }
                                    }
                                    whileTap={
                                        shouldReduceMotion ||
                                        loading
                                            ? undefined
                                            : {
                                                  scale: 0.985,
                                              }
                                    }
                                    className="
                                        group
                                        relative
                                        flex
                                        min-h-12
                                        w-full
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-2xl
                                        bg-indigo-500
                                        px-6
                                        py-3.5
                                        text-sm
                                        font-bold
                                        text-white
                                        shadow-[0_15px_40px_rgba(99,102,241,0.18)]
                                        transition-all
                                        duration-300
                                        hover:bg-indigo-400
                                        hover:shadow-[0_18px_50px_rgba(99,102,241,0.28)]
                                        disabled:cursor-not-allowed
                                        disabled:bg-slate-800
                                        disabled:text-slate-500
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
                                                Creating room...
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="relative">
                                            Create Study Room
                                        </span>
                                    )}
                                </motion.button>

                                <p className="mt-3 text-center text-[10px] text-slate-700">
                                    Press{" "}
                                    <kbd className="rounded-md border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-medium text-slate-500">
                                        Esc
                                    </kbd>{" "}
                                    to close
                                </p>
                            </div>
                        </div>
                    </motion.form>
                </motion.div>
            </motion.div>

            {/* =========================================
                PRIVATE ROOM INVITE
            ========================================= */}

            <InviteCodeModal
                isOpen={showInviteModal}
                room={createdRoom}
                onClose={() => {
                    setShowInviteModal(false);
                    onClose();
                    navigate(
                        `/room/${createdRoom._id}`
                    );
                }}
            />
        </AnimatePresence>
    );
};

export default CreateRoomModal;