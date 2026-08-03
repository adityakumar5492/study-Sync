import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { getCurrentUserThunk } from "./redux/auth/authThunk";
import AppRoutes from "./routes/AppRoutes";

function App() {
    const dispatch = useAppDispatch();

    const { authChecked } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getCurrentUserThunk());
    }, [dispatch]);

    // Block routing entirely until the first /auth/me check has settled.
    // `authChecked` starts false and only ever flips to true once — unlike
    // `loading` (which also starts false), this closes the race where
    // ProtectedRoute would render with a stale isAuthenticated:false on the
    // very first paint and redirect away before the auth check even started.
    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-xl">
                Loading...
            </div>
        );
    }

    return <AppRoutes />;
}

export default App;