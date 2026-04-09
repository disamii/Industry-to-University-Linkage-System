import axios from "axios";

const isServer = typeof window === "undefined";

const getBaseURL = () => {
  if (!isServer) return "/api";

  const isDocker = process.env.RUNNING_IN_DOCKER === "true";

  const baseUrl = isDocker
    ? process.env.API_DOCKER_INTERNAL_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

  return baseUrl;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    // Pass ALL cookies (including the session/auth cookie) to the backend
    const allCookies = cookieStore.toString();
    if (allCookies) {
      config.headers.Cookie = allCookies;
    }

    // Optional: specifically attach Bearer if your backend expects both
    const token = cookieStore.get("access_token")?.value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
