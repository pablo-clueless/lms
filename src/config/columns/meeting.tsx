import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, DateTimeCell, ActionCell, ActionIcons } from "./shared";
import type { Meeting } from "@/types";

export const meetingColumns: ColumnDef<Meeting>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => (
      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium">{row.original.provider}</span>
    ),
  },
  {
    accessorKey: "scheduled_start",
    header: "Scheduled Start",
    cell: ({ row }) => <DateTimeCell date={row.original.scheduled_start} />,
  },
  {
    accessorKey: "estimated_duration",
    header: "Duration",
    cell: ({ row }) => <span>{row.original.estimated_duration} mins</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "participants",
    header: "Participants",
    cell: ({ row }) => <span>{row.original.participant_events?.length || 0}</span>,
  },
  {
    id: "recording",
    header: "Recording",
    cell: ({ row }) => (
      <span className={row.original.recording_url ? "text-green-600" : "text-gray-400"}>
        {row.original.recording_url ? "Available" : "N/A"}
      </span>
    ),
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
