"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateTime, getBasePathByRole, truncateText } from "@/lib";
import type { AssignmentSubmission, Role } from "@/types";
import { Button } from "@/components/ui/button";

export const createColumns = (role: Role): ColumnDef<AssignmentSubmission>[] => {
  return [
    {
      accessorKey: "student_id",
      header: "Student",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.student_id}</span>,
    },
    {
      accessorKey: "content",
      header: "Content",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{truncateText(row.original.content, 50)}</span>,
    },
    {
      accessorKey: "submitted_at",
      header: "Submitted",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDateTime(row.original.submitted_at)}</span>,
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => (
        <span className={`text-sm font-medium ${row.original.score !== undefined ? "" : "text-neutral-400"}`}>
          {row.original.score !== undefined ? `${row.original.score} pts` : "Not graded"}
        </span>
      ),
    },
    {
      accessorKey: "graded_at",
      header: "Graded",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDateTime(row.original.graded_at)}</span>,
    },
    {
      accessorKey: "attachments",
      header: "Files",
      cell: ({ row }) => <span className="text-sm">{row.original.attachments?.length ?? 0}</span>,
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
              href={`${getBasePathByRole(role)}/submissions/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/submissions/${row.original.id}/grade`}
            >
              Grade
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
