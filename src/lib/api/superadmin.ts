import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Pagination, PaginationParams, QueryParams, User, UpdateUserDto } from "@/types";
import { apiClient } from "../api-client";

interface CreateSuperAdminDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
}

type UpdateSuperAdmin = {
  id: string;
  body: UpdateUserDto;
};

const keys = {
  all: ["superadmins"] as const,
  list: () => [...keys.all, "get-superadmins"],
  get: (id: string) => [...keys.all, "get-superadmin", id],
  create: () => [...keys.all, "create-superadmin"],
  update: () => [...keys.all, "update-superadmin"],
  delete: () => [...keys.all, "delete-superadmin"],
};

interface ListSuperAdminResponse {
  pagination: Pagination;
  users: User[];
}

const superAdminApi = {
  list: (params?: PaginationParams) => apiClient.get<ListSuperAdminResponse>("/superadmins", params as QueryParams),
  get: (id: string) => apiClient.get<User>(`/superadmins/${id}`),
  create: (body: CreateSuperAdminDto) => apiClient.post<User>("/superadmins", body),
  update: (payload: UpdateSuperAdmin) => apiClient.put<User>(`/superadmins/${payload.id}`, payload.body),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/superadmins/${id}`),
};

export function useGetSuperAdmins(params?: PaginationParams) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => superAdminApi.list(params),
  });
}

export function useGetSuperAdmin(id: string) {
  return useQuery({
    queryKey: keys.get(id),
    queryFn: () => superAdminApi.get(id),
    enabled: !!id,
  });
}

export function useCreateSuperAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: superAdminApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useUpdateSuperAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: superAdminApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useDeleteSuperAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: superAdminApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}
