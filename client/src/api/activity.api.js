import api from "./axios";

export const getUserActivities = () => {
    return api.get("/activities");
};