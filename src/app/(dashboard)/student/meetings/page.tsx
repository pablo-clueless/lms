"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DataTable, Breadcrumb, Loader } from "@/components/shared";
import { useGetMeetings } from "@/lib/api/meeting";
import { meetingColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Meetings", href: "/student/meetings" }];

const Page = () => {
  const { data, isFetching, isPending, refetch } = useGetMeetings();

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-3xl">Meetings</h3>
          <p className="text-sm font-medium text-gray-600">Join virtual meetings scheduled for your class</p>
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
        <DataTable columns={meetingColumns} data={data?.data || []} />
      </div>
    </div>
  );
};

export default Page;
