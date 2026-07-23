import { FaFilePdf, FaUsers, FaPenNib } from "react-icons/fa";

const AuthBanner = () => {
  return (
    <div className="hidden lg:flex flex-col justify-center p-14 relative overflow-hidden">

      <div className="absolute w-72 h-72 bg-green-500/20 rounded-full blur-3xl -top-20 -left-20"></div>
      <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-0"></div>

      <div className="relative z-10">

        <h1 className="text-6xl font-bold leading-tight text-white">
          Study
          <span className="text-green-500"> Together.</span>
          <br />
          Learn Better.
        </h1>

        <p className="text-slate-400 mt-8 text-lg max-w-lg">
          Collaborate with friends using shared PDFs, real-time
          annotations, live discussions and interactive study rooms.
        </p>

        <div className="space-y-6 mt-12">

          <div className="flex items-center gap-4">
            <FaFilePdf className="text-red-500 text-2xl" />
            <span className="text-slate-300 text-lg">
              Shared PDF Collaboration
            </span>
          </div>

          <div className="flex items-center gap-4">
            <FaPenNib className="text-green-500 text-2xl" />
            <span className="text-slate-300 text-lg">
              Live Annotation
            </span>
          </div>

          <div className="flex items-center gap-4">
            <FaUsers className="text-blue-500 text-2xl" />
            <span className="text-slate-300 text-lg">
              Study Rooms
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AuthBanner;