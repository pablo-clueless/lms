import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateSessionDto, Pagination, PaginationParams, QueryParams, Session, UpdateSessionDto } from "@/types";
import { apiClient } from "../api-client";

type UpdateSession = {
  id: string;
  body: UpdateSessionDto;
};

const keys = {
  all: ["sessions"] as const,
  list: () => [...keys.all, "get-sessions"],
  get: () => [...keys.all, "get-session"],
  create: () => [...keys.all, "create-session"],
  update: () => [...keys.all, "update-session"],
  delete: () => [...keys.all, "delete-session"],
  activate: () => [...keys.all, "activate-session"],
};

interface ListSessionResponse {
  pagination: Pagination;
  sessions: Session[];
}

const sessionApi = {
  create: (body: CreateSessionDto) => apiClient.post<Session>("/sessions", body),
  list: (params?: PaginationParams) => apiClient.get<ListSessionResponse>("/sessions", params as QueryParams),
  get: (id: string) => apiClient.get<Session>(`/sessions/${id}`),
  update: (payload: UpdateSession) => apiClient.put<Session>(`/sessions/${payload.id}`, payload.body),
  delete: (id: string) => apiClient.delete<Session>(`/sessions/${id}`),
  activate: (id: string) => apiClient.get<Session>(`/sessions/${id}/activate`),
};

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: sessionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useGetSessions(params?: PaginationParams) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => sessionApi.list(params),
  });
}

export function useGetSession(id: string) {
  return useQuery({
    queryKey: keys.get(),
    queryFn: () => sessionApi.get(id),
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: sessionApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: sessionApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useActivateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.activate(),
    mutationFn: sessionApi.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}
