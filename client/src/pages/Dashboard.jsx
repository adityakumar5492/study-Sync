import { useOutletContext, useNavigate } from "react-router-dom";

import Topbar from "../components/dashboard/Topbar";
import QuickActions from "../components/dashboard/QuickActions";
import StatsSection from "../components/dashboard/StatsSection";
import RecentRooms from "../components/dashboard/RecentRooms";

const Dashboard = () => {
    const navigate = useNavigate();
    const { openSidebar } = useOutletContext();

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <main className="min-w-0 overflow-y-auto">

                <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8">

                    {/* Topbar */}
                    <Topbar onMenuClick={openSidebar} />

                    {/* Quick Actions */}
                    <section className="mb-7 sm:mb-8">
                        <QuickActions
                            onCreateRoom={() =>
                                navigate("/rooms")
                            }
                            onJoinRoom={() =>
                                navigate("/rooms")
                            }
                            onUploadMaterial={() =>
                                navigate("/rooms")
                            }
                        />
                    </section>

                    {/* Statistics */}
                    <section className="mb-7 sm:mb-8">
                        <StatsSection />
                    </section>

                    {/* Recent Rooms */}
                    <section>
                        <RecentRooms />
                    </section>

                </div>

            </main>

        </div>
    );
};

export default Dashboard;