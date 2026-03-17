import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  Attendance,
  AttendanceStatus,
  HttpResponse,
  ModuleProgress,
  PaginatedResponse,
  PaginationParams,
  Progress,
  Session,
} from "@/types";
import { apiClient } from "../api-client";

interface MarkAttendanceInput {
  student_id: string;
  session_id: string;
  status: AttendanceStatus;
  notes?: string;
}

// ─── Progress ────────────────────────────────────────────────────────────────

const progressKeys = {
  all: ["progress"] as const,
  getAllProgress: () => [...progressKeys.all, "getAllProgress"] as const,
  getMyProgress: () => [...progressKeys.all, "getMyProgress"] as const,
  getUserProgress: (userId: string) => [...progressKeys.all, "getUserProgress", userId] as const,
};

const progressApi = {
  getAllProgress: (params: PaginationParams) => apiClient.get<PaginatedResponse<Progress>>("/progress", { params }),
  getMyProgress: () => apiClient.get<PaginatedResponse<Progress>>("/progress/me"),
  getUserProgress: (userId: string) => apiClient.get<PaginatedResponse<Progress>>(`/progress/users/${userId}`),
  completeModule: (moduleId: string) =>
    apiClient.post<HttpResponse<ModuleProgress>>(`/progress/modules/${moduleId}/complete`, {}),
  markAttendance: (data: MarkAttendanceInput) => apiClient.post<HttpResponse<Attendance>>("/progress/attendance", data),
};

export const useGetAllProgress = (params: PaginationParams) =>
  useQuery({ queryKey: progressKeys.getAllProgress(), queryFn: () => progressApi.getAllProgress(params) });

export const useGetMyProgress = () =>
  useQuery({ queryKey: progressKeys.getMyProgress(), queryFn: () => progressApi.getMyProgress() });

export const useGetUserProgress = (userId: string) =>
  useQuery({ queryKey: progressKeys.getUserProgress(userId), queryFn: () => progressApi.getUserProgress(userId) });

export const useCompleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (moduleId: string) => progressApi.completeModule(moduleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: progressKeys.getMyProgress() }),
  });
};

export const useMarkAttendance = () =>
  useMutation({ mutationFn: (data: MarkAttendanceInput) => progressApi.markAttendance(data) });

// ─── Sessions ────────────────────────────────────────────────────────────────

const sessionKeys = {
  all: ["sessions"] as const,
  getSessions: () => [...sessionKeys.all, "getSessions"] as const,
  getSession: (id: string) => [...sessionKeys.all, "getSession", id] as const,
};

const sessionApi = {
  getSessions: (params: PaginationParams) => apiClient.get<PaginatedResponse<Session>>("/sessions", { params }),
  getSession: (id: string) => apiClient.get<HttpResponse<Session>>(`/sessions/${id}`),
  createSession: (data: Partial<Session>) => apiClient.post<HttpResponse<Session>>("/sessions", data),
  updateSession: (id: string, data: Partial<Session>) => apiClient.put<HttpResponse<Session>>(`/sessions/${id}`, data),
  deleteSession: (id: string) => apiClient.delete<HttpResponse<unknown>>(`/sessions/${id}`),
};

export const useGetSessions = (params: PaginationParams) =>
  useQuery({ queryKey: sessionKeys.getSessions(), queryFn: () => sessionApi.getSessions(params) });

export const useGetSession = (id: string) =>
  useQuery({ queryKey: sessionKeys.getSession(id), queryFn: () => sessionApi.getSession(id) });

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Session>) => sessionApi.createSession(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionKeys.getSessions() }),
  });
};

export const useUpdateSession = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Session>) => sessionApi.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.getSession(id) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.getSessions() });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionApi.deleteSession(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionKeys.getSessions() }),
  });
};
