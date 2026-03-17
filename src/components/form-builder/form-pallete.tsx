"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Calendar01Icon,
  CheckmarkSquare02Icon,
  InputShortTextIcon,
  ListChevronsDownUpIcon,
  Mail01Icon,
  RadioButtonIcon,
  TelephoneIcon,
  TextIcon,
  TextNumberSignIcon,
} from "@hugeicons/core-free-icons";

import type { FieldType } from "@/types";

interface Props {
  onAddField: (type: FieldType) => void;
}

type Field = {
  label: string;
  type: FieldType;
  icon: IconSvgElement;
};

const FIELDS: Field[] = [
  { label: "input", icon: InputShortTextIcon, type: "TEXT" },
  { label: "email", icon: Mail01Icon, type: "EMAIL" },
  { label: "phone", icon: TelephoneIcon, type: "PHONE" },
  { label: "number", icon: TextNumberSignIcon, type: "NUMBER" },
  { label: "dropdown", icon: ListChevronsDownUpIcon, type: "SELECT" },
  { label: "checkbox", icon: CheckmarkSquare02Icon, type: "CHECKBOX" },
  { label: "date", icon: Calendar01Icon, type: "DATE" },
  { label: "radio", icon: RadioButtonIcon, type: "RADIO" },
  { label: "textarea", icon: TextIcon, type: "TEXTAREA" },
  { label: "file", icon: InputShortTextIcon, type: "FILE" },
];

export const FormPallete = ({ onAddField }: Props) => {
  return (
    <div className="w-full space-y-2">
      {FIELDS.map((field, index) => (
        <button
          className="flex h-9 w-full items-center gap-x-2 rounded-md border px-3 transition-all duration-500 hover:shadow"
          key={index}
          onClick={() => onAddField(field.type)}
        >
          <HugeiconsIcon icon={field.icon} className="size-4" />
          <span className="text-sm capitalize">{field.label}</span>
        </button>
      ))}
    </div>
  );
};
