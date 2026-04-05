import axios, { AxiosInstance } from "axios";

const isServer = typeof window === "undefined";

const apiClient = (token?: string): AxiosInstance => {
  const baseURL = isServer
    ? process.env.API_DOCKER_INTERNAL_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  });
};

export default apiClient;
