"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateTime, getBasePathByRole, truncateText } from "@/lib";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import type { Notification, Role } from "@/types";

export const createColumns = (role: Role): ColumnDef<Notification>[] => {
  return [
    {
      accessorKey: "title",
      header: "Notification",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${row.original.is_read ? "text-neutral-500" : ""}`}>
              {row.original.title}
            </span>
            {!row.original.is_read && <span className="size-2 rounded-full bg-blue-500" />}
          </div>
          <span className="text-xs text-neutral-500">{truncateText(row.original.message, 50)}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <StatusBadge status={row.original.type} />,
    },
    {
      accessorKey: "user_id",
      header: "User",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.user_id}</span>,
    },
    {
      accessorKey: "is_read",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            row.original.is_read ? "bg-neutral-100 text-neutral-700" : "bg-blue-100 text-blue-700"
          }`}
        >
          {row.original.is_read ? "Read" : "Unread"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Received",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDateTime(row.original.created_at)}</span>,
    },
    {
      accessorKey: "read_at",
      header: "Read At",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDateTime(row.original.read_at)}</span>,
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
              href={`${getBasePathByRole(role)}/notifications/${row.original.id}`}
            >
              View
            </Link>
            {row.original.link && (
              <Link className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100" href={row.original.link}>
                Go to Link
              </Link>
            )}
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
