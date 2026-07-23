const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500 transition">

      <div className="text-3xl mb-4">
        {icon}
      </div>

      <h3 className="text-3xl font-bold">
        {value}
      </h3>

      <p className="text-slate-400 mt-2">
        {title}
      </p>

    </div>
  );
};

export default StatCard;