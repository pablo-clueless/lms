import { useQuery } from "@tanstack/react-query";

import type { AuditLog, Pagination, PaginationParams, QueryParams } from "@/types";
import { apiClient } from "../api-client";

interface AuditLogQueries {
  user_id?: string;
  action?: string;
  resource_type?: string;
  from?: string;
  to?: string;
}

interface ResourceAuditQueries {
  resource_type: string;
  resource_id: string;
}

const keys = {
  all: ["audit"] as const,
  logs: () => [...keys.all, "logs"],
  log: (id: string) => [...keys.all, "log", id],
  resource: () => [...keys.all, "resource"],
};

interface ListAuditLogResponse {
  data: AuditLog[];
  pagination: Pagination;
}

const auditApi = {
  list: (params?: PaginationParams & AuditLogQueries) =>
    apiClient.get<ListAuditLogResponse>("/audit/logs", params as QueryParams),
  get: (id: string) => apiClient.get<AuditLog>(`/audit/logs/${id}`),
  getResourceTrail: (params: ResourceAuditQueries) =>
    apiClient.get<{ data: AuditLog[] }>("/audit/logs/resource", params as unknown as QueryParams),
};

export function useGetAuditLogs(params?: PaginationParams & AuditLogQueries) {
  return useQuery({
    queryKey: keys.logs(),
    queryFn: () => auditApi.list(params),
  });
}

export function useGetAuditLog(id: string) {
  return useQuery({
    queryKey: keys.log(id),
    queryFn: () => auditApi.get(id),
    enabled: !!id,
  });
}

export function useGetResourceAuditTrail(params: ResourceAuditQueries) {
  return useQuery({
    queryKey: keys.resource(),
    queryFn: () => auditApi.getResourceTrail(params),
    enabled: !!params.resource_type && !!params.resource_id,
  });
}
