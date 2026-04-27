// errors/api-error.ts
export type ApiErrorCause = {
  status?: number;
  data?: unknown;
  code?: string;
};

export class ApiError extends Error {
  public cause?: ApiErrorCause;

  constructor(message: string, cause?: ApiErrorCause) {
    super(message);
    this.name = "ApiError";
    this.cause = cause;
  }
}
