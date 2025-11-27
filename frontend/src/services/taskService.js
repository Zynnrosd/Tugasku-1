import api from "./api";

const taskService = {
  // Mengambil semua tugas
  getAll: async () => {
    const response = await api.get("/tasks");
    // Sesuaikan dengan format return dari backend kamu
    // Jika backend kirim { data: [...] }, maka ambil response.data.data
    // Jika backend kirim [...] (array langsung), ambil response.data
    return response.data; 
  },
  
  // Mengambil satu tugas by ID
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // PENTING: Namanya harus 'create' (bukan addTask) agar cocok dengan AddTaskScreen
  create: async (data) => {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  // PENTING: Namanya harus 'update' (bukan updateTask)
  update: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  // PENTING: Namanya harus 'remove' (bukan deleteTask)
  remove: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

// Export sebagai default agar bisa di-import bebas namanya (import taskService from ...)
export default taskService;