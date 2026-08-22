import {
    FaPlus,
    FaSignInAlt,
    FaFileUpload,
    FaBolt,
} from "react-icons/fa";
import {
    motion,
    useReducedMotion,
} from "framer-motion";

const QuickActions = ({
    onCreateRoom,
    onJoinRoom,
    onUploadMaterial,
}) => {
    const shouldReduceMotion = useReducedMotion();

    const actions = [
        {
            id: "create",
            title: "Create Study Room",
            description:
                "Create a focused workspace and invite your classmates to study together.",
            label: "Start a new session",
            icon: FaPlus,
            accent: "indigo",
            onClick: onCreateRoom,
        },
        {
            id: "join",
            title: "Join a Study Room",
            description:
                "Use an invite code to instantly enter an active collaborative session.",
            label: "Enter with code",
            icon: FaSignInAlt,
            accent: "cyan",
            onClick: onJoinRoom,
        },
        {
            id: "upload",
            title: "Upload Material",
            description:
                "Add PDFs, notes, and presentations to your shared study workspace.",
            label: "Add to workspace",
            icon: FaFileUpload,
            accent: "violet",
            onClick: onUploadMaterial,
        },
    ];

    const accentStyles = {
        indigo: {
            icon:
                "from-indigo-500/20 via-indigo-500/10 to-transparent text-indigo-300 ring-indigo-400/15",
            glow: "bg-indigo-500/20",
            accent: "bg-indigo-400",
            accentSoft: "bg-indigo-400/10",
            accentText: "text-indigo-300",
            border: "group-hover:border-indigo-400/20",
        },
        cyan: {
            icon:
                "from-cyan-500/20 via-cyan-500/10 to-transparent text-cyan-300 ring-cyan-400/15",
            glow: "bg-cyan-500/20",
            accent: "bg-cyan-400",
            accentSoft: "bg-cyan-400/10",
            accentText: "text-cyan-300",
            border: "group-hover:border-cyan-400/20",
        },
        violet: {
            icon:
                "from-violet-500/20 via-violet-500/10 to-transparent text-violet-300 ring-violet-400/15",
            glow: "bg-violet-500/20",
            accent: "bg-violet-400",
            accentSoft: "bg-violet-400/10",
            accentText: "text-violet-300",
            border: "group-hover:border-violet-400/20",
        },
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion
                    ? 0
                    : 0.07,
            },
        },
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 18,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <section className="relative">
            {/* =========================================
                SECTION HEADER
            ========================================= */}

            <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/50" />
                            <span className="relative h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        </span>

                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400/80">
                            Get started
                        </span>
                    </div>

                    <h2 className="text-xl font-bold tracking-[-0.035em] text-white sm:text-2xl">
                        Quick Actions
                    </h2>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                        Start your next collaborative session.
                    </p>
                </div>

                <div className="hidden items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/50 px-3 py-1.5 sm:flex">
                    <FaBolt className="text-[9px] text-amber-400" />

                    <span className="text-[10px] font-medium text-slate-500">
                        Ready to learn
                    </span>
                </div>
            </div>

            {/* =========================================
                ACTION GRID
            ========================================= */}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
            >
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    const colors =
                        accentStyles[action.accent];

                    return (
                        <motion.button
                            key={action.id}
                            variants={cardVariants}
                            type="button"
                            onClick={action.onClick}
                            whileHover={
                                shouldReduceMotion
                                    ? undefined
                                    : {
                                          y: -5,
                                      }
                            }
                            whileTap={
                                shouldReduceMotion
                                    ? undefined
                                    : {
                                          scale: 0.985,
                                      }
                            }
                            transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 26,
                            }}
                            className={`
                                group
                                relative
                                min-h-[235px]
                                overflow-hidden
                                rounded-[22px]
                                border
                                border-slate-800/80
                                bg-[#0a0f17]
                                p-5
                                text-left
                                outline-none
                                shadow-[0_12px_40px_rgba(0,0,0,0.16)]
                                transition-[border-color,background-color,box-shadow]
                                duration-500
                                hover:bg-[#0c121c]
                                hover:shadow-[0_20px_55px_rgba(0,0,0,0.25)]
                                focus-visible:ring-2
                                focus-visible:ring-indigo-400/70
                                focus-visible:ring-offset-2
                                focus-visible:ring-offset-slate-950
                                sm:min-h-[245px]
                                sm:p-6
                                ${colors.border}
                            `}
                        >
                            {/* =================================
                                AMBIENT LIGHT
                            ================================= */}

                            <div
                                className={`
                                    pointer-events-none
                                    absolute
                                    -right-24
                                    -top-24
                                    h-48
                                    w-48
                                    rounded-full
                                    opacity-[0.07]
                                    blur-[65px]
                                    transition-all
                                    duration-700
                                    group-hover:opacity-[0.18]
                                    group-hover:scale-110
                                    ${colors.glow}
                                `}
                            />

                            {/* =================================
                                TOP ACCENT
                            ================================= */}

                            <div
                                className={`
                                    pointer-events-none
                                    absolute
                                    left-8
                                    right-8
                                    top-0
                                    h-px
                                    opacity-30
                                    transition-all
                                    duration-500
                                    group-hover:left-5
                                    group-hover:right-5
                                    group-hover:opacity-80
                                    ${colors.accent}
                                `}
                            />

                            {/* =================================
                                CARD HEADER
                            ================================= */}

                            <div className="relative flex items-start justify-between">
                                {/* Icon */}
                                <motion.div
                                    whileHover={
                                        shouldReduceMotion
                                            ? undefined
                                            : {
                                                  scale: 1.06,
                                                  rotate: -3,
                                              }
                                    }
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 20,
                                    }}
                                    className={`
                                        relative
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-[15px]
                                        bg-gradient-to-br
                                        ring-1
                                        shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                                        ${colors.icon}
                                    `}
                                >
                                    <div className="absolute inset-0 bg-white/[0.025]" />

                                    <Icon className="relative text-[17px]" />
                                </motion.div>

                                {/* Index */}
                                <span className="
                                    rounded-full
                                    border
                                    border-slate-800/80
                                    bg-slate-900/60
                                    px-2
                                    py-1
                                    text-[9px]
                                    font-semibold
                                    tracking-[0.14em]
                                    text-slate-600
                                    transition-colors
                                    duration-300
                                    group-hover:text-slate-400
                                ">
                                    0{index + 1}
                                </span>
                            </div>

                            {/* =================================
                                CONTENT
                            ================================= */}

                            <div className="relative mt-6">
                                <div className="mb-2 flex items-center gap-2">
                                    <span
                                        className={`
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            ${colors.accent}
                                        `}
                                    />

                                    <span
                                        className={`
                                            text-[9px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.14em]
                                            ${colors.accentText}
                                        `}
                                    >
                                        {action.label}
                                    </span>
                                </div>

                                <h3 className="
                                    text-[16px]
                                    font-semibold
                                    tracking-[-0.02em]
                                    text-slate-100
                                    transition-colors
                                    duration-300
                                    group-hover:text-white
                                    sm:text-[17px]
                                ">
                                    {action.title}
                                </h3>

                                <p className="
                                    mt-2.5
                                    max-w-[320px]
                                    text-[12px]
                                    leading-[20px]
                                    text-slate-500
                                    transition-colors
                                    duration-300
                                    group-hover:text-slate-400
                                    sm:text-[13px]
                                    sm:leading-[21px]
                                ">
                                    {action.description}
                                </p>
                            </div>

                            {/* =================================
                                BOTTOM INTERACTION
                            ================================= */}

                            <div className="
                                absolute
                                bottom-5
                                left-5
                                right-5
                                flex
                                items-center
                                justify-between
                                border-t
                                border-slate-800/70
                                pt-3.5
                                sm:bottom-6
                                sm:left-6
                                sm:right-6
                            ">
                                <span className="
                                    text-[10px]
                                    font-medium
                                    text-slate-600
                                    transition-colors
                                    duration-300
                                    group-hover:text-slate-400
                                ">
                                    Continue
                                </span>

                                {/* Minimal motion indicator */}
                                <motion.span
                                    animate={
                                        shouldReduceMotion
                                            ? undefined
                                            : {
                                                  x: [0, 3, 0],
                                              }
                                    }
                                    transition={{
                                        duration: 1.8,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                        ease: "easeInOut",
                                    }}
                                    className={`
                                        flex
                                        h-6
                                        w-6
                                        items-center
                                        justify-center
                                        rounded-full
                                        ${colors.accentSoft}
                                    `}
                                >
                                    <span
                                        className={`
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            ${colors.accent}
                                        `}
                                    />
                                </motion.span>
                            </div>

                            {/* =================================
                                PREMIUM INNER BORDER
                            ================================= */}

                            <div className="
                                pointer-events-none
                                absolute
                                inset-0
                                rounded-[22px]
                                ring-1
                                ring-inset
                                ring-white/[0.025]
                                transition-all
                                duration-500
                                group-hover:ring-white/[0.06]
                            " />

                            {/* =================================
                                HOVER LIGHT
                            ================================= */}

                            <div className="
                                pointer-events-none
                                absolute
                                inset-x-10
                                bottom-0
                                h-px
                                bg-gradient-to-r
                                from-transparent
                                via-white/[0.08]
                                to-transparent
                                opacity-0
                                transition-opacity
                                duration-500
                                group-hover:opacity-100
                            " />
                        </motion.button>
                    );
                })}
            </motion.div>
        </section>
    );
};

export default QuickActions;