"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, RefreshIcon } from "@hugeicons/core-free-icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination, Breadcrumb, CreateTenantDialog } from "@/components/shared";
import { createTenantColumns } from "@/config/columns";
import { useGetTenants, useCreateTenant } from "@/lib/api/tenant";
import { Button } from "@/components/ui/button";
import type { PaginationParams, CreateTenantDto } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Tenants", href: "/superadmin/tenants" }];

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
  { label: "Suspended", value: "SUSPENDED" },
];

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const [createOpen, setCreateOpen] = useState(false);

  const columns = createTenantColumns("SUPER_ADMIN");
  const { data, isFetching, isPending, refetch } = useGetTenants(params);
  const createTenant = useCreateTenant();

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateTenant = async (tenant: CreateTenantDto) => {
    await createTenant.mutateAsync(tenant);
    setCreateOpen(false);
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Tenants</h3>
          <p className="text-muted-foreground text-sm">Manage all tenants in the system</p>
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
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" className="size-4" />
            New Tenant
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
      <CreateTenantDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateTenant}
        isPending={createTenant.isPending}
      />
    </div>
  );
};

export default Page;
