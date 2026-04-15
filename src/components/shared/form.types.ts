import type { UseFormReturn, FieldValues, Path } from "react-hook-form";
import type { ReactNode } from "react";
import type { z } from "zod/v4";

import type { DateRange } from "./calendar";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "switch"
  | "radio"
  | "date"
  | "richtext"
  | "otp";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type BaseFieldConfig<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  label?: string;
  type: FieldType;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  colSpan?: number;
  hidden?: boolean | ((values: T) => boolean);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldProps?: Record<string, any>;
};

type TextFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: "text" | "email" | "password" | "number";
};

type TextareaFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: "textarea";
  maxLength?: number;
  showCharCount?: boolean;
};

type SelectFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: "select";
  options: SelectOption[];
};

type CheckboxFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: "checkbox";
};

type SwitchFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: "switch";
};

type RadioFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: "radio";
  options: SelectOption[];
};

type DateFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: "date";
  datePickerType?: "single" | "range";
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
};

type RichtextFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: "richtext";
  editable?: boolean;
};

type OtpFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: "otp";
  length?: number;
};

export type FormFieldConfig<T extends FieldValues = FieldValues> =
  | TextFieldConfig<T>
  | TextareaFieldConfig<T>
  | SelectFieldConfig<T>
  | CheckboxFieldConfig<T>
  | SwitchFieldConfig<T>
  | RadioFieldConfig<T>
  | DateFieldConfig<T>
  | RichtextFieldConfig<T>
  | OtpFieldConfig<T>;

export type FormStepConfig<T extends FieldValues = FieldValues> = {
  title: string;
  description?: string;
  fields?: FormFieldConfig<T>[];
  children?: ReactNode;
  validateOnlyStepFields?: boolean;
  fieldNames?: Path<T>[];
};

export type FormConfig<T extends FieldValues = FieldValues> = {
  fields?: FormFieldConfig<T>[];
  steps?: FormStepConfig<T>[];
  validationSchema: z.ZodType<T>;
  defaultValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
  className?: string;
  showFormError?: boolean;
};

export type FormRenderAPI<T extends FieldValues = FieldValues> = {
  renderField: (name: Path<T>) => ReactNode;
  values: T;
  errors: Partial<Record<string, string>>;
  touched: Partial<Record<string, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  setFieldValue: (name: Path<T>, value: unknown) => void;
  setFieldError: (name: Path<T>, message: string) => void;
  validate: () => Promise<boolean>;
  reset: () => void;
  formMethods: UseFormReturn<T>;
  currentStep: number;
  goToStep: (step: number) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  totalSteps: number;
};

export type FormProps<T extends FieldValues = FieldValues> = {
  config: FormConfig<T>;
  children?: (api: FormRenderAPI<T>) => ReactNode;
  submitLabel?: string | false;
  renderSubmit?: (api: FormRenderAPI<T>) => ReactNode;
};

export type { DateRange };
