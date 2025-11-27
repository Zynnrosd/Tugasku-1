import api from "./api";

const courseService = {
  async getAll() {
    return api.get("/courses");
  },

  async create(payload) {
    return api.post("/courses", payload);
  },

  async update(id, payload) {
    return api.put(`/courses/${id}`, payload);
  },

  async remove(id) {
    return api.delete(`/courses/${id}`);
  }
};

export default courseService;
