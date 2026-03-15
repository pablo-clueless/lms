import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  Attendance,
  AttendanceStatus,
  HttpResponse,
  ModuleProgress,
  PaginatedResponse,
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
  getMyProgress: () => [...progressKeys.all, "getMyProgress"] as const,
  getUserProgress: (userId: string) => [...progressKeys.all, "getUserProgress", userId] as const,
};

const progressApi = {
  getMyProgress: () => apiClient.get<PaginatedResponse<Progress>>("/progress/me"),
  getUserProgress: (userId: string) => apiClient.get<PaginatedResponse<Progress>>(`/progress/users/${userId}`),
  completeModule: (moduleId: string) =>
    apiClient.post<HttpResponse<ModuleProgress>>(`/progress/modules/${moduleId}/complete`, {}),
  markAttendance: (data: MarkAttendanceInput) => apiClient.post<HttpResponse<Attendance>>("/progress/attendance", data),
};

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
  getSession: (id: string) => [...sessionKeys.all, "getSession", id] as const,
};

const sessionApi = {
  getSession: (id: string) => apiClient.get<HttpResponse<Session>>(`/sessions/${id}`),
  createSession: (data: Partial<Session>) => apiClient.post<HttpResponse<Session>>("/sessions", data),
};

export const useGetSession = (id: string) =>
  useQuery({ queryKey: sessionKeys.getSession(id), queryFn: () => sessionApi.getSession(id) });

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Session>) => sessionApi.createSession(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionKeys.all }),
  });
};
