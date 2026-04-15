import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import type { FormStepConfig } from "./form.types";

export function getFieldNamesForStep<T extends FieldValues>(step: FormStepConfig<T>): Path<T>[] {
  if (step.fieldNames) return step.fieldNames;
  return (step.fields ?? []).map((f) => f.name);
}

export async function validateStep<T extends FieldValues>(
  formMethods: UseFormReturn<T>,
  step: FormStepConfig<T>,
  isMultiStep: boolean,
): Promise<boolean> {
  if (!isMultiStep) return formMethods.trigger();
  const validateOnly = step.validateOnlyStepFields !== false;
  if (!validateOnly) return formMethods.trigger();
  const names = getFieldNamesForStep(step);
  if (!names.length) return true;
  return formMethods.trigger(names);
}

export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}
