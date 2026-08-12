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
        ? new Date(
              user.createdAt
          ).toLocaleDateString(
              undefined,
              {
                  month: "long",
                  year: "numeric",
              }
          )
        : "Not available";

    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                    Personal Information
                </h2>
            </div>

            <div className="space-y-6">

                {/* Email */}
                <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                        <FaEnvelope className="text-green-400" />
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Email
                        </p>

                        <p className="mt-1 text-base text-slate-200">
                            {user?.email ||
                                "Not available"}
                        </p>
                    </div>

                </div>

                {/* Bio */}
                <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                        <FaInfoCircle className="text-blue-400" />
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Bio
                        </p>

                        <p className="mt-1 text-base leading-relaxed text-slate-200">
                            {user?.bio ||
                                "No bio added yet."}
                        </p>
                    </div>

                </div>

                {/* Member Since */}
                <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                        <FaCalendarAlt className="text-purple-400" />
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Member Since
                        </p>

                        <p className="mt-1 text-base text-slate-200">
                            {memberSince}
                        </p>
                    </div>

                </div>

            </div>

        </section>
    );
};

export default ProfileInfo;