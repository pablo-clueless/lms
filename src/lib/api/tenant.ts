import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { HttpResponse, PaginatedResponse, PaginationParams, Tenant } from "@/types";
import { apiClient } from "../api-client";
import type { CreateTenantDto } from "@/types/tenant";

const tenantKeys = {
  all: ["tenants"] as const,
  getTenants: () => [...tenantKeys.all, "getTenants"] as const,
  getTenant: (id: string) => [...tenantKeys.all, "getTenant", id] as const,
  createTenant: () => [...tenantKeys.all, "createTenant"] as const,
  updateTenant: (id: string) => [...tenantKeys.all, "updateTenant", id] as const,
  deleteTenant: (id: string) => [...tenantKeys.all, "deleteTenant", id] as const,
};

const tenantApi = {
  getTenants: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<Tenant>>("/tenants", params as Record<string, string>),
  getTenant: (id: string) => apiClient.get<HttpResponse<Tenant>>(`/tenants/${id}`),
  createTenant: (data: CreateTenantDto) => apiClient.post<HttpResponse<Tenant>>("/tenants", data),
  updateTenant: (id: string, data: Partial<Tenant>) => apiClient.put<HttpResponse<Tenant>>(`/tenants/${id}`, data),
  deleteTenant: (id: string) => apiClient.delete<HttpResponse<unknown>>(`/tenants/${id}`),
};

export const useGetTenants = (params: PaginationParams) => {
  return useQuery({
    queryKey: tenantKeys.getTenants(),
    queryFn: () => tenantApi.getTenants(params),
  });
};

export const useGetTenant = (id: string) => {
  return useQuery({
    queryKey: tenantKeys.getTenant(id),
    queryFn: () => tenantApi.getTenant(id),
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: tenantKeys.createTenant(),
    mutationFn: (data: CreateTenantDto) => tenantApi.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.getTenants() });
    },
  });
};

export const useUpdateTenant = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: tenantKeys.updateTenant(id),
    mutationFn: (data: Partial<Tenant>) => tenantApi.updateTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.getTenant(id) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.getTenants() });
    },
  });
};
