import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import roomReducer from "./room/roomSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        room: roomReducer,
    },
});