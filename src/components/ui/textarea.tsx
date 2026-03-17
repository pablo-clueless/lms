"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, AlertCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons";

const textareaWrapperVariants = cva("group/field flex flex-col gap-1.5 w-full", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base md:text-sm",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const textareaVariants = cva(
  "flex field-sizing-content w-full resize-none rounded-md border bg-input/30 transition-colors outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "min-h-14 px-2.5 py-2 text-sm",
        md: "min-h-16 px-3 py-3 text-base md:text-sm",
        lg: "min-h-20 px-4 py-4 text-lg",
      },
      state: {
        default: "border-input focus-visible:border-ring",
        invalid: "border-destructive dark:border-destructive/50",
        valid: "border-emerald-500 dark:border-emerald-400",
        validating: "border-amber-500 dark:border-amber-400",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  },
);

const labelVariants = cva("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "size">, VariantProps<typeof textareaVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  isLoading?: boolean;
  isValidating?: boolean;
  isValid?: boolean;
  showCharCount?: boolean;
  wrapperClassName?: string;
}

function Textarea({
  className,
  wrapperClassName,
  size,
  label,
  helperText,
  error,
  isLoading,
  isValidating,
  isValid,
  showCharCount,
  maxLength,
  id,
  ...props
}: TextareaProps) {
  const [charCount, setCharCount] = React.useState(0);
  const reactId = React.useId();
  const textareaId = id || reactId;

  const state: "default" | "invalid" | "valid" | "validating" = error
    ? "invalid"
    : isValidating
      ? "validating"
      : isValid
        ? "valid"
        : "default";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (showCharCount) {
      setCharCount(e.target.value.length);
    }
    props.onChange?.(e);
  };

  React.useEffect(() => {
    if (showCharCount && props.value !== undefined) {
      setCharCount(String(props.value).length);
    }
  }, [props.value, showCharCount]);

  const iconSizeClass = size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";

  return (
    <div className={cn(textareaWrapperVariants({ size }), wrapperClassName)}>
      <div className="flex items-center justify-between gap-2">
        {label && (
          <label htmlFor={textareaId} className={cn(labelVariants({ size }))}>
            {label}
            {props.required && (
              <span className="text-destructive ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="flex items-center gap-1.5">
          {isLoading && (
            <HugeiconsIcon icon={Loading03Icon} className={cn(iconSizeClass, "text-muted-foreground animate-spin")} />
          )}

          {isValidating && !isLoading && (
            <HugeiconsIcon
              icon={Loading03Icon}
              className={cn(iconSizeClass, "animate-spin text-amber-500 dark:text-amber-400")}
            />
          )}

          {isValid && !error && !isValidating && !isLoading && (
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className={cn(iconSizeClass, "text-emerald-500 dark:text-emerald-400")}
            />
          )}
        </div>
      </div>

      <textarea
        id={textareaId}
        data-slot="textarea"
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        maxLength={maxLength}
        className={cn(textareaVariants({ size, state }), className)}
        {...props}
        onChange={showCharCount ? handleChange : props.onChange}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {error && (
            <p id={`${textareaId}-error`} className="text-destructive flex items-center gap-1 text-sm">
              <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5 shrink-0" />
              {error}
            </p>
          )}

          {helperText && !error && (
            <p id={`${textareaId}-helper`} className="text-muted-foreground text-sm">
              {helperText}
            </p>
          )}
        </div>

        {showCharCount && (
          <span
            className={cn("text-muted-foreground text-xs", maxLength && charCount >= maxLength && "text-destructive")}
          >
            {charCount}
            {maxLength && `/${maxLength}`}
          </span>
        )}
      </div>
    </div>
  );
}

export { Textarea, textareaVariants };
