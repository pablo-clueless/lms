"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";

import { Breadcrumb, Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/lib/api/user";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Guardians", href: "/admin/guardians" }];

const Page = () => {
  const id = useParams().id as string;

  const { data, isFetching, isPending, refetch } = useGetUser(id);

  if (isPending && !data) return <Loader />;
  console.log(data);

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Guardian</h3>
          <p className="text-sm font-medium text-gray-600">Manage guardian of student</p>
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
      <div className="w-full space-y-4"></div>
    </div>
  );
};

export default Page;
