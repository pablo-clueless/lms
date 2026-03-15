"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, getBasePathByRole } from "@/lib";
import { Button } from "@/components/ui/button";
import type { Enrollment, Role } from "@/types";

export const createColumns = (role: Role): ColumnDef<Enrollment>[] => {
  return [
    {
      accessorKey: "student_id",
      header: "Student",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.student_id}</span>,
    },
    {
      accessorKey: "course_id",
      header: "Course",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.course_id}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${row.original.progress}%` }}
            />
          </div>
          <span className="text-xs text-neutral-600">{row.original.progress}%</span>
        </div>
      ),
    },
    {
      accessorKey: "final_grade",
      header: "Grade",
      cell: ({ row }) => (
        <span className={`text-sm font-medium ${row.original.final_grade !== undefined ? "" : "text-neutral-400"}`}>
          {row.original.final_grade !== undefined ? `${row.original.final_grade}%` : "-"}
        </span>
      ),
    },
    {
      accessorKey: "enrolled_at",
      header: "Enrolled",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDate(row.original.enrolled_at)}</span>,
    },
    {
      accessorKey: "completed_at",
      header: "Completed",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDate(row.original.completed_at)}</span>,
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
              href={`${getBasePathByRole(role)}/enrollments/${row.original.id}`}
            >
              View
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
