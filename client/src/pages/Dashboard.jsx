import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import QuickActions from "../components/dashboard/QuickActions";
import StatsSection from "../components/dashboard/StatsSection";
import RecentRooms from "../components/dashboard/RecentRooms";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        <Topbar />

        <QuickActions />

        <StatsSection />

        <RecentRooms />

      </main>

    </div>
  );
};

export default Dashboard;