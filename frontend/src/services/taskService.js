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
  },

  removeMultiple: async (ids) => {

    const deletionPromises = ids.map(id => taskService.remove(id));
 
    const results = await Promise.allSettled(deletionPromises);

    const failures = results.filter(r => r.status === 'rejected');
    
    if (failures.length > 0) {
      console.error("Partial delete failure:", failures);
      throw new Error(`Gagal menghapus ${failures.length} tugas. Periksa koneksi.`);
    }
    
    return results;
  }
};


export default taskService;