import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { getCurrentUserThunk } from "./redux/auth/authThunk";

import {
    addRoomCreated,
    clearNotifications,
} from "./redux/notification/notificationSlice";

import { removeRoom } from "./redux/room/roomSlice";

import socket from "./socket/socket";
import AppRoutes from "./routes/AppRoutes";

function App() {
    const dispatch = useAppDispatch();

    const {
        authChecked,
        isAuthenticated,
        user,
    } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getCurrentUserThunk());
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated || !user?._id) {
            dispatch(clearNotifications());

            if (socket.connected) {
                socket.disconnect();
            }

            return undefined;
        }

        const userId = user._id.toString();

        const registerUser = () => {
            socket.emit("user:register", {
                userId,
            });
        };

        const handleRoomCreated = ({
            roomId,
            roomName,
            creatorId,
            creatorName,
            createdAt,
            expiresAt,
        } = {}) => {
            if (!roomId || !createdAt || !expiresAt) {
                return;
            }

            dispatch(
                addRoomCreated({
                    id: `room-created-${roomId}`,
                    roomId,
                    roomName: roomName || "Study room",
                    creatorId: creatorId?.toString(),
                    creatorName: creatorName || "Someone",
                    createdAt,
                    expiresAt,
                    isOwnRoom:
                        creatorId?.toString() === userId,
                })
            );
        };

        const handleRoomDeleted = ({
            roomId,
        } = {}) => {
            if (!roomId) {
                return;
            }

            dispatch(removeRoom(roomId.toString()));
        };

        socket.on("connect", registerUser);
        socket.on("room:created", handleRoomCreated);
        socket.on("room:deleted", handleRoomDeleted);

        if (!socket.connected) {
            socket.connect();
        } else {
            registerUser();
        }

        return () => {
            socket.off("connect", registerUser);
            socket.off("room:created", handleRoomCreated);
            socket.off("room:deleted", handleRoomDeleted);
        };
    }, [
        dispatch,
        isAuthenticated,
        user?._id,
    ]);

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