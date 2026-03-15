export type ModuleProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export type SessionType = "LIVE" | "RECORDED" | "OFFICE_HOURS";

export interface Progress {
  id: string;
  student_id: string;
  course_id: string;
  cohort_id: string;
  completed_modules: number;
  total_modules: number;
  percentage: number;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

export interface ModuleProgress {
  id: string;
  student_id: string;
  module_id: string;
  status: ModuleProgressStatus;
  progress: number;
  started_at?: string;
  completed_at?: string;
  time_spent: number;
  created_at: string;
  updated_at: string;
}

export interface ResourceProgress {
  id: string;
  student_id: string;
  resource_id: string;
  completed: boolean;
  progress: number;
  time_spent: number;
  last_position: number;
  accessed_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  session_id: string;
  status: AttendanceStatus;
  check_in_at?: string;
  check_out_at?: string;
  notes?: string;
  marked_by: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  course_id: string;
  cohort_id: string;
  tutor_id: string;
  title: string;
  description: string;
  type: SessionType;
  meeting_link?: string;
  start_time: string;
  end_time: string;
  attendance?: Attendance[];
  created_at: string;
  updated_at: string;
}
