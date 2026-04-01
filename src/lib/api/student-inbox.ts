import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Pagination, QueryParams, StudentInboxEmail } from "@/types";
import { apiClient } from "../api-client";

interface StudentInboxQueries {
  limit?: number;
  page?: number;
  unread_only?: boolean;
}

const keys = {
  all: ["student-inbox"] as const,
  list: () => [...keys.all, "list"],
  unreadCount: () => [...keys.all, "unread-count"],
  markRead: () => [...keys.all, "mark-read"],
  markAllRead: () => [...keys.all, "mark-all-read"],
};

interface StudentInboxResponse {
  data: StudentInboxEmail[];
  pagination: Pagination;
  unread_count: number;
}

interface UnreadCountResponse {
  unread_count: number;
}

interface MarkReadResponse {
  message: string;
}

const studentInboxApi = {
  list: (params?: StudentInboxQueries) => apiClient.get<StudentInboxResponse>("/student/inbox", params as QueryParams),
  getUnreadCount: () => apiClient.get<UnreadCountResponse>("/student/inbox/unread-count"),
  markAsRead: (id: string) => apiClient.post<MarkReadResponse>(`/student/inbox/${id}/read`),
  markAllAsRead: () => apiClient.post<MarkReadResponse>("/student/inbox/mark-all-read"),
};

export function useGetStudentInbox(params?: StudentInboxQueries) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => studentInboxApi.list(params),
  });
}

export function useGetStudentInboxUnreadCount() {
  return useQuery({
    queryKey: keys.unreadCount(),
    queryFn: () => studentInboxApi.getUnreadCount(),
  });
}

export function useMarkStudentEmailAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.markRead(),
    mutationFn: studentInboxApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
      queryClient.invalidateQueries({ queryKey: keys.unreadCount() });
    },
  });
}

export function useMarkAllStudentEmailsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.markAllRead(),
    mutationFn: studentInboxApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
      queryClient.invalidateQueries({ queryKey: keys.unreadCount() });
    },
  });
}
