import {
    FaPlus,
    FaBars,
} from "react-icons/fa";

const RoomHeader = ({
    onCreate,
    onMenuClick,
}) => {
    return (
        <div className="flex flex-col gap-5 border-b border-slate-800 pb-7 sm:flex-row sm:items-end sm:justify-between">

            {/* Heading */}
            <div className="min-w-0">

                {/* Mobile Menu */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white lg:hidden"
                    aria-label="Open navigation menu"
                >
                    <FaBars />
                </button>

                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-indigo-400">
                    Collaboration
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Study Rooms
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Join an existing study room or create a new space
                    for your study group.
                </p>

            </div>

            {/* Create Room */}
            <button
                type="button"
                onClick={onCreate}
                className="group flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:translate-y-0 sm:w-auto"
            >
                <FaPlus className="text-xs transition-transform duration-200 group-hover:rotate-90" />

                Create Room
            </button>

        </div>
    );
};

export default RoomHeader;