"use client";

import { Add01Icon, CopyIcon, Delete02Icon, RefreshIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import Link from "next/link";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination, Breadcrumb } from "@/components/shared";
import type { PaginationParams, ApplicationForm } from "@/types";
import { useGetApplicationForms } from "@/lib/api/cohort";
import type { ColumnDef } from "@tanstack/react-table";
import { cn, copyString, formatDate } from "@/lib";
import { Button } from "@/components/ui/button";

const breadcrumbs = [{ label: "Application Forms", href: "/admin/application-forms" }];

const initialParams: PaginationParams = {
  order: "asc",
  page: 1,
  per_page: 10,
  search: "",
  status: "ALL",
};

const STATUS = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const columns: ColumnDef<ApplicationForm>[] = [
  {
    accessorKey: "id",
    header: "Form ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <span className="font-medium">{row.original.id}</span>
        <Button onClick={() => copyString(row.original.id)} size="icon-xs">
          <HugeiconsIcon icon={CopyIcon} className="size-3" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Form Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span className="text-sm text-neutral-600">{row.original.description || "No description"}</span>,
  },
  {
    accessorKey: "fields",
    header: "Fields",
    cell: ({ row }) => <span className="text-sm">{row.original.fields?.length || 0}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => <span className="text-sm text-neutral-600">{formatDate(row.original.created_at)}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4">
        <Button asChild size="icon" variant="outline">
          <Link href={`/admin/application-forms/${row.original.id}`}>
            <HugeiconsIcon icon={ViewIcon} className="size-4" />
          </Link>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="destructive">
              <HugeiconsIcon icon={Delete02Icon} className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </div>
            <div></div>
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
];

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const { data, isFetching, isPending, refetch } = useGetApplicationForms(params);

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Application Forms</h3>
          <p className="text-muted-foreground text-sm">Manage application form templates</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Select onValueChange={(status) => handleParamsChange("status", status)} value={params.status}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" disabled={isFetching} onClick={() => refetch()} size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/application-forms/create">
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" className="size-4" />
              New Form
            </Link>
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <DataTable columns={columns} data={data?.data || []} />
        <Pagination
          onPageChange={(value) => handleParamsChange("page", value)}
          onPageSizeChange={(value) => handleParamsChange("per_page", value)}
          page={params.page || 1}
          pageSize={params.per_page || 10}
          total={data?.meta.total || 0}
        />
      </div>
    </div>
  );
};

export default Page;
