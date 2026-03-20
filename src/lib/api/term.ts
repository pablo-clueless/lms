import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateTermDto, Term } from "@/types";
import { apiClient } from "../api-client";

type UpdateTerm = {
  sessionId: string;
  termId: string;
  body: Partial<CreateTermDto>;
};

type TermParams = {
  sessionId: string;
  termId: string;
};

const keys = {
  all: ["terms"] as const,
  list: (sessionId: string) => [...keys.all, "get-terms", sessionId],
  get: (sessionId: string, termId: string) => [...keys.all, "get-term", sessionId, termId],
  create: () => [...keys.all, "create-term"],
  update: () => [...keys.all, "update-term"],
  delete: () => [...keys.all, "delete-term"],
  activate: () => [...keys.all, "activate-term"],
};

interface ListTermResponse {
  data: Term[];
}

const termApi = {
  create: (sessionId: string, body: CreateTermDto) => apiClient.post<Term>(`/sessions/${sessionId}/terms`, body),
  list: (sessionId: string) => apiClient.get<ListTermResponse>(`/sessions/${sessionId}/terms`),
  get: (params: TermParams) => apiClient.get<Term>(`/sessions/${params.sessionId}/terms/${params.termId}`),
  update: (payload: UpdateTerm) =>
    apiClient.put<Term>(`/sessions/${payload.sessionId}/terms/${payload.termId}`, payload.body),
  delete: (params: TermParams) => apiClient.delete<void>(`/sessions/${params.sessionId}/terms/${params.termId}`),
  activate: (params: TermParams) =>
    apiClient.post<Term>(`/sessions/${params.sessionId}/terms/${params.termId}/activate`),
};

export function useCreateTerm(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: (body: CreateTermDto) => termApi.create(sessionId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list(sessionId) });
    },
  });
}

export function useGetTerms(sessionId: string) {
  return useQuery({
    queryKey: keys.list(sessionId),
    queryFn: () => termApi.list(sessionId),
    enabled: !!sessionId,
  });
}

export function useGetTerm(sessionId: string, termId: string) {
  return useQuery({
    queryKey: keys.get(sessionId, termId),
    queryFn: () => termApi.get({ sessionId, termId }),
    enabled: !!sessionId && !!termId,
  });
}

export function useUpdateTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: termApi.update,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: keys.list(variables.sessionId) });
    },
  });
}

export function useDeleteTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: termApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: keys.list(variables.sessionId) });
    },
  });
}

export function useActivateTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.activate(),
    mutationFn: termApi.activate,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: keys.list(variables.sessionId) });
    },
  });
}
