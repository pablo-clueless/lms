"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Breadcrumb, Loader } from "@/components/shared";
import { useGetMyWards } from "@/lib/api/guardian";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/core";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Wards", href: "/parent/wards" }];

const Page = () => {
  const {} = useUserStore();

  const { data, isFetching, isPending, refetch } = useGetMyWards({ limit: 10, page: 1 });

  if (isPending && !data) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">My Wards</h3>
          <p className="text-sm font-medium text-gray-600"></p>
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
      <div className="space-y-4"></div>
    </div>
  );
};

export default Page;
