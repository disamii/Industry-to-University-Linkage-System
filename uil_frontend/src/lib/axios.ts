import { ApiErrorResponse } from "@/types/interfaces";
import axios, { AxiosError } from "axios";

const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL: isServer
    ? process.env.API_DOCKER_INTERNAL_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
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

// Wrapper for requests
export async function safeApiRequest<T>(
  request: Promise<{ data: T }>,
): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      // In dev, log full error for debugging
      if (process.env.NODE_ENV === "development") {
        console.error("Axios error:", axiosError);
      }

      // Safe message for frontend
      const safeMessage =
        axiosError.response?.data?.detail ||
        "Something went wrong. Please try again.";

      throw new Error(safeMessage);
    }

    // Non-Axios errors
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error:", error);
    }

    throw new Error("Network error. Please check your connection.");
  }
}

export default api;
