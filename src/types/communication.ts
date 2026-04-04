import type { User } from "./user";

export type CommunicationType = "EMAIL" | "NOTIFICATION" | "SMS";
export type CommunicationStatus = "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "FAILED" | "CANCELLED";
export type RecipientScope = "ALL_USERS" | "ALL_TUTORS" | "ALL_STUDENTS" | "CLASS" | "COURSE" | "SPECIFIC_USERS";

export interface DeliveryRecipient {
  user_id: string;
  email: string;
  status: CommunicationStatus;
  sent_at?: Date;
  failed_at?: Date;
  failure_reason?: string;
  opened_at?: Date;
  clicked_at?: Date;
}

export interface Email {
  id: string;
  tenant_id: string;
  sender: User;
  subject: string;
  body: string;
  html_body?: string;
  recipient_scope: RecipientScope;
  target_class_id?: string;
  target_course_id?: string;
  specific_user_ids?: string[];
  recipients: DeliveryRecipient[];
  status: CommunicationStatus;
  scheduled_for?: Date;
  sent_at?: Date;
  attachment_urls?: string[];
  total_recipients: number;
  success_count: number;
  failure_count: number;
  created_at: Date;
  updated_at: Date;
  cancelled_at?: Date;
}

export type NotificationChannel = "IN_APP" | "PUSH" | "EMAIL" | "SMS";

export type NotificationEventType =
  | "QUIZ_PUBLISHED"
  | "ASSIGNMENT_PUBLISHED"
  | "ASSIGNMENT_DEADLINE_APPROACHING"
  | "EXAMINATION_SCHEDULED"
  | "EXAMINATION_WINDOW_OPEN"
  | "EXAMINATION_WINDOW_CLOSE"
  | "GRADE_PUBLISHED"
  | "TIMETABLE_PUBLISHED"
  | "TIMETABLE_UPDATED"
  | "MEETING_SCHEDULED"
  | "MEETING_CANCELLED"
  | "MEETING_STARTING"
  | "INVOICE_GENERATED"
  | "PAYMENT_OVERDUE"
  | "CUSTOM";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface Notification {
  id: string;
  tenant_id: string;
  user_id: string;
  event_type: NotificationEventType;
  title: string;
  body: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  action_url?: string;
  resource_type?: string;
  resource_id?: string;
  is_read: boolean;
  read_at?: Date;
  delivered_at?: Date;
  failed_at?: Date;
  failure_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEmailDto {
  subject: string;
  body: string;
  html_body: string;
  recipient_scope: RecipientScope;
  target_class_id?: string;
  target_course_id?: string;
  specific_user_ids?: string[];
  send_immediately?: boolean;
}

export interface CreateNotificationDto {
  title: string;
  body: string;
  recipient_scope: RecipientScope;
  target_class_id?: string;
  target_course_id?: string;
  specific_user_ids?: string[];
  channels: NotificationChannel[];
  priority: NotificationPriority;
  action_url?: string;
}

// Student Inbox Types
export interface StudentInboxEmail {
  id: string;
  subject: string;
  body: string;
  html_body?: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  sender_avatar?: string;
  is_read: boolean;
  read_at?: Date;
  received_at: Date;
  attachment_urls?: string[];
}
