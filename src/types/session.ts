export type SessionStatus = "ACTIVE" | "ARCHIVED" | "DRAFT";

export interface Session {
  id: string;
  tenant_id: string;
  label: string;
  start_year: number;
  end_year: number;
  status: SessionStatus;
  description: string;
  created_at: Date;
  updated_at: Date;
  archived_at: Date;
}
