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
  archived_at?: Date;
}

export interface CreateSessionDto {
  label: string;
  start_year: number;
  end_year: number;
  description: string;
  status: SessionStatus;
}

export interface UpdateSessionDto {
  label?: string;
  description?: string;
  status?: SessionStatus;
}
