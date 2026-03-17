import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Examination, ExaminationResult, HttpResponse, PaginatedResponse, PaginationParams } from "@/types";
import { apiClient } from "../api-client";

// ─── Examinations ───────────────────────────────────────────────────────────

const examinationKeys = {
  all: ["examinations"] as const,
  getExaminations: () => [...examinationKeys.all, "getExaminations"] as const,
  getExamination: (id: string) => [...examinationKeys.all, "getExamination", id] as const,
  getExaminationResults: (id: string) => [...examinationKeys.all, "getExaminationResults", id] as const,
};

const examinationApi = {
  getExaminations: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<Examination>>("/examinations", { params }),
  getExamination: (id: string) => apiClient.get<HttpResponse<Examination>>(`/examinations/${id}`),
  createExamination: (data: Partial<Examination>) => apiClient.post<HttpResponse<Examination>>("/examinations", data),
  updateExamination: (id: string, data: Partial<Examination>) =>
    apiClient.put<HttpResponse<Examination>>(`/examinations/${id}`, data),
  deleteExamination: (id: string) => apiClient.delete<HttpResponse<unknown>>(`/examinations/${id}`),
  getExaminationResults: (id: string, params: PaginationParams) =>
    apiClient.get<PaginatedResponse<ExaminationResult>>(`/examinations/${id}/results`, { params }),
};

export const useGetExaminations = (params: PaginationParams) =>
  useQuery({
    queryKey: examinationKeys.getExaminations(),
    queryFn: () => examinationApi.getExaminations(params),
  });

export const useGetExamination = (id: string) =>
  useQuery({
    queryKey: examinationKeys.getExamination(id),
    queryFn: () => examinationApi.getExamination(id),
  });

export const useGetExaminationResults = (id: string, params: PaginationParams) =>
  useQuery({
    queryKey: examinationKeys.getExaminationResults(id),
    queryFn: () => examinationApi.getExaminationResults(id, params),
  });

export const useCreateExamination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Examination>) => examinationApi.createExamination(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examinationKeys.getExaminations() }),
  });
};

export const useUpdateExamination = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Examination>) => examinationApi.updateExamination(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examinationKeys.getExamination(id) });
      queryClient.invalidateQueries({ queryKey: examinationKeys.getExaminations() });
    },
  });
};

export const useDeleteExamination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => examinationApi.deleteExamination(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examinationKeys.getExaminations() }),
  });
};

// ─── Examination Results (Student) ──────────────────────────────────────────

const resultKeys = {
  all: ["examination-results"] as const,
  getMyResults: () => [...resultKeys.all, "getMyResults"] as const,
  getResult: (id: string) => [...resultKeys.all, "getResult", id] as const,
};

const resultApi = {
  getMyResults: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<ExaminationResult>>("/examinations/results/me", { params }),
  getResult: (id: string) => apiClient.get<HttpResponse<ExaminationResult>>(`/examinations/results/${id}`),
  startExamination: (examinationId: string) =>
    apiClient.post<HttpResponse<ExaminationResult>>(`/examinations/${examinationId}/start`, {}),
  submitExamination: (examinationId: string, data: { answers: Record<string, unknown> }) =>
    apiClient.post<HttpResponse<ExaminationResult>>(`/examinations/${examinationId}/submit`, data),
};

export const useGetMyExaminationResults = (params: PaginationParams) =>
  useQuery({
    queryKey: resultKeys.getMyResults(),
    queryFn: () => resultApi.getMyResults(params),
  });

export const useGetExaminationResult = (id: string) =>
  useQuery({
    queryKey: resultKeys.getResult(id),
    queryFn: () => resultApi.getResult(id),
  });

export const useStartExamination = (examinationId: string) =>
  useMutation({ mutationFn: () => resultApi.startExamination(examinationId) });

export const useSubmitExamination = (examinationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { answers: Record<string, unknown> }) => resultApi.submitExamination(examinationId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resultKeys.getMyResults() }),
  });
};
