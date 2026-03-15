export type QuizStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY" | "MATCHING" | "FILL_BLANK";

export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "GRADED" | "EXPIRED";

export interface QuizOption {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  type: QuestionType;
  text: string;
  explanation: string;
  points: number;
  order: number;
  options?: QuizOption[];
  created_at: string;
  updated_at: string;
}

export interface Answer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_options?: string[];
  text_answer?: string;
  is_correct?: boolean;
  points_earned?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_id: string;
  status: AttemptStatus;
  score?: number;
  total_points: number;
  earned_points: number;
  passed?: boolean;
  started_at: string;
  submitted_at?: string;
  graded_at?: string;
  graded_by?: string;
  answers?: Answer[];
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  module_id: string;
  title: string;
  description: string;
  instructions: string;
  status: QuizStatus;
  duration: number;
  pass_threshold: number;
  max_attempts: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results: boolean;
  start_date?: string;
  end_date?: string;
  questions?: Question[];
  attempts?: QuizAttempt[];
  created_at: string;
  updated_at: string;
}
