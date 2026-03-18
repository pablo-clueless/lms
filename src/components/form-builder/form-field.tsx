"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { ApplicationFormField } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib";

interface Props {
  field: ApplicationFormField;
  value?: string | string[] | boolean;
  onChange?: (value: string | string[] | boolean) => void;
  error?: string;
}

const getColSpanClass = (width: 1 | 2 | 3 | 4) => {
  switch (width) {
    case 1:
      return "col-span-1";
    case 2:
      return "col-span-2";
    case 3:
      return "col-span-3";
    case 4:
      return "col-span-4";
  }
};

export const FormField = ({ field, value, onChange, error }: Props) => {
  const colSpanClass = getColSpanClass(field.width);

  if (field.type === "CHECKBOX") {
    return (
      <div className={cn("flex items-center space-x-2", colSpanClass)}>
        <Checkbox
          id={field.id}
          checked={value as boolean}
          onCheckedChange={(checked) => onChange?.(checked as boolean)}
          required={field.validation.required}
        />
        <Label htmlFor={field.id} className="cursor-pointer text-sm font-normal">
          {field.label}
          {field.validation.required && <span className="ml-1 text-red-500">*</span>}
        </Label>
      </div>
    );
  }

  if (field.type === "DATE") {
    return (
      <div className={colSpanClass}>
        <Input
          type="date"
          label={field.label}
          placeholder={field.placeholder}
          helperText={field.helper_text}
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          required={field.validation.required}
          error={error}
        />
      </div>
    );
  }

  if (field.type === "EMAIL") {
    return (
      <div className={colSpanClass}>
        <Input
          type="email"
          label={field.label}
          placeholder={field.placeholder}
          helperText={field.helper_text}
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          required={field.validation.required}
          error={error}
        />
      </div>
    );
  }

  if (field.type === "FILE") {
    return (
      <div className={cn("space-y-2", colSpanClass)}>
        <Label>
          {field.label}
          {field.validation.required && <span className="ml-1 text-red-500">*</span>}
        </Label>
        <div className="relative">
          <Input
            type="file"
            id={field.id}
            onChange={(e) => {
              const file = e.target.files?.[0];
              onChange?.(file?.name || "");
            }}
            required={field.validation.required}
            className="cursor-pointer"
          />
        </div>
        {field.helper_text && <p className="text-muted-foreground text-sm">{field.helper_text}</p>}
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    );
  }

  if (field.type === "NUMBER") {
    return (
      <div className={colSpanClass}>
        <Input
          type="number"
          label={field.label}
          placeholder={field.placeholder}
          helperText={field.helper_text}
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          required={field.validation.required}
          min={field.validation.min}
          max={field.validation.max}
          error={error}
        />
      </div>
    );
  }

  if (field.type === "PHONE") {
    return (
      <div className={colSpanClass}>
        <Input
          type="tel"
          label={field.label}
          placeholder={field.placeholder}
          helperText={field.helper_text}
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          required={field.validation.required}
          error={error}
        />
      </div>
    );
  }

  if (field.type === "RADIO") {
    return (
      <div className={cn("space-y-2", colSpanClass)}>
        <Label>
          {field.label}
          {field.validation.required && <span className="ml-1 text-red-500">*</span>}
        </Label>
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${field.id}-${option.value}`}
                name={field.name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                required={field.validation.required}
                className="text-primary focus:ring-primary size-4 border-gray-300"
              />
              <Label htmlFor={`${field.id}-${option.value}`} className="cursor-pointer text-sm font-normal">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        {field.helper_text && <p className="text-muted-foreground text-sm">{field.helper_text}</p>}
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    );
  }

  if (field.type === "SELECT") {
    return (
      <div className={cn("space-y-2", colSpanClass)}>
        <Label>
          {field.label}
          {field.validation.required && <span className="ml-1 text-red-500">*</span>}
        </Label>
        <Select value={value as string} onValueChange={(val) => onChange?.(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={field.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {field.helper_text && <p className="text-muted-foreground text-sm">{field.helper_text}</p>}
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    );
  }

  if (field.type === "TEXTAREA") {
    return (
      <div className={colSpanClass}>
        <Textarea
          label={field.label}
          placeholder={field.placeholder}
          helperText={field.helper_text}
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          required={field.validation.required}
          minLength={field.validation.min_length}
          maxLength={field.validation.max_length}
          error={error}
          showCharCount={!!field.validation.max_length}
        />
      </div>
    );
  }

  if (field.type === "TOGGLE") {
    return (
      <div className={cn("flex items-center justify-between", colSpanClass)}>
        <div className="space-y-0.5">
          <Label htmlFor={field.id}>
            {field.label}
            {field.validation.required && <span className="ml-1 text-red-500">*</span>}
          </Label>
          {field.helper_text && <p className="text-muted-foreground text-sm">{field.helper_text}</p>}
        </div>
        <Switch id={field.id} checked={value as boolean} onCheckedChange={(checked) => onChange?.(checked)} />
      </div>
    );
  }

  // Default TEXT type
  return (
    <div className={colSpanClass}>
      <Input
        type="text"
        label={field.label}
        placeholder={field.placeholder}
        helperText={field.helper_text}
        value={value as string}
        onChange={(e) => onChange?.(e.target.value)}
        required={field.validation.required}
        minLength={field.validation.min_length}
        maxLength={field.validation.max_length}
        error={error}
      />
    </div>
  );
};
