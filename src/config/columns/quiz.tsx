"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, formatDuration, getBasePathByRole, truncateText } from "@/lib";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { Quiz, Role } from "@/types";

export const createColumns = (role: Role): ColumnDef<Quiz>[] => {
  return [
    {
      accessorKey: "title",
      header: "Quiz",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.title}</span>
          <span className="text-xs text-neutral-500">{truncateText(row.original.description, 40)}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "questions",
      header: "Questions",
      cell: ({ row }) => <span className="text-sm">{row.original.questions?.length ?? 0}</span>,
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDuration(row.original.duration)}</span>,
    },
    {
      accessorKey: "pass_threshold",
      header: "Pass %",
      cell: ({ row }) => <span className="text-sm">{row.original.pass_threshold}%</span>,
    },
    {
      accessorKey: "max_attempts",
      header: "Attempts",
      cell: ({ row }) => <span className="text-sm">{row.original.max_attempts}</span>,
    },
    {
      accessorKey: "start_date",
      header: "Available",
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span>{formatDate(row.original.start_date)}</span>
          <span className="text-xs text-neutral-500">to {formatDate(row.original.end_date)}</span>
        </div>
      ),
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
              href={`${getBasePathByRole(role)}/quizzes/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/quizzes/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
