"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, getBasePathByRole } from "@/lib";
import { Button } from "@/components/ui/button";
import type { Cohort, Role } from "@/types";

export const createColumns = (role: Role): ColumnDef<Cohort>[] => {
  return [
    {
      accessorKey: "name",
      header: "Cohort",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-neutral-500">{row.original.tracks?.length ?? 0} tracks</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "max_students",
      header: "Capacity",
      cell: ({ row }) => <span className="text-sm">{row.original.max_students} students</span>,
    },
    {
      accessorKey: "application_start_date",
      header: "Applications",
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span>{formatDate(row.original.application_start_date)}</span>
          <span className="text-xs text-neutral-500">to {formatDate(row.original.application_end_date)}</span>
        </div>
      ),
    },
    {
      accessorKey: "start_date",
      header: "Duration",
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
              href={`${getBasePathByRole(role)}/cohorts/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/cohorts/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
