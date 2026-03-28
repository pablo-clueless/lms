"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DataTable, Breadcrumb, Loader } from "@/components/shared";
import { useGetInvoices, useGetBillingMetrics } from "@/lib/api/billing";
import { invoiceColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Billing", href: "/superadmin/billing" }];

const Page = () => {
  const { data, isFetching, isPending, refetch } = useGetInvoices();
  const { data: metrics } = useGetBillingMetrics();

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Billing</h3>
          <p className="text-sm font-medium text-gray-600">
            View aggregated billing, invoices, and payment status across all tenants
          </p>
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
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₦{metrics?.total_revenue?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₦{metrics?.pending_amount?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overdue Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">₦{metrics?.overdue_amount?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>
      </div>
      <div className="w-full space-y-4">
        <DataTable columns={invoiceColumns} data={data?.data || []} />
      </div>
    </div>
  );
};

export default Page;
