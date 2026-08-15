import api from "./axios";

export const createRoom = (data) => {
    return api.post("/rooms", data);
};

export const getRooms = () => {
    return api.get("/rooms");
};

export const getRoom = (id) => {
    return api.get(`/rooms/${id}`);
};

export const joinRoom = (inviteCode) => {
    return api.post("/rooms/join", {
        inviteCode,
    });
};

export const leaveRoom = (id) => {
    return api.post(`/rooms/${id}/leave`);
};

export const updateRoom = (id, data) => {
    return api.put(`/rooms/${id}`, data);
};

export const deleteRoom = (id) => {
    return api.delete(`/rooms/${id}`);
};

export const uploadRoomPdf = (roomId, formData) =>
    api.post(`/rooms/${roomId}/pdf`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const deleteRoomPdf = (roomId) => {
    return api.delete(`/rooms/${roomId}/pdf`);
};

export const getRoomMessages = (roomId) => {
    return api.get(`/rooms/${roomId}/messages`);
};


export const requestRoomRejoin = (roomId) => {
    return api.post(
        `/rooms/${roomId}/rejoin-request`
    );
};

export const approveRoomRejoin = (
    roomId,
    userId
) => {
    return api.post(
        `/rooms/${roomId}/rejoin-request/approve`,
        { userId }
    );
};

export const rejectRoomRejoin = (
    roomId,
    userId
) => {
    return api.post(
        `/rooms/${roomId}/rejoin-request/reject`,
        { userId }
    );
};