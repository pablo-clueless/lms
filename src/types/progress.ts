export type ProgressStatus = "IN_PROGRESS" | "COMPLETED" | "FLAGGED";

export interface Grade {
  continuous_assessment: number;
  examination: number;
  total: number;
  percentage: number;
  letter_grade: string;
  remark: string;
}

export interface AttendanceRecord {
  total_periods: number;
  periods_attended: number;
  periods_absent: number;
  percentage: number;
}

export interface Progress {
  id: string;
  tenant_id: string;
  student_id: string;
  course_id: string;
  term_id: string;
  class_id: string;
  status: ProgressStatus;
  quiz_scores: number[];
  assignment_scores: number[];
  examination_score?: number;
  grade?: Grade;
  attendance: AttendanceRecord;
  tutor_remarks?: string;
  principal_remarks?: string;
  class_position?: number;
  is_flagged: boolean;
  flag_reason?: string;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface ReportCard {
  id: string;
  tenant_id: string;
  student_id: string;
  term_id: string;
  class_id: string;
  course_progresses: Progress[];
  overall_percentage: number;
  overall_grade: string;
  class_position: number;
  total_students: number;
  principal_remarks?: string;
  next_term_begins?: Date;
  generated_at: Date;
  generated_by: string;
  pdf_url?: string;
  created_at: Date;
  updated_at: Date;
}
