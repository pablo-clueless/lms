import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Class, CreateClassDto, Pagination, PaginationParams, QueryParams } from "@/types";
import { apiClient } from "../api-client";

type UpdateClass = {
  id: string;
  body: Partial<CreateClassDto>;
};

const keys = {
  all: ["classes"] as const,
  list: () => [...keys.all, "get-classes"],
  get: (id: string) => [...keys.all, "get-class", id],
  create: () => [...keys.all, "create-class"],
  update: () => [...keys.all, "update-class"],
  delete: () => [...keys.all, "delete-class"],
};

interface ListClassResponse {
  pagination: Pagination;
  data: Class[];
}

const classApi = {
  create: (body: CreateClassDto) => apiClient.post<Class>("/classes", body),
  list: (params?: PaginationParams) => apiClient.get<ListClassResponse>("/classes", params as QueryParams),
  get: (id: string) => apiClient.get<Class>(`/classes/${id}`),
  update: (payload: UpdateClass) => apiClient.put<Class>(`/classes/${payload.id}`, payload.body),
  delete: (id: string) => apiClient.delete<void>(`/classes/${id}`),
};

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: classApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useGetClasses(params?: PaginationParams) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => classApi.list(params),
  });
}

export function useGetClass(id: string) {
  return useQuery({
    queryKey: keys.get(id),
    queryFn: () => classApi.get(id),
    enabled: !!id,
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: classApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: classApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}
