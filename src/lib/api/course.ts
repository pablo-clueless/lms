import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Course, HttpResponse, Module, PaginatedResponse, PaginationParams, Resource } from "@/types";
import { apiClient } from "../api-client";

// ─── Courses ─────────────────────────────────────────────────────────────────

const courseKeys = {
  all: ["courses"] as const,
  getCourses: () => [...courseKeys.all, "getCourses"] as const,
  getCourse: (id: string) => [...courseKeys.all, "getCourse", id] as const,
  getCourseModules: (id: string) => [...courseKeys.all, "getCourseModules", id] as const,
};

const courseApi = {
  getCourses: (params: PaginationParams) => apiClient.get<PaginatedResponse<Course>>("/courses", { params }),
  getCourse: (id: string) => apiClient.get<HttpResponse<Course>>(`/courses/${id}`),
  createCourse: (data: Partial<Course>) => apiClient.post<HttpResponse<Course>>("/courses", data),
  updateCourse: (id: string, data: Partial<Course>) => apiClient.put<HttpResponse<Course>>(`/courses/${id}`, data),
  deleteCourse: (id: string) => apiClient.delete<HttpResponse<unknown>>(`/courses/${id}`),
  getCourseModules: (id: string, params: PaginationParams) =>
    apiClient.get<PaginatedResponse<Module>>(`/courses/${id}/modules`, { params }),
};

export const useGetCourses = (params: PaginationParams) =>
  useQuery({ queryKey: courseKeys.getCourses(), queryFn: () => courseApi.getCourses(params) });

export const useGetCourse = (id: string) =>
  useQuery({ queryKey: courseKeys.getCourse(id), queryFn: () => courseApi.getCourse(id) });

export const useGetCourseModules = (id: string, params: PaginationParams) =>
  useQuery({ queryKey: courseKeys.getCourseModules(id), queryFn: () => courseApi.getCourseModules(id, params) });

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Course>) => courseApi.createCourse(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: courseKeys.getCourses() }),
  });
};

export const useUpdateCourse = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Course>) => courseApi.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.getCourse(id) });
      queryClient.invalidateQueries({ queryKey: courseKeys.getCourses() });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseApi.deleteCourse(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: courseKeys.getCourses() }),
  });
};

// ─── Modules ─────────────────────────────────────────────────────────────────

const moduleKeys = {
  all: ["modules"] as const,
  getModule: (id: string) => [...moduleKeys.all, "getModule", id] as const,
  getModuleResources: (id: string) => [...moduleKeys.all, "getModuleResources", id] as const,
};

const moduleApi = {
  getModule: (id: string) => apiClient.get<HttpResponse<Module>>(`/modules/${id}`),
  createModule: (data: Partial<Module>) => apiClient.post<HttpResponse<Module>>("/modules", data),
  updateModule: (id: string, data: Partial<Module>) => apiClient.put<HttpResponse<Module>>(`/modules/${id}`, data),
  deleteModule: (id: string) => apiClient.delete<HttpResponse<unknown>>(`/modules/${id}`),
  getModuleResources: (id: string, params: PaginationParams) =>
    apiClient.get<PaginatedResponse<Resource>>(`/modules/${id}/resources`, { params }),
  createResource: (moduleId: string, data: Partial<Resource>) =>
    apiClient.post<HttpResponse<Resource>>(`/modules/${moduleId}/resources`, data),
};

export const useGetModule = (id: string) =>
  useQuery({ queryKey: moduleKeys.getModule(id), queryFn: () => moduleApi.getModule(id) });

export const useGetModuleResources = (id: string, params: PaginationParams) =>
  useQuery({ queryKey: moduleKeys.getModuleResources(id), queryFn: () => moduleApi.getModuleResources(id, params) });

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Module>) => moduleApi.createModule(data),
    onSuccess: (_, vars) => {
      if (vars.course_id) queryClient.invalidateQueries({ queryKey: courseKeys.getCourseModules(vars.course_id) });
    },
  });
};

export const useUpdateModule = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Module>) => moduleApi.updateModule(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: moduleKeys.getModule(id) }),
  });
};

export const useDeleteModule = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => moduleApi.deleteModule(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: courseKeys.getCourseModules(courseId) }),
  });
};

export const useCreateResource = (moduleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Resource>) => moduleApi.createResource(moduleId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: moduleKeys.getModuleResources(moduleId) }),
  });
};
