import type { ErrorResponse } from "@/types/interfaces";

let globalToastHandler: ((error: ErrorResponse) => void) | null = null;

export const setGlobalToastHandler = (
  handler: (error: ErrorResponse) => void,
) => {
  globalToastHandler = handler;
};

export const showErrorToast = (error: ErrorResponse) => {
  if (globalToastHandler) {
    globalToastHandler(error);
  } else {
    console.error("No global toast handler set:", error);
  }
};

export const processError = (error: unknown): ErrorResponse => {
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    "error" in error
  ) {
    return error as ErrorResponse;
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
