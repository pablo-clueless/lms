"use client";

import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination } from "@/components/shared";
import { createNotificationColumns } from "@/config/columns";
import { Breadcrumb } from "@/components/shared";
import { useGetNotifications } from "@/lib/api/communication";
import type { PaginationParams } from "@/types";

const breadcrumbs = [{ label: "Notifications", href: "/tutor/notifications" }];

const initialParams: PaginationParams = {
  order: "desc",
  page: 1,
  per_page: 10,
  search: "",
  status: "",
};

const STATUS = [
  { label: "All", value: "ALL" },
  { label: "Unread", value: "UNREAD" },
  { label: "Read", value: "READ" },
];

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const columns = createNotificationColumns("TUTOR");

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const { data, isPending } = useGetNotifications(params);

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="">
          <h3 className="text-foreground text-3xl">Notifications</h3>
          <p className="text-sm text-neutral-600">View your notifications</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Select onValueChange={(status) => handleParamsChange("status", status)} value={params.status}>
            <SelectTrigger className="w-37.5">
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
