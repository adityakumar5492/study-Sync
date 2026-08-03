import { createSlice } from "@reduxjs/toolkit";
import {
    getRoomsThunk,
    getRoomThunk,
    createRoomThunk,
    joinRoomThunk,
    leaveRoomThunk,
    updateRoomThunk,
    deleteRoomThunk,
    uploadRoomPdfThunk
} from "./roomThunk";

const initialState = {
    rooms: [],
    currentRoom: null,
    loading: false,
    error: null,
};

const roomSlice = createSlice({
    name: "room",
    initialState,

    reducers: {
        setCurrentRoom: (state, action) => {
            state.currentRoom = action.payload;
        },

        clearCurrentRoom: (state) => {
            state.currentRoom = null;
        },
    },

    extraReducers: (builder) => {
    builder

        // ===========================
        // Get All Rooms
        // ===========================
        .addCase(getRoomsThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getRoomsThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.rooms = action.payload.rooms;
        })
        .addCase(getRoomsThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ===========================
        // Get Room
        // ===========================
        .addCase(getRoomThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getRoomThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.currentRoom = action.payload.room;
        })
        .addCase(getRoomThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // Clear any stale room so the previous room never flashes
            state.currentRoom = null;
        })

        // ===========================
        // Create Room
        // ===========================
        .addCase(createRoomThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createRoomThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.rooms.unshift(action.payload.room);
        })
        .addCase(createRoomThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ===========================
        // Join Room
        // ===========================
        .addCase(joinRoomThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(joinRoomThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.currentRoom = action.payload.room;

            // Keep the room list fresh so the joined room stays in sync
            const joinedRoom = action.payload.room;
            const exists = state.rooms.some(
                (room) => room._id === joinedRoom._id
            );

            if (!exists) {
                state.rooms.unshift(joinedRoom);
            } else {
                state.rooms = state.rooms.map((room) =>
                    room._id === joinedRoom._id ? joinedRoom : room
                );
            }
        })
        .addCase(joinRoomThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // Clear any stale room so the previous room never flashes
            state.currentRoom = null;
        })

        // ===========================
        // Leave Room
        // ===========================
        .addCase(leaveRoomThunk.fulfilled, (state, action) => {
            state.currentRoom = null;

            // Keep the room list in sync — this room's `members` no longer
            // includes the current user, so RoomItem.jsx will correctly
            // show "Join" again instead of "Open".
            const leftRoom = action.payload.room;

            if (leftRoom) {
                state.rooms = state.rooms.map((room) =>
                    room._id === leftRoom._id ? leftRoom : room
                );
            }
        })

        // ===========================
        // Update Room
        // ===========================
        .addCase(updateRoomThunk.fulfilled, (state, action) => {
            state.currentRoom = action.payload.room;

            const index = state.rooms.findIndex(
                (room) => room._id === action.payload.room._id
            );

            if (index !== -1) {
                state.rooms[index] = action.payload.room;
            }
        })

        // ===========================
        // Delete Room
        // ===========================
        .addCase(deleteRoomThunk.fulfilled, (state, action) => {
            state.rooms = state.rooms.filter(
                (room) => room._id !== action.payload.roomId
            );
        })

        // ===========================
        // Upload PDF
        // ===========================
        .addCase(uploadRoomPdfThunk.fulfilled, (state, action) => {
            state.currentRoom = action.payload.room;
        });
    }
});

export const {
    setCurrentRoom,
    clearCurrentRoom,
} = roomSlice.actions;

export default roomSlice.reducer;