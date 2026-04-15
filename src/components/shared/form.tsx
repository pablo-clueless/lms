/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, Controller, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";
import { Tick02Icon, ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

import type { FormProps, FormRenderAPI, FormFieldConfig, FormStepConfig } from "./form.types";
import { renderFieldByType } from "./form.field-map";
import { Button } from "@/components/ui/button";
import { validateStep } from "./form.utils";
import { cn } from "@/lib/utils";

function FormStepNavigator<T extends FieldValues>({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: FormStepConfig<T>[];
  currentStep: number;
  onStepClick: (i: number) => void;
}) {
  return (
    <div className="mb-8">
      <div className="relative flex items-start justify-between">
        <div className="bg-border absolute top-4 right-0 left-0 z-0 h-px" />
        <div
          className="bg-primary absolute top-4 left-0 z-0 h-px transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const isClickable = i <= currentStep;

          return (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(i)}
                disabled={!isClickable}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-background text-primary ring-primary/20 ring-4",
                  !isCompleted && !isCurrent && "border-muted-foreground/30 bg-background text-muted-foreground",
                  isClickable ? "cursor-pointer" : "cursor-default",
                )}
              >
                {isCompleted ? <HugeiconsIcon icon={Tick02Icon} className="size-4" strokeWidth={2.5} /> : i + 1}
              </button>
              <div className="flex flex-col items-center text-center">
                <span className={cn("text-xs font-medium", isCurrent ? "text-foreground" : "text-muted-foreground")}>
                  {step.title}
                </span>
                {step.description && <span className="text-muted-foreground text-xs">{step.description}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormFieldRenderer<T extends FieldValues>({
  config,
  formMethods,
  watchedValues,
}: {
  config: FormFieldConfig<T>;
  formMethods: ReturnType<typeof useForm<T>>;
  watchedValues: T;
}) {
  const isHidden = typeof config.hidden === "function" ? config.hidden(watchedValues) : config.hidden;

  if (isHidden) return null;

  const error = formMethods.formState.errors[config.name]?.message as string | undefined;

  return (
    <div className={cn(config.colSpan === 2 && "col-span-2", config.colSpan === 3 && "col-span-3")}>
      <Controller
        name={config.name}
        control={formMethods.control}
        render={({ field }) => renderFieldByType(config, field, error) as React.ReactElement}
      />
    </div>
  );
}

export function Form<T extends FieldValues>({ config, children, submitLabel = "Submit", renderSubmit }: FormProps<T>) {
  const { fields, steps, validationSchema, defaultValues, onSubmit, reValidateMode, className } = config;
  const isMultiStep = !!steps?.length;
  const [currentStep, setCurrentStep] = React.useState(0);

  const formMethods = useForm<T>({
    resolver: zodResolver(validationSchema as any),
    defaultValues: defaultValues as any,
    reValidateMode: reValidateMode ?? "onChange",
  });

  const watchedValues = formMethods.watch() as T;
  const { isSubmitting, isValid, errors, touchedFields } = formMethods.formState;

  const totalSteps = steps?.length ?? 1;

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) setCurrentStep(step);
  };

  const nextStep = async () => {
    const step = steps![currentStep];
    const valid = await validateStep(formMethods as any, step, true);
    if (valid) setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (formMethods as any).handleSubmit(async (values: T) => {
    await onSubmit(values);
  });

  const renderField = (name: Path<T>) => {
    const allFields = isMultiStep ? steps!.flatMap((s) => s.fields ?? []) : (fields ?? []);
    const fieldConfig = allFields.find((f) => f.name === name);
    if (!fieldConfig) return null;
    return (
      <FormFieldRenderer key={name} config={fieldConfig} formMethods={formMethods} watchedValues={watchedValues} />
    );
  };

  const api: FormRenderAPI<T> = {
    renderField,
    values: watchedValues,
    errors: Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, (v as { message?: string })?.message])),
    touched: touchedFields as Partial<Record<string, boolean>>,
    isSubmitting,
    isValid,
    setFieldValue: (name, value) => formMethods.setValue(name, value as T[Path<T>]),
    setFieldError: (name, message) => formMethods.setError(name, { message }),
    validate: () => formMethods.trigger(),
    reset: () => formMethods.reset(),
    formMethods: formMethods as unknown as UseFormReturn<T>,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    totalSteps,
  };

  const currentStepConfig = isMultiStep ? steps![currentStep] : null;
  const currentFields = isMultiStep ? (currentStepConfig?.fields ?? []) : (fields ?? []);

  const defaultSubmitArea = submitLabel !== false && !renderSubmit && (
    <div className="flex items-center justify-end gap-2 pt-2">
      {isMultiStep && currentStep > 0 && (
        <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
          <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
          Back
        </Button>
      )}
      {isMultiStep && currentStep < totalSteps - 1 ? (
        <Button type="button" onClick={nextStep} disabled={isSubmitting}>
          Continue
          <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
        </Button>
      ) : (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : (submitLabel as string)}
        </Button>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)} noValidate>
      {isMultiStep && <FormStepNavigator steps={steps!} currentStep={currentStep} onStepClick={goToStep} />}

      {children ? (
        children(api)
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {currentFields.map((field) => (
            <FormFieldRenderer
              key={field.name as string}
              config={field}
              formMethods={formMethods}
              watchedValues={watchedValues}
            />
          ))}
        </div>
      )}

      {renderSubmit ? renderSubmit(api) : defaultSubmitArea}
    </form>
  );
}
