"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetSuperAdminDashboardQuery } from "@/lib/api/dashboard";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/shared";
import { useUserStore } from "@/store/core";

const Page = () => {
  const { user } = useUserStore();

  const { data, isFetching, isPending, refetch } = useGetSuperAdminDashboardQuery();

  if (isPending) return <Loader isFullScreen />;

  return (
    <div className="space-y-6 p-6">
      <div className="from-foreground/90 to-foreground space-y-10 rounded-xl border bg-linear-to-r p-10">
        <h3 className="text-background text-3xl font-medium">Welcome back, {user?.name}</h3>
        <p className="text-background/50 font-medium">Let&apos;s see what&apos;s happening in your system today.</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Select>
            <SelectTrigger className="w-37.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-x-4">
          <Button disabled={isFetching || isPending} onClick={() => refetch()} size="sm">
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
      <div className="grid w-full grid-cols-4 gap-6">
        <div className="space-y-4 rounded-lg border p-4">
          <p className="text-sm font-medium text-neutral-600">Total Tenants</p>
          <h4 className="text-foreground text-4xl">{data?.data.stats.total_tenants}</h4>
        </div>
        <div className="space-y-4 rounded-lg border p-4">
          <p className="text-sm font-medium text-neutral-600">Total Users</p>
          <h4 className="text-foreground text-4xl">0</h4>
        </div>
        <div className="space-y-4 rounded-lg border p-4">
          <p className="text-sm font-medium text-neutral-600">Unread Notifications</p>
          <h4 className="text-foreground text-4xl">{data?.data.stats.unread_notifications}</h4>
        </div>
        <div className="space-y-4 rounded-lg border p-4">
          <p className="text-sm font-medium text-neutral-600">Total Tenants</p>
          <h4 className="text-foreground text-4xl">0</h4>
        </div>
      </div>
      <div className="w-full rounded-lg border p-4"></div>
      <div className="grid grid-cols-2 gap-6">
        <div className="w-full rounded-lg border p-4"></div>
        <div className="w-full rounded-lg border p-4"></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="w-full rounded-lg border p-4"></div>
        <div className="w-full rounded-lg border p-4"></div>
      </div>
    </div>
  );
};

export default Page;
