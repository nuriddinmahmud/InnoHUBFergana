/**
 * API client for backend communication.
 * When VITE_API_URL is not set, the app uses mock data (no backend required).
 */

const API_URL = import.meta.env.VITE_API_URL ?? "";
const isBackendEnabled = Boolean(API_URL);

export { isBackendEnabled };

function getAuthHeader(): Record<string, string> {
  try {
    const user = localStorage.getItem("user");
    if (!user) return {};
    const parsed = JSON.parse(user);
    const token = parsed?.token ?? parsed?.accessToken;
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch {
    // ignore
  }
  return {};
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("user");
    }
    const msg =
      (data && typeof data === "object" && "message" in data && String((data as { message: unknown }).message)) ||
      (data && typeof data === "object" && "error" in data && String((data as { error: unknown }).error)) ||
      res.statusText ||
      `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, data);
  }

  return data as T;
}

export type RequestConfig = RequestInit & { params?: Record<string, string> };

export async function apiRequest<T>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  const { params, ...init } = config;

  let url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (params && Object.keys(params).length > 0) {
    const search = new URLSearchParams(params).toString();
    url += (url.includes("?") ? "&" : "?") + search;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...(typeof init.headers === "object" && !(init.headers instanceof Headers)
      ? (init.headers as Record<string, string>)
      : {}),
  };

  const res = await fetch(url, {
    ...init,
    headers,
  });

  return handleResponse<T>(res);
}

export const api = {
  get: <T>(path: string, config?: RequestConfig) =>
    apiRequest<T>(path, { ...config, method: "GET" }),

  post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    apiRequest<T>(path, { ...config, method: "POST", body: body ? JSON.stringify(body) : undefined }),

  put: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    apiRequest<T>(path, { ...config, method: "PUT", body: body ? JSON.stringify(body) : undefined }),

  patch: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    apiRequest<T>(path, { ...config, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),

  delete: <T>(path: string, config?: RequestConfig) =>
    apiRequest<T>(path, { ...config, method: "DELETE" }),
};
