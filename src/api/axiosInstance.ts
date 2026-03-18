import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  // BU YERDA 5173 EMAS, 3000 BO'LISHI SHART
  baseURL: "http://localhost:3000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;