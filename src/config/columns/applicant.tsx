"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, getBasePathByRole } from "@/lib";
import { Button } from "@/components/ui/button";
import type { Applicant, Role } from "@/types";

interface ColumnOptions {
  onReview?: (applicant: Applicant) => void;
}

export const createColumns = (role: Role, options?: ColumnOptions): ColumnDef<Applicant>[] => {
  return [
    {
      accessorKey: "name",
      header: "Applicant",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-neutral-500">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "cohort_id",
      header: "Cohort",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.cohort_id}</span>,
    },
    {
      accessorKey: "track_id",
      header: "Track",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.track_id}</span>,
    },
    {
      accessorKey: "submitted_at",
      header: "Submitted",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDate(row.original.submitted_at)}</span>,
    },
    {
      accessorKey: "created_at",
      header: "Applied",
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
              href={`${getBasePathByRole(role)}/applicants/${row.original.id}`}
            >
              View
            </Link>
            {options?.onReview ? (
              <button
                type="button"
                className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-neutral-100"
                onClick={() => options.onReview?.(row.original)}
              >
                Review
              </button>
            ) : (
              <Link
                className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
                href={`${getBasePathByRole(role)}/applicants/${row.original.id}/review`}
              >
                Review
              </Link>
            )}
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
