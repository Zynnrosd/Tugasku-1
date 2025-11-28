import api from "./api";

const taskService = {

  getAll: async () => {
    const response = await api.get("/tasks");
   
    return response.data; 
  },
 
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};


export default taskService;