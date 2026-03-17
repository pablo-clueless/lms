import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { PaginatedResponse, PaginationParams, User, CreateUserDto, HttpResponse } from "@/types";
import { apiClient } from "../api-client";

const userKeys = {
  all: ["users"] as const,
  getUsers: () => [...userKeys.all, "getUsers"] as const,
  getUser: (id: string) => [...userKeys.all, "getUser", id] as const,
  getMe: () => [...userKeys.all, "getMe"] as const,
  createUser: () => [...userKeys.all, "createUser"] as const,
  updateUser: () => [...userKeys.all, "updateUser"] as const,
  updateMe: () => [...userKeys.all, "updateMe"] as const,
  updateProfile: () => [...userKeys.all, "updateProfile"] as const,
  updatePassword: () => [...userKeys.all, "updatePassword"] as const,
  deleteUser: () => [...userKeys.all, "deleteUser"] as const,
};

const userApi = {
  getUsers: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<User>>("/users", params as Record<string, unknown>),
  getUser: (id: string) => apiClient.get<HttpResponse<User>>(`/users/${id}`),
  getMe: () => apiClient.get<HttpResponse<User>>("/users/me"),
  createUser: (body: CreateUserDto) => apiClient.post<HttpResponse<User>>("/users", body),
  updateUser: (id: string, body: Partial<User>) => apiClient.put<HttpResponse<User>>(`/users/${id}`, body),
  updateMe: (body: Partial<User>) => apiClient.put<HttpResponse<User>>("/users/me", body),
  updateProfile: (body: Partial<User>) => apiClient.put<HttpResponse<User>>("/users/me/profile", body),
  updatePassword: (body: { oldPassword: string; newPassword: string }) =>
    apiClient.put<User>("/users/me/password", body),
  deleteUser: (id: string) => apiClient.delete<HttpResponse<User>>(`/users/${id}`),
};

export const useGetUsers = (params: PaginationParams) => {
  return useQuery({
    queryKey: userKeys.getUsers(),
    queryFn: () => userApi.getUsers(params),
  });
};

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.getUser(id),
    queryFn: () => userApi.getUser(id),
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: userKeys.getMe(),
    queryFn: () => userApi.getMe(),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateUserDto) => userApi.createUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<User>) => userApi.updateUser(id, body),
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.getUser(id), data);
    },
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<User>) => userApi.updateMe(body),
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.getMe(), data);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<User>) => userApi.updateProfile(body),
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.getMe(), data);
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (body: { oldPassword: string; newPassword: string }) => userApi.updatePassword(body),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
