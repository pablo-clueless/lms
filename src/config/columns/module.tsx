"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDuration, getBasePathByRole, truncateText } from "@/lib";
import { Button } from "@/components/ui/button";
import type { Module, Role } from "@/types";

export const createColumns = (role: Role): ColumnDef<Module>[] => {
  return [
    {
      accessorKey: "order",
      header: "#",
      cell: ({ row }) => <span className="text-sm font-medium text-neutral-500">{row.original.order}</span>,
    },
    {
      accessorKey: "title",
      header: "Module",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.title}</span>
          <span className="text-xs text-neutral-500">{truncateText(row.original.description, 40)}</span>
        </div>
      ),
    },
    {
      accessorKey: "is_published",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            row.original.is_published ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-700"
          }`}
        >
          {row.original.is_published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDuration(row.original.duration)}</span>,
    },
    {
      accessorKey: "resources",
      header: "Resources",
      cell: ({ row }) => <span className="text-sm">{row.original.resources?.length ?? 0}</span>,
    },
    {
      accessorKey: "requires_quiz",
      header: "Quiz",
      cell: ({ row }) => (
        <span className={`text-sm ${row.original.requires_quiz ? "text-amber-600" : "text-neutral-400"}`}>
          {row.original.requires_quiz ? "Required" : "None"}
        </span>
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
              href={`${getBasePathByRole(role)}/modules/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/modules/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
