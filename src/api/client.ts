import axios from "axios";
import { clearAuth, getAccessToken } from "@/lib/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const method = String(error.config?.method ?? "GET").toUpperCase();
    const requestUrl = `${error.config?.baseURL ?? ""}${error.config?.url ?? ""}`;

    if (status === 404) {
      console.error(`[API 404] ${method} ${requestUrl}`, error.response?.data ?? error.message);
    } else if (status === 401) {
      console.error(`[API 401] ${method} ${requestUrl}`, error.response?.data ?? error.message);
      clearAuth();

      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.replace("/login");
      }
    } else {
      console.error(`[API ${status ?? "ERROR"}] ${method} ${requestUrl}`, error.response?.data ?? error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
