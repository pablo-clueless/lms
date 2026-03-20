import type { ColumnDef } from "@tanstack/react-table";

import { DateCell, ActionCell, ActionIcons } from "./shared";
import type { SystemConfig } from "@/types";

export const configColumns: ColumnDef<SystemConfig>[] = [
  {
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => <div className="max-w-75 truncate">{row.original.value}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "is_sensitive",
    header: "",
    cell: ({ row }) => <span>{row.original.is_sensitive ? "Sensitive" : "Public"}</span>,
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
