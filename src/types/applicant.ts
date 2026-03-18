export type ApplicantStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED" | "EXPIRED";

export interface Applicant {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  cohort_id: string;
  track_id: string;
  status: ApplicantStatus;
  form_data?: Record<string, unknown>;
  submitted_at?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationToken {
  id: string;
  applicant_id: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export interface ApplicationParams {
  cohort_id?: string;
  track_id?: string;
}
