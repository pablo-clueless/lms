"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, getBasePathByRole, truncateText } from "@/lib";
import type { EmailTemplate, Role } from "@/types";
import { Button } from "@/components/ui/button";

export const createColumns = (role: Role): ColumnDef<EmailTemplate>[] => {
  return [
    {
      accessorKey: "name",
      header: "Template",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.name}</span>
            {row.original.is_default && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">Default</span>
            )}
          </div>
          <span className="text-xs text-neutral-500">{row.original.subject}</span>
        </div>
      ),
    },
    {
      accessorKey: "body",
      header: "Preview",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{truncateText(row.original.body, 50)}</span>,
    },
    {
      accessorKey: "variables",
      header: "Variables",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.variables?.slice(0, 3).map((v) => (
            <span key={v} className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs">
              {`{{${v}}}`}
            </span>
          ))}
          {(row.original.variables?.length ?? 0) > 3 && (
            <span className="text-xs text-neutral-500">+{row.original.variables!.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: "Updated",
      cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDate(row.original.updated_at)}</span>,
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
              href={`${getBasePathByRole(role)}/email-templates/${row.original.id}`}
            >
              View
            </Link>
            <Link
              className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
              href={`${getBasePathByRole(role)}/email-templates/${row.original.id}/edit`}
            >
              Edit
            </Link>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
