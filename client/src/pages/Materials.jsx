import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

import Topbar from "../components/dashboard/Topbar";
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
                    TOPBAR
                ========================================= */}

                <Topbar onMenuClick={openSidebar} />

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