import api from "./axios";

export const getUserProfile = () => {
    return api.get("/users/profile");
};

export const updateUserProfile = (data) => {
    return api.put("/users/profile", data);
};

export const uploadAvatar = (formData) => {
    return api.put("/users/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};