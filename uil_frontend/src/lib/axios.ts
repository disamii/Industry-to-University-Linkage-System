import axios from "axios";

const isServer = typeof window === "undefined";

const api = axios.create({
  // If server: use internal container alias
  // If client: use the public localhost URL
  baseURL: isServer 
    ? process.env.INTERNAL_API_URL 
    : process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;