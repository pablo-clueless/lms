import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { removeNullOrUndefined } from "@/lib";
import type { RefreshResponse } from "@/types/auth";

const MAX_RETRIES = 3;
const baseURL = "/api/v1/proxy";
let isRefreshing = false;
let retryCount = 0;

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
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry: boolean };
    const refresh_token = Cookies.get("REFRESH_TOKEN");

    if (error.response?.status === 401 && refresh_token && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const toastId = toast.loading("Refreshing session...");
        const response = await axios.post(`${baseURL}/auth/refresh`, { refresh_token });

        if (response.data.success) {
          const data = response.data.data as RefreshResponse;
          Cookies.set("ACCESS_TOKEN", data.access_token);
          Cookies.set("REFRESH_TOKEN", data.refresh_token);
          originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`;

          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("token-refreshed", { detail: data }));
          }

          toast.dismiss(toastId);
          toast.success("Session refreshed successfully");
          isRefreshing = false;
          retryCount = 0;

          return client(originalRequest);
        }
        throw new Error("Token refresh failed");
      } catch (err) {
        if (process.env.NODE_ENV === "development") console.error(err);
        isRefreshing = false;
        retryCount++;

        if (retryCount > MAX_RETRIES) {
          toast.error("Session expired. Please log in again.");
          retryCount = 0;
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("token-expired"));
            Cookies.remove("ACCESS_TOKEN");
            Cookies.remove("REFRESH_TOKEN");
            window.location.href = "/";
          }
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
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
