"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  CheckmarkSquare02Icon,
  Delete02Icon,
  DragDropVerticalIcon,
  InputShortTextIcon,
  ListChevronsDownUpIcon,
  Mail01Icon,
  RadioButtonIcon,
  TelephoneIcon,
  TextIcon,
  TextNumberSignIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

import type { ApplicationFormFieldDto, FieldType } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib";

interface Props {
  fields: ApplicationFormFieldDto[];
  selectedIndex: number | null;
  onSelectField: (index: number) => void;
  onRemoveField: (index: number) => void;
  onReorderFields: (fields: ApplicationFormFieldDto[]) => void;
}

const FIELD_ICONS: Record<FieldType, typeof InputShortTextIcon> = {
  TEXT: InputShortTextIcon,
  EMAIL: Mail01Icon,
  PHONE: TelephoneIcon,
  NUMBER: TextNumberSignIcon,
  SELECT: ListChevronsDownUpIcon,
  CHECKBOX: CheckmarkSquare02Icon,
  DATE: Calendar01Icon,
  RADIO: RadioButtonIcon,
  TEXTAREA: TextIcon,
  FILE: Upload01Icon,
};

const FIELD_LABELS: Record<FieldType, string> = {
  TEXT: "Text Input",
  EMAIL: "Email",
  PHONE: "Phone",
  NUMBER: "Number",
  SELECT: "Dropdown",
  CHECKBOX: "Checkbox",
  DATE: "Date",
  RADIO: "Radio",
  TEXTAREA: "Textarea",
  FILE: "File Upload",
};

const getWidthStyle = (width: 1 | 2 | 3 | 4) => {
  switch (width) {
    case 1:
      return "calc(25% - 12px)";
    case 2:
      return "calc(50% - 8px)";
    case 3:
      return "calc(75% - 4px)";
    case 4:
      return "100%";
  }
};

interface FieldCardProps {
  field: ApplicationFormFieldDto;
  isSelected?: boolean;
  isDragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
}

const FieldCard = ({ field, isSelected, isDragging, dragHandleProps }: FieldCardProps) => {
  const Icon = FIELD_ICONS[field.type];

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-lg border bg-card p-4 transition-all",
        isSelected ? "border-primary ring-primary/20 ring-2" : "hover:border-primary/50",
        isDragging && "shadow-lg",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="touch-none cursor-grab active:cursor-grabbing" {...dragHandleProps}>
            <HugeiconsIcon icon={DragDropVerticalIcon} className="text-muted-foreground size-4" />
          </div>
          <HugeiconsIcon icon={Icon} className="text-muted-foreground size-4" />
          <span className="text-muted-foreground text-xs">{FIELD_LABELS[field.type]}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          {field.label || "Untitled Field"}
          {field.validation.required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {field.type === "TEXTAREA" ? (
          <div className="bg-muted h-16 w-full rounded-md border px-3 py-2">
            <span className="text-muted-foreground text-xs">{field.placeholder || "Enter text..."}</span>
          </div>
        ) : field.type === "SELECT" ? (
          <div className="bg-muted flex h-9 w-full items-center justify-between rounded-md border px-3">
            <span className="text-muted-foreground text-xs">{field.placeholder || "Select an option"}</span>
            <HugeiconsIcon icon={ListChevronsDownUpIcon} className="text-muted-foreground size-4" />
          </div>
        ) : field.type === "CHECKBOX" ? (
          <div className="flex items-center gap-2">
            <div className="size-4 rounded border" />
            <span className="text-muted-foreground text-xs">{field.placeholder || "Checkbox option"}</span>
          </div>
        ) : field.type === "RADIO" ? (
          <div className="space-y-1.5">
            {(field.options?.length ? field.options : [{ label: "Option 1", value: "1" }]).map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="size-4 rounded-full border" />
                <span className="text-muted-foreground text-xs">{opt.label}</span>
              </div>
            ))}
          </div>
        ) : field.type === "FILE" ? (
          <div className="bg-muted flex h-20 w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed">
            <HugeiconsIcon icon={Upload01Icon} className="text-muted-foreground size-5" />
            <span className="text-muted-foreground text-xs">Click to upload</span>
          </div>
        ) : (
          <div className="bg-muted flex h-9 w-full items-center rounded-md border px-3">
            <span className="text-muted-foreground text-xs">{field.placeholder || "Enter value..."}</span>
          </div>
        )}
        {field.helper_text && <p className="text-muted-foreground text-xs">{field.helper_text}</p>}
      </div>
    </div>
  );
};

interface SortableFieldProps {
  field: ApplicationFormFieldDto;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

const SortableField = ({ field, index, isSelected, onSelect, onRemove }: SortableFieldProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `field-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: getWidthStyle(field.width),
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = FIELD_ICONS[field.type];

  return (
    <div ref={setNodeRef} style={style} onClick={onSelect}>
      <div
        className={cn(
          "group relative cursor-pointer rounded-lg border bg-card p-4 transition-all h-full",
          isSelected ? "border-primary ring-primary/20 ring-2" : "hover:border-primary/50",
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="touch-none cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <HugeiconsIcon icon={DragDropVerticalIcon} className="text-muted-foreground size-4" />
            </button>
            <HugeiconsIcon icon={Icon} className="text-muted-foreground size-4" />
            <span className="text-muted-foreground text-xs">{FIELD_LABELS[field.type]}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <HugeiconsIcon icon={Delete02Icon} className="size-3.5 text-red-500" />
          </Button>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {field.label || "Untitled Field"}
            {field.validation.required && <span className="ml-1 text-red-500">*</span>}
          </label>
          {field.type === "TEXTAREA" ? (
            <div className="bg-muted h-16 w-full rounded-md border px-3 py-2">
              <span className="text-muted-foreground text-xs">{field.placeholder || "Enter text..."}</span>
            </div>
          ) : field.type === "SELECT" ? (
            <div className="bg-muted flex h-9 w-full items-center justify-between rounded-md border px-3">
              <span className="text-muted-foreground text-xs">{field.placeholder || "Select an option"}</span>
              <HugeiconsIcon icon={ListChevronsDownUpIcon} className="text-muted-foreground size-4" />
            </div>
          ) : field.type === "CHECKBOX" ? (
            <div className="flex items-center gap-2">
              <div className="size-4 rounded border" />
              <span className="text-muted-foreground text-xs">{field.placeholder || "Checkbox option"}</span>
            </div>
          ) : field.type === "RADIO" ? (
            <div className="space-y-1.5">
              {(field.options?.length ? field.options : [{ label: "Option 1", value: "1" }]).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="size-4 rounded-full border" />
                  <span className="text-muted-foreground text-xs">{opt.label}</span>
                </div>
              ))}
            </div>
          ) : field.type === "FILE" ? (
            <div className="bg-muted flex h-20 w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed">
              <HugeiconsIcon icon={Upload01Icon} className="text-muted-foreground size-5" />
              <span className="text-muted-foreground text-xs">Click to upload</span>
            </div>
          ) : (
            <div className="bg-muted flex h-9 w-full items-center rounded-md border px-3">
              <span className="text-muted-foreground text-xs">{field.placeholder || "Enter value..."}</span>
            </div>
          )}
          {field.helper_text && <p className="text-muted-foreground text-xs">{field.helper_text}</p>}
        </div>
      </div>
    </div>
  );
};

export const Form = ({ fields, selectedIndex, onSelectField, onRemoveField, onReorderFields }: Props) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(String(active.id).replace("field-", ""));
      const newIndex = parseInt(String(over.id).replace("field-", ""));

      const newFields = arrayMove(fields, oldIndex, newIndex);
      onReorderFields(newFields);
    }
  };

  const activeIndex = activeId ? parseInt(activeId.replace("field-", "")) : null;
  const activeField = activeIndex !== null ? fields[activeIndex] : null;

  if (fields.length === 0) {
    return (
      <div className="grid h-100 w-full place-items-center rounded-md border border-dashed">
        <div className="flex flex-col items-center gap-y-2 text-center">
          <div className="bg-muted flex size-12 items-center justify-center rounded-full">
            <HugeiconsIcon icon={InputShortTextIcon} className="text-muted-foreground size-6" />
          </div>
          <div>
            <p className="font-medium">No fields added</p>
            <p className="text-muted-foreground text-sm">Click on a field type from the palette to add it</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-md border p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fields.map((_, index) => `field-${index}`)} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-4">
            {fields.map((field, index) => (
              <SortableField
                key={`field-${index}`}
                field={field}
                index={index}
                isSelected={selectedIndex === index}
                onSelect={() => onSelectField(index)}
                onRemove={() => onRemoveField(index)}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeField ? (
            <div style={{ width: getWidthStyle(activeField.width) }}>
              <FieldCard field={activeField} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
