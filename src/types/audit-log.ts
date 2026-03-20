import type { Role } from "./user";

// AuditAction represents the type of action being audited
export type AuditAction =
  // Tenant actions
  | "TENANT_CREATED"
  | "TENANT_UPDATED"
  | "TENANT_SUSPENDED"
  | "TENANT_REACTIVATED"
  // User actions
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DEACTIVATED"
  | "USER_REACTIVATED"
  | "USER_LOGIN"
  | "USER_LOGOUT"
  | "ROLE_CHANGED"
  // Session/Term actions
  | "SESSION_CREATED"
  | "SESSION_UPDATED"
  | "SESSION_ARCHIVED"
  | "TERM_CREATED"
  | "TERM_UPDATED"
  | "TERM_ACTIVATED"
  | "TERM_COMPLETED"
  // Class/Course actions
  | "CLASS_CREATED"
  | "CLASS_UPDATED"
  | "CLASS_DELETED"
  | "COURSE_CREATED"
  | "COURSE_UPDATED"
  | "COURSE_DELETED"
  | "TUTOR_REASSIGNED"
  // Enrollment actions
  | "STUDENT_ENROLLED"
  | "ENROLLMENT_CREATED"
  | "ENROLLMENT_UPDATED"
  | "STUDENT_TRANSFERRED"
  | "STUDENT_WITHDRAWN"
  | "ENROLLMENT_WITHDRAWN"
  | "ENROLLMENT_SUSPENDED"
  | "ENROLLMENT_REACTIVATED"
  // Timetable actions
  | "TIMETABLE_GENERATED"
  | "TIMETABLE_PUBLISHED"
  | "PERIOD_SWAP_REQUESTED"
  | "PERIOD_SWAP_APPROVED"
  | "PERIOD_SWAP_REJECTED"
  // Assessment actions
  | "QUIZ_CREATED"
  | "QUIZ_PUBLISHED"
  | "QUIZ_SUBMITTED"
  | "QUIZ_GRADED"
  | "ASSIGNMENT_CREATED"
  | "ASSIGNMENT_PUBLISHED"
  | "ASSIGNMENT_SUBMITTED"
  | "ASSIGNMENT_GRADED"
  // Examination actions
  | "EXAMINATION_CREATED"
  | "EXAMINATION_SCHEDULED"
  | "EXAMINATION_SUBMITTED"
  | "EXAMINATION_GRADED"
  | "RESULTS_PUBLISHED"
  // Meeting actions
  | "MEETING_SCHEDULED"
  | "MEETING_STARTED"
  | "MEETING_ENDED"
  | "MEETING_CANCELLED"
  // Billing actions
  | "INVOICE_GENERATED"
  | "INVOICE_PAID"
  | "BILLING_ADJUSTMENT_APPLIED"
  | "SUBSCRIPTION_CANCELLED"
  // Communication actions
  | "EMAIL_SENT"
  | "NOTIFICATION_SENT";

// AuditResourceType represents the type of resource being audited
export type AuditResourceType =
  | "TENANT"
  | "USER"
  | "SESSION"
  | "TERM"
  | "CLASS"
  | "COURSE"
  | "ENROLLMENT"
  | "TIMETABLE"
  | "PERIOD"
  | "QUIZ"
  | "ASSIGNMENT"
  | "EXAMINATION"
  | "PROGRESS"
  | "MEETING"
  | "INVOICE"
  | "SUBSCRIPTION"
  | "EMAIL"
  | "NOTIFICATION";

// AuditLog represents an immutable audit trail entry
export interface AuditLog {
  id: string;
  tenant_id?: string; // NULL for platform-level actions
  actor_user_id: string;
  actor_role: Role;
  action: AuditAction;
  resource_type: AuditResourceType;
  resource_id: string;
  resource_name?: string; // Human-readable resource name
  before_state?: Record<string, unknown>; // JSON snapshot of resource before change
  after_state?: Record<string, unknown>; // JSON snapshot of resource after change
  changes?: Record<string, unknown>; // Field-level changes for updates
  ip_address: string;
  user_agent?: string;
  metadata?: Record<string, unknown>; // Additional context
  is_sensitive: boolean; // True for sensitive actions (billing, suspension, etc.)
  timestamp: Date;
  created_at: Date;
}
