import {
    FaEnvelope,
    FaCalendarAlt,
    FaInfoCircle,
} from "react-icons/fa";

import { useAppSelector } from "../../redux/hooks";

const ProfileInfo = () => {
    const { user } = useAppSelector(
        (state) => state.auth
    );

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString(
              undefined,
              {
                  month: "long",
                  year: "numeric",
              }
          )
        : "Not available";

    return (
        <section className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/5 transition duration-300 hover:border-slate-700 hover:shadow-black/10 sm:p-6">

            {/* Subtle background glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-indigo-500/5 blur-3xl transition duration-500 group-hover:bg-indigo-500/10" />

            {/* Header */}
            <div className="relative mb-6 sm:mb-7">
                <h2 className="text-lg font-semibold text-white sm:text-xl">
                    Personal Information
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                    Your account and personal details.
                </p>
            </div>

            <div className="relative space-y-5 sm:space-y-6">

                {/* Email */}
                <div className="flex min-w-0 gap-3 sm:gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 sm:h-11 sm:w-11">
                        <FaEnvelope className="text-sm text-green-400 sm:text-base" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                            Email
                        </p>

                        <p className="mt-1 break-all text-sm leading-6 text-slate-200 sm:text-base">
                            {user?.email || "Not available"}
                        </p>
                    </div>

                </div>

                {/* Bio */}
                <div className="flex min-w-0 gap-3 sm:gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 sm:h-11 sm:w-11">
                        <FaInfoCircle className="text-sm text-blue-400 sm:text-base" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                            Bio
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-200 sm:text-base sm:leading-7">
                            {user?.bio || "No bio added yet."}
                        </p>
                    </div>

                </div>

                {/* Member Since */}
                <div className="flex min-w-0 gap-3 sm:gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 sm:h-11 sm:w-11">
                        <FaCalendarAlt className="text-sm text-purple-400 sm:text-base" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                            Member Since
                        </p>

                        <p className="mt-1 text-sm text-slate-200 sm:text-base">
                            {memberSince}
                        </p>
                    </div>

                </div>

            </div>

        </section>
    );
};

export default ProfileInfo;