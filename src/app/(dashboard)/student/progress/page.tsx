"use client";

import { DataTable, Loader, Pagination } from "@/components/shared";
import { createProgressColumns } from "@/config/columns";
import { Breadcrumb } from "@/components/shared";
import { useGetMyProgress } from "@/lib/api/progress";

const breadcrumbs = [{ label: "Progress", href: "/student/progress" }];

const Page = () => {
  const columns = createProgressColumns("STUDENT");
  const { data, isPending } = useGetMyProgress();

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="">
          <h3 className="text-foreground text-3xl">My Progress</h3>
          <p className="text-sm text-neutral-600">Track your learning progress</p>
        </div>
      </div>
      <div className="space-y-4">
        <DataTable columns={columns} data={data?.data || []} />
        <Pagination
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          page={data?.meta?.page || 1}
          pageSize={data?.meta?.page_size || 10}
          total={data?.meta?.total || 0}
        />
      </div>
    </div>
  );
};

export default Page;
