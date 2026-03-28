import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateCell, ActionCell, ActionIcons } from "./shared";
import { fromSnakeCase, getBasePathByRole } from "@/lib";
import type { Class, Role } from "@/types";

export const classColumns = (role: Role): ColumnDef<Class>[] => [
  {
    accessorKey: "name",
    header: "Class Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "arm",
    header: "Arm",
    cell: ({ row }) => <span>{row.original.arm || "N/A"}</span>,
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => <span className="capitalize">{fromSnakeCase(row.original.level?.toLowerCase()) || "N/A"}</span>,
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => <span>{row.original.capacity || "Unlimited"}</span>,
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
            href: `${getBasePathByRole(role)}/classes/${row.original.id}`,
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
