export type NotificationType = "INFO" | "WARNING" | "SUCCESS" | "ERROR" | "REMINDER";

export type EmailStatus = "PENDING" | "SENT" | "FAILED" | "DELIVERED" | "BOUNCED";

export interface Notification {
  id: string;
  tenant_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface Email {
  id: string;
  tenant_id: string;
  sender_id: string;
  recipients: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  is_html: boolean;
  status: EmailStatus;
  sent_at?: string;
  failed_at?: string;
  error_message?: string;
  retries: number;
  template_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  tenant_id: string;
  name: string;
  subject: string;
  body: string;
  variables?: string[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  tenant_id: string;
  author_id: string;
  title: string;
  content: string;
  cohort_id?: string;
  course_id?: string;
  is_pinned: boolean;
  published_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}
