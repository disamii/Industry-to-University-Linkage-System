import { ApiErrorResponse } from "@/types/interfaces";
import axios, { AxiosError } from "axios";

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
        axiosError.response?.data?.error ||
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
