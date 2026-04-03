import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../api-client";
import type {
  Assignment,
  AssignmentSubmission,
  CreateAssignmentDto,
  CreateQuizDto,
  Pagination,
  QueryParams,
  Quiz,
  QuizSubmission,
  SubmitAssignmentDto,
  SubmitQuizDto,
} from "@/types";

const keys = {
  all: ["assessments"] as const,
  quizzes: (courseId: string) => [...keys.all, "quizzes", courseId] as const,
  quiz: (course_id: string, id: string) => [...keys.all, "quiz", course_id, id] as const,
  assignments: (courseId: string) => [...keys.all, "assignments", courseId] as const,
  assignment: (course_id: string, id: string) => [...keys.all, "assignment", course_id, id] as const,
  createQuiz: () => [...keys.all, "create-quiz"] as const,
  createAssignment: () => [...keys.all, "create-assignment"] as const,
  quizSubmissions: (course_id: string, id: string) => [...keys.all, "quiz-submissions", course_id, id] as const,
  assignmentSubmissions: (course_id: string, id: string) =>
    [...keys.all, "assignment-submissions", course_id, id] as const,
  quizSubmission: (id: string) => [...keys.all, "quiz-submission", id] as const,
  assignmentSubmission: (id: string) => [...keys.all, "assignment-submission", id] as const,
  startQuiz: (course_id: string, id: string) => [...keys.all, "start-quiz", course_id, id] as const,
  submitQuiz: (course_id: string, id: string) => [...keys.all, "submit-quiz", course_id, id] as const,
  submitAssignment: (course_id: string, id: string) => [...keys.all, "submit-assignment", course_id, id] as const,
  publishQuiz: (course_id: string, id: string) => [...keys.all, "publish-quiz", course_id, id] as const,
  publishAssignment: (course_id: string, id: string) => [...keys.all, "publish-assignment", course_id, id] as const,
};

interface ListQueries {
  class_id?: string;
  limit?: number;
  page?: number;
}

interface ListQuizResponse {
  data: Quiz[];
  pagination: Pagination;
}

interface ListAssignmentResponse {
  data: Assignment[];
  pagination: Pagination;
}

interface ListQuizSubmissionResponse {
  data: QuizSubmission[];
  pagination: Pagination;
}

interface ListAssignmentSubmissionResponse {
  data: AssignmentSubmission[];
  pagination: Pagination;
}

const assessmentApi = {
  listQuizzes: (courseId: string, params?: ListQueries) =>
    apiClient.get<ListQuizResponse>(`/courses/${courseId}/quizzes`, params as QueryParams),
  getQuiz: (course_id: string, id: string) => apiClient.get<Quiz>(`/courses/${course_id}/quizzes/${id}`),
  createQuiz: (courseId: string, body: Partial<CreateQuizDto>) =>
    apiClient.post<Quiz>(`/courses/${courseId}/quizzes`, body),
  listAssignments: (courseId: string, params?: ListQueries) =>
    apiClient.get<ListAssignmentResponse>(`/courses/${courseId}/assignments`, params as QueryParams),
  getAssignment: (course_id: string, id: string) =>
    apiClient.get<Assignment>(`/courses/${course_id}/assignments/${id}`),
  createAssignment: (courseId: string, body: Partial<CreateAssignmentDto>) =>
    apiClient.post<Assignment>(`/courses/${courseId}/assignments`, body),
  quizSubmissions: (course_id: string, id: string, params?: ListQueries) =>
    apiClient.get<ListQuizSubmissionResponse>(`/courses/${course_id}/quizzes/${id}/submissions`, params as QueryParams),
  assignmentSubmissions: (course_id: string, id: string, params?: ListQueries) =>
    apiClient.get<ListAssignmentSubmissionResponse>(
      `/courses/${course_id}/assignments/${id}/submissions`,
      params as QueryParams,
    ),
  quizSubmission: (course_id: string, id: string) => apiClient.get(`/courses/${course_id}/quizzes/${id}/submissions`),
  assignmentSubmission: (course_id: string, id: string) =>
    apiClient.get(`/courses/${course_id}/assignments/${id}/submissions`),
  startQuiz: (course_id: string, id: string) => apiClient.post(`/courses/${course_id}/quizzes/${id}/start`),
  submitQuiz: (course_id: string, id: string, body: SubmitQuizDto) =>
    apiClient.post(`/courses/${course_id}/quizzes/${id}/submit`, body),
  submitAssignment: (course_id: string, id: string, body: SubmitAssignmentDto) =>
    apiClient.post(`/courses/${course_id}/assignments/${id}/submit`, body),
  publishQuiz: (course_id: string, id: string) => apiClient.post(`/courses/${course_id}/quizzes/${id}/publish`),
  publishAssignment: (course_id: string, id: string) =>
    apiClient.post(`/courses/${course_id}/assignments/${id}/publish`),
};

export function useGetQuizzes(courseId: string, params?: ListQueries) {
  return useQuery({
    queryKey: keys.quizzes(courseId),
    queryFn: () => assessmentApi.listQuizzes(courseId, params),
    enabled: !!courseId,
  });
}

export function useCreateQuiz(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.createQuiz(),
    mutationFn: (body: Partial<CreateQuizDto>) => assessmentApi.createQuiz(courseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.quizzes(courseId) });
    },
  });
}

export function useGetAssignments(courseId: string, params?: ListQueries) {
  return useQuery({
    queryKey: keys.assignments(courseId),
    queryFn: () => assessmentApi.listAssignments(courseId, params),
    enabled: !!courseId,
  });
}

export function useCreateAssignment(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.createAssignment(),
    mutationFn: (body: Partial<CreateAssignmentDto>) => assessmentApi.createAssignment(courseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.assignments(courseId) });
    },
  });
}

export function useGetQuiz(course_id: string, id: string) {
  return useQuery({
    queryKey: keys.quiz(course_id, id),
    queryFn: () => assessmentApi.getQuiz(course_id, id),
    enabled: !!course_id && !!id,
  });
}

export function useGetAssignment(course_id: string, id: string) {
  return useQuery({
    queryKey: keys.assignment(course_id, id),
    queryFn: () => assessmentApi.getAssignment(course_id, id),
    enabled: !!course_id && !!id,
  });
}

export function useGetQuizSubmissions(course_id: string, id: string, params?: ListQueries) {
  return useQuery({
    queryKey: keys.quizSubmissions(course_id, id),
    queryFn: () => assessmentApi.quizSubmissions(course_id, id, params),
    enabled: !!course_id && !!id,
  });
}

export function useGetAssignmentSubmissions(course_id: string, id: string, params?: ListQueries) {
  return useQuery({
    queryKey: keys.assignmentSubmissions(course_id, id),
    queryFn: () => assessmentApi.assignmentSubmissions(course_id, id, params),
    enabled: !!course_id && !!id,
  });
}

export function useGetQuizSubmission(course_id: string, id: string) {
  return useQuery({
    queryKey: keys.quizSubmission(id),
    queryFn: () => assessmentApi.quizSubmission(course_id, id),
    enabled: !!course_id && !!id,
  });
}

export function useGetAssignmentSubmission(course_id: string, id: string) {
  return useQuery({
    queryKey: keys.assignmentSubmission(id),
    queryFn: () => assessmentApi.assignmentSubmission(course_id, id),

    enabled: !!course_id && !!id,
  });
}

export function useStartQuiz(course_id: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.startQuiz(course_id, id),
    mutationFn: () => assessmentApi.startQuiz(course_id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.quiz(course_id, id) });
    },
  });
}

export function useSubmitQuiz(course_id: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.submitQuiz(course_id, id),
    mutationFn: (body: SubmitQuizDto) => assessmentApi.submitQuiz(course_id, id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.quiz(course_id, id) });
      queryClient.invalidateQueries({ queryKey: keys.quizSubmissions(course_id, id) });
    },
  });
}

export function useSubmitAssignment(course_id: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.submitAssignment(course_id, id),
    mutationFn: (body: SubmitAssignmentDto) => assessmentApi.submitAssignment(course_id, id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.assignment(course_id, id) });
      queryClient.invalidateQueries({ queryKey: keys.assignmentSubmissions(course_id, id) });
    },
  });
}

export function usePublishQuiz(course_id: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.publishQuiz(course_id, id),
    mutationFn: () => assessmentApi.publishQuiz(course_id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.quiz(course_id, id) });
      queryClient.invalidateQueries({ queryKey: keys.quizzes(course_id) });
    },
  });
}

export function usePublishAssignment(course_id: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.publishAssignment(course_id, id),
    mutationFn: () => assessmentApi.publishAssignment(course_id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.assignment(course_id, id) });
      queryClient.invalidateQueries({ queryKey: keys.assignments(course_id) });
    },
  });
}
