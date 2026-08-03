import { FaBell } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";

const Topbar = () => {
  const { user } = useAppSelector((state) => state.auth);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between mb-10">

      {/* Left */}
      <div>
        <h2 className="text-4xl font-bold">
          Welcome back,{" "}
          <span className="text-green-500">
            {user?.name || "Student"}
          </span>{" "}
          👋
        </h2>

        <p className="text-slate-400 mt-2">
          {today}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        <button className="relative p-3 rounded-xl bg-slate-900 hover:bg-slate-800 transition">

          <FaBell className="text-xl" />

          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
            3
          </span>

        </button>

      </div>

    </header>
  );
};

export default Topbar;