"use client";

import { DataTable, Breadcrumb, Loader, Pagination } from "@/components/shared";
import { useGetSuperAdmins } from "@/lib/api/superadmin";
import { Button } from "@/components/ui/button";
import { userColumns } from "@/config/columns";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Users", href: "/superadmin/users" }];

const initialParams = {
  page: 1,
  limit: 20,
  search: "",
  status: "",
};

const Page = () => {
  const { handleChange, values } = useHandler(initialParams);

  const { data, isPending } = useGetSuperAdmins(values);

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Users</h3>
          <p className="text-sm font-medium text-gray-600">Manage super administrator accounts</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button className={cn("")} size="sm" variant="outline">
            Refresh
          </Button>
        </div>
      </div>
      <div className="w-full space-y-4">
        <DataTable columns={userColumns} data={data?.users || []} />
        <Pagination
          onPageChange={(page) => handleChange("page", page)}
          page={values.page}
          pageSize={values.limit}
          total={data?.pagination.total || 0}
        />
      </div>
    </div>
  );
};

export default Page;
