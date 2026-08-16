const StatCard = ({
    title,
    value,
    icon,
    subtitle,
}) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-slate-900 hover:shadow-indigo-500/5 sm:p-5">

            {/* Subtle hover glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-500/0 blur-3xl transition duration-500 group-hover:bg-indigo-500/10" />

            <div className="relative mb-4">
                {icon}
            </div>

            <h3 className="relative text-xl font-bold tracking-tight text-white sm:text-2xl">
                {value}
            </h3>

            <p className="relative mt-1 text-sm text-slate-500">
                {title}
            </p>

            {subtitle && (
                <p className="relative mt-3 text-xs font-medium text-indigo-400">
                    {subtitle}
                </p>
            )}

        </div>
    );
};

export default StatCard;