"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, getBasePathByRole, truncateText } from "@/lib";
import { Button } from "@/components/ui/button";
import type { Role, User } from "@/types";

export const createColumns = (role: Role): ColumnDef<User>[] => {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-neutral-500">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "headline",
      header: "Headline",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.original.tutor?.headline || "—"}</span>
          <span className="text-xs text-neutral-500">{truncateText(row.original.tutor?.bio || "", 40)}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "years_of_experience",
      header: "Experience",
      cell: ({ row }) => {
        const years = row.original.tutor?.years_of_experience;
        return (
          <span className="text-sm">
            {years ? `${years} ${years === 1 ? "year" : "years"}` : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "specialities",
      header: "Specialities",
      cell: ({ row }) => {
        const specialities = row.original.tutor?.specialities;
        if (!specialities || specialities.length === 0) {
          return <span className="text-sm text-neutral-500">—</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {specialities.slice(0, 2).map((s) => (
              <span key={s} className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">
                {s}
              </span>
            ))}
            {specialities.length > 2 && (
              <span className="text-xs text-neutral-500">+{specialities.length - 2}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "last_login_at",
      header: "Last Login",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDate(row.original.last_login_at)}</span>,
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
              href={`${getBasePathByRole(role)}/tutors/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/tutors/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
