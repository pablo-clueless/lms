"use client";

import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, getBasePathByRole } from "@/lib";
import { Button } from "@/components/ui/button";
import type { Role, Tenant } from "@/types";

export const createColumns = (role: Role): ColumnDef<Tenant>[] => {
  return [
    {
      accessorKey: "name",
      header: "Tenant",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8 rounded">
            <AvatarImage src={row.original.logo || ""} />
            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-neutral-500">{row.original.slug}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.original.email}</span>
          <span className="text-xs text-neutral-500">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "city",
      header: "Location",
      cell: ({ row }) => (
        <span className="text-sm text-neutral-600">
          {[row.original.city, row.original.country].filter(Boolean).join(", ") || "-"}
        </span>
      ),
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
            <div className="space-y-1">
              <Link
                className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
                href={`${getBasePathByRole(role)}/tenants/${row.original.id}`}
              >
                View
              </Link>
              <Link
                className="block w-full rounded px-2 py-1.5 text-sm hover:bg-neutral-100"
                href={`${getBasePathByRole(role)}/tenants/${row.original.id}/edit`}
              >
                Edit
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ];
};
