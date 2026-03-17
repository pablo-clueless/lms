export type CohortStatus = "DRAFT" | "OPEN" | "CLOSED" | "ACTIVE" | "COMPLETED";

export type TermStatus = "UPCOMING" | "ACTIVE" | "COMPLETED";

export type GradeLevel =
  | "PRIMARY_1"
  | "PRIMARY_2"
  | "PRIMARY_3"
  | "PRIMARY_4"
  | "PRIMARY_5"
  | "PRIMARY_6"
  | "JSS_1"
  | "JSS_2"
  | "JSS_3"
  | "SSS_1"
  | "SSS_2"
  | "SSS_3";

export type FieldType =
  | "TEXT"
  | "TEXTAREA"
  | "NUMBER"
  | "EMAIL"
  | "PHONE"
  | "DATE"
  | "SELECT"
  | "CHECKBOX"
  | "RADIO"
  | "FILE";

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FieldValidation {
  required: boolean;
  min?: number;
  max?: number;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  message?: string;
}

export interface ApplicationFormField {
  id: string;
  form_id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder: string;
  helper_text: string;
  options?: FormFieldOption[];
  validation: FieldValidation;
  order: number;
  width: number;
  created_at: string;
  updated_at: string;
}

export interface ApplicationForm {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  fields?: ApplicationFormField[];
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  description: string;
  grade_level?: GradeLevel;
  duration: number;
  cohorts?: Cohort[];
  created_at: string;
  updated_at: string;
}

export interface Cohort {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  status: CohortStatus;
  application_start_date?: string;
  application_end_date?: string;
  start_date?: string;
  end_date?: string;
  max_students: number;
  tracks?: Track[];
  application_form_id?: string;
  application_form?: ApplicationForm;
  created_at: string;
  updated_at: string;
}

export interface Term {
  id: string;
  tenant_id: string;
  cohort_id: string;
  cohort?: Cohort;
  name: string;
  number: number;
  start_date?: string;
  end_date?: string;
  status: TermStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationFormDto {
  name: string;
  description: string;
  fields: ApplicationFormFieldDto[];
}

export type OptionsSourceType = "manual" | "api" | "file";

export interface OptionsApiConfig {
  url: string;
  method: "GET" | "POST";
  headers?: Record<string, string>;
  label_field: string;
  value_field: string;
}

export interface ApplicationFormFieldDto {
  name: string;
  type: FieldType;
  label: string;
  placeholder: string;
  helper_text: string;
  options?: FormFieldOption[];
  options_source?: OptionsSourceType;
  options_api_config?: OptionsApiConfig;
  validation: FieldValidation;
  order: number;
  width: 1 | 2 | 3 | 4;
}
