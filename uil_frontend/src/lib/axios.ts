import axios from "axios";

const isServer = typeof window === "undefined";

export const api = axios.create({
  baseURL: isServer
    ? `${process.env.API_BASE_URL}`
    : `${process.env.API_DOCKER_INTERNAL_URL}`,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
