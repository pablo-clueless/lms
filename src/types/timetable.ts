import type { Period } from "./period";
import type { TermOrdinal, TermStatus } from "./term";

export type TimetableStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Timetable {
  id: string;
  tenant_id: string;
  class: {
    id: string;
    tenant_id: string;
    session_id: string;
    name: string;
    arm: string;
    level: string;
    capacity: number;
    status: string;
    created_at: Date;
    updated_at: Date;
  };
  term: {
    id: string;
    tenant_id: string;
    session_id: string;
    ordinal: TermOrdinal;
    start_date: Date;
    end_date: Date;
    status: TermStatus;
    holidays: [];
    non_instructional_days: [];
    created_at: Date;
    updated_at: Date;
  };
  status: TimetableStatus;
  generated_at: Date;
  generated_by: string;
  generation_version: 1;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
  archived_at?: Date;
  notes?: string[];
  periods: Period[];
}

export interface CreateTimeTableDto {
  class_id: string;
  session_id: string;
  term_id: string;
  config: {
    periods_per_day: number;
    period_duration_minutes: number;
    break_duration_minutes: number;
    start_time: string;
    days: string[];
  };
}
