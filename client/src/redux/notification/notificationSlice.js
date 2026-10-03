import { createSlice } from "@reduxjs/toolkit";

const MAX_NOTIFICATIONS = 30;

const initialState = {
    items: [],
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: "notification",

    initialState,

    reducers: {
        addRoomCreated: (state, action) => {
            const notification = action.payload;

            if (!notification?.roomId) {
                return;
            }

            const id =
                notification.id ||
                `room-created-${notification.roomId}`;

            const alreadyExists = state.items.some(
                (item) => item.id === id
            );

            if (alreadyExists) {
                return;
            }

            state.items.unshift({
                ...notification,
                id,
                read: false,
            });

            if (state.items.length > MAX_NOTIFICATIONS) {
                state.items = state.items.slice(
                    0,
                    MAX_NOTIFICATIONS
                );
            }

            state.unreadCount += 1;
        },

        markNotificationRead: (state, action) => {
            const notification = state.items.find(
                (item) => item.id === action.payload
            );

            if (!notification || notification.read) {
                return;
            }

            notification.read = true;

            state.unreadCount = Math.max(
                0,
                state.unreadCount - 1
            );
        },

        markAllNotificationsRead: (state) => {
            state.items.forEach((item) => {
                item.read = true;
            });

            state.unreadCount = 0;
        },

        clearNotifications: (state) => {
            state.items = [];
            state.unreadCount = 0;
        },
    },
});

export const {
    addRoomCreated,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
