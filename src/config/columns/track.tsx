"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDuration, getBasePathByRole, truncateText } from "@/lib";
import { formatStatus } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { Role, Track } from "@/types";

export const createColumns = (role: Role): ColumnDef<Track>[] => {
  return [
    {
      accessorKey: "name",
      header: "Track",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="font-mono text-xs text-neutral-500">{row.original.code}</span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{truncateText(row.original.description, 50)}</span>,
    },
    {
      accessorKey: "grade_level",
      header: "Grade Level",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.grade_level ? formatStatus(row.original.grade_level) : "-"}</span>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDuration(row.original.duration)}</span>,
    },
    {
      accessorKey: "cohorts",
      header: "Cohorts",
      cell: ({ row }) => <span className="text-sm">{row.original.cohorts?.length ?? 0}</span>,
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
              href={`${getBasePathByRole(role)}/tracks/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/tracks/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
