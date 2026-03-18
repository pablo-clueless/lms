"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, RefreshIcon } from "@hugeicons/core-free-icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination, Breadcrumb, DatePicker } from "@/components/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { createCohortColumns } from "@/config/columns";
import { useGetCohorts, useCreateCohort, useGetTracks, useGetApplicationForms } from "@/lib/api/cohort";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PaginationParams, CreateCohortDto } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Cohorts", href: "/admin/cohorts" }];

const initialParams: PaginationParams = {
  order: "asc",
  page: 1,
  per_page: 10,
  search: "",
  status: "ALL",
};

const STATUS = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Open", value: "OPEN" },
  { label: "Closed", value: "CLOSED" },
  { label: "Archived", value: "ARCHIVED" },
];

interface CreateCohortFormData {
  name: string;
  description: string;
  max_students: number;
  application_start_date?: Date;
  application_end_date?: Date;
  start_date?: Date;
  end_date?: Date;
  application_form_id: string;
  track_ids: string[];
}

const initialCohortForm: CreateCohortFormData = {
  name: "",
  description: "",
  max_students: 0,
  application_start_date: undefined,
  application_end_date: undefined,
  start_date: undefined,
  end_date: undefined,
  application_form_id: "",
  track_ids: [],
};

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const [createOpen, setCreateOpen] = useState(false);
  const [cohortForm, setCohortForm] = useState<CreateCohortFormData>(initialCohortForm);

  const columns = createCohortColumns("ADMIN");
  const { data, isFetching, isPending, refetch } = useGetCohorts(params);
  const { data: tracksData } = useGetTracks({ page: 1, per_page: 100 });
  const { data: applicationFormsData } = useGetApplicationForms({ page: 1, per_page: 100 });
  const createCohort = useCreateCohort();

  const tracks = tracksData?.data || [];
  const applicationForms = applicationFormsData?.data || [];

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormChange = <K extends keyof CreateCohortFormData>(field: K, value: CreateCohortFormData[K]) => {
    setCohortForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTrackToggle = (trackId: string) => {
    setCohortForm((prev) => ({
      ...prev,
      track_ids: prev.track_ids.includes(trackId)
        ? prev.track_ids.filter((id) => id !== trackId)
        : [...prev.track_ids, trackId],
    }));
  };

  const handleCreateCohort = async () => {
    const payload: CreateCohortDto = {
      name: cohortForm.name,
      description: cohortForm.description,
      max_students: cohortForm.max_students,
      application_start_date: cohortForm.application_start_date?.toISOString() || "",
      application_end_date: cohortForm.application_end_date?.toISOString() || "",
      start_date: cohortForm.start_date?.toISOString() || "",
      end_date: cohortForm.end_date?.toISOString() || "",
      application_form_id: cohortForm.application_form_id,
      track_ids: cohortForm.track_ids,
    };
    await createCohort.mutateAsync(payload);
    setCohortForm(initialCohortForm);
    setCreateOpen(false);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setCohortForm(initialCohortForm);
    }
    setCreateOpen(value);
  };

  const isValid =
    cohortForm.name &&
    cohortForm.max_students > 0 &&
    cohortForm.application_form_id &&
    cohortForm.track_ids.length > 0 &&
    cohortForm.application_start_date &&
    cohortForm.application_end_date &&
    cohortForm.start_date &&
    cohortForm.end_date;

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Cohorts</h3>
          <p className="text-muted-foreground text-sm">Manage student cohorts and intakes</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Select onValueChange={(status) => handleParamsChange("status", status)} value={params.status}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" disabled={isFetching} onClick={() => refetch()} size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" className="size-4" />
            New Cohort
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

      <Dialog open={createOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Cohort</DialogTitle>
            <DialogDescription>Add a new cohort to manage student intakes and enrollment periods.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-medium">Cohort Information</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Cohort Name"
                    value={cohortForm.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="Enter cohort name"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Textarea
                    label="Description"
                    value={cohortForm.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    placeholder="Brief description of the cohort"
                  />
                </div>
                <Input
                  label="Max Students"
                  type="number"
                  value={cohortForm.max_students.toString()}
                  onChange={(e) => handleFormChange("max_students", parseInt(e.target.value) || 0)}
                  placeholder="Enter maximum number of students"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-medium">Application Period</h4>
              <p className="text-muted-foreground mb-3 text-xs">Define when students can apply for this cohort.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <DatePicker
                  type="single"
                  label="Application Start Date"
                  value={cohortForm.application_start_date}
                  onValueChange={(date) => handleFormChange("application_start_date", date)}
                  placeholder="Select start date"
                />
                <DatePicker
                  type="single"
                  label="Application End Date"
                  value={cohortForm.application_end_date}
                  onValueChange={(date) => handleFormChange("application_end_date", date)}
                  placeholder="Select end date"
                  minDate={cohortForm.application_start_date}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-medium">Cohort Duration</h4>
              <p className="text-muted-foreground mb-3 text-xs">Define the start and end dates for this cohort.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <DatePicker
                  type="single"
                  label="Start Date"
                  value={cohortForm.start_date}
                  onValueChange={(date) => handleFormChange("start_date", date)}
                  placeholder="Select start date"
                />
                <DatePicker
                  type="single"
                  label="End Date"
                  value={cohortForm.end_date}
                  onValueChange={(date) => handleFormChange("end_date", date)}
                  placeholder="Select end date"
                  minDate={cohortForm.start_date}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-medium">Application Form</h4>
              <p className="text-muted-foreground mb-3 text-xs">
                Select the application form that students will fill out when applying.
              </p>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Application Form <span className="text-destructive">*</span>
                </label>
                <Select
                  value={cohortForm.application_form_id}
                  onValueChange={(value) => handleFormChange("application_form_id", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select application form" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicationForms.map((form) => (
                      <SelectItem key={form.id} value={form.id}>
                        {form.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {applicationForms.length === 0 && (
                  <p className="text-muted-foreground text-xs">
                    No application forms available. Please create one first.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-medium">Tracks</h4>
              <p className="text-muted-foreground mb-3 text-xs">
                Select the tracks available for this cohort. Students can apply to any of these tracks.
              </p>
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Available Tracks <span className="text-destructive">*</span>
                </label>
                {tracks.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No tracks available. Please create tracks first.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {tracks.map((track) => (
                      <div key={track.id} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Checkbox
                          id={track.id}
                          checked={cohortForm.track_ids.includes(track.id)}
                          onCheckedChange={() => handleTrackToggle(track.id)}
                        />
                        <label
                          htmlFor={track.id}
                          className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <span className="block">{track.name}</span>
                          {track.code && (
                            <span className="text-muted-foreground block text-xs">{track.code}</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {cohortForm.track_ids.length === 0 && tracks.length > 0 && (
                  <p className="text-destructive text-xs">Select at least one track</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCohort} disabled={createCohort.isPending || !isValid}>
              {createCohort.isPending ? "Creating..." : "Create Cohort"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
