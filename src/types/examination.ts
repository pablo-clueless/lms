import type { QuestionDto, QuestionType } from "./assessment";

export type ExaminationStatus = "DRAFT" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
export type ExaminationSubmissionStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "GRADED" | "PUBLISHED";

export interface ExaminationQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correct_answers?: string[];
  marks: number;
  is_confidential: boolean;
  explanation?: string;
  order_index: number;
  attachment_urls?: string[];
}

export interface Examination {
  id: string;
  tenant_id: string;
  course_id: string;
  term_id: string;
  created_by_id: string;
  title: string;
  instructions: string;
  questions: ExaminationQuestion[];
  total_marks: number;
  duration: number;
  window_start: Date;
  window_end: Date;
  status: ExaminationStatus;
  results_published: boolean;
  results_published_at?: Date;
  results_published_by?: string;
  created_at: Date;
  updated_at: Date;
  scheduled_at?: Date;
}

export interface IntegrityEvent {
  event_type: string;
  timestamp: Date;
  description?: string;
}

export interface ExaminationAnswer {
  question_id: string;
  answer_text?: string;
  selected_options?: string[];
  is_correct?: boolean;
  marks_earned?: number;
  feedback?: string;
  submitted_at: Date;
}

export interface ExaminationSubmission {
  id: string;
  tenant_id: string;
  examination_id: string;
  student_id: string;
  status: ExaminationSubmissionStatus;
  started_at?: Date;
  submitted_at?: Date;
  auto_submitted: boolean;
  answers: ExaminationAnswer[];
  score?: number;
  percentage?: number;
  is_auto_graded: boolean;
  feedback?: string;
  integrity_events: IntegrityEvent[];
  ip_address: string;
  created_at: Date;
  updated_at: Date;
  graded_at?: Date;
  graded_by?: string;
  results_published_to_student: boolean;
}

export interface CreateExaminationDto {
  course_id: string;
  duration: number;
  instructions: string;
  questions: QuestionDto[];
  term_id: string;
  title: string;
  total_marks: number;
  window_end: string;
  window_start: string;
}
