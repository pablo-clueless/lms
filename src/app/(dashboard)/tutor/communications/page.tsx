"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DataTable, Breadcrumb, Loader } from "@/components/shared";
import { useGetEmails } from "@/lib/api/communication";
import { emailColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Communications", href: "/tutor/communications" }];

const Page = () => {
  const { data, isFetching, isPending, refetch } = useGetEmails();

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Communications</h3>
          <p className="text-sm font-medium text-gray-600">Send emails and messages to students in your classes</p>
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
        <DataTable columns={emailColumns} data={data?.data || []} />
      </div>
    </div>
  );
};

export default Page;
