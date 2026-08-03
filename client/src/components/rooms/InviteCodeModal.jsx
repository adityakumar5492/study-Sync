import { FaCheckCircle, FaCopy } from "react-icons/fa";
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
            await navigator.clipboard.writeText(room.inviteCode);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

                <div className="flex flex-col items-center text-center">

                    <FaCheckCircle
                        size={60}
                        className="mb-4 text-green-500"
                    />

                    <h2 className="text-2xl font-bold text-white">
                        Private Room Created
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Share this invite code with your friends.
                    </p>

                    <div className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-800 p-4">
                        <p className="text-sm text-slate-400">
                            Invite Code
                        </p>

                        <p className="mt-2 text-3xl font-bold tracking-[0.3em] text-green-400">
                            {room.inviteCode}
                        </p>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-600"
                    >
                        <FaCopy />
                        Copy Invite Code
                    </button>

                    <button
                        onClick={handleGoToRoom}
                        className="mt-3 w-full rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-800"
                    >
                        Go To Room
                    </button>

                </div>
            </div>
        </div>
    );
};

export default InviteCodeModal;