"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, getBasePathByRole, truncateText } from "@/lib";
import type { Announcement, Role } from "@/types";
import { Button } from "@/components/ui/button";

export const createColumns = (role: Role): ColumnDef<Announcement>[] => {
  return [
    {
      accessorKey: "title",
      header: "Announcement",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.title}</span>
            {row.original.is_pinned && (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">Pinned</span>
            )}
          </div>
          <span className="text-xs text-neutral-500">{truncateText(row.original.content, 50)}</span>
        </div>
      ),
    },
    {
      accessorKey: "author_id",
      header: "Author",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.author_id}</span>,
    },
    {
      accessorKey: "published_at",
      header: "Published",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDate(row.original.published_at)}</span>,
    },
    {
      accessorKey: "expires_at",
      header: "Expires",
      cell: ({ row }) => {
        if (!row.original.expires_at) return <span className="text-sm text-neutral-400">Never</span>;
        const isExpired = new Date(row.original.expires_at) < new Date();
        return (
          <span className={`text-sm ${isExpired ? "text-red-600" : "text-neutral-600"}`}>
            {formatDate(row.original.expires_at)}
          </span>
        );
      },
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
              href={`${getBasePathByRole(role)}/announcements/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/announcements/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
