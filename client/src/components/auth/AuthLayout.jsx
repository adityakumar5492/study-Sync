import AuthBanner from "./AuthBanner";

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="grid min-h-screen lg:grid-cols-2">

                {/* Left Banner */}
                <div className="hidden lg:block">
                    <AuthBanner />
                </div>

                {/* Right Form */}
                <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10 sm:px-10">

                    {/* Background Glow */}
                    <div className="pointer-events-none absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-[140px]" />

                    <div className="relative z-10 w-full">
                        {children}
                    </div>

                </main>

            </div>
        </div>
    );
};

export default AuthLayout;