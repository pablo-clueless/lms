import { Delete, Edit, MoreVertical } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib";

export type ActionVariant = "default" | "destructive" | "info" | "success" | "warning";

const variants: Record<ActionVariant, string> = {
  default: "text-gray-500 hover:bg-gray-200",
  destructive: "text-red-600 hover:bg-red-50",
  info: "text-blue-600 hover:bg-blue-50",
  success: "text-green-600 hover:bg-green-50",
  warning: "text-yellow-600 hover:bg-yellow-50",
};

export interface ActionItem<T = unknown> {
  label: string;
  icon: IconSvgElement;
  hidden?: boolean | ((rowItem: T) => boolean);
  href?: string | ((rowItem: T) => string);
  onClick?: (rowItem: T) => void;
  variant?: ActionVariant | (string & {});
}

interface ActionCellsProps<T extends object> {
  actions: (rowItem: T) => ActionItem<T>[];
  rowItem: T;
  baseHref?: string;
}

interface CreateTableColumnsProps<T> {
  columns: ColumnDef<T>[];
  actions?: (rowItem: T) => ActionItem<T>[];
  actionColumnHeader?: string;
  actionColumnId?: string;
  baseHref?: string;
}

export const ActionCells = <T extends object>({ actions, rowItem, baseHref }: ActionCellsProps<T>) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <HugeiconsIcon className="size-4" icon={MoreVertical} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1">
        {actions(rowItem).map((action, index) => {
          const href = action.href ? (typeof action.href === "function" ? action.href(rowItem) : action.href) : "";
          const finalHref = baseHref && href ? `${baseHref}${href}` : href;

          return action.href ? (
            <Link
              key={index}
              href={finalHref}
              className={cn(
                "flex w-full items-center gap-x-2 rounded-md px-2.5 py-2 text-xs hover:bg-gray-200",
                variants[action.variant as ActionVariant],
                (typeof action.hidden === "function" ? action.hidden(rowItem) : action.hidden) && "hidden",
              )}
            >
              <HugeiconsIcon className="size-4" icon={action.icon} />
              <span>{action.label}</span>
            </Link>
          ) : (
            <button
              key={index}
              onClick={() => action.onClick?.(rowItem)}
              className={cn(
                "flex w-full items-center gap-x-2 rounded-md px-2.5 py-2 text-xs hover:bg-gray-200",
                action.variant === "danger" && "text-red-600 hover:bg-red-50",
                action.hidden && "hidden",
              )}
            >
              <HugeiconsIcon className="size-4" icon={action.icon} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};

export const createTableColumns = <T extends object>({
  columns,
  actions,
  actionColumnHeader = "",
  actionColumnId = "actions",
  baseHref,
}: CreateTableColumnsProps<T>): ColumnDef<T>[] => {
  const baseColumns: ColumnDef<T>[] = [...columns];

  if (actions) {
    baseColumns.push({
      id: actionColumnId,
      header: actionColumnHeader,
      cell: ({ row }) => <ActionCells actions={actions} rowItem={row.original} baseHref={baseHref} />,
    } as ColumnDef<T>);
  }

  return baseColumns;
};

interface User {
  id: string;
  name: string;
}

createTableColumns<User>({
  columns: [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
  ],
  actions: (rowItem) => [
    { label: "View", icon: Edit, href: `/${rowItem.id}` },
    { label: "Edit", icon: Edit, href: `/edit/${rowItem.id}` },
    { label: "Delete", icon: Delete, variant: "destructive" },
  ],
  actionColumnId: "actions",
  baseHref: "/users",
});
