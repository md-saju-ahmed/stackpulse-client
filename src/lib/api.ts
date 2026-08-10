import { env } from "@/env";

export type ApiMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
};

type ApiErrorResponse = {
  success: false;
  message: string;
};

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function buildHeaders(options: { jwt?: string | null }): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.jwt) {
    headers["Authorization"] = `Bearer ${options.jwt}`;
  }

  return headers;
}

type RequestOptions = {
  jwt?: string | null;
  body?: unknown;
  cache?: RequestCache;
  revalidate?: number;
};

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; meta?: ApiMeta }> {
  const { jwt, body, cache, revalidate } = options;

  const url = `${env.NEXT_PUBLIC_API_URL}${path}`;

  const nextOptions: RequestInit["next"] =
    revalidate !== undefined ? { revalidate } : {};

  const response = await fetch(url, {
    method,
    headers: buildHeaders({ jwt }),
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: cache ?? "no-store",
    next: Object.keys(nextOptions).length > 0 ? nextOptions : undefined,
  });

  if (response.status === 204) {
    return { data: undefined as T };
  }

  const json = (await response.json()) as ApiResponse<T>;

  if (!json.success) {
    if (response.status === 401 && typeof window !== "undefined") {
      const { dispatchAuthChange } = await import("./auth");
      dispatchAuthChange();
      window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new ApiError(response.status, json.message);
  }

  return { data: json.data, meta: json.meta };
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, options),

  post: <T>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, "body">,
  ) => request<T>("POST", path, { ...options, body }),

  patch: <T>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, "body">,
  ) => request<T>("PATCH", path, { ...options, body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, options),
};
