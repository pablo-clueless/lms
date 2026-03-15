export type ExaminationType = "TEST" | "MID_TERM" | "FINAL" | "MOCK";

export type ExaminationStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Examination {
  id: string;
  tenant_id: string;
  course_id: string;
  term_id: string;
  title: string;
  type: ExaminationType;
  exam_date?: string;
  duration: number;
  max_score: number;
  status: ExaminationStatus;
  instructions: string;
  created_at: string;
  updated_at: string;
}

export interface ExaminationResult {
  id: string;
  examination_id: string;
  student_id: string;
  score: number;
  grade: string;
  remarks?: string;
  graded_at: string;
  graded_by_id?: string;
  created_at: string;
  updated_at: string;
}
