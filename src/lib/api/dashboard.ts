import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api-client";
import type {
  AdminDashboardResponse,
  HttpResponse,
  StudentDashboardResponse,
  SuperAdminDashboardResponse,
  TutorDashboardResponse,
} from "@/types";

const dashboardKeys = {
  all: ["dashboard"] as const,
};

const dashboardApi = {
  getSuperAdminDashboard: () => apiClient.get<HttpResponse<SuperAdminDashboardResponse>>("/dashboard"),
  getAdminDashboard: () => apiClient.get<HttpResponse<AdminDashboardResponse>>("/dashboard"),
  getTutorDashboard: () => apiClient.get<HttpResponse<TutorDashboardResponse>>("/dashboard"),
  getStudentDashboard: () => apiClient.get<HttpResponse<StudentDashboardResponse>>("/dashboard"),
};

export const useGetSuperAdminDashboardQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: dashboardApi.getSuperAdminDashboard,
  });
};

export const useGetAdminDashboardQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: dashboardApi.getAdminDashboard,
  });
};

export const useGetTutorDashboardQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: dashboardApi.getTutorDashboard,
  });
};

export const useGetStudentDashboardQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: dashboardApi.getStudentDashboard,
  });
};
