export interface AuditLog {
  id: string;
  tenant_id?: string;
  user_id?: string;
  action: string;
  resource: string;
  resource_id?: string;
  method: string;
  path: string;
  status_code: number;
  ip_address?: string;
  user_agent?: string;
  request_body?: Record<string, unknown>;
  response_summary?: string;
  duration_ms: number;
  created_at: string;
  user_email?: string;
  user_name?: string;
  tenant_name?: string;
}

export interface AuditLogFilter {
  tenant_id?: string;
  user_id?: string;
  action?: string;
  resource?: string;
  resource_id?: string;
  method?: string;
  start_date?: string;
  end_date?: string;
  ip_address?: string;
  min_status?: number;
  max_status?: number;
  page?: number;
  per_page?: number;
}

export interface AuditLogStats {
  total_logs: number;
  logs_by_action: {
    CREATE: number;
    READ: number;
  };
  logs_by_resource: {
    "/api/v1/audit-logs": number;
    "/api/v1/audit-logs/stats": number;
    "/api/v1/auth/signin": number;
    "/api/v1/dashboard": number;
    "/api/v1/permissions": number;
    "/api/v1/tenants": number;
    "/api/v1/users": number;
  };
  logs_by_status_code: {
    "200": number;
    "500": number;
  };
  avg_duration_ms: number;
  unique_users: number;
  unique_ips: number;
}
