import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api-client";
import type {
  AdminDashboardResponse,
  StudentDashboardResponse,
  SuperAdminDashboardResponse,
  TutorDashboardResponse,
} from "@/types";

const keys = {
  all: ["dashboard"] as const,
};

const dashboardApi = {
  getSuperAdminDashboard: () => apiClient.get<SuperAdminDashboardResponse>("/dashboard"),
  getAdminDashboard: () => apiClient.get<AdminDashboardResponse>("/dashboard"),
  getTutorDashboard: () => apiClient.get<TutorDashboardResponse>("/dashboard"),
  getStudentDashboard: () => apiClient.get<StudentDashboardResponse>("/dashboard"),
};

export function useGetSuperAdminDashboard() {
  return useQuery({
    queryKey: [...keys.all, "super-admin"],
    queryFn: () => dashboardApi.getSuperAdminDashboard(),
  });
}

export function useGetAdminDashboard() {
  return useQuery({
    queryKey: [...keys.all, "admin"],
    queryFn: () => dashboardApi.getAdminDashboard(),
  });
}

export function useGetTutorDashboard() {
  return useQuery({
    queryKey: [...keys.all, "tutor"],
    queryFn: () => dashboardApi.getTutorDashboard(),
  });
}

export function useGetStudentDashboard() {
  return useQuery({
    queryKey: [...keys.all, "student"],
    queryFn: () => dashboardApi.getStudentDashboard(),
  });
}
