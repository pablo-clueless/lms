import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateTenantDto, Pagination, PaginationParams, QueryParams, Tenant, UpdateTenantDto } from "@/types";
import { apiClient } from "../api-client";

type UpdateTenant = {
  id: string;
  body: UpdateTenantDto;
};

const keys = {
  all: ["tenants"] as const,
  list: () => [...keys.all, "get-tenants"],
  get: () => [...keys.all, "get-tenant"],
  create: () => [...keys.all, "create-tenant"],
  update: () => [...keys.all, "update-tenant"],
  delete: () => [...keys.all, "delete-tenant"],
  suspend: () => [...keys.all, "suspend-tenant"],
  reactivate: () => [...keys.all, "reactivate-tenant"],
};

interface ListTenantResponse {
  pagination: Pagination;
  tenants: Tenant[];
}

const tenantApi = {
  create: (body: CreateTenantDto) => apiClient.post<Tenant>("/tenants", body),
  list: (params?: PaginationParams) => apiClient.get<ListTenantResponse>("/tenants", params as QueryParams),
  get: (id: string) => apiClient.get<Tenant>(`/tenants/${id}`),
  update: (payload: UpdateTenant) => apiClient.put<Tenant>(`/tenants/${payload.id}`, payload.body),
  delete: (id: string) => apiClient.delete<Tenant>(`/tenants/${id}`),
  suspend: (id: string) => apiClient.get<Tenant>(`/tenants/${id}/suspend`),
  reactivate: (id: string) => apiClient.get<Tenant>(`/tenants/${id}/reactivate`),
};

export function useCreateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: tenantApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useGetTenants(params?: PaginationParams) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => tenantApi.list(params),
  });
}

export function useGetTenant(id: string) {
  return useQuery({
    queryKey: keys.get(),
    queryFn: () => tenantApi.get(id),
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: tenantApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: tenantApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useSuspendTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.suspend(),
    mutationFn: tenantApi.suspend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useReactivateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.reactivate(),
    mutationFn: tenantApi.reactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}
