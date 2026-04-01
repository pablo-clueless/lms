import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateEmailDto, Email, Pagination, QueryParams } from "@/types";
import { apiClient } from "../api-client";

interface EmailQueries {
  limit?: number;
  page?: number;
  status?: "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "FAILED" | "CANCELLED" | (string & {});
}

interface ScheduleEmailDto {
  scheduled_for: string;
}

const keys = {
  all: ["communications"] as const,
  emails: () => [...keys.all, "emails"],
  email: (id: string) => [...keys.all, "email", id],
  compose: () => [...keys.all, "compose-email"],
  send: () => [...keys.all, "send-email"],
  schedule: () => [...keys.all, "schedule-email"],
  delete: () => [...keys.all, "delete-email"],
};

interface ListEmailResponse {
  data: Email[];
  pagination: Pagination;
}

const communicationApi = {
  listEmails: (params?: EmailQueries) =>
    apiClient.get<ListEmailResponse>("/communications/emails", params as QueryParams),
  getEmail: (id: string) => apiClient.get<Email>(`/communications/emails/${id}`),
  compose: (body: CreateEmailDto) => apiClient.post<Email>("/communications/emails", body),
  send: (id: string) => apiClient.post<Email>(`/communications/emails/${id}/send`),
  schedule: (id: string, body: ScheduleEmailDto) =>
    apiClient.post<Email>(`/communications/emails/${id}/schedule`, body),
  delete: (id: string) => apiClient.delete<void>(`/communications/emails/${id}`),
};

export function useGetEmails(params?: EmailQueries) {
  return useQuery({
    queryKey: keys.emails(),
    queryFn: () => communicationApi.listEmails(params),
  });
}

export function useGetEmail(id: string) {
  return useQuery({
    queryKey: keys.email(id),
    queryFn: () => communicationApi.getEmail(id),
    enabled: !!id,
  });
}

export function useComposeEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.compose(),
    mutationFn: communicationApi.compose,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.emails() });
    },
  });
}

export function useSendEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.send(),
    mutationFn: communicationApi.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.emails() });
    },
  });
}

export function useScheduleEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.schedule(),
    mutationFn: ({ id, body }: { id: string; body: ScheduleEmailDto }) => communicationApi.schedule(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.emails() });
    },
  });
}

export function useDeleteEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: communicationApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.emails() });
    },
  });
}
