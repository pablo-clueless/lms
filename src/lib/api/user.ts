import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { PaginatedResponse, PaginationParams, User } from "@/types";
import { apiClient } from "../api-client";

const userKeys = {
  all: ["users"] as const,
  getUsers: () => [...userKeys.all, "getUsers"] as const,
  getUser: (id: string) => [...userKeys.all, "getUser", id] as const,
  getMe: () => [...userKeys.all, "getMe"] as const,
  updateUser: () => [...userKeys.all, "updateUser"] as const,
  updateMe: () => [...userKeys.all, "updateMe"] as const,
  updateProfile: () => [...userKeys.all, "updateProfile"] as const,
  updatePassword: () => [...userKeys.all, "updatePassword"] as const,
  deleteUser: () => [...userKeys.all, "deleteUser"] as const,
};

const userApi = {
  getUsers: (params: PaginationParams) => apiClient.get<PaginatedResponse<User>>("/users", { params }),
  getUser: (id: string) => apiClient.get<User>(`/users/${id}`),
  getMe: () => apiClient.get<User>("/users/me"),
  updateUser: (id: string, body: Partial<User>) => apiClient.put<User>(`/users/${id}`, body),
  updateMe: (body: Partial<User>) => apiClient.put<User>("/users/me", body),
  updateProfile: (body: Partial<User>) => apiClient.put<User>("/users/me/profile", body),
  updatePassword: (body: { oldPassword: string; newPassword: string }) =>
    apiClient.put<User>("/users/me/password", body),
  deleteUser: (id: string) => apiClient.delete<User>(`/users/${id}`),
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

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<User>) => userApi.updateUser(id, body),
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.getUser(id), data);
    },
  });
};
