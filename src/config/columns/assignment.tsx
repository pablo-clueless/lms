"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, getBasePathByRole, truncateText } from "@/lib";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { Assignment, Role } from "@/types";

export const createColumns = (role: Role): ColumnDef<Assignment>[] => {
  return [
    {
      accessorKey: "title",
      header: "Assignment",
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
      accessorKey: "max_score",
      header: "Max Score",
      cell: ({ row }) => <span className="text-sm">{row.original.max_score} pts</span>,
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => {
        const isOverdue = new Date(row.original.due_date) < new Date();
        return (
          <span className={`text-sm ${isOverdue ? "text-red-600" : "text-neutral-600"}`}>
            {formatDate(row.original.due_date)}
          </span>
        );
      },
    },
    {
      accessorKey: "attachments",
      header: "Files",
      cell: ({ row }) => <span className="text-sm">{row.original.attachments?.length ?? 0}</span>,
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
              href={`${getBasePathByRole(role)}/assignments/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/assignments/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
