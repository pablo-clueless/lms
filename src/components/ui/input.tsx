"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

const inputWrapperVariants = cva("group/field flex flex-col gap-1.5 w-full", {
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

const inputVariants = cva(
  "flex w-full min-w-0 rounded-md text-foreground border bg-input/30 transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 py-1 text-sm file:h-6 file:text-xs",
        md: "h-9 px-3 py-1 text-base md:text-sm file:h-7 file:text-sm",
        lg: "h-11 px-4 py-2 text-lg file:h-8 file:text-base",
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

type PasswordStrength = "weak" | "fair" | "good" | "strong";

interface PasswordStrengthConfig {
  strength: PasswordStrength;
  label: string;
  color: string;
  percentage: number;
}

function getPasswordStrength(password: string): PasswordStrengthConfig {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) {
    return {
      strength: "weak",
      label: "Weak",
      color: "bg-red-500",
      percentage: 25,
    };
  }
  if (score <= 2) {
    return {
      strength: "fair",
      label: "Fair",
      color: "bg-orange-500",
      percentage: 50,
    };
  }
  if (score <= 3) {
    return {
      strength: "good",
      label: "Good",
      color: "bg-amber-500",
      percentage: 75,
    };
  }
  return {
    strength: "strong",
    label: "Strong",
    color: "bg-emerald-500",
    percentage: 100,
  };
}

export interface InputProps extends Omit<React.ComponentProps<"input">, "size">, VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  isLoading?: boolean;
  isValidating?: boolean;
  isValid?: boolean;
  showPasswordStrength?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  wrapperClassName?: string;
}

function Input({
  className,
  wrapperClassName,
  type,
  size,
  label,
  helperText,
  error,
  isLoading,
  isValidating,
  isValid,
  showPasswordStrength,
  startIcon,
  endIcon,
  id,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState<PasswordStrengthConfig | null>(null);
  const idFromUse = React.useId();
  const inputId = id || idFromUse;

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const state: "default" | "invalid" | "valid" | "validating" = error
    ? "invalid"
    : isValidating
      ? "validating"
      : isValid
        ? "valid"
        : "default";

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPassword && showPasswordStrength) {
      const value = e.target.value;
      if (value) {
        setPasswordStrength(getPasswordStrength(value));
      } else {
        setPasswordStrength(null);
      }
    }
    props.onChange?.(e);
  };

  const hasStartContent = startIcon || isLoading;
  const hasEndContent = endIcon || isPassword || isValidating || (isValid && !error);

  const iconSizeClass = size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";

  return (
    <div className={cn(inputWrapperVariants({ size }), wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className={cn(labelVariants({ size }))}>
          {label}
          {props.required && (
            <span className="text-destructive ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        {hasStartContent && (
          <div
            className={cn(
              "text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center",
              size === "sm" ? "pl-2" : size === "lg" ? "pl-4" : "pl-3",
            )}
          >
            {isLoading ? (
              <HugeiconsIcon icon={Loading03Icon} className={cn(iconSizeClass, "animate-spin")} />
            ) : (
              startIcon
            )}
          </div>
        )}
        <input
          type={inputType}
          id={inputId}
          data-slot="input"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={cn(
            inputVariants({ size, state }),
            hasStartContent && (size === "sm" ? "pl-8" : size === "lg" ? "pl-12" : "pl-10"),
            hasEndContent && (size === "sm" ? "pr-8" : size === "lg" ? "pr-12" : "pr-10"),
            className,
          )}
          {...props}
          onChange={isPassword && showPasswordStrength ? handlePasswordChange : props.onChange}
        />

        {hasEndContent && (
          <div
            className={cn(
              "absolute inset-y-0 right-0 flex items-center gap-1",
              size === "sm" ? "pr-2" : size === "lg" ? "pr-4" : "pr-3",
            )}
          >
            {isValidating && (
              <HugeiconsIcon
                icon={Loading03Icon}
                className={cn(iconSizeClass, "animate-spin text-amber-500 dark:text-amber-400")}
              />
            )}

            {isValid && !error && !isValidating && (
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className={cn(iconSizeClass, "text-emerald-500 dark:text-emerald-400")}
              />
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground rounded-sm p-0.5 transition-colors focus-visible:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} className={iconSizeClass} />
              </button>
            )}

            {endIcon && !isPassword && !isValidating && !isValid && endIcon}
          </div>
        )}
      </div>
      {isPassword && showPasswordStrength && passwordStrength && (
        <div className="flex items-center gap-2">
          <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
            <div
              className={cn("h-full transition-all duration-300", passwordStrength.color)}
              style={{ width: `${passwordStrength.percentage}%` }}
            />
          </div>
          <span
            className={cn(
              "text-xs font-medium",
              passwordStrength.strength === "weak" && "text-red-500",
              passwordStrength.strength === "fair" && "text-orange-500",
              passwordStrength.strength === "good" && "text-amber-500",
              passwordStrength.strength === "strong" && "text-emerald-500",
            )}
          >
            {passwordStrength.label}
          </span>
        </div>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-destructive flex items-center gap-1 text-sm">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-muted-foreground text-sm">
          {helperText}
        </p>
      )}
    </div>
  );
}

export { Input, inputVariants, getPasswordStrength };
export type { PasswordStrength, PasswordStrengthConfig };
