import axios from "axios";
import { cookies } from "next/headers";

const isServer = typeof window === "undefined";

export const api = axios.create({
  baseURL: isServer
    ? `${process.env.API_BASE_URL}`
    : `${process.env.API_DOCKER_INTERNAL_URL}`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
