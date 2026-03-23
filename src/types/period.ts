import type { Course } from "./course";
import type { Class } from "./class";
import type { User } from "./user";

export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
export type SwapRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "ESCALATED" | "CANCELLED";

export interface Period {
  id: string;
  tenant_id: string;
  timetable_id: string;
  course: Course;
  tutor: User;
  class: Class;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  period_number: number;
  created_at: Date;
  updated_at: Date;
}

export interface SwapRequest {
  id: string;
  tenant_id: string;
  requesting_period_id: string;
  target_period_id: string;
  requesting_tutor_id: string;
  target_tutor_id: string;
  status: SwapRequestStatus;
  reason?: string;
  rejection_reason?: string;
  escalation_reason?: string;
  admin_override_reason?: string;
  admin_override_by?: string;
  created_at: Date;
  updated_at: Date;
  responded_at?: Date;
  escalated_at?: Date;
}
