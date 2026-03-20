export type TermOrdinal = "FIRST" | "SECOND" | "THIRD";
export type TermStatus = "DRAFT" | "ACTIVE" | "COMPLETED";

export interface Holiday {
  date: Date;
  name: string;
  description?: string;
  is_public: boolean;
}

export interface Term {
  id: string;
  tenant_id: string;
  session_id: string;
  ordinal: TermOrdinal;
  start_date: Date;
  end_date: Date;
  status: TermStatus;
  holidays: Holiday[];
  non_instructional_days: Date[];
  description?: string;
  created_at: Date;
  updated_at: Date;
  activated_at?: Date;
  completed_at?: Date;
}
