"use client";

import { useState } from "react";

import { DataTable, Loader, Pagination } from "@/components/shared";
import { createProgressColumns } from "@/config/columns";
import { Breadcrumb } from "@/components/shared";
import { useGetAllProgress } from "@/lib/api/progress";
import type { PaginationParams } from "@/types";

const breadcrumbs = [{ label: "Progress", href: "/tutor/progress" }];

const initialParams: PaginationParams = {
  order: "asc",
  page: 1,
  per_page: 10,
  search: "",
  status: "",
};

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const columns = createProgressColumns("TUTOR");

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const { data, isPending } = useGetAllProgress(params);

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="">
          <h3 className="text-foreground text-3xl">Student Progress</h3>
          <p className="text-sm text-neutral-600">Track progress of students in your courses</p>
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
