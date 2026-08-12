import { FaHistory } from "react-icons/fa";

const ActivityTimeline = () => {
    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <FaHistory className="text-green-400" />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Recent Activity
                    </h2>

                    <p className="text-sm text-slate-500">
                        Your latest StudySync activity
                    </p>
                </div>

            </div>

            <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40">

                <div className="text-center">
                    <FaHistory className="mx-auto mb-3 text-2xl text-slate-700" />

                    <p className="text-sm font-medium text-slate-400">
                        No recent activity
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                        Your study activity will appear here.
                    </p>
                </div>

            </div>

        </section>
    );
};

export default ActivityTimeline;