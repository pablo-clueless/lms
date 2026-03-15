"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, getBasePathByRole } from "@/lib";
import { Button } from "@/components/ui/button";
import type { Role, Student } from "@/types";

export const createColumns = (role: Role): ColumnDef<Student>[] => {
  return [
    {
      accessorKey: "student_number",
      header: "Student ID",
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.student_number}</span>,
    },
    {
      accessorKey: "user_id",
      header: "User ID",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.user_id}</span>,
    },
    {
      accessorKey: "enrollment_date",
      header: "Enrolled",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDate(row.original.enrollment_date)}</span>,
    },
    {
      accessorKey: "graduation_date",
      header: "Graduated",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDate(row.original.graduation_date)}</span>,
    },
    {
      accessorKey: "applications",
      header: "Applications",
      cell: ({ row }) => <span className="text-sm">{row.original.applications?.length ?? 0}</span>,
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
              href={`${getBasePathByRole(role)}/students/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/students/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
