import axios from "axios";

const isServer = typeof window === "undefined";

const apiServer = axios.create({
  baseURL: isServer
    ? process.env.API_DOCKER_INTERNAL_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiServer.interceptors.request.use(async (config) => {
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

export default apiServer;
