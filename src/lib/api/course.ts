import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Course, CreateCourseDto, Pagination, PaginationParams, QueryParams } from "@/types";
import { apiClient } from "../api-client";

type UpdateCourse = {
  id: string;
  body: Partial<CreateCourseDto>;
};

interface CourseQueries {
  class_id?: string;
}

const keys = {
  all: ["courses"] as const,
  list: () => [...keys.all, "get-courses"],
  get: (id: string) => [...keys.all, "get-course", id],
  create: () => [...keys.all, "create-course"],
  update: () => [...keys.all, "update-course"],
  delete: () => [...keys.all, "delete-course"],
};

interface ListCourseResponse {
  pagination: Pagination;
  courses: Course[];
}

const courseApi = {
  create: (body: CreateCourseDto) => apiClient.post<Course>("/courses", body),
  list: (params?: PaginationParams & CourseQueries) =>
    apiClient.get<ListCourseResponse>("/courses", params as QueryParams),
  get: (id: string) => apiClient.get<Course>(`/courses/${id}`),
  update: (payload: UpdateCourse) => apiClient.put<Course>(`/courses/${payload.id}`, payload.body),
  delete: (id: string) => apiClient.delete<void>(`/courses/${id}`),
};

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: courseApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useGetCourses(params?: PaginationParams & CourseQueries) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => courseApi.list(params),
  });
}

export function useGetCourse(id: string) {
  return useQuery({
    queryKey: keys.get(id),
    queryFn: () => courseApi.get(id),
    enabled: !!id,
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: courseApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: courseApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}
