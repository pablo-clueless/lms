import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateCell, ActionCell, ActionIcons } from "./shared";
import type { Tenant } from "@/types";

export const tenantColumns: ColumnDef<Tenant>[] = [
  {
    id: "school",
    header: "School",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-3">
        {row.original.logo && (
          <img src={row.original.logo} alt={row.original.name} className="size-8 rounded-full object-cover" />
        )}
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-gray-500">{row.original.contact_email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "school_type",
    header: "Type",
    cell: ({ row }) => <span className="capitalize">{row.original.school_type?.toLowerCase()}</span>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <span className="max-w-xs truncate">{row.original.address || "N/A"}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "created_at",
    header: "Date Registered",
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
            label: "Suspend",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Suspend", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];
