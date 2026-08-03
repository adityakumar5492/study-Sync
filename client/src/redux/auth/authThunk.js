import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    loginUser,
    registerUser,
    getCurrentUser,
} from "../../api/auth.api";

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginUser(credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);

export const registerThunk = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await registerUser(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );
        }
    }
);

export const getCurrentUserThunk = createAsyncThunk(
    "auth/me",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCurrentUser();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Unauthorized"
            );
        }
    }
);