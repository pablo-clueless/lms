"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateTime, getBasePathByRole, truncateText } from "@/lib";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { Role, Session } from "@/types";

export const createColumns = (role: Role): ColumnDef<Session>[] => {
  return [
    {
      accessorKey: "title",
      header: "Session",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.title}</span>
          <span className="text-xs text-neutral-500">{truncateText(row.original.description, 40)}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <StatusBadge status={row.original.type} />,
    },
    {
      accessorKey: "start_time",
      header: "Start",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDateTime(row.original.start_time)}</span>,
    },
    {
      accessorKey: "end_time",
      header: "End",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDateTime(row.original.end_time)}</span>,
    },
    {
      accessorKey: "tutor_id",
      header: "Tutor",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.tutor_id}</span>,
    },
    {
      accessorKey: "meeting_link",
      header: "Meeting",
      cell: ({ row }) =>
        row.original.meeting_link ? (
          <a
            href={row.original.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm hover:underline"
          >
            Join
          </a>
        ) : (
          <span className="text-sm text-neutral-400">-</span>
        ),
    },
    {
      accessorKey: "attendance",
      header: "Attendance",
      cell: ({ row }) => <span className="text-sm">{row.original.attendance?.length ?? 0}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon-sm" variant="ghost">
              <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-32 p-1">
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/sessions/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/sessions/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
