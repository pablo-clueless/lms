import { useQuery } from "@tanstack/react-query";

import type { AuditLog, AuditLogFilter, AuditLogStats, HttpResponse, PaginatedResponse } from "@/types";
import { apiClient } from "../api-client";

const auditLogKeys = {
  all: ["audit-logs"] as const,
  getAuditLogs: () => [...auditLogKeys.all, "getAuditLogs"] as const,
  getAuditLog: (id: string) => [...auditLogKeys.all, "getAuditLog", id] as const,
  getAuditLogStats: () => [...auditLogKeys.all, "getAuditLogStats"] as const,
};

const auditLogApi = {
  getAuditLogs: (params: AuditLogFilter) =>
    apiClient.get<PaginatedResponse<AuditLog>>("/audit-logs", params as Record<string, unknown>),
  getAuditLog: (id: string) => apiClient.get<HttpResponse<AuditLog>>(`/audit-logs/${id}`),
  getAuditLogStats: () => apiClient.get<HttpResponse<AuditLogStats>>("/audit-logs/stats"),
};

export const useGetAuditLogs = (params: AuditLogFilter) => {
  return useQuery({
    queryKey: [...auditLogKeys.getAuditLogs(), params],
    queryFn: () => auditLogApi.getAuditLogs(params),
  });
};

export const useGetAuditLog = (id: string) => {
  return useQuery({
    queryKey: auditLogKeys.getAuditLog(id),
    queryFn: () => auditLogApi.getAuditLog(id),
    enabled: !!id,
  });
};

export const useGetAuditLogStats = () => {
  return useQuery({
    queryKey: auditLogKeys.getAuditLogStats(),
    queryFn: () => auditLogApi.getAuditLogStats(),
  });
};
