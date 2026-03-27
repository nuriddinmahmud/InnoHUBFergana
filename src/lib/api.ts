import axios from "axios";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiErrorMessage(error: unknown, fallback = "So'rovni bajarishda xato yuz berdi") {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data;
    const message = Array.isArray(payload?.message)
      ? payload.message.join(", ")
      : payload?.message ?? payload?.error ?? error.message;

    return String(message || fallback);
  }

  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function toApiError(error: unknown, fallback = "So'rovni bajarishda xato yuz berdi") {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return new ApiError(getApiErrorMessage(error, fallback), error.response?.status, error.response?.data);
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError(fallback);
}
