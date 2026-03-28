"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DataTable, Breadcrumb, Loader } from "@/components/shared";
import { useGetNotifications } from "@/lib/api/notification";
import { notificationColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Notifications", href: "/tutor/notifications" }];

const initialParams = {
  limit: 50,
  unread_only: false,
};

const Page = () => {
  const { values } = useHandler(initialParams);

  const { data, isFetching, isPending, refetch } = useGetNotifications(values);

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Notifications</h3>
          <p className="text-sm font-medium text-gray-600">View notifications and important updates</p>
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
        <DataTable columns={notificationColumns} data={data?.notifications || []} />
      </div>
    </div>
  );
};

export default Page;
