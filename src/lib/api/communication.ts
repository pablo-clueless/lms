import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  Announcement,
  Email,
  EmailTemplate,
  HttpResponse,
  Notification,
  PaginatedResponse,
  PaginationParams,
} from "@/types";
import { apiClient } from "../api-client";

interface SendEmailInput {
  subject: string;
  body: string;
  recipient_type?: string;
  recipients?: string[];
  cohort_id?: string;
  track_id?: string;
  cc?: string[];
  bcc?: string[];
  is_html?: boolean;
  template_id?: string;
}

// ─── Notifications ───────────────────────────────────────────────────────────

const notificationKeys = {
  all: ["notifications"] as const,
  getNotifications: () => [...notificationKeys.all, "getNotifications"] as const,
};

const notificationApi = {
  getNotifications: (params: PaginationParams & { read?: boolean }) =>
    apiClient.get<PaginatedResponse<Notification>>("/communications/notifications", { params }),
  createNotification: (data: Partial<Notification>) =>
    apiClient.post<HttpResponse<Notification>>("/communications/notifications", data),
  markAsRead: (id: string) => apiClient.put<HttpResponse<unknown>>(`/communications/notifications/${id}/read`, {}),
  markAllAsRead: () => apiClient.put<HttpResponse<unknown>>("/communications/notifications/read-all", {}),
};

export const useGetNotifications = (params: PaginationParams & { read?: boolean }) =>
  useQuery({ queryKey: notificationKeys.getNotifications(), queryFn: () => notificationApi.getNotifications(params) });

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Notification>) => notificationApi.createNotification(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.getNotifications() }),
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.getNotifications() }),
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.getNotifications() }),
  });
};

// ─── Emails ──────────────────────────────────────────────────────────────────

const emailApi = {
  sendEmail: (data: SendEmailInput) => apiClient.post<HttpResponse<Email>>("/communications/emails", data),
};

export const useSendEmail = () => useMutation({ mutationFn: (data: SendEmailInput) => emailApi.sendEmail(data) });

// ─── Announcements ───────────────────────────────────────────────────────────

const announcementKeys = {
  all: ["announcements"] as const,
  getAnnouncements: () => [...announcementKeys.all, "getAnnouncements"] as const,
};

const announcementApi = {
  getAnnouncements: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<Announcement>>("/communications/announcements", { params }),
  createAnnouncement: (data: Partial<Announcement>) =>
    apiClient.post<HttpResponse<Announcement>>("/communications/announcements", data),
};

export const useGetAnnouncements = (params: PaginationParams) =>
  useQuery({ queryKey: announcementKeys.getAnnouncements(), queryFn: () => announcementApi.getAnnouncements(params) });

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Announcement>) => announcementApi.createAnnouncement(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: announcementKeys.getAnnouncements() }),
  });
};

// ─── Email Templates ─────────────────────────────────────────────────────────

const emailTemplateKeys = {
  all: ["email-templates"] as const,
  getEmailTemplates: () => [...emailTemplateKeys.all, "getEmailTemplates"] as const,
  getEmailTemplate: (id: string) => [...emailTemplateKeys.all, "getEmailTemplate", id] as const,
};

const emailTemplateApi = {
  getEmailTemplates: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<EmailTemplate>>("/email-templates", { params }),
  getEmailTemplate: (id: string) => apiClient.get<HttpResponse<EmailTemplate>>(`/email-templates/${id}`),
  createEmailTemplate: (data: Partial<EmailTemplate>) =>
    apiClient.post<HttpResponse<EmailTemplate>>("/email-templates", data),
  updateEmailTemplate: (id: string, data: Partial<EmailTemplate>) =>
    apiClient.put<HttpResponse<EmailTemplate>>(`/email-templates/${id}`, data),
  deleteEmailTemplate: (id: string) => apiClient.delete<HttpResponse<unknown>>(`/email-templates/${id}`),
  previewEmailTemplate: (id: string, variables: Record<string, string>) =>
    apiClient.post<HttpResponse<{ subject: string; body: string }>>(`/email-templates/${id}/preview`, { variables }),
};

export const useGetEmailTemplates = (params: PaginationParams) =>
  useQuery({
    queryKey: emailTemplateKeys.getEmailTemplates(),
    queryFn: () => emailTemplateApi.getEmailTemplates(params),
  });

export const useGetEmailTemplate = (id: string) =>
  useQuery({ queryKey: emailTemplateKeys.getEmailTemplate(id), queryFn: () => emailTemplateApi.getEmailTemplate(id) });

export const useCreateEmailTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<EmailTemplate>) => emailTemplateApi.createEmailTemplate(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: emailTemplateKeys.getEmailTemplates() }),
  });
};

export const useUpdateEmailTemplate = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<EmailTemplate>) => emailTemplateApi.updateEmailTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailTemplateKeys.getEmailTemplate(id) });
      queryClient.invalidateQueries({ queryKey: emailTemplateKeys.getEmailTemplates() });
    },
  });
};

export const useDeleteEmailTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emailTemplateApi.deleteEmailTemplate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: emailTemplateKeys.getEmailTemplates() }),
  });
};

export const usePreviewEmailTemplate = (id: string) =>
  useMutation({
    mutationFn: (variables: Record<string, string>) => emailTemplateApi.previewEmailTemplate(id, variables),
  });
