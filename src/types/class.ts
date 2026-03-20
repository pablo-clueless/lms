export type SchoolLevel = "PRIMARY" | "SECONDARY";
export type ClassStatus = "ACTIVE" | "INACTIVE";

export interface Class {
  id: string;
  tenant_id: string;
  session_id: string;
  name: string;
  arm: string;
  level: SchoolLevel;
  capacity?: number;
  status: ClassStatus;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
