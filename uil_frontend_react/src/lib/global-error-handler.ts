import type { ApiErrorResponse } from "@/types/interfaces";

let globalToastHandler: ((error: ApiErrorResponse) => void) | null = null;

export const setGlobalToastHandler = (
  handler: (error: ApiErrorResponse) => void,
) => {
  globalToastHandler = handler;
};

export const showErrorToast = (error: ApiErrorResponse) => {
  if (globalToastHandler) {
    globalToastHandler(error);
  } else {
    console.error("No global toast handler set:", error);
  }
};

export const processError = (error: unknown): ApiErrorResponse => {
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    "error" in error
  ) {
    return error as ApiErrorResponse;
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      status: 0,
      error: "server error",
      message: "Network connection failed. Please check your internet.",
      details: null,
    };
  }

  return {
    status: 500,
    error: "server error",
    message: "Something went wrong. Please try again.",
    details: error instanceof Error ? error.message : String(error),
  };
};
