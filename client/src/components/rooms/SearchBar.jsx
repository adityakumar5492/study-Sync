import { FaSearch } from "react-icons/fa";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative mb-8">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search study rooms..."
        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-green-500"
      />
    </div>
  );
};

export default SearchBar;