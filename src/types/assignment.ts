export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export interface Assignment {
  id: string;
  tenant_id: string;
  course_id: string;
  term_id: string;
  teacher_id: string;
  title: string;
  description: string;
  instructions: string;
  due_date: string;
  max_score: number;
  status: AssignmentStatus;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  content: string;
  attachments?: string[];
  submitted_at: string;
  score?: number;
  feedback?: string;
  graded_at?: string;
  graded_by_id?: string;
  created_at: string;
  updated_at: string;
}
