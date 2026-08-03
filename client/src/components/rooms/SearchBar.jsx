import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({ value, onChange }) => {
  const clearSearch = () => onChange("");

  return (
    <div className="relative mb-8">

      <FaSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search study rooms..."
        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-12 transition focus:outline-none focus:border-green-500"
      />

      {value && (
        <button
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
        >
          <FaTimes />
        </button>
      )}

    </div>
  );
};

export default SearchBar;