import axios from "axios";

const api = axios.create({
  baseURL: "http://10.131.139.95:5000/api",
});

export default api;
