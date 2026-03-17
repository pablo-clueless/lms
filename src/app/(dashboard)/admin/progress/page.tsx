"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon } from "@hugeicons/core-free-icons";

import { DataTable, Loader, Pagination, Breadcrumb } from "@/components/shared";
import { createProgressColumns } from "@/config/columns";
import { useGetAllProgress } from "@/lib/api/progress";
import { Button } from "@/components/ui/button";
import type { PaginationParams } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Progress", href: "/admin/progress" }];

const initialParams: PaginationParams = {
  order: "asc",
  page: 1,
  per_page: 10,
  search: "",
  status: "",
};

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const columns = createProgressColumns("ADMIN");

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const { data, isPending, isFetching, refetch } = useGetAllProgress(params);

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Student Progress</h3>
          <p className="text-muted-foreground text-sm">Track and monitor student progress</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button variant="outline" disabled={isFetching} onClick={() => refetch()} size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            Refresh
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
