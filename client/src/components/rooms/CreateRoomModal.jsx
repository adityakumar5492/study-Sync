import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
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
                    : err?.message || "Failed to create room."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            Create Study Room
                        </h2>

                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="text-slate-400 transition hover:text-white disabled:cursor-not-allowed"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Room Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                required
                                disabled={loading}
                                placeholder="Enter room name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-transparent bg-slate-800 p-3 text-white outline-none transition focus:border-green-500 disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Description
                            </label>

                            <textarea
                                rows={4}
                                name="description"
                                required
                                disabled={loading}
                                placeholder="Describe your study room..."
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full resize-none rounded-xl border border-transparent bg-slate-800 p-3 text-white outline-none transition focus:border-green-500 disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Maximum Members
                            </label>

                            <input
                                type="number"
                                name="maxMembers"
                                min={2}
                                max={500}
                                disabled={loading}
                                value={formData.maxMembers}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-transparent bg-slate-800 p-3 text-white outline-none transition focus:border-green-500 disabled:opacity-60"
                            />
                        </div>

                        <label className="flex cursor-pointer items-center gap-3 text-slate-300">
                            <input
                                type="checkbox"
                                name="isPrivate"
                                checked={formData.isPrivate}
                                onChange={handleChange}
                                disabled={loading}
                                className="h-4 w-4 accent-green-500"
                            />

                            Private Room
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full rounded-xl py-3 font-semibold transition ${
                                loading
                                    ? "cursor-not-allowed bg-slate-700 text-slate-400"
                                    : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                        >
                            {loading
                                ? "Creating Room..."
                                : "Create Room"}
                        </button>
                    </form>
                </div>
            </div>

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
}
export default CreateRoomModal;