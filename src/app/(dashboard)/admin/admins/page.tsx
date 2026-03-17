"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, RefreshIcon } from "@hugeicons/core-free-icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination, Breadcrumb, CreateAdminDialog } from "@/components/shared";
import { createAdminColumns } from "@/config/columns";
import { useGetUsers, useCreateUser } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import type { PaginationParams, CreateUserDto } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Admins", href: "/admin/admins" }];

const initialParams: PaginationParams = {
  order: "asc",
  page: 1,
  per_page: 10,
  role: "ADMIN",
  search: "",
  status: "",
};

const STATUS = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const [createOpen, setCreateOpen] = useState(false);

  const columns = createAdminColumns("ADMIN");
  const { data, isFetching, isPending, refetch } = useGetUsers(params);
  const createUser = useCreateUser();

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAdmin = async (admin: CreateUserDto) => {
    await createUser.mutateAsync(admin);
    setCreateOpen(false);
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Admins</h3>
          <p className="text-muted-foreground text-sm">Manage administrator accounts</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Select onValueChange={(status) => handleParamsChange("status", status)} value={params.status}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
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
            Add Admin
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
      <CreateAdminDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateAdmin}
        isPending={createUser.isPending}
      />
    </div>
  );
};

export default Page;
