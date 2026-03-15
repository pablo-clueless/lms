"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusBadge, formatStatus } from "@/components/shared/status-badge";
import { formatDate, formatDuration, getBasePathByRole } from "@/lib";
import type { Examination, Role } from "@/types";
import { Button } from "@/components/ui/button";

export const createColumns = (role: Role): ColumnDef<Examination>[] => {
  return [
    {
      accessorKey: "title",
      header: "Examination",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.title}</span>
          <span className="text-xs text-neutral-500">{formatStatus(row.original.type)}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "exam_date",
      header: "Date",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDate(row.original.exam_date)}</span>,
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDuration(row.original.duration)}</span>,
    },
    {
      accessorKey: "max_score",
      header: "Max Score",
      cell: ({ row }) => <span className="text-sm">{row.original.max_score} pts</span>,
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDate(row.original.created_at)}</span>,
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
              href={`${getBasePathByRole(role)}/examinations/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/examinations/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
