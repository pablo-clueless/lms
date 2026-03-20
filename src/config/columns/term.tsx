import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateCell, ActionCell, ActionIcons } from "./shared";
import type { Term } from "@/types";

const ordinalLabels: Record<string, string> = {
  FIRST: "First Term",
  SECOND: "Second Term",
  THIRD: "Third Term",
};

export const termColumns: ColumnDef<Term>[] = [
  {
    accessorKey: "ordinal",
    header: "Term",
    cell: ({ row }) => (
      <span className="font-medium">{ordinalLabels[row.original.ordinal] || row.original.ordinal}</span>
    ),
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => <DateCell date={row.original.start_date} />,
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => <DateCell date={row.original.end_date} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "holidays",
    header: "Holidays",
    cell: ({ row }) => <span>{row.original.holidays?.length || 0}</span>,
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
