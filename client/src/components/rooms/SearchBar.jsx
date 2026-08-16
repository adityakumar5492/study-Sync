import {
    FaSearch,
    FaTimes,
} from "react-icons/fa";

const SearchBar = ({
    value,
    onChange,
}) => {
    const clearSearch = () =>
        onChange("");

    return (
        <div className="relative mt-7 w-full">

            {/* Search Icon */}
            <FaSearch
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-slate-600"
            />

            <input
                type="text"
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                placeholder="Search study rooms by name or description..."
                className="
                    min-h-12
                    w-full
                    rounded-xl
                    border border-slate-800
                    bg-slate-900/70
                    py-3.5
                    pl-11
                    pr-12
                    text-sm
                    text-white
                    outline-none
                    placeholder:truncate
                    placeholder:text-slate-600
                    transition duration-200
                    hover:border-slate-700
                    focus:border-indigo-500/60
                    focus:bg-slate-900
                    focus:ring-2
                    focus:ring-indigo-500/10
                "
            />

            {/* Clear */}
            {value && (
                <button
                    type="button"
                    onClick={clearSearch}
                    className="
                        absolute
                        right-3
                        top-1/2
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-500
                        transition
                        hover:bg-slate-800
                        hover:text-white
                        active:scale-95
                    "
                    aria-label="Clear search"
                >
                    <FaTimes className="text-xs" />
                </button>
            )}

        </div>
    );
};

export default SearchBar;