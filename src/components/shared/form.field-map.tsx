/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import type { FormFieldConfig } from "./form.types";
import type { ReactNode } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./date-picker";
import { TextEditor } from "./text-editor";
import { OtpInput } from "./otp-input";
import { cn } from "@/lib/utils";

type FieldRenderer = (config: FormFieldConfig<any>, field: ControllerRenderProps<any>, error?: string) => ReactNode;

const fieldRegistry = new Map<string, FieldRenderer>();

function registerFieldType(type: string, renderer: FieldRenderer) {
  fieldRegistry.set(type, renderer);
}

function renderFieldByType<T extends FieldValues>(
  config: FormFieldConfig<T>,
  field: ControllerRenderProps<T>,
  error?: string,
): ReactNode {
  const renderer = fieldRegistry.get(config.type);
  if (!renderer) return null;
  return renderer(config, field, error);
}

const inputRenderer: FieldRenderer = (config, field, error) => (
  <Input
    {...field}
    type={config.type as string}
    label={config.label}
    placeholder={config.placeholder}
    helperText={config.helperText}
    error={error}
    required={config.required}
    disabled={config.disabled}
    className={config.className}
    {...config.fieldProps}
  />
);

registerFieldType("text", inputRenderer);
registerFieldType("email", inputRenderer);
registerFieldType("password", inputRenderer);
registerFieldType("number", inputRenderer);

registerFieldType("textarea", (config, field, error) => {
  const cfg = config as Extract<FormFieldConfig, { type: "textarea" }>;
  return (
    <Textarea
      {...field}
      label={config.label}
      placeholder={config.placeholder}
      helperText={config.helperText}
      error={error}
      required={config.required}
      disabled={config.disabled}
      className={config.className}
      maxLength={cfg.maxLength}
      showCharCount={cfg.showCharCount}
      {...config.fieldProps}
    />
  );
});

registerFieldType("select", (config, field, error) => {
  const cfg = config as Extract<FormFieldConfig, { type: "select" }>;
  return (
    <div className="flex w-full flex-col gap-1.5">
      {config.label && (
        <Label htmlFor={field.name}>
          {config.label}
          {config.required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      <Select
        value={field.value ?? ""}
        onValueChange={field.onChange}
        disabled={config.disabled}
        {...config.fieldProps}
      >
        <SelectTrigger id={field.name} className={cn("w-full", config.className)} aria-invalid={!!error}>
          <SelectValue placeholder={config.placeholder ?? "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {cfg.options?.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-destructive text-sm">{error}</p>}
      {config.helperText && !error && <p className="text-muted-foreground text-sm">{config.helperText}</p>}
    </div>
  );
});

registerFieldType("checkbox", (config, field, error) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center gap-2">
      <Checkbox
        id={field.name}
        checked={!!field.value}
        onCheckedChange={field.onChange}
        disabled={config.disabled}
        {...config.fieldProps}
      />
      {config.label && (
        <Label htmlFor={field.name}>
          {config.label}
          {config.required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
    </div>
    {error && <p className="text-destructive text-sm">{error}</p>}
    {config.helperText && !error && <p className="text-muted-foreground text-sm">{config.helperText}</p>}
  </div>
));

registerFieldType("switch", (config, field, error) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center gap-2">
      <Switch
        id={field.name}
        checked={!!field.value}
        onCheckedChange={field.onChange}
        disabled={config.disabled}
        {...config.fieldProps}
      />
      {config.label && (
        <Label htmlFor={field.name}>
          {config.label}
          {config.required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
    </div>
    {error && <p className="text-destructive text-sm">{error}</p>}
    {config.helperText && !error && <p className="text-muted-foreground text-sm">{config.helperText}</p>}
  </div>
));

registerFieldType("radio", (config, field, error) => {
  const cfg = config as Extract<FormFieldConfig, { type: "radio" }>;
  return (
    <div className="flex flex-col gap-1.5">
      {config.label && (
        <Label>
          {config.label}
          {config.required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      <RadioGroup
        value={field.value ?? ""}
        onValueChange={field.onChange}
        disabled={config.disabled}
        className={config.className}
        {...config.fieldProps}
      >
        {cfg.options?.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem value={opt.value} id={`${field.name}-${opt.value}`} disabled={opt.disabled} />
            <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="text-destructive text-sm">{error}</p>}
      {config.helperText && !error && <p className="text-muted-foreground text-sm">{config.helperText}</p>}
    </div>
  );
});

registerFieldType("date", (config, field, error) => {
  const cfg = config as Extract<FormFieldConfig, { type: "date" }>;
  const pickerType = cfg.datePickerType ?? "single";
  return (
    <div className="flex w-full flex-col gap-1.5">
      {pickerType === "range" ? (
        <DatePicker
          type="range"
          label={config.label}
          value={field.value ?? { from: undefined, to: undefined }}
          onValueChange={field.onChange}
          disabled={config.disabled}
          minDate={cfg.minDate}
          maxDate={cfg.maxDate}
          disabledDates={cfg.disabledDates}
          {...config.fieldProps}
        />
      ) : (
        <DatePicker
          type="single"
          label={config.label}
          value={field.value}
          onValueChange={field.onChange}
          placeholder={config.placeholder}
          disabled={config.disabled}
          minDate={cfg.minDate}
          maxDate={cfg.maxDate}
          disabledDates={cfg.disabledDates}
          {...config.fieldProps}
        />
      )}
      {error && <p className="text-destructive text-sm">{error}</p>}
      {config.helperText && !error && <p className="text-muted-foreground text-sm">{config.helperText}</p>}
    </div>
  );
});

registerFieldType("richtext", (config, field, error) => {
  const cfg = config as Extract<FormFieldConfig, { type: "richtext" }>;
  return (
    <div className="flex w-full flex-col gap-1.5">
      {config.label && (
        <Label>
          {config.label}
          {config.required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      <TextEditor
        value={field.value ?? ""}
        onValueChange={field.onChange}
        editable={cfg.editable !== false}
        className={config.className}
        {...config.fieldProps}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      {config.helperText && !error && <p className="text-muted-foreground text-sm">{config.helperText}</p>}
    </div>
  );
});

registerFieldType("otp", (config, field, error) => {
  const cfg = config as Extract<FormFieldConfig, { type: "otp" }>;
  return (
    <div className="flex w-full flex-col gap-1.5">
      {config.label && (
        <Label>
          {config.label}
          {config.required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      <OtpInput
        value={field.value ?? ""}
        onChange={field.onChange}
        disabled={config.disabled}
        length={cfg.length}
        helperText={config.helperText}
        error={error ? { touched: true, message: error } : undefined}
        {...config.fieldProps}
      />
    </div>
  );
});

export { registerFieldType, renderFieldByType };
