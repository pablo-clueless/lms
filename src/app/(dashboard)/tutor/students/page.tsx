"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DataTable, Breadcrumb, Loader, Pagination } from "@/components/shared";
import { useGetEnrollments } from "@/lib/api/enrollment";
import { enrollmentColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Students", href: "/tutor/students" }];

const initialParams = {
  page: 0,
  limit: 20,
};

const Page = () => {
  const { handleChange, values } = useHandler(initialParams);

  const { data, isFetching, isPending, refetch } = useGetEnrollments(values);

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-3xl">Students</h3>
          <p className="text-sm font-medium text-gray-600">View students in your assigned classes and their progress</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button disabled={isFetching} onClick={() => refetch()} variant="outline" size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
      <div className="w-full space-y-4">
        <DataTable columns={enrollmentColumns} data={data?.data || []} />
        <Pagination
          onPageChange={(page) => handleChange("page", page)}
          page={values.page}
          pageSize={values.limit}
          total={data?.pagination?.count || 0}
        />
      </div>
    </div>
  );
};

export default Page;
