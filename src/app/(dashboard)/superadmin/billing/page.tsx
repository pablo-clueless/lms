"use client";

import { RefreshIcon, Invoice02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";

import { useGenerateInvoices, useGetInvoices, useGetBillingMetrics } from "@/lib/api/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, Breadcrumb, Loader } from "@/components/shared";
import { invoiceColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const breadcrumbs = [{ label: "Billing", href: "/superadmin/billing" }];

const Page = () => {
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);

  const { data, isFetching, isPending, refetch } = useGetInvoices();
  const { data: metrics } = useGetBillingMetrics();
  const { mutate: generateInvoices, isPending: isGenerating } = useGenerateInvoices();

  const handleGenerateInvoices = () => {
    generateInvoices(undefined, {
      onSuccess: (result) => {
        setGenerateDialogOpen(false);
        toast.success(
          `Generated ${result.invoices_created} invoice(s) for ${result.total_tenants} tenant(s). ${result.skipped} skipped, ${result.failed} failed.`,
        );
      },
      onError: () => {
        toast.error("Failed to generate invoices. Please try again.");
      },
    });
  };

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
          <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <HugeiconsIcon icon={Invoice02Icon} data-icon="inline-start" className="size-4" />
                Generate Invoices
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Generate Invoices</DialogTitle>
              <DialogDescription>
                This will generate invoices for all active tenants based on their current subscription plans. Tenants
                with existing unpaid invoices for this billing period will be skipped.
              </DialogDescription>
              <DialogFooter>
                <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateInvoices} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Invoices"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{formatCurrency((metrics?.total_revenue || 0) / 100)}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{formatCurrency((metrics?.mrr || 0) / 100)}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Late Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold text-red-600">{metrics?.late_payments}</h2>
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
