import { useEffect, useRef } from "react";
import {
    FaSearch,
    FaTimes,
} from "react-icons/fa";
import {
    motion,
    useReducedMotion,
} from "framer-motion";

const SearchBar = ({
    value,
    onChange,
}) => {
    const shouldReduceMotion = useReducedMotion();
    const inputRef = useRef(null);

    const clearSearch = () => {
        onChange("");
        inputRef.current?.focus();
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();
                inputRef.current?.focus();
            }

            if (
                event.key === "Escape" &&
                document.activeElement ===
                    inputRef.current
            ) {
                inputRef.current?.blur();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 8,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="group relative mt-7 w-full"
        >
            {/* =================================
                Ambient Focus Glow
            ================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-2xl
                    bg-indigo-500/[0.04]
                    opacity-0
                    blur-xl
                    transition-opacity
                    duration-300
                    group-focus-within:opacity-100
                "
            />

            {/* =================================
                Search Container
            ================================= */}

            <div
                className="
                    relative
                    flex
                    min-h-14
                    items-center
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#0a0f1c]
                    shadow-[0_12px_40px_rgba(0,0,0,0.14)]
                    transition-all
                    duration-300
                    hover:border-white/[0.11]
                    group-focus-within:border-indigo-400/30
                    group-focus-within:bg-[#0b101e]
                    group-focus-within:shadow-[0_15px_50px_rgba(99,102,241,0.07)]
                "
            >
                {/* Top Highlight */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-x-12
                        top-0
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-white/[0.08]
                        to-transparent
                    "
                />

                {/* =================================
                    Search Icon
                ================================= */}

                <motion.div
                    animate={
                        value
                            ? {
                                  color: "#818cf8",
                              }
                            : undefined
                    }
                    className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        z-10
                        flex
                        -translate-y-1/2
                        items-center
                        justify-center
                        text-slate-600
                        transition-colors
                        duration-200
                        group-focus-within:text-indigo-400
                        sm:left-5
                    "
                >
                    <FaSearch className="text-xs sm:text-sm" />
                </motion.div>

                {/* =================================
                    Input
                ================================= */}

                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    placeholder="Search study rooms..."
                    aria-label="Search study rooms"
                    autoComplete="off"
                    spellCheck="false"
                    className="
                        min-h-14
                        w-full
                        bg-transparent
                        py-3
                        pl-11
                        pr-24
                        text-sm
                        font-medium
                        text-white
                        outline-none
                        placeholder:text-slate-700
                        sm:pl-12
                        sm:pr-28
                    "
                />

                {/* =================================
                    Keyboard Shortcut
                ================================= */}

                {!value && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        className="
                            pointer-events-none
                            absolute
                            right-4
                            top-1/2
                            hidden
                            -translate-y-1/2
                            items-center
                            gap-1
                            sm:flex
                        "
                    >
                        <kbd
                            className="
                                rounded-lg
                                border
                                border-white/[0.07]
                                bg-white/[0.025]
                                px-2
                                py-1
                                text-[9px]
                                font-semibold
                                text-slate-600
                            "
                        >
                            Ctrl
                        </kbd>

                        <kbd
                            className="
                                rounded-lg
                                border
                                border-white/[0.07]
                                bg-white/[0.025]
                                px-2
                                py-1
                                text-[9px]
                                font-semibold
                                text-slate-600
                            "
                        >
                            K
                        </kbd>
                    </motion.div>
                )}

                {/* =================================
                    Clear Button
                ================================= */}

                {value && (
                    <motion.button
                        type="button"
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.8,
                        }}
                        whileHover={
                            shouldReduceMotion
                                ? undefined
                                : {
                                      scale: 1.05,
                                  }
                        }
                        whileTap={
                            shouldReduceMotion
                                ? undefined
                                : {
                                      scale: 0.9,
                                  }
                        }
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
                            rounded-xl
                            border
                            border-white/[0.05]
                            bg-white/[0.025]
                            text-slate-600
                            transition-all
                            duration-200
                            hover:border-white/[0.09]
                            hover:bg-white/[0.06]
                            hover:text-white
                        "
                        aria-label="Clear search"
                        title="Clear search"
                    >
                        <FaTimes className="text-[10px]" />
                    </motion.button>
                )}
            </div>

            {/* =================================
                Search Status
            ================================= */}

            {value && (
                <motion.div
                    initial={{
                        opacity: 0,
                        y: shouldReduceMotion
                            ? 0
                            : -3,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="
                        mt-2
                        flex
                        items-center
                        gap-1.5
                        px-1
                    "
                >
                    <span className="h-1 w-1 rounded-full bg-indigo-400" />

                    <span className="text-[10px] text-slate-600">
                        Searching rooms matching
                    </span>

                    <span className="max-w-48 truncate text-[10px] font-semibold text-slate-500">
                        "{value}"
                    </span>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SearchBar;