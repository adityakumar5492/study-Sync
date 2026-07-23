import AuthBanner from "./AuthBanner";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950">

      <div className="grid lg:grid-cols-2 min-h-screen">

        <AuthBanner />

        <div className="flex justify-center items-center px-6 py-10">
          {children}
        </div>

      </div>

    </div>
  );
};

export default AuthLayout;