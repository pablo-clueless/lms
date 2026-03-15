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
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  last_login_at?: string;
  permissions?: string[];
  profile?: Profile;
  tutor?: Tutor;
  student?: Student;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: Role;
  status?: UserStatus;
}

export interface UpdateUserProfileDto {
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  avatar?: string;
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}
