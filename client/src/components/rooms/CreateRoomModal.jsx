import { useEffect, useState } from "react";
import {
    FaTimes,
    FaLock,
    FaGlobe,
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

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [createdRoom, setCreatedRoom] = useState(null);
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setFormData(initialState);
            setLoading(false);
            setCreatedRoom(null);
            setShowInviteModal(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

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

    const handleMaxMembersChange = (e) => {
        const value = e.target.value;

        // Allow empty input while editing
        if (value === "") {
            setFormData((prev) => ({
                ...prev,
                maxMembers: "",
            }));
            return;
        }

        // Remove leading zeros
        const cleanedValue = value.replace(/^0+/, "");

        setFormData((prev) => ({
            ...prev,
            maxMembers: cleanedValue
                ? Number(cleanedValue)
                : 0,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!formData.name.trim()) {
            toast.error("Room name is required.");
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Description is required.");
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
                navigate(`/room/${result.room._id}`);
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

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto bg-black/70 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">

                {/* Modal */}
                <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50 sm:rounded-3xl">

                    {/* Header */}
                    <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-800 px-4 py-4 sm:px-7 sm:py-5">

                        <div className="min-w-0">
                            <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                                Create Study Room
                            </h2>

                            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 sm:text-sm">
                                Set up a collaborative space for your study group.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Close modal"
                        >
                            <FaTimes />
                        </button>

                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6"
                    >

                        {/* Room Name */}
                        <div>
                            <label
                                htmlFor="room-name"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Room name
                            </label>

                            <input
                                id="room-name"
                                type="text"
                                name="name"
                                required
                                disabled={loading}
                                placeholder="e.g. Operating Systems Revision"
                                value={formData.name}
                                onChange={handleChange}
                                className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:truncate placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="room-description"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Description
                            </label>

                            <textarea
                                id="room-description"
                                rows={3}
                                name="description"
                                required
                                disabled={loading}
                                placeholder="What will your group study in this room?"
                                value={formData.description}
                                onChange={handleChange}
                                className="min-h-24 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </div>

                        {/* Maximum Members */}
                        <div>
                            <label
                                htmlFor="max-members"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Maximum members
                            </label>

                            <input
                                id="max-members"
                                type="text"
                                name="maxMembers"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                disabled={loading}
                                value={formData.maxMembers}
                                onChange={handleMaxMembersChange}
                                className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <p className="mt-2 text-xs text-slate-600">
                                Choose between 2 and 500 members.
                            </p>
                        </div>

                        {/* Privacy */}
                        <div className="grid gap-3 sm:grid-cols-2">

                            {/* Public */}
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        isPrivate: false,
                                    }))
                                }
                                className={`flex min-h-[76px] items-center gap-3 rounded-xl border p-4 text-left transition ${
                                    !formData.isPrivate
                                        ? "border-indigo-500/40 bg-indigo-500/10"
                                        : "border-slate-800 bg-slate-950 hover:border-slate-700"
                                }`}
                            >
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                        !formData.isPrivate
                                            ? "bg-indigo-500/15 text-indigo-400"
                                            : "bg-slate-800 text-slate-500"
                                    }`}
                                >
                                    <FaGlobe />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white">
                                        Public
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Anyone can join
                                    </p>
                                </div>
                            </button>

                            {/* Private */}
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        isPrivate: true,
                                    }))
                                }
                                className={`flex min-h-[76px] items-center gap-3 rounded-xl border p-4 text-left transition ${
                                    formData.isPrivate
                                        ? "border-indigo-500/40 bg-indigo-500/10"
                                        : "border-slate-800 bg-slate-950 hover:border-slate-700"
                                }`}
                            >
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                        formData.isPrivate
                                            ? "bg-indigo-500/15 text-indigo-400"
                                            : "bg-slate-800 text-slate-500"
                                    }`}
                                >
                                    <FaLock />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white">
                                        Private
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Invite code required
                                    </p>
                                </div>
                            </button>

                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Creating room...
                                </span>
                            ) : (
                                "Create Room"
                            )}
                        </button>

                    </form>
                </div>
            </div>

            {/* Private Room Invite */}
            <InviteCodeModal
                isOpen={showInviteModal}
                room={createdRoom}
                onClose={() => {
                    setShowInviteModal(false);
                    onClose();
                    navigate(`/room/${createdRoom._id}`);
                }}
            />
        </>
    );
};

export default CreateRoomModal;