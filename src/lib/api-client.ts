import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { removeNullOrUndefined } from "@/lib";
import type { RefreshResponse } from "@/types/auth";

const baseURL = "/api/v1/proxy";
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message?: string,
  ) {
    super(message || `API Error ${status}`);
    this.name = "ApiError";
  }
}

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const clearAuthAndRedirect = () => {
  Cookies.remove("ACCESS_TOKEN");
  Cookies.remove("REFRESH_TOKEN");
  if (typeof window !== "undefined") {
    localStorage.removeItem("USER_STORE");
    window.dispatchEvent(new CustomEvent("token-expired"));
    window.location.href = "/signin";
  }
};

const client = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = Cookies.get("ACCESS_TOKEN");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // For non-401 errors, just reject without signing out
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Check if this is a login/auth endpoint - don't try to refresh for auth failures on login
    const isAuthEndpoint = originalRequest.url?.includes("/auth/");
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    const refresh_token = Cookies.get("REFRESH_TOKEN");

    // No refresh token available - only redirect if we had a token before (session expired)
    // Don't redirect for unauthenticated requests that never had a token
    if (!refresh_token) {
      const hadToken = Cookies.get("ACCESS_TOKEN");
      if (hadToken) {
        // User was logged in but token expired and no refresh token
        clearAuthAndRedirect();
      }
      return Promise.reject(error);
    }

    // Already retried this request - don't retry again, but don't sign out either
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(client(originalRequest));
          },
          reject: (err: unknown) => {
            reject(err);
          },
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(`${baseURL}/auth/refresh`, { refresh_token });

      if (response.data.success) {
        const data = response.data.data as RefreshResponse;

        const cookieOptions = {
          path: "/",
          sameSite: "lax" as const,
          secure: process.env.NODE_ENV === "production",
        };

        Cookies.set("ACCESS_TOKEN", data.access_token, cookieOptions);
        if (data.refresh_token) {
          Cookies.set("REFRESH_TOKEN", data.refresh_token, cookieOptions);
        }

        originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`;

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("token-refreshed", { detail: data }));
        }

        processQueue(null, data.access_token);
        isRefreshing = false;

        return client(originalRequest);
      }

      throw new Error("Token refresh failed");
    } catch (refreshError) {
      if (process.env.NODE_ENV === "development") console.error("Token refresh error:", refreshError);

      processQueue(refreshError, null);
      isRefreshing = false;

      // Only sign out if refresh explicitly failed (not for network errors)
      const isNetworkError = (refreshError as AxiosError)?.code === "ERR_NETWORK";
      if (!isNetworkError) {
        toast.error("Session expired. Please log in again.");
        clearAuthAndRedirect();
      } else {
        toast.error("Network error. Please check your connection.");
      }

      return Promise.reject(refreshError);
    }
  },
);

function buildUrl(path: string, params?: Record<string, unknown>): string {
  if (!params) return path;
  const cleaned = removeNullOrUndefined(params);
  const query = new URLSearchParams(cleaned as Record<string, string>).toString();
  return query ? `${path}?${query}` : path;
}

export const apiClient = {
  get: <T>(path: string, params?: Record<string, unknown>) => client.get<T>(buildUrl(path, params)).then((r) => r.data),
  post: <T>(path: string, body?: unknown) => client.post<T>(path, body).then((r) => r.data),
  put: <T>(path: string, body?: unknown) => client.put<T>(path, body).then((r) => r.data),
  patch: <T>(path: string, body?: unknown) => client.patch<T>(path, body).then((r) => r.data),
  delete: <T>(path: string) => client.delete<T>(path).then((r) => r.data),
};
