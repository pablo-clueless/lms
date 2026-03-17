import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Assignment, AssignmentSubmission, HttpResponse, PaginatedResponse, PaginationParams } from "@/types";
import { apiClient } from "../api-client";

// ─── Assignments ────────────────────────────────────────────────────────────

const assignmentKeys = {
  all: ["assignments"] as const,
  getAssignments: () => [...assignmentKeys.all, "getAssignments"] as const,
  getAssignment: (id: string) => [...assignmentKeys.all, "getAssignment", id] as const,
  getAssignmentSubmissions: (id: string) => [...assignmentKeys.all, "getAssignmentSubmissions", id] as const,
};

const assignmentApi = {
  getAssignments: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<Assignment>>("/assignments", { params }),
  getAssignment: (id: string) => apiClient.get<HttpResponse<Assignment>>(`/assignments/${id}`),
  createAssignment: (data: Partial<Assignment>) => apiClient.post<HttpResponse<Assignment>>("/assignments", data),
  updateAssignment: (id: string, data: Partial<Assignment>) =>
    apiClient.put<HttpResponse<Assignment>>(`/assignments/${id}`, data),
  deleteAssignment: (id: string) => apiClient.delete<HttpResponse<unknown>>(`/assignments/${id}`),
  getAssignmentSubmissions: (id: string, params: PaginationParams) =>
    apiClient.get<PaginatedResponse<AssignmentSubmission>>(`/assignments/${id}/submissions`, { params }),
};

export const useGetAssignments = (params: PaginationParams) =>
  useQuery({
    queryKey: assignmentKeys.getAssignments(),
    queryFn: () => assignmentApi.getAssignments(params),
  });

export const useGetAssignment = (id: string) =>
  useQuery({
    queryKey: assignmentKeys.getAssignment(id),
    queryFn: () => assignmentApi.getAssignment(id),
  });

export const useGetAssignmentSubmissions = (id: string, params: PaginationParams) =>
  useQuery({
    queryKey: assignmentKeys.getAssignmentSubmissions(id),
    queryFn: () => assignmentApi.getAssignmentSubmissions(id, params),
  });

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Assignment>) => assignmentApi.createAssignment(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.getAssignments() }),
  });
};

export const useUpdateAssignment = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Assignment>) => assignmentApi.updateAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.getAssignment(id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.getAssignments() });
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assignmentApi.deleteAssignment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.getAssignments() }),
  });
};

// ─── Assignment Submissions ─────────────────────────────────────────────────

const submissionKeys = {
  all: ["assignment-submissions"] as const,
  getMySubmissions: () => [...submissionKeys.all, "getMySubmissions"] as const,
  getSubmission: (id: string) => [...submissionKeys.all, "getSubmission", id] as const,
};

const submissionApi = {
  getMySubmissions: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<AssignmentSubmission>>("/assignments/submissions/me", { params }),
  getSubmission: (id: string) => apiClient.get<HttpResponse<AssignmentSubmission>>(`/assignments/submissions/${id}`),
  submitAssignment: (assignmentId: string, data: FormData) =>
    apiClient.post<HttpResponse<AssignmentSubmission>>(`/assignments/${assignmentId}/submit`, data),
  gradeSubmission: (id: string, data: { grade: number; feedback?: string }) =>
    apiClient.put<HttpResponse<AssignmentSubmission>>(`/assignments/submissions/${id}/grade`, data),
};

export const useGetMySubmissions = (params: PaginationParams) =>
  useQuery({
    queryKey: submissionKeys.getMySubmissions(),
    queryFn: () => submissionApi.getMySubmissions(params),
  });

export const useGetSubmission = (id: string) =>
  useQuery({
    queryKey: submissionKeys.getSubmission(id),
    queryFn: () => submissionApi.getSubmission(id),
  });

export const useSubmitAssignment = (assignmentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => submissionApi.submitAssignment(assignmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.getMySubmissions() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.getAssignmentSubmissions(assignmentId) });
    },
  });
};

export const useGradeSubmission = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { grade: number; feedback?: string }) => submissionApi.gradeSubmission(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: submissionKeys.getSubmission(id) }),
  });
};
