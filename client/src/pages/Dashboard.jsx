import { useNavigate } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import QuickActions from "../components/dashboard/QuickActions";
import StatsSection from "../components/dashboard/StatsSection";
import RecentRooms from "../components/dashboard/RecentRooms";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">

            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto">

                <Topbar />

                <QuickActions
                    onCreateRoom={() => navigate("/rooms")}
                    onJoinRoom={() => navigate("/rooms")}
                    onUploadMaterial={() => navigate("/rooms")}
                />

                <StatsSection />

                <RecentRooms />

            </main>

        </div>
    );
};

export default Dashboard;