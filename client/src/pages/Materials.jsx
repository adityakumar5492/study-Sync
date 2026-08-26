import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import MaterialUpload from "../components/materials/MaterialUpload";
import MaterialList from "../components/materials/MaterialList";

const Materials = () => {
    const { openSidebar } = useOutletContext();

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMaterials = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/materials`,
                {
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (data.success) {
                setMaterials(data.materials);
            }
        } catch (error) {
            console.error(
                "Failed to fetch materials:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    return (
        <div className="min-h-screen bg-[#060a10] px-4 py-6 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* =========================================
                    MOBILE SIDEBAR BUTTON
                ========================================= */}
                <motion.button
                    type="button"
                    onClick={openSidebar}
                    whileTap={{ scale: 0.92 }}
                    className="
                        mb-5
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-800/90
                        bg-slate-900/90
                        text-slate-300
                        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                        backdrop-blur-xl
                        transition-all
                        duration-200
                        hover:border-indigo-500/40
                        hover:bg-slate-800
                        hover:text-white
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500/70
                        lg:hidden
                    "
                    aria-label="Open navigation menu"
                    title="Open navigation menu"
                >
                    <FaBars className="text-sm" />
                </motion.button>

                {/* =========================================
                    HEADER
                ========================================= */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.35,
                        ease: "easeOut",
                    }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-black">
                        My Materials
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        Upload and manage your personal study PDFs.
                    </p>
                </motion.div>

                {/* =========================================
                    UPLOAD
                ========================================= */}
                <MaterialUpload
                    onUploadSuccess={fetchMaterials}
                />

                {/* =========================================
                    MATERIAL LIST
                ========================================= */}
                <div className="mt-8">
                    <MaterialList
                        materials={materials}
                        loading={loading}
                        onDelete={fetchMaterials}
                    />
                </div>

            </div>
        </div>
    );
};

export default Materials;