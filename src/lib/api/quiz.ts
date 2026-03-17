import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { HttpResponse, PaginatedResponse, PaginationParams, Quiz, QuizAttempt } from "@/types";
import { apiClient } from "../api-client";

interface SubmitQuizInput {
  answers: { question_id: string; selected_options?: string[]; text_answer?: string }[];
}

const quizKeys = {
  all: ["quizzes"] as const,
  getQuizzes: () => [...quizKeys.all, "getQuizzes"] as const,
  getQuiz: (id: string) => [...quizKeys.all, "getQuiz", id] as const,
  getQuizResults: (id: string) => [...quizKeys.all, "getQuizResults", id] as const,
  getMyAttempts: () => [...quizKeys.all, "getMyAttempts"] as const,
};

const quizApi = {
  getQuizzes: (params: PaginationParams) => apiClient.get<PaginatedResponse<Quiz>>("/quizzes", { params }),
  getQuiz: (id: string) => apiClient.get<HttpResponse<Quiz>>(`/quizzes/${id}`),
  createQuiz: (data: Partial<Quiz>) => apiClient.post<HttpResponse<Quiz>>("/quizzes", data),
  updateQuiz: (id: string, data: Partial<Quiz>) => apiClient.put<HttpResponse<Quiz>>(`/quizzes/${id}`, data),
  deleteQuiz: (id: string) => apiClient.delete<HttpResponse<unknown>>(`/quizzes/${id}`),
  startQuiz: (id: string) => apiClient.post<HttpResponse<QuizAttempt>>(`/quizzes/${id}/start`, {}),
  submitQuiz: (id: string, data: SubmitQuizInput) =>
    apiClient.post<HttpResponse<QuizAttempt>>(`/quizzes/${id}/submit`, data),
  getQuizResults: (id: string) => apiClient.get<HttpResponse<QuizAttempt>>(`/quizzes/${id}/results`),
  getMyAttempts: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<QuizAttempt>>("/quizzes/attempts/me", { params }),
};

export const useGetQuizzes = (params: PaginationParams) =>
  useQuery({ queryKey: quizKeys.getQuizzes(), queryFn: () => quizApi.getQuizzes(params) });

export const useGetMyQuizAttempts = (params: PaginationParams) =>
  useQuery({ queryKey: quizKeys.getMyAttempts(), queryFn: () => quizApi.getMyAttempts(params) });

export const useGetQuiz = (id: string) =>
  useQuery({ queryKey: quizKeys.getQuiz(id), queryFn: () => quizApi.getQuiz(id) });

export const useGetQuizResults = (id: string) =>
  useQuery({ queryKey: quizKeys.getQuizResults(id), queryFn: () => quizApi.getQuizResults(id) });

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Quiz>) => quizApi.createQuiz(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: quizKeys.all }),
  });
};

export const useUpdateQuiz = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Quiz>) => quizApi.updateQuiz(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: quizKeys.getQuiz(id) }),
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => quizApi.deleteQuiz(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: quizKeys.all }),
  });
};

export const useStartQuiz = (id: string) => useMutation({ mutationFn: () => quizApi.startQuiz(id) });

export const useSubmitQuiz = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubmitQuizInput) => quizApi.submitQuiz(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: quizKeys.getQuizResults(id) }),
  });
};
