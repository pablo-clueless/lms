import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateNotificationDto, Notification, Pagination, QueryParams } from "@/types";
import { apiClient } from "../api-client";

interface NotificationQueries {
  unread_only?: boolean;
  cursor?: string;
  limit?: number;
}

const keys = {
  all: ["notifications"] as const,
  list: () => [...keys.all, "get-notifications"],
  unreadCount: () => [...keys.all, "unread-count"],
  create: () => [...keys.all, "create"],
  markRead: () => [...keys.all, "mark-read"],
  markAllRead: () => [...keys.all, "mark-all-read"],
};

interface ListNotificationResponse {
  data: Notification[];
  pagination: Pagination;
  unread_count: number;
}

interface UnreadCountResponse {
  unread_count: number;
}

interface MarkReadResponse {
  message: string;
}

interface CreateNotificationResponse {
  message: string;
  notification_count: number;
}

const notificationApi = {
  list: (params?: NotificationQueries) =>
    apiClient.get<ListNotificationResponse>("/notifications", params as QueryParams),
  getUnreadCount: () => apiClient.get<UnreadCountResponse>("/notifications/unread-count"),
  create: (body: CreateNotificationDto) => apiClient.post<CreateNotificationResponse>("/notifications/broadcast", body),
  markAsRead: (id: string) => apiClient.post<MarkReadResponse>(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.post<MarkReadResponse>("/notifications/mark-all-read"),
};

export function useGetNotifications(params?: NotificationQueries) {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => notificationApi.list(params),
  });
}

export function useGetUnreadCount() {
  return useQuery({
    queryKey: keys.unreadCount(),
    queryFn: () => notificationApi.getUnreadCount(),
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: notificationApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.markRead(),
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
      queryClient.invalidateQueries({ queryKey: keys.unreadCount() });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: keys.markAllRead(),
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
      queryClient.invalidateQueries({ queryKey: keys.unreadCount() });
    },
  });
}
