export type QuestionType = "MULTIPLE_CHOICE" | "MULTIPLE_ANSWER" | "boolean_FALSE" | "SHORT_ANSWER" | "ESSAY";
export type SubmissionStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "LATE" | "GRADED";
export type AssessmentType = "QUIZ" | "ASSIGNMENT";
export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

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
  class_id: string;
  created_by_tutor_id: string;
  title: string;
  description: string;
  max_marks: number;
  submission_deadline: Date;
  allow_late_submission: false;
  allowed_file_formats: string[];
  max_file_size: number;
  status: AssessmentStatus;
  questions: Question[];
  created_at: Date;
  updated_at: Date;
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
  description: string;
  instructions: string;
  questions: QuestionDto;
  time_limit_minutes: number;
  max_attempts: number;
  passing_score: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results: boolean;
  availability_start: string;
  availability_end: string;
}

export interface QuestionDto {
  attachment_urls: string[];
  correct_answers: string[];
  explanation: string;
  id: string;
  marks: number;
  options: string[];
  order_index: number;
  text: string;
  type: QuestionType;
}

export interface CreateAssignmentDto {
  allow_late_submission: boolean;
  allowed_file_formats: string[];
  attachment_urls: string[];
  course_id: string;
  class_id: string;
  description: string;
  hard_cutoff_date: string;
  max_file_size: number;
  max_marks: number;
  questions: QuestionDto[];
  submission_deadline: string;
  title: string;
}

export interface CreateQuizDto {
  allow_retake: boolean;
  availability_end: string;
  availability_start: string;
  course_id: string;
  class_id: string;
  instructions: string;
  passing_percentage: number;
  questions: QuestionDto[];
  show_before_window: boolean;
  time_limit: number;
  title: string;
}

export interface SubmitQuizDto {
  answers: QuizAnswerDto[];
}

export interface QuizAnswerDto {
  answer_text: string;
  feedback: string;
  is_correct: boolean;
  marks_earned: number;
  question_id: string;
  selected_options: string[];
}

export interface SubmitAssignmentDto {
  answer_text: string;
  file_urls: string[];
}
