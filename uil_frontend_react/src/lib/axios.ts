import env from "@/env";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.headers?.Authorization) return config;

  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Access the store directly to clear it
      useAuthStore.getState().clearAuth();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

export default api;
