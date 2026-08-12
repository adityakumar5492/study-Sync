import { useRef, useState } from "react";
import {
    FaCamera,
    FaUserCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
    useAppDispatch,
    useAppSelector,
} from "../../redux/hooks";

import { updateUser } from "../../redux/auth/authSlice";
import api from "../../api/axios";

const AvatarUpload = () => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const dispatch = useAppDispatch();

    const fileInputRef = useRef(null);

    const [uploading, setUploading] =
        useState(false);

    // ===========================
    // Open file picker
    // ===========================

    const handleButtonClick = () => {
        if (uploading) return;

        fileInputRef.current?.click();
    };

    // ===========================
    // Upload avatar
    // ===========================

    const handleFileChange = async (event) => {
        const file =
            event.target.files?.[0];

        if (!file) return;

        // Check image type
        if (!file.type.startsWith("image/")) {
            toast.error(
                "Please select an image file."
            );

            event.target.value = "";
            return;
        }

        // 5 MB limit
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

            // Update user in Redux
            dispatch(
                updateUser(
                    response.data.user
                )
            );

            toast.success(
                "Avatar updated successfully."
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to upload avatar."
            );
        } finally {
            setUploading(false);

            // Allows selecting the same
            // image again
            event.target.value = "";
        }
    };

    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">

            {/* Avatar */}
            <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-800">

                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={
                            user?.name ||
                            "Profile"
                        }
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <FaUserCircle className="text-7xl text-slate-500" />
                )}

            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Upload button */}
            <button
                type="button"
                onClick={handleButtonClick}
                disabled={uploading}
                className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <FaCamera />

                {uploading
                    ? "Uploading..."
                    : "Upload Avatar"}
            </button>

            <p className="mt-3 text-xs text-slate-500">
                JPG, PNG or WebP · Max 5 MB
            </p>

        </section>
    );
};

export default AvatarUpload;