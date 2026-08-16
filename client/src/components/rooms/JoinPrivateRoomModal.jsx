import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaLock,
    FaArrowRight,
    FaTimes,
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

    return (
        <div className="fixed inset-0 z-[60] flex min-h-screen items-center justify-center overflow-y-auto bg-black/70 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">

            <div className="my-auto flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50 sm:rounded-3xl">

                {/* Header */}
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-800 px-4 py-4 sm:px-6 sm:py-5">

                    <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                            <FaLock />
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-base font-bold text-white sm:text-lg">
                                Join Private Room
                            </h2>

                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                Enter your invitation code
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <FaTimes className="text-sm" />
                    </button>

                </div>

                {/* Content */}
                <div className="overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">

                    <p className="text-sm leading-6 text-slate-500">
                        {room?.name ? (
                            <>
                                Enter the invite code to join{" "}
                                <span className="break-words font-medium text-slate-300">
                                    "{room.name}"
                                </span>
                                .
                            </>
                        ) : (
                            "Enter the invite code to join this room."
                        )}
                    </p>

                    {/* Invite Code */}
                    <div className="mt-5">

                        <label
                            htmlFor="invite-code"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Invite code
                        </label>

                        <input
                            id="invite-code"
                            type="text"
                            value={inviteCode}
                            onChange={(e) =>
                                setInviteCode(
                                    e.target.value.toUpperCase()
                                )
                            }
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    !loading
                                ) {
                                    handleJoin();
                                }
                            }}
                            placeholder="Enter invite code"
                            autoFocus
                            disabled={loading}
                            className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-center text-base font-semibold tracking-[0.18em] text-white uppercase outline-none placeholder:tracking-normal placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg sm:tracking-[0.2em]"
                        />

                    </div>

                    {/* Actions */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="min-h-12 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleJoin}
                            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Joining...
                                </>
                            ) : (
                                <>
                                    Join Room
                                    <FaArrowRight className="text-xs" />
                                </>
                            )}
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default JoinPrivateRoomModal;