import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateTimeCell, ActionCell, ActionIcons } from "./shared";
import type { AuditLog } from "@/types";

export const auditLogColumns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium">
        {row.original.action.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    accessorKey: "resource_type",
    header: "Resource Type",
    cell: ({ row }) => <span className="capitalize">{row.original.resource_type.toLowerCase()}</span>,
  },
  {
    accessorKey: "resource_name",
    header: "Resource",
    cell: ({ row }) => <span>{row.original.resource_name || row.original.resource_id}</span>,
  },
  {
    accessorKey: "actor_role",
    header: "Actor Role",
    cell: ({ row }) => <StatusBadge status={row.original.actor_role} />,
  },
  {
    id: "is_sensitive",
    header: "Sensitive",
    cell: ({ row }) => (
      <span className={row.original.is_sensitive ? "text-red-600" : "text-gray-400"}>
        {row.original.is_sensitive ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.ip_address}</span>,
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => <DateTimeCell date={row.original.timestamp} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          { label: "View Details", icon: ActionIcons.View, onClick: () => console.log("View", row.original.id) },
        ]}
      />
    ),
  },
];
