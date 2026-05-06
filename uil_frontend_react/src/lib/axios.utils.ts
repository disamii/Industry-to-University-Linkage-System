import { ApiErrorResponse } from "@/types/interfaces";
import axios, { AxiosError } from "axios";
import { ApiError } from "./api-error";
import api from "./axios";

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
      const responseData = axiosError.response?.data;

      if (isDev) {
        console.dir(responseData);
        console.error("Backend Error Detail:", responseData);
      }

      const isValidationError = responseData?.error === "validation_error";

      let message: string;

      if (isDev) {
        // Full detail in development
        message =
          responseData?.details?.join(" ") ||
          responseData?.message ||
          responseData?.error ||
          "Something went wrong. Please try again.";
      } else {
        // Safe production messages
        if (isValidationError) {
          message =
            responseData?.details?.join(" ") ||
            "Invalid input. Please check your data.";
        } else {
          message = "Something went wrong. Please try again.";
        }
      }

      throw new ApiError(message, {
        status: axiosError.response?.status,
        data: isDev ? responseData : undefined, // hide in prod
        code: axiosError.code,
      });
    }

    if (isDev) {
      console.error("Unexpected error:", error);
    }

    throw new ApiError(
      isDev
        ? "Unexpected error occurred."
        : "Network error. Please check your connection.",
    );
  }
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;

const buildQueryParams = (params?: QueryParams) => {
  if (!params) return {};

  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
};

export const createGetRequest =
  <TResponse>(url: string) =>
  (params?: QueryParams) => {
    return safeApiRequest(
      api.get<TResponse>(url, {
        params: buildQueryParams(params),
      }),
    );
  };
