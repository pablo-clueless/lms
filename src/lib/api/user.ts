import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../api-client";
import type {
  InviteUserDto,
  PaginationParams,
  QueryParams,
  User,
  UpdateMeDto,
  UpdateUserDto,
  UserQueries,
  Pagination,
} from "@/types";

type UpdateUser = {
  id: string;
  body: UpdateUserDto;
};

const keys = {
  all: ["users"] as const,
  invite: () => [...keys.all, "invite-user"],
  list: (params?: PaginationParams & UserQueries) => [...keys.all, "get-users", params],
  get: (id: string) => [...keys.all, "get-user", id],
  getMe: () => [...keys.all, "get-me"],
  update: () => [...keys.all, "update-user"],
  updateMe: () => [...keys.all, "update-me"],
  deactivate: () => [...keys.all, "deactivate-user"],
};

interface ListUserResponse {
  pagination: Pagination;
  users: User[];
}

const userApi = {
  list: (params?: PaginationParams & UserQueries) => apiClient.get<ListUserResponse>("/users", params as QueryParams),
  get: (id: string) => apiClient.get<User>(`/users/${id}`),
  getMe: () => apiClient.get<User>("/users/me"),
  update: (payload: UpdateUser) => apiClient.put<User>(`/users/${payload.id}`, payload.body),
  updateMe: (payload: UpdateMeDto) => apiClient.put<User>("/users/me", payload),
  invite: (payload: InviteUserDto) => apiClient.post<User>("/users/invite", payload),
  deactivate: (id: string) => apiClient.post(`/users/${id}/deactivate`),
};

export function useGetUsers(params: PaginationParams & UserQueries) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => userApi.list(params),
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.invite(),
    mutationFn: userApi.invite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...keys.all, "get-users"] });
    },
  });
}

export function useGetUser(id: string) {
  return useQuery({
    queryKey: keys.get(id),
    queryFn: () => userApi.get(id),
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: keys.getMe(),
    queryFn: () => userApi.getMe(),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: userApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...keys.all, "get-users"] });
    },
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.updateMe(),
    mutationFn: userApi.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.getMe() });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.deactivate(),
    mutationFn: userApi.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...keys.all, "get-users"] });
    },
  });
}
