import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  Course,
  CourseContent,
  CourseContentType,
  CreateCourseDto,
  Pagination,
  PaginationParams,
  QueryParams,
} from "@/types";
import { apiClient } from "../api-client";

type UpdateCourse = {
  id: string;
  body: Partial<CreateCourseDto>;
};

interface CourseQueries {
  class_id?: string;
  term_id?: string;
  tutor_id?: string;
}

interface ContentQueries {
  type?: CourseContentType;
}

export interface CreateContentDto {
  title: string;
  content_type: CourseContentType;
  content: string;
  description?: string;
  duration?: number;
  file_size?: number;
  mime_type?: string;
}

export interface UpdateContentDto {
  title?: string;
  content_type?: CourseContentType;
  content?: string;
  description?: string;
  duration?: number;
  file_size?: number;
  mime_type?: string;
}

export interface ReorderContentDto {
  content_ids: string[];
}

type CreateContent = {
  courseId: string;
  body: CreateContentDto;
};

type UpdateContent = {
  courseId: string;
  contentId: string;
  body: UpdateContentDto;
};

type DeleteContent = {
  courseId: string;
  contentId: string;
};

type GetContent = {
  courseId: string;
  contentId: string;
};

type ReorderContent = {
  courseId: string;
  body: ReorderContentDto;
};

const keys = {
  all: ["courses"] as const,
  list: () => [...keys.all, "get-courses"],
  get: (id: string) => [...keys.all, "get-course", id],
  getWithContents: (id: string) => [...keys.all, "get-course-with-contents", id],
  create: () => [...keys.all, "create-course"],
  update: () => [...keys.all, "update-course"],
  delete: () => [...keys.all, "delete-course"],
  // Course content keys
  contents: (courseId: string) => [...keys.all, courseId, "contents"],
  content: (courseId: string, contentId: string) => [...keys.all, courseId, "contents", contentId],
  createContent: () => [...keys.all, "create-content"],
  updateContent: () => [...keys.all, "update-content"],
  deleteContent: () => [...keys.all, "delete-content"],
  reorderContent: () => [...keys.all, "reorder-content"],
};

interface ListCourseResponse {
  pagination: Pagination;
  courses: Course[];
}

interface ListContentsResponse {
  contents: CourseContent[];
}

const courseApi = {
  create: (body: CreateCourseDto) => apiClient.post<Course>("/courses", body),
  list: (params?: PaginationParams & CourseQueries) =>
    apiClient.get<ListCourseResponse>("/courses", params as QueryParams),
  get: (id: string) => apiClient.get<Course>(`/courses/${id}`),
  getWithContents: (id: string) => apiClient.get<Course>(`/courses/${id}/with-contents`),
  update: (payload: UpdateCourse) => apiClient.put<Course>(`/courses/${payload.id}`, payload.body),
  delete: (id: string) => apiClient.delete<void>(`/courses/${id}`),
  // Course content endpoints
  listContents: (courseId: string, params?: ContentQueries) =>
    apiClient.get<ListContentsResponse>(`/courses/${courseId}/contents`, params as QueryParams),
  getContent: (payload: GetContent) =>
    apiClient.get<CourseContent>(`/courses/${payload.courseId}/contents/${payload.contentId}`),
  createContent: (payload: CreateContent) =>
    apiClient.post<CourseContent>(`/courses/${payload.courseId}/contents`, payload.body),
  updateContent: (payload: UpdateContent) =>
    apiClient.put<CourseContent>(`/courses/${payload.courseId}/contents/${payload.contentId}`, payload.body),
  deleteContent: (payload: DeleteContent) =>
    apiClient.delete<void>(`/courses/${payload.courseId}/contents/${payload.contentId}`),
  reorderContents: (payload: ReorderContent) =>
    apiClient.post<{ message: string }>(`/courses/${payload.courseId}/contents/reorder`, payload.body),
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

// Course Content Hooks

export function useGetCourseWithContents(id: string) {
  return useQuery({
    queryKey: keys.getWithContents(id),
    queryFn: () => courseApi.getWithContents(id),
    enabled: !!id,
  });
}

export function useGetCourseContents(courseId: string, params?: ContentQueries) {
  return useQuery({
    queryKey: keys.contents(courseId),
    queryFn: () => courseApi.listContents(courseId, params),
    enabled: !!courseId,
  });
}

export function useGetCourseContent(courseId: string, contentId: string) {
  return useQuery({
    queryKey: keys.content(courseId, contentId),
    queryFn: () => courseApi.getContent({ courseId, contentId }),
    enabled: !!courseId && !!contentId,
  });
}

export function useCreateCourseContent(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.createContent(),
    mutationFn: (body: CreateContentDto) => courseApi.createContent({ courseId, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.contents(courseId) });
      queryClient.invalidateQueries({ queryKey: keys.getWithContents(courseId) });
    },
  });
}

export function useUpdateCourseContent(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.updateContent(),
    mutationFn: ({ contentId, body }: { contentId: string; body: UpdateContentDto }) =>
      courseApi.updateContent({ courseId, contentId, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.contents(courseId) });
      queryClient.invalidateQueries({ queryKey: keys.getWithContents(courseId) });
    },
  });
}

export function useDeleteCourseContent(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.deleteContent(),
    mutationFn: (contentId: string) => courseApi.deleteContent({ courseId, contentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.contents(courseId) });
      queryClient.invalidateQueries({ queryKey: keys.getWithContents(courseId) });
    },
  });
}

export function useReorderCourseContents(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.reorderContent(),
    mutationFn: (body: ReorderContentDto) => courseApi.reorderContents({ courseId, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.contents(courseId) });
      queryClient.invalidateQueries({ queryKey: keys.getWithContents(courseId) });
    },
  });
}
