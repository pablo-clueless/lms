"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, Loader } from "@/components/shared";
import { Breadcrumb } from "@/components/shared";
import { useGetPermissions } from "@/lib/api/permission";

interface Permission {
  permission: string;
  resource: string;
  action: string;
  description: string;
}

const breadcrumbs = [{ label: "Permissions", href: "/superadmin/permissions" }];

const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: "permission",
    header: "Permission",
    cell: ({ row }) => <span className="font-mono text-sm font-medium">{row.original.permission}</span>,
  },
  {
    accessorKey: "resource",
    header: "Resource",
    cell: ({ row }) => <span className="text-sm">{row.original.resource}</span>,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <span className="rounded bg-neutral-100 px-2 py-1 text-xs font-medium">{row.original.action}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.description}</span>,
  },
];

const Page = () => {
  const { data, isPending } = useGetPermissions();

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="">
          <h3 className="text-foreground text-3xl">Permissions</h3>
          <p className="text-sm text-neutral-600">View system permissions and access controls</p>
        </div>
      </div>
      <div className="space-y-4">
        <DataTable columns={columns} data={data?.data || []} />
      </div>
    </div>
  );
};

export default Page;
