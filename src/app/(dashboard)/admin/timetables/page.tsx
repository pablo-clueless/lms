"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { CreateTimeTable } from "@/components/admin/create-timetable";
import { DataTable, Breadcrumb, Loader } from "@/components/shared";
import { useGetTimetables } from "@/lib/api/timetable";
import { timetableColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Timetables", href: "/admin/timetables" }];

const initialParams = {
  class_id: "",
  term_id: "",
};

const Page = () => {
  const { values } = useHandler(initialParams);

  const { data, isFetching, isPending, refetch } = useGetTimetables(values);

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Timetables</h3>
          <p className="text-sm font-medium text-gray-600">Manage class schedules and timetables</p>
        </div>
        <div className="flex items-center gap-x-4">
          <CreateTimeTable />
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
        <DataTable columns={timetableColumns("ADMIN")} data={data?.data || []} />
      </div>
    </div>
  );
};

export default Page;
