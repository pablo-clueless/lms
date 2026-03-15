"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateTime, getBasePathByRole, truncateText } from "@/lib";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { Attendance, Role } from "@/types";

export const createColumns = (role: Role): ColumnDef<Attendance>[] => {
  return [
    {
      accessorKey: "student_id",
      header: "Student",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.student_id}</span>,
    },
    {
      accessorKey: "session_id",
      header: "Session",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.session_id}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "check_in_at",
      header: "Check In",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDateTime(row.original.check_in_at)}</span>,
    },
    {
      accessorKey: "check_out_at",
      header: "Check Out",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDateTime(row.original.check_out_at)}</span>,
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <span className="text-sm text-neutral-600">{truncateText(row.original.notes ?? "-", 30)}</span>
      ),
    },
    {
      accessorKey: "marked_by",
      header: "Marked By",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.marked_by}</span>,
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
              href={`${getBasePathByRole(role)}/attendance/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/attendance/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
