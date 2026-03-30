"use client";

import { Breadcrumb } from "@/components/shared";

const breadcrumbs = [
  { label: "Tenants", href: "/superadmin/tenants" },
  { label: "Create Tenant", href: "/superadmin/tenants/create" },
];

const Page = () => {
  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Create Tenant</h3>
          <p className="text-sm font-medium text-gray-600"></p>
        </div>
      </div>
      <div className="space-y-4"></div>
    </div>
  );
};

export default Page;
