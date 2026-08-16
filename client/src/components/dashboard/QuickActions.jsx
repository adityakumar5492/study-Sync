import {
    FaPlus,
    FaSignInAlt,
    FaFileUpload,
} from "react-icons/fa";

const QuickActions = ({
    onCreateRoom,
    onJoinRoom,
    onUploadMaterial,
}) => {
    const actions = [
        {
            title: "Create Study Room",
            description:
                "Start a collaborative study session and invite your classmates.",
            icon: <FaPlus />,
            iconColor: "text-indigo-400",
            iconBg: "bg-indigo-500/10",
            onClick: onCreateRoom,
        },
        {
            title: "Join with Invite Code",
            description:
                "Join an existing study room instantly using an invite code.",
            icon: <FaSignInAlt />,
            iconColor: "text-cyan-400",
            iconBg: "bg-cyan-500/10",
            onClick: onJoinRoom,
        },
        {
            title: "Upload Study Material",
            description:
                "Upload PDFs, notes, or presentations for your study group.",
            icon: <FaFileUpload />,
            iconColor: "text-violet-400",
            iconBg: "bg-violet-500/10",
            onClick: onUploadMaterial,
        },
    ];

    return (
        <section>
            <div className="mb-5">
                <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                    Quick Actions
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                    Get started with your next study session.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
                {actions.map((action) => (
                    <button
                        key={action.title}
                        type="button"
                        onClick={action.onClick}
                        className="group relative min-h-[180px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-left shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-slate-900 hover:shadow-indigo-500/5 active:scale-[0.99] sm:min-h-[190px] sm:p-5"
                    >
                        {/* Subtle hover glow */}
                        <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-indigo-500/0 blur-3xl transition duration-500 group-hover:bg-indigo-500/10" />

                        {/* Icon */}
                        <div
                            className={`relative mb-5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconBg} ${action.iconColor} text-lg transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12 sm:text-xl`}
                        >
                            {action.icon}
                        </div>

                        {/* Content */}
                        <div className="relative">
                            <h3 className="text-base font-semibold text-white">
                                {action.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {action.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default QuickActions;