"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination, Breadcrumb } from "@/components/shared";
import { useGetApplicants, useUpdateApplicantStatus } from "@/lib/api/applicant";
import type { Applicant, ApplicantStatus, PaginationParams } from "@/types";
import { StatusBadge } from "@/components/shared/status-badge";
import { createApplicantColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const breadcrumbs = [{ label: "Applications", href: "/admin/applications" }];

const initialParams: PaginationParams = {
  page: 1,
  per_page: 10,
  search: "",
  status: "",
};

const STATUS_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const STATUS_UPDATE_OPTIONS: { label: string; value: ApplicantStatus }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Under Review", value: "SUBMITTED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const Page = () => {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicantStatus | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [params, setParams] = useState(initialParams);

  const columns = createApplicantColumns("ADMIN", {
    onReview: (applicant: Applicant) => {
      setSelectedApplicant(applicant);
      setSelectedStatus(applicant.status);
      setIsDialogOpen(true);
    },
  });

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const { data, isPending, isFetching, refetch } = useGetApplicants(params);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicantStatus();

  const handleStatusUpdate = () => {
    if (!selectedApplicant || !selectedStatus) return;

    updateStatus(
      { id: selectedApplicant.id, status: selectedStatus },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setSelectedApplicant(null);
          setSelectedStatus("");
        },
      },
    );
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedApplicant(null);
    setSelectedStatus("");
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Applications</h3>
          <p className="text-sm text-neutral-600">Review and manage student applications</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Select onValueChange={(status) => handleParamsChange("status", status)} value={params.status}>
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" disabled={isFetching} onClick={() => refetch()}>
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <DataTable columns={columns} data={data?.data || []} />
        <Pagination
          onPageChange={(value) => handleParamsChange("page", value)}
          onPageSizeChange={(value) => handleParamsChange("per_page", value)}
          page={params.page || 1}
          pageSize={params.per_page || 10}
          total={data?.meta.total || 0}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>Review applicant details and update their application status.</DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium uppercase">Name</p>
                  <p className="text-sm font-medium">{selectedApplicant.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium uppercase">Email</p>
                  <p className="text-sm font-medium">{selectedApplicant.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium uppercase">Current Status</p>
                  <StatusBadge status={selectedApplicant.status} />
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium uppercase">Applied</p>
                  <p className="text-sm">{formatDate(selectedApplicant.created_at)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium uppercase">Cohort ID</p>
                  <p className="text-sm">{selectedApplicant.cohort_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium uppercase">Track ID</p>
                  <p className="text-sm">{selectedApplicant.track_id}</p>
                </div>
                {selectedApplicant.submitted_at && (
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-muted-foreground text-xs font-medium uppercase">Submitted</p>
                    <p className="text-sm">{formatDate(selectedApplicant.submitted_at)}</p>
                  </div>
                )}
              </div>

              {selectedApplicant.form_data && Object.keys(selectedApplicant.form_data).length > 0 && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-medium uppercase">Application Data</p>
                  <div className="bg-muted/50 max-h-40 overflow-y-auto rounded-md border p-3">
                    <pre className="text-xs">{JSON.stringify(selectedApplicant.form_data, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium uppercase">Update Status</p>
                <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ApplicantStatus)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_UPDATE_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdating || !selectedStatus || selectedStatus === selectedApplicant?.status}
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
