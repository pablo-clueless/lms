import type { Course } from "./course";
import type { StudentEnrollment } from "./enrollment";
import type { Session } from "./session";
import type { Tenant } from "./tenant";

export interface SuperAdminDashboardResponse {
  role: "SUPER_ADMIN";
  dashboard: {
    total_tenants: number;
    active_tenants: number;
    suspended_tenants: number;
    total_users: number;
    users_by_role: {
      ADMIN: number;
      STUDENT: number;
      SUPER_ADMIN: number;
      TUTOR: number;
    };
    recent_tenants: Tenant[];
    user_growth: {
      count: number;
      date: string;
    }[];
    system_metrics: {
      uptime_seconds: number;
      uptime_formatted: string;
      total_requests: number;
      error_count: number;
      error_rate: number;
      avg_latency_ms: number;
      active_connections: number;
    };
    db_stats: {
      max_open_connections: number;
      open_connections: number;
      in_use: number;
      idle: number;
      wait_count: number;
      wait_duration_ms: number;
    };
    billing_metrics: {
      total_revenue: number;
      mrr: number;
      upcoming_payments: number;
      late_payments: number;
      upcoming_count: number;
      late_count: number;
      recent_invoices: [];
    };
  };
}

export interface QuickActions {
  label: string;
  action: string;
  icon: string;
}

export interface AdminDashboardResponse {
  role: "ADMIN";
  dashboard: {
    tenant_info: Tenant;
    total_users: number;
    users_by_role: {
      ADMIN: number;
      STUDENT: number;
      TUTOR: number;
    };
    total_classes: number;
    total_courses: number;
    total_sessions: number;
    active_session: Session;
    total_enrollments: number;
    active_enrollments: number;
  };
}

export interface TutorDashboardResponse {
  dashboard: {
    total_courses: number;
    courses: Course[];
    total_students: number;
    active_session: Session;
  };
  role: "TUTOR";
}

export interface StudentDashboardResponse {
  dashboard: {
    total_enrollments: number;
    enrollments: StudentEnrollment[];
    total_courses: number;
    courses: Course[];
    active_session: Session;
  };
  role: "STUDENT";
}
