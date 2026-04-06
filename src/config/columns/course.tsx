import type { ColumnDef } from "@tanstack/react-table";
import { CopyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { StatusBadge, DateCell, ActionCell, ActionIcons } from "./shared";
import type { Course, Role, User } from "@/types";
import { getBasePathByRole } from "@/lib";
import { useCopy } from "@/hooks";

const Tutor = ({ tutor }: { tutor: User }) => {
  const { handleCopy } = useCopy(tutor.email);
  const name = `${tutor.first_name} ${tutor.last_name}`;

  return (
    <div className="max-w-85">
      <p className="text-foreground text-sm">{name}</p>
      <div className="flex w-full items-center justify-between">
        <p className="text-muted-foreground text-xs">{tutor.email}</p>
        <button onClick={handleCopy}>
          <HugeiconsIcon className="size-4" icon={CopyIcon} />
        </button>
      </div>
    </div>
  );
};

export const courseColumns = (role: Role): ColumnDef<Course>[] => [
  {
    accessorKey: "name",
    header: "Course Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "subject_code",
    header: "Code",
    cell: ({ row }) => (
      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium">{row.original.subject_code}</span>
    ),
  },
  {
    id: "tutor",
    header: "Tutor",
    cell: ({ row }) => <Tutor tutor={row.original.assigned_tutor} />,
  },
  {
    accessorKey: "max_periods_per_week",
    header: "Periods/Week",
    cell: ({ row }) => <span>{row.original.max_periods_per_week || "N/A"}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }) => <DateCell date={row.original.created_at} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          {
            label: "View Details",
            icon: ActionIcons.View,
            href: `${getBasePathByRole(role)}/courses/${row.original.id}`,
          },
          { label: "Edit", icon: ActionIcons.Edit, onClick: () => console.log("Edit", row.original.id) },
          {
            label: "Delete",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Delete", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];

export const studentCourseColumns: ColumnDef<Course>[] = [
  {
    accessorKey: "name",
    header: "Course Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "subject_code",
    header: "Code",
    cell: ({ row }) => (
      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium">{row.original.subject_code}</span>
    ),
  },
  {
    accessorKey: "max_periods_per_week",
    header: "Periods/Week",
    cell: ({ row }) => <span>{row.original.max_periods_per_week || "N/A"}</span>,
  },
  {
    id: "tutor",
    header: "Tutor",
    cell: ({ row }) => <Tutor tutor={row.original.assigned_tutor} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }) => <DateCell date={row.original.created_at} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          {
            label: "View Details",
            icon: ActionIcons.View,
            href: `/student/class/courses/${row.original.id}`,
          },
          { label: "Edit", icon: ActionIcons.Edit, onClick: () => console.log("Edit", row.original.id) },
          {
            label: "Delete",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Delete", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];
