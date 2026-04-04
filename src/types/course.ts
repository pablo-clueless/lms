export type CourseContentType = "TEXT" | "VIDEO" | "IMAGE" | "AUDIO" | "DOCUMENT" | "LINK";
export type CourseStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface GradeWeighting {
  continuous_assessment: number;
  examination: number;
}

export interface Course {
  id: string;
  tenant_id: string;
  session_id: string;
  class_id: string;
  term_id: string;
  name: string;
  subject_code: string;
  description?: string;
  assigned_tutor_id: string;
  status: CourseStatus;
  max_periods_per_week?: number;
  custom_grade_weighting?: GradeWeighting;
  materials: string[];
  syllabus?: string;
  created_at: Date;
  updated_at: Date;
  course_contents: CourseContent[];
}

export interface CreateCourseDto {
  class_id: string;
  name: string;
  code: string;
  description: string;
  tutor_id: string;
  credits: number;
  periods_per_week: number;
}

export interface CourseContent {
  id: string;
  course_id: string;
  title: string;
  content_type: CourseContentType;
  content: string;
  description?: string;
  order_index: number;
  duration?: number;
  file_size?: number;
  mime_type?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateContentDto {
  content: string;
  content_type: CourseContentType;
  title: string;
  description?: string;
  duration?: number;
  file_size?: number;
  mime_type?: string;
}
