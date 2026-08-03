import { FaPlus, FaSignInAlt, FaFileUpload } from "react-icons/fa";

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
      bg: "bg-green-500",
      hover: "hover:border-green-500",
      onClick: onCreateRoom,
    },
    {
      title: "Join with Invite Code",
      description:
        "Join an existing study room instantly using an invite code.",
      icon: <FaSignInAlt />,
      bg: "bg-blue-500",
      hover: "hover:border-blue-500",
      onClick: onJoinRoom,
    },
    {
      title: "Upload Study Material",
      description:
        "Upload PDFs, notes, or presentations for your study group.",
      icon: <FaFileUpload />,
      bg: "bg-purple-500",
      hover: "hover:border-purple-500",
      onClick: onUploadMaterial,
    },
  ];

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={action.onClick}
            className={`text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 transition duration-300 hover:-translate-y-1 ${action.hover}`}
          >
            <div
              className={`w-14 h-14 rounded-xl ${action.bg} flex items-center justify-center text-2xl mb-5`}
            >
              {action.icon}
            </div>

            <h3 className="text-xl font-semibold">
              {action.title}
            </h3>

            <p className="text-slate-400 mt-2">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;