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
}
