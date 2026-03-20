"use client";

import { DataTable, Breadcrumb, Loader, Pagination } from "@/components/shared";
import { quizColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Assessments", href: "/admin/assessments" }];

const initialParams = {
  page: 0,
  limit: 20,
  status: "",
};

const Page = () => {
  const {} = useHandler(initialParams);

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-3xl"></h3>
          <p className="text-sm font-medium text-gray-600"></p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button className={cn("")} size="sm" variant="outline">
            Refresh
          </Button>
        </div>
      </div>
      <div className="w-full space-y-4">
        <DataTable columns={quizColumns} data={[]} />
      </div>
    </div>
  );
};

export default Page;
