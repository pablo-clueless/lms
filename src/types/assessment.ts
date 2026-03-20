export type AssessmentType = "QUIZ" | "ASSIGNMENT";
export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type QuestionType = "MULTIPLE_CHOICE" | "MULTIPLE_ANSWER" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY";
export type SubmissionStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "LATE" | "GRADED";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correct_answers?: string[];
  marks: number;
  explanation?: string;
  order_index: number;
  attachment_urls?: string[];
}

export interface Quiz {
  id: string;
  tenant_id: string;
  course_id: string;
  created_by_tutor_id: string;
  title: string;
  instructions: string;
  questions: Question[];
  total_marks: number;
  time_limit: number;
  availability_start: Date;
  availability_end: Date;
  status: AssessmentStatus;
  show_before_window: boolean;
  allow_retake: boolean;
  passing_percentage?: number;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
}

export interface Assignment {
  id: string;
  tenant_id: string;
  course_id: string;
  created_by_tutor_id: string;
  title: string;
  instructions: string;
  questions: Question[];
  total_marks: number;
  due_date: Date;
  availability_start: Date;
  availability_end: Date;
  status: AssessmentStatus;
  allow_late_submission: boolean;
  late_penalty_percentage?: number;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
}

export interface QuizSubmission {
  id: string;
  tenant_id: string;
  quiz_id: string;
  student_id: string;
  status: SubmissionStatus;
  started_at?: Date;
  submitted_at?: Date;
  answers: SubmissionAnswer[];
  score?: number;
  percentage?: number;
  is_auto_graded: boolean;
  feedback?: string;
  created_at: Date;
  updated_at: Date;
  graded_at?: Date;
  graded_by?: string;
}

export interface AssignmentSubmission {
  id: string;
  tenant_id: string;
  assignment_id: string;
  student_id: string;
  status: SubmissionStatus;
  submitted_at?: Date;
  answers: SubmissionAnswer[];
  attachment_urls?: string[];
  score?: number;
  percentage?: number;
  is_late: boolean;
  late_penalty_applied?: number;
  feedback?: string;
  created_at: Date;
  updated_at: Date;
  graded_at?: Date;
  graded_by?: string;
}

export interface SubmissionAnswer {
  question_id: string;
  answer_text?: string;
  selected_options?: string[];
  is_correct?: boolean;
  marks_earned?: number;
  feedback?: string;
}

export interface CreateAssessmentDto {
  title: string;
  instructions: string;
  questions: Question[];
  time_limit?: number;
  due_date?: Date;
  availability_start: Date;
  availability_end: Date;
  status: AssessmentStatus;
  allow_late_submission?: boolean;
  allow_retake?: boolean;
  passing_percentage?: number;
  late_penalty_percentage?: number;
}
