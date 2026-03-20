export type TimetableStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Timetable {
  id: string;
  tenant_id: string;
  class_id: string;
  term_id: string;
  status: TimetableStatus;
  generated_at: Date;
  generated_by: string;
  published_at?: Date;
  published_by?: string;
  generation_version: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  archived_at?: Date;
}

export interface CreateTimeTable {
  class_id: string;
  term_id: string;
  config: {
    periods_per_day: number;
    period_duration_minutes: number;
    break_duration_minutes: number;
    start_time: string;
    days: string[];
  };
}
