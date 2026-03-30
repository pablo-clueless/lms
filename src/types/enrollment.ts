export type EnrollmentStatus = "ACTIVE" | "TRANSFERRED" | "WITHDRAWN" | "SUSPENDED";

export interface Enrollment {
  id: string;
  tenant_id: string;
  student_id: string;
  class_id: string;
  session_id: string;
  status: EnrollmentStatus;
  enrollment_date: Date;
  withdrawal_date?: Date;
  withdrawal_reason?: string;
  transferred_to_class_id?: string;
  transfer_date?: Date;
  transfer_reason?: string;
  suspension_date?: Date;
  suspension_reason?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface StudentEnrollment {
  id: string;
  tenant_id: string;
  student_id: string;
  class_id: string;
  session_id: string;
  status: EnrollmentStatus;
  enrollment_date: Date;
  created_at: Date;
  updated_at: Date;
}
