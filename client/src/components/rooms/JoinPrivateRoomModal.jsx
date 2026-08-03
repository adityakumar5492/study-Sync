import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { joinRoomThunk } from "../../redux/room/roomThunk";

const JoinPrivateRoomModal = ({
    isOpen,
    room,
    onClose,
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading } = useAppSelector(
        (state) => state.room
    );

    const [inviteCode, setInviteCode] = useState("");

    if (!isOpen) return null;

    const handleJoin = async () => {
        const code = inviteCode.trim();

        if (!code) {
            toast.error("Invite code is required.");
            return;
        }

        try {
            const response = await dispatch(
                joinRoomThunk(code)
            ).unwrap();

            toast.success(response.message || "Joined room successfully.");

            setInviteCode("");
            onClose();

            const joinedRoomId = response.room?._id;

            if (joinedRoomId) {
                navigate(`/room/${joinedRoomId}`);
            } else {
                navigate("/rooms");
            }
        } catch (err) {
            toast.error(
                typeof err === "string"
                    ? err
                    : err?.message || "Invalid invite code."
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white">
                    Join Private Room
                </h2>

                <p className="mt-2 text-slate-400">
                    {room?.name
                        ? `Enter the invite code to join "${room.name}".`
                        : "Enter the invite code to join this room."}
                </p>

                <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) =>
                        setInviteCode(e.target.value.toUpperCase())
                    }
                    placeholder="Invite Code"
                    className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white uppercase outline-none focus:border-green-500"
                />

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => {
                            setInviteCode("");
                            onClose();
                        }}
                        className="rounded-xl border border-slate-700 px-5 py-2 text-slate-300 hover:bg-slate-800"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleJoin}
                        className="rounded-xl bg-green-500 px-5 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-60"
                    >
                        {loading ? "Joining..." : "Join"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinPrivateRoomModal;

