import type { GradeWeighting } from "./course";

export type TenantStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface TenantConfiguration {
  timezone: string;
  school_level: string;
  period_duration: number;
  daily_period_limit: number;
  max_periods_per_week: Record<string, number>;
  grade_weighting: {
    continuous_assessment: number;
    examination: number;
  };
  attendance_threshold: number;
  invoice_grace_period: number;
  suspension_threshold: number;
  branding_assets: Record<string, string>;
  communication_prefs: Record<string, boolean>;
  supported_classes: string[];
  notification_settings: Record<string, boolean>;
  meeting_recording_retention: number;
}

export interface Tenant {
  id: string;
  name: string;
  school_type: string;
  contact_email: string;
  address: string;
  logo: string;
  status: TenantStatus;
  configuration: TenantConfiguration;
  billing_contact: {
    name: string;
    email: string;
    phone: string;
  };
  suspension_reason: string;
  principal_admin_id: string;
  created_at: Date;
  updated_at: Date;
  suspended_at: Date;
}

export interface CreateTenantDto {
  name: string;
  school_type: "PRIMARY" | "SECONDARY" | (string & {});
  contact_email: string;
  address: string;
  logo: string;
  billing_contact: {
    name: string;
    email: string;
    phone: string;
  };
  principal_admin: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
}

export interface UpdateTenantDto {
  name?: string;
  contact_email?: string;
  address?: string;
  logo?: string;
  configuration?: {
    timezone?: string;
    school_level?: string;
    period_duration?: number;
    daily_period_limit?: number;
    max_periods_per_week?: Record<string, number>;
    grade_weighting?: GradeWeighting;
    attendance_threshold?: number;
    invoice_grace_period?: number;
    suspension_threshold?: number;
    branding_assets?: Record<string, string>;
    communication_prefs?: Record<string, boolean>;
    supported_classes?: string[];
    notification_settings?: Record<string, boolean>;
    meeting_recording_retention?: number;
  };
  billing_contact?: {
    name: string;
    email: string;
    phone: string;
  };
}
