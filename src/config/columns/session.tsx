import { Delete02Icon, MoreVertical, ViewIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { Session } from "@/types";

const ActionCell = ({ session }: { session: Session }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline">
          <HugeiconsIcon className="size-4" icon={MoreVertical} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56">
        <Link
          className="flex w-full items-start gap-x-2 rounded-md px-3 py-2 text-xs hover:bg-gray-200"
          href={`/admin/sessions/${session.id}`}
        >
          <HugeiconsIcon className="size-4" icon={ViewIcon} />
          <span>View Details</span>
        </Link>
        <button className="flex w-full items-start gap-x-2 rounded-md px-3 py-2 text-xs hover:bg-gray-200">
          <HugeiconsIcon className="size-4" icon={Delete02Icon} />
          <span>Delete</span>
        </button>
      </PopoverContent>
    </Popover>
  );
};

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
    cell: ({ row }) => <ActionCell session={row.original} />,
  },
];
