import { createSlice } from "@reduxjs/toolkit";

import {
    loginThunk,
    registerThunk,
    getCurrentUserThunk,
} from "./authThunk";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    // Tracks whether the initial /auth/me check
    // has completed at least once.
    authChecked: false,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },

        // Update the current user in Redux
        // after profile/avatar changes.
        updateUser: (state, action) => {
            state.user = action.payload;
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ===========================
            // LOGIN
            // ===========================

            .addCase(
                loginThunk.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                loginThunk.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.isAuthenticated = true;
                    state.user =
                        action.payload.user;
                }
            )

            .addCase(
                loginThunk.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload;
                }
            )

            // ===========================
            // REGISTER
            // ===========================

            .addCase(
                registerThunk.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                registerThunk.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.isAuthenticated = true;
                    state.user =
                        action.payload.user;
                }
            )

            .addCase(
                registerThunk.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload;
                }
            )

            // ===========================
            // CURRENT USER
            // ===========================

            .addCase(
                getCurrentUserThunk.pending,
                (state) => {
                    state.loading = true;
                }
            )

            .addCase(
                getCurrentUserThunk.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.isAuthenticated = true;
                    state.user =
                        action.payload.user;
                    state.authChecked = true;
                }
            )

            .addCase(
                getCurrentUserThunk.rejected,
                (state) => {
                    state.loading = false;
                    state.isAuthenticated = false;
                    state.user = null;
                    state.authChecked = true;
                }
            );
    },
});

export const {
    clearError,
    updateUser,
    logout,
} = authSlice.actions;

export default authSlice.reducer;