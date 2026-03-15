export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "DROPPED" | "FAILED";

export type ResourceType = "VIDEO" | "PDF" | "LINK" | "DOCUMENT" | "IMAGE" | "AUDIO";

export interface Resource {
  id: string;
  module_id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  file_key: string;
  file_size: number;
  duration: number;
  order: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  order: number;
  is_published: boolean;
  requires_quiz: boolean;
  quiz_id?: string;
  resources?: Resource[];
  created_at: string;
  updated_at: string;
}

export interface TutorCourse {
  id: string;
  course_id: string;
  tutor_id: string;
  is_primary: boolean;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  cohort_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  completed_at?: string;
  progress: number;
  final_grade?: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  tenant_id: string;
  track_id: string;
  title: string;
  code: string;
  description: string;
  thumbnail: string;
  status: CourseStatus;
  pass_threshold: number;
  duration: number;
  order: number;
  modules?: Module[];
  tutor_assignments?: TutorCourse[];
  student_enrollments?: Enrollment[];
  created_at: string;
  updated_at: string;
}
