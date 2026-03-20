export type ApplicationStatus =
  | "REVIEWING"
  | "ADMITTED"
  | "ENROLLED"
  | "ONBOARDED"
  | "GRADUATED"
  | "SUSPENDED"
  | "WITHDRAWN"
  | "EXPELLED";

export type TutorStatus = "PENDING" | "SUSPENDED" | "ACTIVE" | "ON_LEAVE";

export type UserStatus = "ACTIVE" | "INACTIVE";

export type Role = "SUPER_ADMIN" | "ADMIN" | "TUTOR" | "STUDENT";

export interface Profile {
  id: string;
  user_id: string;
  phone: string;
  gender: string;
  date_of_birth?: string;
  avatar: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  tutor_id: string;
  day: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface Tutor {
  id: string;
  user_id: string;
  bio: string;
  headline: string;
  timezone: string;
  years_of_experience: number;
  status: TutorStatus;
  specialities: string[];
  availability?: Availability[];
  created_at: string;
  updated_at: string;
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  file_name: string;
  file_key: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface Application {
  id: string;
  student_id: string;
  cohort_id: string;
  track_id: string;
  status: ApplicationStatus;
  form_data: Record<string, unknown>;
  notes?: string[];
  submitted_at?: string;
  reviewed_at?: string;
  reviewer_id?: string;
  documents?: ApplicationDocument[];
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  student_number: string;
  enrollment_date?: string;
  graduation_date?: string;
  applications?: Application[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  tenant_id?: string;
  role: Role;
  email: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  profile_photo: string;
  phone: string;
  status: UserStatus;
  permissions: string[];
  notification_preferences: NotificationPreferences[];
  last_login_at: Date;
  deactivated_at: Date;
  deactivation_reason: string;
  created_at: Date;
  updated_at: Date;
}

export interface NotificationPreferences {
  event_type: string;
  in_app_enabled: boolean;
  push_enabled: boolean;
  email_enabled: boolean;
}

export interface InviteUserDto {
  email: string;
  role: Role;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: string;
}

export interface UpdateMeDto {
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: string;
  profile_photo: string;
  notification_preferences: NotificationPreferences[];
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone?: string;
  profile_photo?: string;
  status?: UserStatus;
  permissions?: string[];
}

export interface UserQueries {
  role?: Role | (string & {});
  search?: string;
  status?: UserStatus | (string & {});
}
