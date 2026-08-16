import {
    FaCheckCircle,
    FaCopy,
    FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const InviteCodeModal = ({
    isOpen,
    room,
    onClose,
}) => {
    const navigate = useNavigate();

    if (!isOpen || !room) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                room.inviteCode
            );

            toast.success("Invite code copied.");
        } catch {
            toast.error("Failed to copy invite code.");
        }
    };

    const handleGoToRoom = () => {
        onClose();
        navigate(`/room/${room._id}`);
    };

    return (
        <div className="fixed inset-0 z-[60] flex min-h-screen items-center justify-center overflow-y-auto bg-black/70 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">

            <div className="relative my-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50 sm:rounded-3xl">

                {/* Top Accent */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-cyan-400" />

                <div className="p-5 sm:p-8">

                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 sm:h-16 sm:w-16">
                            <FaCheckCircle
                                className="text-2xl text-emerald-400 sm:text-3xl"
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mt-5 text-center">

                        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                            Private Room Created
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                            Share this invite code with your study group
                            to let them join the room.
                        </p>

                    </div>

                    {/* Invite Code */}
                    <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-center sm:mt-7 sm:p-5">

                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs sm:tracking-[0.2em]">
                            Invite Code
                        </p>

                        <p className="mt-3 break-all text-2xl font-bold tracking-[0.18em] text-indigo-400 sm:text-3xl sm:tracking-[0.25em]">
                            {room.inviteCode}
                        </p>

                    </div>

                    {/* Copy */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.99]"
                    >
                        <FaCopy />
                        Copy Invite Code
                    </button>

                    {/* Go To Room */}
                    <button
                        type="button"
                        onClick={handleGoToRoom}
                        className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white active:scale-[0.99]"
                    >
                        Go to Room
                        <FaArrowRight className="text-xs" />
                    </button>

                    {/* Hint */}
                    <p className="mt-5 text-center text-xs leading-5 text-slate-600">
                        You can find the invite code again from your room.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default InviteCodeModal;