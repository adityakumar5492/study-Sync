import { useRef, useState } from "react";
import {
    FaCamera,
    FaUserCircle,
    FaCheck,
    FaImage,
} from "react-icons/fa";
import {
    motion,
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

const AvatarUpload = () => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const dispatch = useAppDispatch();
    const shouldReduceMotion = useReducedMotion();

    const fileInputRef = useRef(null);

    const [uploading, setUploading] =
        useState(false);

    const handleButtonClick = () => {
        if (uploading) return;

        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
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
                "Avatar must be smaller than 5 MB."
            );

            event.target.value = "";
            return;
        }

        const formData = new FormData();

        formData.append("avatar", file);

        try {
            setUploading(true);

            const response = await api.put(
                "/users/avatar",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            if (!response.data?.success) {
                throw new Error(
                    response.data?.message ||
                        "Failed to upload avatar."
                );
            }

            dispatch(
                updateUser(response.data.user)
            );

            toast.success(
                "Avatar updated successfully."
            );
        } catch (error) {
            console.error(
                "Avatar upload error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to upload avatar."
            );
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const avatarUrl = user?.avatar
        ? user.avatar.startsWith("http")
            ? user.avatar
            : `${API_URL}${user.avatar}`
        : null;

    return (
        <motion.section
            initial={
                shouldReduceMotion
                    ? false
                    : {
                          opacity: 0,
                          y: 12,
                      }
            }
            animate={
                shouldReduceMotion
                    ? undefined
                    : {
                          opacity: 1,
                          y: 0,
                      }
            }
            transition={{
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="
                group
                relative
                overflow-hidden
                rounded-[24px]
                border
                border-slate-800/80
                bg-[#0a0f17]
                p-5
                text-center
                shadow-[0_18px_55px_rgba(0,0,0,0.18)]
                transition-all
                duration-500
                hover:border-slate-700/80
                sm:p-6
            "
        >
            {/* =========================================
                AMBIENT BACKGROUND
            ========================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-56
                    w-56
                    rounded-full
                    bg-indigo-500/[0.07]
                    blur-[80px]
                    transition-all
                    duration-700
                    group-hover:bg-indigo-500/[0.11]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-28
                    -left-20
                    h-48
                    w-48
                    rounded-full
                    bg-violet-500/[0.025]
                    blur-[70px]
                "
            />

            {/* Top highlight */}
            <div
                className="
                    pointer-events-none
                    absolute
                    left-10
                    right-10
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-indigo-400/30
                    to-transparent
                "
            />

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="relative mb-6">
                <div className="mb-2 flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.17em] text-indigo-400/80">
                        Profile photo
                    </span>
                </div>

                <h2 className="text-lg font-semibold tracking-[-0.025em] text-white sm:text-xl">
                    Your Avatar
                </h2>

                <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-slate-500">
                    Choose a photo that represents you
                    in StudySync.
                </p>
            </div>

            {/* =========================================
                AVATAR
            ========================================= */}

            <div className="relative mx-auto h-32 w-32 sm:h-36 sm:w-36">
                {/* Outer glow */}
                <motion.div
                    animate={
                        shouldReduceMotion
                            ? undefined
                            : {
                                  scale: [1, 1.04, 1],
                                  opacity: [
                                      0.45,
                                      0.7,
                                      0.45,
                                  ],
                              }
                    }
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
                        absolute
                        inset-[-10px]
                        rounded-full
                        bg-indigo-500/[0.07]
                        blur-2xl
                    "
                />

                {/* Avatar frame */}
                <motion.div
                    whileHover={
                        shouldReduceMotion
                            ? undefined
                            : {
                                  scale: 1.025,
                              }
                    }
                    transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 22,
                    }}
                    className="
                        relative
                        h-full
                        w-full
                        overflow-hidden
                        rounded-full
                        border
                        border-slate-700/80
                        bg-slate-950
                        p-1
                        shadow-[0_18px_45px_rgba(0,0,0,0.35)]
                    "
                >
                    <div className="
                        relative
                        h-full
                        w-full
                        overflow-hidden
                        rounded-full
                    ">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={
                                    user?.name ||
                                    "Profile"
                                }
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                    transition-transform
                                    duration-700
                                    group-hover:scale-105
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
                                <FaUserCircle className="text-[78px] text-slate-600" />
                            </div>
                        )}

                        {/* Image overlay */}
                        <div className="
                            pointer-events-none
                            absolute
                            inset-0
                            rounded-full
                            bg-gradient-to-t
                            from-black/25
                            via-transparent
                            to-white/[0.04]
                        " />
                    </div>
                </motion.div>

                {/* Online indicator */}
                <span className="
                    absolute
                    bottom-1
                    right-1
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    border-[3px]
                    border-[#0a0f17]
                    bg-emerald-400
                    shadow-[0_0_14px_rgba(52,211,153,0.45)]
                ">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                </span>
            </div>

            {/* =========================================
                USER NAME
            ========================================= */}

            <div className="relative mt-5">
                <p className="truncate text-sm font-semibold text-white">
                    {user?.name || "Student"}
                </p>

                <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="text-[10px] text-slate-600">
                        {user?.email || "Profile photo"}
                    </span>
                </div>
            </div>

            {/* =========================================
                FILE INPUT
            ========================================= */}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* =========================================
                UPLOAD BUTTON
            ========================================= */}

            <motion.button
                type="button"
                onClick={handleButtonClick}
                disabled={uploading}
                whileHover={
                    shouldReduceMotion || uploading
                        ? undefined
                        : {
                              y: -2,
                          }
                }
                whileTap={
                    shouldReduceMotion || uploading
                        ? undefined
                        : {
                              scale: 0.98,
                          }
                }
                className="
                    relative
                    mt-6
                    flex
                    min-h-11
                    w-full
                    items-center
                    justify-center
                    gap-2.5
                    overflow-hidden
                    rounded-xl
                    border
                    border-indigo-400/20
                    bg-indigo-500
                    px-5
                    py-3
                    text-xs
                    font-semibold
                    text-white
                    shadow-[0_10px_30px_rgba(99,102,241,0.2)]
                    transition-all
                    duration-300
                    hover:border-indigo-300/30
                    hover:bg-indigo-400
                    hover:shadow-[0_14px_35px_rgba(99,102,241,0.3)]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    disabled:shadow-none
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-indigo-400/70
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#0a0f17]
                    sm:text-sm
                "
            >
                {/* Button shine */}
                {!uploading && (
                    <span className="
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
                        hover:translate-x-full
                    " />
                )}

                {uploading ? (
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

                        <span className="relative">
                            Uploading...
                        </span>
                    </>
                ) : (
                    <>
                        <FaCamera className="relative text-[11px]" />

                        <span className="relative">
                            {user?.avatar
                                ? "Change Avatar"
                                : "Upload Avatar"}
                        </span>
                    </>
                )}
            </motion.button>

            {/* =========================================
                INFO
            ========================================= */}

            <div className="
                relative
                mt-4
                flex
                items-center
                justify-center
                gap-2
            ">
                {user?.avatar && !uploading ? (
                    <>
                        <FaCheck className="text-[8px] text-emerald-400" />

                        <p className="text-[10px] text-slate-600">
                            Profile photo is up to date
                        </p>
                    </>
                ) : (
                    <>
                        <FaImage className="text-[9px] text-slate-600" />

                        <p className="text-[10px] text-slate-600">
                            JPG, PNG or WebP · Max 5 MB
                        </p>
                    </>
                )}
            </div>

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
                opacity-0
                transition-opacity
                duration-500
                group-hover:opacity-100
            " />

            {/* Inner border */}
            <div className="
                pointer-events-none
                absolute
                inset-0
                rounded-[24px]
                ring-1
                ring-inset
                ring-white/[0.025]
            " />
        </motion.section>
    );
};

export default AvatarUpload;