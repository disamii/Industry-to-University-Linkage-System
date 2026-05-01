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

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export const buildQueryParams = (params?: QueryParams) => {
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
