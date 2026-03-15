import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { cn } from "@/lib";

type StepProps = {
  index: number;
  label: string;
  description?: string;
  icon?: IconSvgElement;
};

interface StepperProps {
  current: number;
  steps: StepProps[];
  className?: string;
  onStepChange?: (step: number) => void;
  stepperClassName?: string;
}

export function Stepper({ current, steps, className, onStepChange, stepperClassName }: StepperProps) {
  return (
    <div className={cn("relative flex w-full items-center justify-center gap-x-0.5", className)}>
      {steps.map(({ index, label, description, icon }) => (
        <div
          key={index}
          onClick={() => onStepChange?.(index)}
          role="button"
          className={cn(
            "flex flex-1 flex-col gap-y-0.5 p-2",
            current === index && "bg-primary-50/50 text-primary-600",
            current < index && "bg-neutral-200 text-neutral-600",
            current > index && "bg-green-100 text-green-600",
            onStepChange ? "cursor-pointer" : "cursor-default",
            stepperClassName,
          )}
        >
          <div className="flex items-center gap-x-2">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} />
            <div className="flex items-center gap-x-2">
              {icon && <HugeiconsIcon icon={icon} className="size-4" />}
              <span className="text-sm font-medium">{label}</span>
            </div>
          </div>
          <span className="text-xs">{description}</span>
        </div>
      ))}
    </div>
  );
}
