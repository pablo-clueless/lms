import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Role } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeNullOrUndefined<T>(obj: T): Partial<T> {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.filter((item) => item !== null && item !== undefined) as T;
  }

  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        const normalizedValue = value === "ALL" ? "" : value;
        if (normalizedValue !== "") {
          result[key] = normalizedValue;
        }
      }
    }
  }
  return result as T;
}

export function getInitials(value?: string) {
  if (!value || !value.trim()) return "";
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function getBasePathByRole(role: Role) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "STUDENT":
      return "/student";
    case "SUPER_ADMIN":
      return "/superadmin";
    case "TUTOR":
      return "/tutor";
    default:
      return "/";
  }
}

export function formatCurrency(amount: number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-US", {
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    notation: "compact",
    style: "currency",
  }).format(amount);
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
