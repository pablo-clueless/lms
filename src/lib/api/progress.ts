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
  computeGradesForCourse: () => [...keys.all, "compute-grades-course"],
  computeGradesForClass: () => [...keys.all, "compute-grades-class"],
  reportCard: (studentId: string) => [...keys.all, "report-card", studentId],
  generateReportCard: () => [...keys.all, "generate-report-card"],
  courseStatistics: (courseId: string) => [...keys.all, "course-statistics", courseId],
  classStatistics: (classId: string) => [...keys.all, "class-statistics", classId],
  flaggedStudents: () => [...keys.all, "flagged-students"],
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
  computeGradesForCourse: (courseId: string) =>
    apiClient.post<ComputeGradesResponse>(`/progress/courses/${courseId}/compute-grades`),
  computeGradesForClass: (classId: string) =>
    apiClient.post<ComputeGradesResponse>(`/progress/classes/${classId}/compute-grades`),
  getReportCard: (studentId: string, params?: ReportCardQueries) =>
    apiClient.get<ReportCard>(`/progress/report-cards/students/${studentId}`, params as QueryParams),
  generateReportCard: (studentId: string) => apiClient.post<ReportCard>(`/progress/report-cards/students/${studentId}`),
  getCourseStatistics: (courseId: string) => apiClient.get(`/progress/courses/${courseId}/statistics`),
  getClassStatistics: (classId: string) => apiClient.get(`/progress/classes/${classId}/statistics`),
  getFlaggedStudents: () => apiClient.get(`/progress/flagged`),
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

export function useComputeGradesForCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.computeGradesForCourse(),
    mutationFn: progressApi.computeGradesForCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useComputeGradesForClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.computeGradesForClass(),
    mutationFn: progressApi.computeGradesForClass,
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

export function useGetCourseStatistics(courseId: string) {
  return useQuery({
    queryKey: keys.courseStatistics(courseId),
    queryFn: () => progressApi.getCourseStatistics(courseId),
    enabled: !!courseId,
  });
}

export function useGetClassStatistics(classId: string) {
  return useQuery({
    queryKey: keys.classStatistics(classId),
    queryFn: () => progressApi.getClassStatistics(classId),
    enabled: !!classId,
  });
}

export function useGetFlaggedStudents() {
  return useQuery({
    queryKey: keys.flaggedStudents(),
    queryFn: progressApi.getFlaggedStudents,
  });
}
