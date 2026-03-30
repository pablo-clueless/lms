"use client";

import { RefreshIcon, ChartLineData02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DataTable, Breadcrumb, Loader, Pagination } from "@/components/shared";
import { useGetEnrollments } from "@/lib/api/enrollment";
import { enrollmentColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Progress", href: "/tutor/progress" }];

const initialParams = {
  page: 1,
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
          <h3 className="text-foreground text-3xl">Student Progress</h3>
          <p className="text-sm font-medium text-gray-600">
            Track student progress and academic performance in your courses
          </p>
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
        {data?.enrollments && data.enrollments.length > 0 ? (
          <>
            <DataTable columns={enrollmentColumns} data={data.enrollments} />
            <Pagination
              onPageChange={(page) => handleChange("page", page)}
              page={values.page}
              pageSize={values.limit}
              total={data?.pagination?.total || 0}
            />
          </>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border">
            <HugeiconsIcon icon={ChartLineData02Icon} className="text-muted-foreground size-12" />
            <p className="text-muted-foreground mt-2">No student progress data available</p>
            <p className="text-muted-foreground text-xs">
              Student progress will appear here once students are enrolled
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
