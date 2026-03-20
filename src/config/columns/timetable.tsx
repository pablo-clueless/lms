import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateCell, DateTimeCell, ActionCell, ActionIcons } from "./shared";
import type { Timetable } from "@/types";

export const timetableColumns: ColumnDef<Timetable>[] = [
  {
    accessorKey: "class_id",
    header: "Class",
    cell: ({ row }) => <span>{row.original.class_id}</span>,
  },
  {
    accessorKey: "term_id",
    header: "Term",
    cell: ({ row }) => <span>{row.original.term_id}</span>,
  },
  {
    accessorKey: "generation_version",
    header: "Version",
    cell: ({ row }) => <span className="font-mono">v{row.original.generation_version}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "generated_at",
    header: "Generated At",
    cell: ({ row }) => <DateTimeCell date={row.original.generated_at} />,
  },
  {
    accessorKey: "published_at",
    header: "Published At",
    cell: ({ row }) => <DateTimeCell date={row.original.published_at} />,
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
          { label: "View Timetable", icon: ActionIcons.View, onClick: () => console.log("View", row.original.id) },
          { label: "Edit", icon: ActionIcons.Edit, onClick: () => console.log("Edit", row.original.id) },
          {
            label: "Archive",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Archive", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];
