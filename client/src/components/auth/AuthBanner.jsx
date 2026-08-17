import { motion } from "framer-motion";
import {
    FaFilePdf,
    FaUsers,
    FaPenNib,
} from "react-icons/fa";

const AuthBanner = () => {
    const features = [
        {
            icon: <FaFilePdf />,
            title: "Shared PDF Collaboration",
            description: "Study from the same material together.",
            iconClass: "text-red-400",
            bgClass: "bg-red-500/10",
        },
        {
            icon: <FaPenNib />,
            title: "Live Annotation",
            description: "Draw and annotate in real time.",
            iconClass: "text-indigo-400",
            bgClass: "bg-indigo-500/10",
        },
        {
            icon: <FaUsers />,
            title: "Interactive Study Rooms",
            description: "Learn together with your study group.",
            iconClass: "text-cyan-400",
            bgClass: "bg-cyan-500/10",
        },
    ];

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden border-r border-slate-800 bg-slate-950 px-10 py-16 xl:px-16">

            {/* Background Glows */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/15 blur-[130px]" />

            <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />

            <div className="relative z-10 max-w-xl">

                {/* Brand */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <span className="text-2xl font-bold tracking-tight text-white">
                        Study
                        <span className="text-indigo-400">
                            Sync
                        </span>
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.1,
                    }}
                >
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
                        Collaborative Learning
                    </p>

                    <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white xl:text-6xl">
                        Study together.
                        <br />
                        <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Learn better.
                        </span>
                    </h1>

                    <p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">
                        Collaborate with your study group using shared PDFs,
                        real-time annotations, live discussions, and
                        interactive study rooms.
                    </p>
                </motion.div>

                {/* Features */}
                <div className="mt-12 space-y-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{
                                opacity: 0,
                                x: -20,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.2 + index * 0.1,
                            }}
                            className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-slate-700 hover:bg-slate-900"
                        >
                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${feature.bgClass} ${feature.iconClass}`}
                            >
                                {feature.icon}
                            </div>

                            <div>
                                <h3 className="font-medium text-slate-200">
                                    {feature.title}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Status */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.6,
                    }}
                    className="mt-10 flex items-center gap-2 text-sm text-slate-500"
                >
                    <span className="h-2 w-2 rounded-full bg-green-400 shadow-lg shadow-green-400/40" />
                    Built for real-time collaboration
                </motion.div>

            </div>
        </div>
    );
};

export default AuthBanner;