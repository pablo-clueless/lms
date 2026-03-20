export type ConfigType =
  | "general"
  | "maintenance"
  | "billing"
  | "email"
  | "security"
  | "features"
  | "rate_limit"
  | "defaults";

export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description: string;
  category: ConfigType;
  is_sensitive: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSystemConfigDto {
  key: string;
  value: string;
  description: string;
  category: ConfigType;
  is_sensitive: boolean;
}

export interface UpdateSystemConfigDto {
  value: string;
  description: string;
  category: ConfigType;
  is_sensitive: boolean;
}

export interface SystemConfigQueries {
  limit?: number;
  category?: ConfigType | (string & {});
  mask_sensitive?: boolean;
}
