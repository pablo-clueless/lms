"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  RefreshIcon,
  Calendar03Icon,
  Invoice02Icon,
  Mail01Icon,
  MoneyReceiveSquareIcon,
  FileDownloadIcon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";

import { useDownloadInvoice, useGetInvoice } from "@/lib/api/billing";
import { Breadcrumb, Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/config/columns";
import { cn, formatCurrency } from "@/lib";
import { useDownload } from "@/hooks";

const Page = () => {
  const id = useParams().id as string;

  const { data, isFetching, isPending, refetch } = useGetInvoice(id);
  const { refetch: fetchPdf, isFetching: isDownloading } = useDownloadInvoice(id);
  const { download } = useDownload({
    onError: () => toast.error("Failed to download invoice"),
  });

  const handleDownloadInvoice = async () => {
    const result = await fetchPdf();
    if (result.data) {
      download(result.data, `${data?.invoice_number || "invoice"}.pdf`);
    }
  };

  const handlePayNow = () => {
    // TODO: Implement payment gateway integration
    toast.info("Redirecting to payment gateway...");
  };

  const breadcrumbs = [
    { label: "Billing", href: "/admin/billing" },
    { label: data?.invoice_number || "Invoice", href: `/admin/billing/${id}` },
  ];

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd/MM/yyyy");
  };

  const formatDateTime = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd/MM/yyyy HH:mm");
  };

  if (isPending && !data) return <Loader />;

  const canPay = data?.status === "PENDING" || data?.status === "OVERDUE";

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-gray-100">
            <HugeiconsIcon icon={Invoice02Icon} className="size-7 text-gray-600" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-foreground text-2xl font-semibold">{data?.invoice_number}</h3>
              <StatusBadge status={data?.status || "PENDING"} />
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
                Issued: {formatDate(data?.issued_date)}
              </span>
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Mail01Icon} className="size-4" />
                {data?.billing_email}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          {canPay && (
            <Button size="sm" onClick={handlePayNow}>
              <HugeiconsIcon icon={CreditCardIcon} data-icon="inline-start" className="size-4" />
              Pay Now
            </Button>
          )}
          <Button disabled={isDownloading} onClick={handleDownloadInvoice} variant="outline" size="sm">
            <HugeiconsIcon
              icon={FileDownloadIcon}
              data-icon="inline-start"
              className={cn("size-4", isDownloading && "animate-pulse")}
            />
            {isDownloading ? "Downloading..." : "Download PDF"}
          </Button>
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
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-4">
          <h4 className="font-semibold">Invoice Details</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice Number</span>
              <span className="font-mono">{data?.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge status={data?.status || "PENDING"} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Student Count</span>
              <span>{data?.student_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Currency</span>
              <span>{data?.currency}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4 rounded-lg border p-4">
          <h4 className="font-semibold">Dates</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Issued Date</span>
              <span>{formatDate(data?.issued_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due Date</span>
              <span className={data?.status === "OVERDUE" ? "font-medium text-red-600" : ""}>
                {formatDate(data?.due_date)}
              </span>
            </div>
            {data?.paid_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid At</span>
                <span className="font-medium text-green-600">{formatDateTime(data.paid_at)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{formatDateTime(data?.created_at)}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
          <h4 className="font-semibold">Line Items</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-muted-foreground pb-2 text-left font-medium">Description</th>
                  <th className="text-muted-foreground pb-2 text-right font-medium">Qty</th>
                  <th className="text-muted-foreground pb-2 text-right font-medium">Unit Price</th>
                  <th className="text-muted-foreground pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data?.line_items?.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">{formatCurrency(item.unit_price / 100, data.currency)}</td>
                    <td className="py-3 text-right font-medium">{formatCurrency(item.amount / 100, data.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-4 rounded-lg border p-4">
          <h4 className="font-semibold">Amount Breakdown</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency((data?.subtotal_amount ?? 0) / 100, data?.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency((data?.tax_amount ?? 0) / 100, data?.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-green-600">
                -{formatCurrency((data?.discount_amount ?? 0) / 100, data?.currency)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold">
                {formatCurrency((data?.total_amount ?? 0) / 100, data?.currency)}
              </span>
            </div>
          </div>
        </div>
        {data?.status === "PAID" && (
          <div className="space-y-4 rounded-lg border bg-green-50 p-4">
            <h4 className="flex items-center gap-2 font-semibold text-green-800">
              <HugeiconsIcon icon={MoneyReceiveSquareIcon} className="size-5" />
              Payment Information
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Payment Method</span>
                <span className="font-medium">{data?.payment_method?.replace("_", " ")}</span>
              </div>
              {data?.payment_reference && (
                <div className="flex justify-between">
                  <span className="text-green-700">Reference</span>
                  <span className="font-mono text-xs">{data.payment_reference}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-green-700">Paid At</span>
                <span>{formatDateTime(data?.paid_at)}</span>
              </div>
            </div>
          </div>
        )}
        {data?.status === "DISPUTED" && (
          <div className="space-y-4 rounded-lg border bg-yellow-50 p-4">
            <h4 className="font-semibold text-yellow-800">Dispute Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-yellow-700">Disputed At</span>
                <span>{formatDateTime(data?.disputed_at)}</span>
              </div>
              {data?.dispute_reason && (
                <div>
                  <span className="text-yellow-700">Reason</span>
                  <p className="mt-1 rounded bg-yellow-100 p-2">{data.dispute_reason}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {data?.status === "VOIDED" && (
          <div className="space-y-4 rounded-lg border bg-gray-100 p-4">
            <h4 className="font-semibold text-gray-700">Void Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Voided At</span>
                <span>{formatDateTime(data?.voided_at)}</span>
              </div>
              {data?.void_reason && (
                <div>
                  <span className="text-muted-foreground">Reason</span>
                  <p className="mt-1 rounded bg-gray-200 p-2">{data.void_reason}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {data?.notes && (
          <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
            <h4 className="font-semibold">Notes</h4>
            <p className="text-muted-foreground text-sm">{data.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
