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
