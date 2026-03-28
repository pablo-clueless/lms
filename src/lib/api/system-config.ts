import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../api-client";
import type {
  ConfigType,
  ConfigValue,
  CreateSystemConfigDto,
  Pagination,
  QueryParams,
  SystemConfig,
  SystemConfigQueries,
} from "@/types";

interface BulkUpdateConfigDto {
  key: string;
  value: ConfigValue;
}

type UpdateSystemConfig = {
  id: string;
  body: UpdateSystemConfig;
};

const keys = {
  all: ["system-configs"] as const,
  list: () => [...keys.all, "get-configs"],
  get: (id: string) => [...keys.all, "get-config", id],
  getByKey: (key: string) => [...keys.all, "get-config-by-key", key],
  categories: () => [...keys.all, "categories"],
  byCategory: (category: ConfigType) => [...keys.all, "by-category", category],
  create: () => [...keys.all, "create-config"],
  update: () => [...keys.all, "update-config"],
  bulkUpdate: () => [...keys.all, "bulk-update"],
  delete: () => [...keys.all, "delete-config"],
};

interface ListSystemConfigResponse {
  configs: SystemConfig[];
  pagination: Pagination;
}

interface CategoriesResponse {
  categories: string[];
}

interface CategoryConfigsResponse {
  category: string;
  configs: SystemConfig[];
}

interface BulkUpdateResponse {
  message: string;
  count: number;
}

const systemConfigApi = {
  list: (params?: SystemConfigQueries) =>
    apiClient.get<ListSystemConfigResponse>("/system-configs", params as QueryParams),
  get: (id: string) => apiClient.get<SystemConfig>(`/system-configs/${id}`),
  getByKey: (key: string) => apiClient.get<SystemConfig>(`/system-configs/key/${key}`),
  getCategories: () => apiClient.get<CategoriesResponse>("/system-configs/categories"),
  getByCategory: (category: ConfigType, params?: { mask_sensitive?: boolean }) =>
    apiClient.get<CategoryConfigsResponse>(`/system-configs/category/${category}`, params as QueryParams),
  create: (body: CreateSystemConfigDto) => apiClient.post<SystemConfig>("/system-configs", body),
  update: (payload: UpdateSystemConfig) => apiClient.put<SystemConfig>(`/system-configs/${payload.id}`, payload.body),
  bulkUpdate: (configs: BulkUpdateConfigDto[]) => apiClient.put<BulkUpdateResponse>("/system-configs/bulk", configs),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/system-configs/${id}`),
};

export function useGetSystemConfigs(params?: SystemConfigQueries) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => systemConfigApi.list(params),
  });
}

export function useGetSystemConfig(id: string) {
  return useQuery({
    queryKey: keys.get(id),
    queryFn: () => systemConfigApi.get(id),
    enabled: !!id,
  });
}

export function useGetSystemConfigByKey(key: string) {
  return useQuery({
    queryKey: keys.getByKey(key),
    queryFn: () => systemConfigApi.getByKey(key),
    enabled: !!key,
  });
}

export function useGetConfigCategories() {
  return useQuery({
    queryKey: keys.categories(),
    queryFn: () => systemConfigApi.getCategories(),
  });
}

export function useGetConfigsByCategory(category: ConfigType, params?: { mask_sensitive?: boolean }) {
  return useQuery({
    queryKey: keys.byCategory(category),
    queryFn: () => systemConfigApi.getByCategory(category, params),
    enabled: !!category,
  });
}

export function useCreateSystemConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: systemConfigApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useUpdateSystemConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: systemConfigApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useBulkUpdateConfigs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.bulkUpdate(),
    mutationFn: systemConfigApi.bulkUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useDeleteSystemConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: systemConfigApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}
