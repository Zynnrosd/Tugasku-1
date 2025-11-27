import api from "./api";

export const profileService = {
  getProfile: () => api.get("/profiles").then(res => res.data.data),
  saveProfile: (data) => api.post("/profiles", data).then(res => res.data.data),
};
