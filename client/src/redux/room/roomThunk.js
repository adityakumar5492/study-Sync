import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getRooms,
    getRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    updateRoom,
    deleteRoom,
    uploadRoomPdf,
} from "../../api/room.api";

// Get all rooms
export const getRoomsThunk = createAsyncThunk(
    "room/getRooms",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await getRooms();
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch rooms"
            );
        }
    }
);

// Get one room
export const getRoomThunk = createAsyncThunk(
    "room/getRoom",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await getRoom(id);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch room"
            );
        }
    }
);

// Create room
export const createRoomThunk = createAsyncThunk(
    "room/createRoom",
    async (roomData, { rejectWithValue }) => {
        try {
            const { data } = await createRoom(roomData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create room"
            );
        }
    }
);

// Join room
export const joinRoomThunk = createAsyncThunk(
    "room/joinRoom",
    async (inviteCode, { rejectWithValue }) => {
        try {
            const { data } = await joinRoom(inviteCode);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to join room"
            );
        }
    }
);

// Leave room
export const leaveRoomThunk = createAsyncThunk(
    "room/leaveRoom",
    async (roomId, { rejectWithValue }) => {
        try {
            const { data } = await leaveRoom(roomId);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to leave room"
            );
        }
    }
);

// Update room
export const updateRoomThunk = createAsyncThunk(
    "room/updateRoom",
    async ({ id, roomData }, { rejectWithValue }) => {
        try {
            const { data } = await updateRoom(id, roomData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update room"
            );
        }
    }
);

// Delete room
export const deleteRoomThunk = createAsyncThunk(
    "room/deleteRoom",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await deleteRoom(id);
            return { ...data, roomId: id };   // ← the fix
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete room"
            );
        }
    }
);

export const uploadRoomPdfThunk = createAsyncThunk(
    "room/uploadRoomPdf",
    async ({ roomId, formData }, { rejectWithValue }) => {
        try {
            const { data } = await uploadRoomPdf(roomId, formData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to upload PDF"
            );
        }
    }
);