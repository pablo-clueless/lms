import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateCell, ActionCell, ActionIcons } from "./shared";
import type { Course } from "@/types";

export const courseColumns: ColumnDef<Course>[] = [
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
          { label: "View Details", icon: ActionIcons.View, onClick: () => console.log("View", row.original.id) },
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
