const StatCard = ({
  title,
  value,
  icon,
  subtitle,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-green-500 hover:-translate-y-1">

      <div className="text-3xl mb-5">
        {icon}
      </div>

      <h3 className="text-3xl font-bold">
        {value}
      </h3>

      <p className="text-slate-400 mt-2">
        {title}
      </p>

      {subtitle && (
        <p className="text-sm text-green-400 mt-3">
          {subtitle}
        </p>
      )}

    </div>
  );
};

export default StatCard;