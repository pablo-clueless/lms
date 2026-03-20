import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Progress, ReportCard, QueryParams } from "@/types";
import { apiClient } from "../api-client";

interface ReportCardQueries {
  term_id?: string;
}

const keys = {
  all: ["progress"] as const,
  get: (id: string) => [...keys.all, "get-progress", id],
  student: (studentId: string) => [...keys.all, "student", studentId],
  computeGrades: () => [...keys.all, "compute-grades"],
  reportCard: (studentId: string) => [...keys.all, "report-card", studentId],
  generateReportCard: () => [...keys.all, "generate-report-card"],
};

interface ListProgressResponse {
  data: Progress[];
}

interface ComputeGradesResponse {
  message: string;
  updated_count: number;
}

const progressApi = {
  get: (id: string) => apiClient.get<Progress>(`/progress/${id}`),
  getStudentProgress: (studentId: string) => apiClient.get<ListProgressResponse>(`/progress/students/${studentId}`),
  computeGrades: (courseId: string) =>
    apiClient.post<ComputeGradesResponse>(`/progress/courses/${courseId}/compute-grades`),
  getReportCard: (studentId: string, params?: ReportCardQueries) =>
    apiClient.get<ReportCard>(`/progress/report-cards/students/${studentId}`, params as QueryParams),
  generateReportCard: (studentId: string) => apiClient.post<ReportCard>(`/progress/report-cards/students/${studentId}`),
};

export function useGetProgress(id: string) {
  return useQuery({
    queryKey: keys.get(id),
    queryFn: () => progressApi.get(id),
    enabled: !!id,
  });
}

export function useGetStudentProgress(studentId: string) {
  return useQuery({
    queryKey: keys.student(studentId),
    queryFn: () => progressApi.getStudentProgress(studentId),
    enabled: !!studentId,
  });
}

export function useComputeGrades() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.computeGrades(),
    mutationFn: progressApi.computeGrades,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useGetReportCard(studentId: string, params?: ReportCardQueries) {
  return useQuery({
    queryKey: keys.reportCard(studentId),
    queryFn: () => progressApi.getReportCard(studentId, params),
    enabled: !!studentId,
  });
}

export function useGenerateReportCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.generateReportCard(),
    mutationFn: progressApi.generateReportCard,
    onSuccess: (_, studentId) => {
      queryClient.invalidateQueries({ queryKey: keys.reportCard(studentId) });
    },
  });
}
