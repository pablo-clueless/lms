import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateTimeCell, ActionCell, ActionIcons } from "./shared";
import type { Email, Notification } from "@/types";
import { fromSnakeCase } from "@/lib";

// Email columns
export const emailColumns: ColumnDef<Email>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <span className="max-w-xs truncate font-medium">{row.original.subject}</span>,
  },
  {
    accessorKey: "recipient_scope",
    header: "Recipients",
    cell: ({ row }) => <span className="capitalize">{fromSnakeCase(row.original.recipient_scope)}</span>,
  },
  {
    accessorKey: "total_recipients",
    header: "Total",
    cell: ({ row }) => <span>{row.original.total_recipients}</span>,
  },
  {
    id: "delivery",
    header: "Delivered",
    cell: ({ row }) => (
      <span>
        {row.original.success_count}/{row.original.total_recipients}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "scheduled_for",
    header: "Scheduled For",
    cell: ({ row }) => <DateTimeCell date={row.original.scheduled_for} />,
  },
  {
    accessorKey: "sent_at",
    header: "Sent At",
    cell: ({ row }) => <DateTimeCell date={row.original.sent_at} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          { label: "View Details", icon: ActionIcons.View, onClick: () => console.log("View", row.original.id) },
          {
            label: "Cancel",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Cancel", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];

// Notification columns
export const notificationColumns: ColumnDef<Notification>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="max-w-xs truncate font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "event_type",
    header: "Event Type",
    cell: ({ row }) => (
      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">
        {fromSnakeCase(row.original.event_type.toLowerCase())}
      </span>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const colors: Record<string, string> = {
        LOW: "text-gray-600",
        NORMAL: "text-blue-600",
        HIGH: "text-orange-600",
        URGENT: "text-red-600",
      };
      return <span className={colors[row.original.priority] || "text-gray-600"}>{row.original.priority}</span>;
    },
  },
  {
    id: "channels",
    header: "Channels",
    cell: ({ row }) => <span>{row.original.channels?.join(", ") || "N/A"}</span>,
  },
  {
    id: "is_read",
    header: "Read",
    cell: ({ row }) => (
      <span className={row.original.is_read ? "text-green-600" : "text-gray-400"}>
        {row.original.is_read ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => <DateTimeCell date={row.original.created_at} />,
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
