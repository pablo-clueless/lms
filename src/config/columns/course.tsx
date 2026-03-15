"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDuration, getBasePathByRole, truncateText } from "@/lib";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { Course, Role } from "@/types";

export const createColumns = (role: Role): ColumnDef<Course>[] => {
  return [
    {
      accessorKey: "title",
      header: "Course",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-10 rounded">
            <AvatarImage src={row.original.thumbnail} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.title}</span>
            <span className="text-xs text-neutral-500">{row.original.code}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{truncateText(row.original.description, 60)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "modules",
      header: "Modules",
      cell: ({ row }) => <span className="text-sm">{row.original.modules?.length ?? 0}</span>,
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDuration(row.original.duration)}</span>,
    },
    {
      accessorKey: "pass_threshold",
      header: "Pass %",
      cell: ({ row }) => <span className="text-sm">{row.original.pass_threshold}%</span>,
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
              href={`${getBasePathByRole(role)}/courses/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/courses/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
