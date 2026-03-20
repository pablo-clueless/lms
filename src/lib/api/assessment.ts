import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Assignment, CreateAssessmentDto, Quiz } from "@/types";
import { apiClient } from "../api-client";

const keys = {
  all: ["assessments"] as const,
  quizzes: (courseId: string) => [...keys.all, "quizzes", courseId],
  assignments: (courseId: string) => [...keys.all, "assignments", courseId],
  createQuiz: () => [...keys.all, "create-quiz"],
  createAssignment: () => [...keys.all, "create-assignment"],
};

interface ListQuizResponse {
  data: Quiz[];
}

interface ListAssignmentResponse {
  data: Assignment[];
}

const assessmentApi = {
  listQuizzes: (courseId: string) => apiClient.get<ListQuizResponse>(`/courses/${courseId}/quizzes`),
  createQuiz: (courseId: string, body: CreateAssessmentDto) =>
    apiClient.post<Quiz>(`/courses/${courseId}/quizzes`, body),
  listAssignments: (courseId: string) => apiClient.get<ListAssignmentResponse>(`/courses/${courseId}/assignments`),
  createAssignment: (courseId: string, body: CreateAssessmentDto) =>
    apiClient.post<Assignment>(`/courses/${courseId}/assignments`, body),
};

export function useGetQuizzes(courseId: string) {
  return useQuery({
    queryKey: keys.quizzes(courseId),
    queryFn: () => assessmentApi.listQuizzes(courseId),
    enabled: !!courseId,
  });
}

export function useCreateQuiz(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.createQuiz(),
    mutationFn: (body: CreateAssessmentDto) => assessmentApi.createQuiz(courseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.quizzes(courseId) });
    },
  });
}

export function useGetAssignments(courseId: string) {
  return useQuery({
    queryKey: keys.assignments(courseId),
    queryFn: () => assessmentApi.listAssignments(courseId),
    enabled: !!courseId,
  });
}

export function useCreateAssignment(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.createAssignment(),
    mutationFn: (body: CreateAssessmentDto) => assessmentApi.createAssignment(courseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.assignments(courseId) });
    },
  });
}
