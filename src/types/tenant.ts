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
  slug: string;
  description: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  settings: string;
  admin_name: string;
  admin_email: string;
  admin_password: string;
}
