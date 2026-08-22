import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    FaCamera,
    FaUserCircle,
    FaTimes,
    FaCheck,
    FaImage,
} from "react-icons/fa";

import {
    motion,
    AnimatePresence,
    useReducedMotion,
} from "framer-motion";

import toast from "react-hot-toast";

import {
    useAppDispatch,
    useAppSelector,
} from "../../redux/hooks";

import { updateUser } from "../../redux/auth/authSlice";

import api from "../../api/axios";

const API_URL = import.meta.env.VITE_API_URL;

const EditProfileModal = ({
    open,
    onClose,
}) => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const dispatch = useAppDispatch();
    const fileInputRef = useRef(null);
    const shouldReduceMotion = useReducedMotion();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [selectedFile, setSelectedFile] =
        useState(null);
    const [previewUrl, setPreviewUrl] =
        useState(null);
    const [saving, setSaving] =
        useState(false);

    /* =========================================
        LOAD USER DATA
    ========================================= */

    useEffect(() => {
        if (!open || !user) return;

        setName(user.name || "");
        setBio(user.bio || "");
        setSelectedFile(null);
        setPreviewUrl(null);
    }, [open, user]);

    /* =========================================
        CLEANUP PREVIEW
    ========================================= */

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    /* =========================================
        ESCAPE KEY
    ========================================= */

    useEffect(() => {
        if (!open || saving) return;

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
    }, [open, saving, onClose]);

    /* =========================================
        SELECT PHOTO
    ========================================= */

    const handlePhotoChange = (event) => {
        const file =
            event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error(
                "Please select an image file."
            );

            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error(
                "Photo must be smaller than 5 MB."
            );

            event.target.value = "";
            return;
        }

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const newPreview =
            URL.createObjectURL(file);

        setSelectedFile(file);
        setPreviewUrl(newPreview);

        event.target.value = "";
    };

    /* =========================================
        SAVE PROFILE
    ========================================= */

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedBio = bio.trim();

        if (!trimmedName) {
            toast.error("Name is required.");
            return;
        }

        if (trimmedName.length < 2) {
            toast.error(
                "Name must be at least 2 characters."
            );
            return;
        }

        if (trimmedName.length > 50) {
            toast.error(
                "Name cannot exceed 50 characters."
            );
            return;
        }

        if (trimmedBio.length > 200) {
            toast.error(
                "Bio cannot exceed 200 characters."
            );
            return;
        }

        try {
            setSaving(true);

            /* ================================
                1. UPDATE NAME + BIO
            ================================= */

            const profileResponse = await api.put(
                "/users/profile",
                {
                    name: trimmedName,
                    bio: trimmedBio,
                }
            );

            if (!profileResponse.data?.success) {
                throw new Error(
                    profileResponse.data?.message ||
                        "Failed to update profile."
                );
            }

            /* ================================
                2. UPLOAD AVATAR
            ================================= */

            if (selectedFile) {
                const formData = new FormData();

                formData.append(
                    "avatar",
                    selectedFile
                );

                const avatarResponse =
                    await api.put(
                        "/users/avatar",
                        formData
                    );

                if (
                    !avatarResponse.data?.success
                ) {
                    throw new Error(
                        avatarResponse.data
                            ?.message ||
                            "Failed to upload photo."
                    );
                }
            }

            /* ================================
                3. GET FINAL USER
            ================================= */

            const freshProfileResponse =
                await api.get(
                    "/users/profile"
                );

            if (
                !freshProfileResponse.data
                    ?.success
            ) {
                throw new Error(
                    freshProfileResponse.data
                        ?.message ||
                        "Failed to refresh profile."
                );
            }

            const freshUser =
                freshProfileResponse.data.user;

            /* ================================
                4. UPDATE REDUX
            ================================= */

            dispatch(updateUser(freshUser));

            /* ================================
                5. SUCCESS
            ================================= */

            toast.success(
                "Profile updated successfully."
            );

            onClose();
        } catch (error) {
            console.error(
                "Profile update error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    const currentAvatar = user?.avatar
        ? `${API_URL}${user.avatar}`
        : null;

    const displayedAvatar =
        previewUrl || currentAvatar;

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: shouldReduceMotion ? 1 : 0.96,
            y: shouldReduceMotion ? 0 : 12,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
            },
        },
        exit: {
            opacity: 0,
            scale: shouldReduceMotion ? 1 : 0.97,
            y: shouldReduceMotion ? 0 : 8,
            transition: {
                duration: 0.2,
                ease: [0.4, 0, 1, 1],
            },
        },
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={
                        shouldReduceMotion
                            ? {
                                  opacity: 0,
                              }
                            : {
                                  opacity: 0,
                              }
                    }
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    transition={{
                        duration: 0.22,
                    }}
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        overflow-y-auto
                        bg-black/75
                        p-3
                        backdrop-blur-md
                        sm:p-5
                    "
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                                event.currentTarget &&
                            !saving
                        ) {
                            onClose();
                        }
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-profile-title"
                >
                    {/* =================================
                        MODAL
                    ================================= */}

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
                            max-w-lg
                            flex-col
                            overflow-hidden
                            rounded-[26px]
                            border
                            border-slate-800/80
                            bg-[#090e16]
                            shadow-[0_30px_100px_rgba(0,0,0,0.55)]
                            sm:max-h-[90vh]
                        "
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        {/* =================================
                            AMBIENT BACKGROUND
                        ================================= */}

                        <div className="
                            pointer-events-none
                            absolute
                            -right-24
                            -top-24
                            h-64
                            w-64
                            rounded-full
                            bg-indigo-500/[0.08]
                            blur-[90px]
                        " />

                        <div className="
                            pointer-events-none
                            absolute
                            -bottom-28
                            -left-20
                            h-48
                            w-48
                            rounded-full
                            bg-violet-500/[0.035]
                            blur-[80px]
                        " />

                        <div className="
                            pointer-events-none
                            absolute
                            left-10
                            right-10
                            top-0
                            h-px
                            bg-gradient-to-r
                            from-transparent
                            via-indigo-400/40
                            to-transparent
                        " />

                        {/* =================================
                            HEADER
                        ================================= */}

                        <div className="
                            relative
                            flex
                            shrink-0
                            items-start
                            justify-between
                            border-b
                            border-slate-800/70
                            px-5
                            py-4
                            sm:px-6
                            sm:py-5
                        ">
                            <div>
                                <div className="
                                    mb-1.5
                                    flex
                                    items-center
                                    gap-2
                                ">
                                    <span className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-indigo-400
                                        shadow-[0_0_8px_rgba(129,140,248,0.5)]
                                    " />

                                    <span className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-indigo-400/80
                                    ">
                                        Account settings
                                    </span>
                                </div>

                                <h2
                                    id="edit-profile-title"
                                    className="
                                        text-lg
                                        font-bold
                                        tracking-[-0.025em]
                                        text-white
                                        sm:text-xl
                                    "
                                >
                                    Edit Profile
                                </h2>

                                <p className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-slate-500
                                ">
                                    Update your profile
                                    information.
                                </p>
                            </div>

                            <motion.button
                                type="button"
                                onClick={onClose}
                                disabled={saving}
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
                                    border-slate-800/80
                                    bg-slate-900/70
                                    text-slate-500
                                    transition-all
                                    duration-200
                                    hover:border-slate-700
                                    hover:bg-slate-800
                                    hover:text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-indigo-400/70
                                "
                                aria-label="Close edit profile"
                                title="Close"
                            >
                                <FaTimes className="text-xs" />
                            </motion.button>
                        </div>

                        {/* =================================
                            FORM
                        ================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="
                                relative
                                overflow-y-auto
                                px-5
                                py-5
                                sm:px-6
                                sm:py-6
                            "
                        >
                            <div className="space-y-5 sm:space-y-6">
                                {/* =================================
                                    PROFILE PHOTO
                                ================================= */}

                                <div className="
                                    rounded-2xl
                                    border
                                    border-slate-800/70
                                    bg-slate-950/35
                                    p-4
                                    sm:p-5
                                ">
                                    <div className="
                                        flex
                                        flex-col
                                        items-center
                                        text-center
                                    ">
                                        <div className="
                                            relative
                                            h-24
                                            w-24
                                            sm:h-28
                                            sm:w-28
                                        ">
                                            {/* Glow */}
                                            <div className="
                                                absolute
                                                inset-[-8px]
                                                rounded-[28px]
                                                bg-indigo-500/[0.08]
                                                blur-xl
                                            " />

                                            {/* Avatar */}
                                            <div className="
                                                relative
                                                h-full
                                                w-full
                                                overflow-hidden
                                                rounded-[22px]
                                                border
                                                border-slate-700/80
                                                bg-slate-950
                                                shadow-[0_15px_40px_rgba(0,0,0,0.3)]
                                            ">
                                                {displayedAvatar ? (
                                                    <img
                                                        src={
                                                            displayedAvatar
                                                        }
                                                        alt={
                                                            user?.name ||
                                                            "Profile"
                                                        }
                                                        className="
                                                            h-full
                                                            w-full
                                                            object-cover
                                                        "
                                                    />
                                                ) : (
                                                    <div className="
                                                        flex
                                                        h-full
                                                        w-full
                                                        items-center
                                                        justify-center
                                                        bg-gradient-to-br
                                                        from-slate-900
                                                        to-slate-950
                                                    ">
                                                        <FaUserCircle className="
                                                            text-[64px]
                                                            text-slate-600
                                                        " />
                                                    </div>
                                                )}

                                                <div className="
                                                    pointer-events-none
                                                    absolute
                                                    inset-0
                                                    bg-gradient-to-t
                                                    from-black/25
                                                    via-transparent
                                                    to-white/[0.04]
                                                " />
                                            </div>

                                            {/* Camera */}
                                            <motion.button
                                                type="button"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                disabled={
                                                    saving
                                                }
                                                whileHover={
                                                    shouldReduceMotion
                                                        ? undefined
                                                        : {
                                                              scale: 1.08,
                                                          }
                                                }
                                                whileTap={
                                                    shouldReduceMotion
                                                        ? undefined
                                                        : {
                                                              scale: 0.94,
                                                          }
                                                }
                                                title="Change profile photo"
                                                className="
                                                    absolute
                                                    bottom-[-2px]
                                                    right-[-2px]
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    border-[3px]
                                                    border-[#090e16]
                                                    bg-indigo-500
                                                    text-white
                                                    shadow-[0_8px_20px_rgba(99,102,241,0.3)]
                                                    transition-colors
                                                    hover:bg-indigo-400
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                "
                                                aria-label="Change profile photo"
                                            >
                                                <FaCamera className="text-xs" />
                                            </motion.button>
                                        </div>

                                        <input
                                            ref={
                                                fileInputRef
                                            }
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            onChange={
                                                handlePhotoChange
                                            }
                                            className="hidden"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            disabled={
                                                saving
                                            }
                                            className="
                                                mt-3
                                                flex
                                                items-center
                                                gap-2
                                                text-xs
                                                font-semibold
                                                text-indigo-400
                                                transition-colors
                                                hover:text-indigo-300
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        >
                                            <FaImage className="text-[10px]" />
                                            Change Photo
                                        </button>

                                        <p className="
                                            mt-1.5
                                            text-[10px]
                                            text-slate-600
                                        ">
                                            JPG, PNG or WebP ·
                                            Max 5 MB
                                        </p>
                                    </div>
                                </div>

                                {/* =================================
                                    NAME
                                ================================= */}

                                <div>
                                    <div className="
                                        mb-2
                                        flex
                                        items-center
                                        justify-between
                                    ">
                                        <label
                                            htmlFor="profile-name"
                                            className="
                                                text-xs
                                                font-semibold
                                                text-slate-300
                                            "
                                        >
                                            Full Name
                                        </label>

                                        <span className="
                                            text-[9px]
                                            font-medium
                                            text-slate-600
                                        ">
                                            Required
                                        </span>
                                    </div>

                                    <input
                                        id="profile-name"
                                        type="text"
                                        value={name}
                                        onChange={(event) =>
                                            setName(
                                                event.target
                                                    .value
                                            )
                                        }
                                        maxLength={50}
                                        disabled={saving}
                                        placeholder="Enter your name"
                                        autoComplete="name"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-800/80
                                            bg-slate-950/70
                                            px-3.5
                                            py-3
                                            text-sm
                                            text-white
                                            outline-none
                                            transition-all
                                            duration-200
                                            placeholder:text-slate-700
                                            hover:border-slate-700
                                            focus:border-indigo-500/60
                                            focus:bg-slate-950
                                            focus:ring-4
                                            focus:ring-indigo-500/[0.07]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                            sm:px-4
                                        "
                                    />

                                    <div className="
                                        mt-1.5
                                        flex
                                        justify-end
                                    ">
                                        <span
                                            className={`
                                                text-[10px]
                                                ${
                                                    name.length >=
                                                    45
                                                        ? "text-amber-400"
                                                        : "text-slate-600"
                                                }
                                            `}
                                        >
                                            {name.length}/50
                                        </span>
                                    </div>
                                </div>

                                {/* =================================
                                    BIO
                                ================================= */}

                                <div>
                                    <div className="
                                        mb-2
                                        flex
                                        items-center
                                        justify-between
                                    ">
                                        <label
                                            htmlFor="profile-bio"
                                            className="
                                                text-xs
                                                font-semibold
                                                text-slate-300
                                            "
                                        >
                                            Bio
                                        </label>

                                        <span className="
                                            text-[9px]
                                            font-medium
                                            text-slate-600
                                        ">
                                            Optional
                                        </span>
                                    </div>

                                    <textarea
                                        id="profile-bio"
                                        rows={4}
                                        value={bio}
                                        onChange={(event) =>
                                            setBio(
                                                event.target
                                                    .value
                                            )
                                        }
                                        maxLength={200}
                                        disabled={saving}
                                        placeholder="Tell others a little about yourself..."
                                        className="
                                            w-full
                                            resize-none
                                            rounded-xl
                                            border
                                            border-slate-800/80
                                            bg-slate-950/70
                                            px-3.5
                                            py-3
                                            text-sm
                                            leading-6
                                            text-white
                                            outline-none
                                            transition-all
                                            duration-200
                                            placeholder:text-slate-700
                                            hover:border-slate-700
                                            focus:border-indigo-500/60
                                            focus:bg-slate-950
                                            focus:ring-4
                                            focus:ring-indigo-500/[0.07]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                            sm:px-4
                                        "
                                    />

                                    <div className="
                                        mt-1.5
                                        flex
                                        justify-end
                                    ">
                                        <span
                                            className={`
                                                text-[10px]
                                                ${
                                                    bio.length >=
                                                    180
                                                        ? "text-amber-400"
                                                        : "text-slate-600"
                                                }
                                            `}
                                        >
                                            {bio.length}/200
                                        </span>
                                    </div>
                                </div>

                                {/* =================================
                                    ACTIONS
                                ================================= */}

                                <div className="
                                    flex
                                    flex-col-reverse
                                    gap-2.5
                                    border-t
                                    border-slate-800/70
                                    pt-5
                                    min-[400px]:flex-row
                                    min-[400px]:justify-end
                                ">
                                    <motion.button
                                        type="button"
                                        onClick={onClose}
                                        disabled={saving}
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
                                            flex
                                            min-h-11
                                            w-full
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-slate-700/80
                                            bg-slate-900/60
                                            px-5
                                            py-3
                                            text-xs
                                            font-semibold
                                            text-slate-300
                                            transition-all
                                            duration-200
                                            hover:border-slate-600
                                            hover:bg-slate-800
                                            hover:text-white
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                            min-[400px]:w-auto
                                        "
                                    >
                                        Cancel
                                    </motion.button>

                                    <motion.button
                                        type="submit"
                                        disabled={
                                            saving ||
                                            !name.trim()
                                        }
                                        whileHover={
                                            shouldReduceMotion ||
                                            saving ||
                                            !name.trim()
                                                ? undefined
                                                : {
                                                      y: -1,
                                                  }
                                        }
                                        whileTap={
                                            shouldReduceMotion ||
                                            saving ||
                                            !name.trim()
                                                ? undefined
                                                : {
                                                      scale: 0.98,
                                                  }
                                        }
                                        className="
                                            relative
                                            flex
                                            min-h-11
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-indigo-400/20
                                            bg-indigo-500
                                            px-6
                                            py-3
                                            text-xs
                                            font-semibold
                                            text-white
                                            shadow-[0_10px_30px_rgba(99,102,241,0.18)]
                                            transition-all
                                            duration-300
                                            hover:border-indigo-300/30
                                            hover:bg-indigo-400
                                            hover:shadow-[0_14px_35px_rgba(99,102,241,0.28)]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                            disabled:shadow-none
                                            min-[400px]:w-auto
                                        "
                                    >
                                        {saving ? (
                                            <>
                                                <span className="
                                                    h-3.5
                                                    w-3.5
                                                    animate-spin
                                                    rounded-full
                                                    border-2
                                                    border-white/30
                                                    border-t-white
                                                " />

                                                <span>
                                                    Saving...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <FaCheck className="text-[10px]" />

                                                <span>
                                                    Save Changes
                                                </span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </form>

                        {/* Bottom highlight */}
                        <div className="
                            pointer-events-none
                            absolute
                            inset-x-10
                            bottom-0
                            h-px
                            bg-gradient-to-r
                            from-transparent
                            via-white/[0.06]
                            to-transparent
                        " />

                        {/* Inner border */}
                        <div className="
                            pointer-events-none
                            absolute
                            inset-0
                            rounded-[26px]
                            ring-1
                            ring-inset
                            ring-white/[0.025]
                        " />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;