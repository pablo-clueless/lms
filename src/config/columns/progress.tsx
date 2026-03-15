"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateTime, getBasePathByRole } from "@/lib";
import { Button } from "@/components/ui/button";
import type { Progress, Role } from "@/types";

export const createColumns = (role: Role): ColumnDef<Progress>[] => {
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
      accessorKey: "percentage",
      header: "Progress",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-200">
            <div
              className={`h-full rounded-full transition-all ${
                row.original.percentage === 100
                  ? "bg-emerald-500"
                  : row.original.percentage >= 50
                    ? "bg-blue-500"
                    : "bg-amber-500"
              }`}
              style={{ width: `${row.original.percentage}%` }}
            />
          </div>
          <span className="text-xs font-medium text-neutral-600">{row.original.percentage}%</span>
        </div>
      ),
    },
    {
      accessorKey: "completed_modules",
      header: "Modules",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.completed_modules} / {row.original.total_modules}
        </span>
      ),
    },
    {
      accessorKey: "last_accessed_at",
      header: "Last Active",
      cell: ({ row }) => (
        <span className="text-sm text-neutral-600">{formatDateTime(row.original.last_accessed_at)}</span>
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
              href={`${getBasePathByRole(role)}/progress/${row.original.id}`}
            >
              View Details
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
