import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { ActionCell, ActionIcons } from "./shared";
import type { Session } from "@/types";
import { Archive02Icon } from "@hugeicons/core-free-icons";

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "start_year",
    header: "Start Year",
  },
  {
    accessorKey: "end_year",
    header: "End Year",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }) => <span>{format(row.original.created_at, "dd/MM/yyyy")}</span>,
  },
  {
    accessorKey: "archived_at",
    header: "Date Archived",
    cell: ({ row }) => <span>{row.original.archived_at ? format(row.original.archived_at, "dd/MM/yyyy") : "N/A"}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          { label: "View Details", icon: ActionIcons.View, href: `/admin/sessions/${row.original.id}` },
          { label: "Edit", icon: ActionIcons.Edit, onClick: () => console.log("Edit", row.original.id) },
          { label: "Archive", icon: Archive02Icon, onClick: () => console.log("Archive", row.original.id) },
        ]}
      />
    ),
  },
];
