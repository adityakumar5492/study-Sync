import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    FaCamera,
    FaUserCircle,
    FaTimes,
} from "react-icons/fa";

import toast from "react-hot-toast";

import {
    useAppDispatch,
    useAppSelector,
} from "../../redux/hooks";

import { updateUser } from "../../redux/auth/authSlice";

import api from "../../api/axios";

const API_URL = "http://localhost:5000";

const EditProfileModal = ({
    open,
    onClose,
}) => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const dispatch = useAppDispatch();

    const fileInputRef = useRef(null);

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [previewUrl, setPreviewUrl] =
        useState(null);

    const [saving, setSaving] =
        useState(false);

    // ===========================
    // Load User Data
    // ===========================

    useEffect(() => {
        if (!open || !user) return;

        setName(user.name || "");
        setBio(user.bio || "");

        setSelectedFile(null);
        setPreviewUrl(null);
    }, [open, user]);

    // ===========================
    // Cleanup Preview
    // ===========================

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // ===========================
    // Select Photo
    // ===========================

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

    // ===========================
    // Save Profile
    // ===========================

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

            // =================================
            // 1. Update name + bio
            // =================================

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

            // =================================
            // 2. Upload avatar if selected
            // =================================

            if (selectedFile) {
                const formData = new FormData();

                formData.append(
                    "avatar",
                    selectedFile
                );

                const avatarResponse = await api.put(
                    "/users/avatar",
                    formData
                );

                if (!avatarResponse.data?.success) {
                    throw new Error(
                        avatarResponse.data?.message ||
                            "Failed to upload photo."
                    );
                }
            }

            // =================================
            // 3. Get the FINAL user from backend
            // =================================

            const freshProfileResponse =
                await api.get(
                    "/users/profile"
                );

            if (
                !freshProfileResponse.data?.success
            ) {
                throw new Error(
                    freshProfileResponse.data
                        ?.message ||
                        "Failed to refresh profile."
                );
            }

            const freshUser =
                freshProfileResponse.data.user;

            // =================================
            // 4. Update Redux
            // =================================

            dispatch(updateUser(freshUser));

            // =================================
            // 5. Close modal
            // =================================

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

    const currentAvatar =
        user?.avatar
            ? `${API_URL}${user.avatar}`
            : null;

    const displayedAvatar =
        previewUrl ||
        currentAvatar;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-4"
            onMouseDown={(event) => {
                if (
                    event.target ===
                        event.currentTarget &&
                    !saving
                ) {
                    onClose();
                }
            }}
        >
            {/* ===========================
                Modal
            =========================== */}

            <div className="my-auto flex max-h-[94vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50 sm:max-h-[90vh] sm:rounded-3xl">

                {/* ===========================
                    Close Button
                =========================== */}

                <div className="flex shrink-0 justify-end px-3 pt-3 sm:px-4 sm:pt-4">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10"
                        aria-label="Close"
                        title="Close"
                    >
                        <FaTimes />
                    </button>

                </div>

                {/* ===========================
                    Form
                =========================== */}

                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto px-4 pb-5 sm:px-6 sm:pb-6"
                >

                    <div className="space-y-5 sm:space-y-6">

                        {/* ===========================
                            Profile Photo
                        =========================== */}

                        <div className="text-center">

                            <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">

                                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-lg sm:h-24 sm:w-24">

                                    {displayedAvatar ? (
                                        <img
                                            src={
                                                displayedAvatar
                                            }
                                            alt={
                                                user?.name ||
                                                "Profile"
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="text-5xl text-slate-600 sm:text-6xl" />
                                    )}

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={saving}
                                    title="Change profile photo"
                                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-slate-900 bg-indigo-500 text-white shadow-lg transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FaCamera size={13} />
                                </button>

                            </div>

                            <input
                                ref={fileInputRef}
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
                                disabled={saving}
                                className="mt-2 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300 disabled:opacity-50"
                            >
                                Change Photo
                            </button>

                            <p className="mt-1 text-xs text-slate-600">
                                JPG, PNG or WebP · Max 5 MB
                            </p>

                        </div>

                        {/* ===========================
                            Name
                        =========================== */}

                        <div>

                            <label
                                htmlFor="profile-name"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Full Name
                            </label>

                            <input
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                maxLength={50}
                                disabled={saving}
                                placeholder="Enter your name"
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-3"
                            />

                            <p className="mt-1 text-right text-xs text-slate-600">
                                {name.length}/50
                            </p>

                        </div>

                        {/* ===========================
                            Bio
                        =========================== */}

                        <div>

                            <label
                                htmlFor="profile-bio"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Bio
                            </label>

                            <textarea
                                id="profile-bio"
                                rows={3}
                                value={bio}
                                onChange={(event) =>
                                    setBio(
                                        event.target.value
                                    )
                                }
                                maxLength={200}
                                disabled={saving}
                                placeholder="Tell others a little about yourself..."
                                className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                            />

                            <p className="mt-1 text-right text-xs text-slate-600">
                                {bio.length}/200
                            </p>

                        </div>

                        {/* ===========================
                            Actions
                        =========================== */}

                        <div className="flex flex-col-reverse gap-2.5 border-t border-slate-800 pt-4 min-[380px]:flex-row min-[380px]:justify-end">

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={saving}
                                className="w-full rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 min-[380px]:w-auto"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    !name.trim()
                                }
                                className="w-full rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 min-[380px]:w-auto"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default EditProfileModal;