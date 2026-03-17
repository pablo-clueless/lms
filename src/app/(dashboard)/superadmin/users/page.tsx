"use client";

import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination } from "@/components/shared";
import { createAdminColumns } from "@/config/columns";
import { Breadcrumb } from "@/components/shared";
import type { PaginationParams } from "@/types";
import { useGetUsers } from "@/lib/api/user";

const breadcrumbs = [{ label: "Users", href: "/superadmin/users" }];

const initialParams: PaginationParams = {
  order: "asc",
  page: 1,
  per_page: 10,
  role: "SUPER_ADMIN",
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
  const columns = createAdminColumns("SUPER_ADMIN");

  const { data, isPending } = useGetUsers(params);

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="">
          <h3 className="text-foreground text-3xl">Users</h3>
          <p className="text-sm text-neutral-600"></p>
        </div>
        <div className="flex items-center gap-x-4">
          <Select onValueChange={(status) => handleParamsChange("status", status)} value={params.status}>
            <SelectTrigger className="w-37.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
