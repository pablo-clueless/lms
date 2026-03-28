"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DataTable, Breadcrumb, Loader, Pagination } from "@/components/shared";
import { CreateTutor } from "@/components/admin/create-tutor";
import { useGetUsers } from "@/lib/api/user";
import { tutorColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Tutors", href: "/admin/tutors" }];

const initialParams = {
  page: 1,
  limit: 20,
  role: "TUTOR",
  status: "",
  search: "",
};

const Page = () => {
  const { handleChange, values } = useHandler(initialParams);

  const { data, isFetching, isPending, refetch } = useGetUsers(values);

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Tutors</h3>
          <p className="text-sm font-medium text-gray-600">Manage all tutors and teachers</p>
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
          <CreateTutor />
        </div>
      </div>
      <div className="w-full space-y-4">
        <DataTable columns={tutorColumns} data={data?.users || []} />
        <Pagination
          onPageChange={(page) => handleChange("page", page)}
          page={values.page}
          pageSize={values.limit}
          total={data?.pagination?.total || 0}
        />
      </div>
    </div>
  );
};

export default Page;
