"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { RefreshIcon, Mail01Icon, Location01Icon, Calendar03Icon, Settings01Icon } from "@hugeicons/core-free-icons";

import { Breadcrumb, DataTable, Loader, Pagination, TabPanel } from "@/components/shared";
import { useGetTenant, useSuspendTenant, useReactivateTenant } from "@/lib/api/tenant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetInvoices } from "@/lib/api/billing";
import { Button } from "@/components/ui/button";
import { invoiceColumns, StatusBadge } from "@/config/columns";
import { getInitials, cn } from "@/lib";
import { useHandler } from "@/hooks";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const tabs = ["overview", "configuration", "billing"];

const initialParams = {
  limit: 10,
  page: 1,
  tenant_id: "",
};

const Page = () => {
  const id = useParams().id as string;

  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const { handleChange, values } = useHandler({ ...initialParams, tenant_id: id });

  const { data, isFetching, isPending, refetch } = useGetTenant(id);
  const { mutate: suspendTenant, isPending: isSuspending } = useSuspendTenant();
  const { mutate: reactivateTenant, isPending: isReactivating } = useReactivateTenant();
  const { data: invoices, isPending: isFetchingInvoices } = useGetInvoices(values);

  const breadcrumbs = [
    { label: "Tenants", href: "/superadmin/tenants" },
    { label: data?.name || "Tenant Details", href: `/superadmin/tenants/${id}` },
  ];

  const handleSuspend = () => {
    suspendTenant(id, {
      onSuccess: () => {
        toast.success("Tenant suspended successfully");
        setSuspendDialogOpen(false);
        refetch();
      },
      onError: () => {
        toast.error("Failed to suspend tenant");
      },
    });
  };

  const handleReactivate = () => {
    reactivateTenant(id, {
      onSuccess: () => {
        toast.success("Tenant reactivated successfully");
        setReactivateDialogOpen(false);
        refetch();
      },
      onError: () => {
        toast.error("Failed to reactivate tenant");
      },
    });
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={data?.logo} alt={data?.name} />
            <AvatarFallback className="text-lg">{getInitials(data?.name || "")}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-foreground text-2xl font-semibold">{data?.name}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Mail01Icon} className="size-4" />
                {data?.contact_email}
              </span>
              <span className="flex items-center gap-1 capitalize">
                <HugeiconsIcon icon={Settings01Icon} className="size-4" />
                {data?.school_type?.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <StatusBadge status={data?.status || "INACTIVE"} />
          {data?.status === "ACTIVE" ? (
            <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                  Suspend
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Suspend Tenant</DialogTitle>
                <DialogDescription>
                  Are you sure you want to suspend <span className="font-semibold">{data?.name}</span>? This will
                  temporarily disable access for all users associated with this tenant.
                </DialogDescription>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleSuspend} disabled={isSuspending}>
                    {isSuspending ? "Suspending..." : "Suspend Tenant"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : data?.status === "SUSPENDED" ? (
            <Dialog open={reactivateDialogOpen} onOpenChange={setReactivateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Reactivate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Reactivate Tenant</DialogTitle>
                <DialogDescription>
                  Are you sure you want to reactivate <span className="font-semibold">{data?.name}</span>? This will
                  restore access for all users associated with this tenant.
                </DialogDescription>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setReactivateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReactivate} disabled={isReactivating}>
                    {isReactivating ? "Reactivating..." : "Reactivate Tenant"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null}
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
      <div className="w-full space-y-4">
        <div className="border-b">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors",
                  currentTab === tab
                    ? "border-primary text-primary border-b-2"
                    : "text-muted-foreground hover:text-foreground",
                )}
                key={tab}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <TabPanel selected={currentTab} value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">School Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{data?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="capitalize">{data?.school_type?.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact Email</span>
                  <span>{data?.contact_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={data?.status || "INACTIVE"} />
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Address & Dates</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <HugeiconsIcon icon={Location01Icon} className="size-3" />
                    Address
                  </span>
                  <span className="text-right">{data?.address || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                    Created
                  </span>
                  <span>{data?.created_at ? new Date(data.created_at).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{data?.updated_at ? new Date(data.updated_at).toLocaleDateString() : "N/A"}</span>
                </div>
                {data?.suspended_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Suspended At</span>
                    <span className="text-red-600">{new Date(data.suspended_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            {data?.suspension_reason && (
              <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4 md:col-span-2">
                <h4 className="font-semibold text-red-800">Suspension Reason</h4>
                <p className="text-sm text-red-700">{data.suspension_reason}</p>
              </div>
            )}
            <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
              <h4 className="font-semibold">Billing Contact</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-sm">Name</p>
                  <p className="font-medium">{data?.billing_contact?.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="font-medium">{data?.billing_contact?.email || "Not set"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Phone</p>
                  <p className="font-medium">{data?.billing_contact?.phone || "Not set"}</p>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel selected={currentTab} value="configuration">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">General Settings</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone</span>
                  <span>{data?.configuration?.timezone || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">School Level</span>
                  <span className="capitalize">{data?.configuration?.school_level?.toLowerCase() || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period Duration</span>
                  <span>{data?.configuration?.period_duration || 0} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Period Limit</span>
                  <span>{data?.configuration?.daily_period_limit || 0}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Grade Weighting</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Continuous Assessment</span>
                  <span>{data?.configuration?.grade_weighting?.continuous_assessment || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Examination</span>
                  <span>{data?.configuration?.grade_weighting?.examination || 0}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Thresholds & Policies</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendance Threshold</span>
                  <span>{data?.configuration?.attendance_threshold || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Grace Period</span>
                  <span>{data?.configuration?.invoice_grace_period || 0} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Suspension Threshold</span>
                  <span>{data?.configuration?.suspension_threshold || 0} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meeting Recording Retention</span>
                  <span>{data?.configuration?.meeting_recording_retention || 0} days</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Supported Classes</h4>
              <div className="flex flex-wrap gap-2">
                {data?.configuration?.supported_classes?.length ? (
                  data.configuration.supported_classes.map((cls) => (
                    <span key={cls} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {cls}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No classes configured</p>
                )}
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel selected={currentTab} value="billing">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
              <h4 className="font-semibold">Billing Contact Details</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-sm">Contact Name</p>
                  <p className="font-medium">{data?.billing_contact?.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Contact Email</p>
                  <p className="font-medium">{data?.billing_contact?.email || "Not set"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Contact Phone</p>
                  <p className="font-medium">{data?.billing_contact?.phone || "Not set"}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
              <h4 className="font-semibold">Billing Policies</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-muted-foreground text-sm">Invoice Grace Period</span>
                  <span className="font-medium">{data?.configuration?.invoice_grace_period || 0} days</span>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-muted-foreground text-sm">Suspension Threshold</span>
                  <span className="font-medium">{data?.configuration?.suspension_threshold || 0} days overdue</span>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              {isFetchingInvoices ? (
                <Loader />
              ) : !!invoices?.data.length ? (
                <div className="space-y-4">
                  <DataTable columns={invoiceColumns("SUPER_ADMIN")} data={invoices.data || []} />
                  <Pagination
                    onPageChange={(page) => handleChange("page", page)}
                    page={values.page}
                    pageSize={values.limit}
                    total={invoices?.pagination.total || 0}
                  />
                </div>
              ) : (
                <div className="rounded-lg border p-8 text-center">
                  <p className="text-muted-foreground">Invoice history and payment records will be displayed here</p>
                </div>
              )}
            </div>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
