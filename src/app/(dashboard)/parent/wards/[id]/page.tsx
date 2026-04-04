"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";

import { useGetWardInvoices, useGetWardProgress } from "@/lib/api/guardian";
import { useGetStudentEnrollment } from "@/lib/api/enrollment";
import { Breadcrumb, Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/lib/api/user";
import { cn } from "@/lib";

const Page = () => {
  const id = useParams().id as string;

  const { data: user, isFetching, isPending, refetch } = useGetUser(id);
  const {} = useGetStudentEnrollment(id);
  const {} = useGetWardInvoices(id);
  const {} = useGetWardProgress(id);

  const name = `${user?.first_name} ${user?.last_name}`;

  const breadcrumbs = [
    { label: "Wards", href: "/parent/wards" },
    { label: "", href: `/parent/wards/${id}` },
  ];

  if (isPending && !user) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">{name}</h3>
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
