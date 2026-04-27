import axios, { AxiosError } from "axios";
import { ApiError } from "./api-error";
import { ApiErrorResponse } from "@/types/interfaces";

export async function safeApiRequest<T>(
  request: Promise<{ data: T }>,
): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (error: unknown) {
    const isDev = import.meta.env.DEV;

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      if (isDev) {
        console.error("Axios error:", axiosError);
      }

      const message =
        axiosError.response?.data?.error ||
        "Something went wrong. Please try again.";

      throw new ApiError(message, {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        code: axiosError.code,
      });
    }

    if (isDev) {
      console.error("Unexpected error:", error);
    }

    throw new ApiError("Network error. Please check your connection.");
  }
}
