import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../dashboard/Sidebar";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    return (
        <div className="flex min-h-screen bg-slate-950 text-white">

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />

            {/* Main Content */}
            <main className="min-w-0 flex-1">
                <Outlet
                    context={{
                        openSidebar: () =>
                            setSidebarOpen(true),
                    }}
                />
            </main>

        </div>
    );
};

export default DashboardLayout;