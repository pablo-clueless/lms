"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Edit02Icon,
  Calendar03Icon,
  UserMultipleIcon,
  Route01Icon,
  File02Icon,
} from "@hugeicons/core-free-icons";

import { Breadcrumb, Loader, StatusBadge } from "@/components/shared";
import { useGetCohort, useUpdateCohort } from "@/lib/api/cohort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CohortStatus } from "@/types";
import { formatDate } from "@/lib";

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="text-foreground text-sm font-medium">{value ?? "—"}</p>
  </div>
);

const InfoItem = ({ icon, label, value }: { icon: typeof Calendar03Icon; label: string; value?: string | number }) => (
  <div className="flex items-center gap-3">
    <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
      <HugeiconsIcon icon={icon} className="text-muted-foreground size-5" />
    </div>
    <Field label={label} value={value} />
  </div>
);

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const { data: cohortData, isPending } = useGetCohort(id);
  const cohort = cohortData?.data;
  const updateCohort = useUpdateCohort(id);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    status: "" as CohortStatus,
    max_students: 0,
    application_start_date: "",
    application_end_date: "",
    start_date: "",
    end_date: "",
  });

  const breadcrumbs = [
    { label: "Cohorts", href: "/admin/cohorts" },
    { label: "Cohort Details", href: `/admin/cohorts/${id}` },
  ];

  const openEdit = () => {
    if (cohort) {
      setEditForm({
        name: cohort.name || "",
        description: cohort.description || "",
        status: cohort.status,
        max_students: cohort.max_students || 0,
        application_start_date: cohort.application_start_date?.split("T")[0] || "",
        application_end_date: cohort.application_end_date?.split("T")[0] || "",
        start_date: cohort.start_date?.split("T")[0] || "",
        end_date: cohort.end_date?.split("T")[0] || "",
      });
    }
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    await updateCohort.mutateAsync(editForm);
    setEditOpen(false);
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/admin/cohorts")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Cohorts
      </Button>

      {/* Cohort Header */}
      <div className="bg-card relative overflow-hidden rounded-xl border">
        <div className="bg-primary/10 h-24" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="border-background bg-primary flex size-24 items-center justify-center rounded-xl border-4 shadow-lg">
                <HugeiconsIcon icon={UserMultipleIcon} className="text-primary-foreground size-12" />
              </div>
              <div className="pb-2">
                <h2 className="text-foreground text-2xl font-semibold">{cohort?.name}</h2>
                <p className="text-muted-foreground text-sm">Max {cohort?.max_students} students</p>
                <div className="mt-1">{cohort?.status && <StatusBadge status={cohort.status} />}</div>
              </div>
            </div>
            <Button variant="outline" onClick={openEdit}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit Cohort
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {cohort?.description && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="mb-2 text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground text-sm">{cohort.description}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Application Dates */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Application Period</h3>
          <div className="space-y-4">
            <InfoItem
              icon={Calendar03Icon}
              label="Application Start"
              value={formatDate(cohort?.application_start_date)}
            />
            <InfoItem icon={Calendar03Icon} label="Application End" value={formatDate(cohort?.application_end_date)} />
          </div>
        </div>

        {/* Cohort Dates */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Cohort Period</h3>
          <div className="space-y-4">
            <InfoItem icon={Calendar03Icon} label="Start Date" value={formatDate(cohort?.start_date)} />
            <InfoItem icon={Calendar03Icon} label="End Date" value={formatDate(cohort?.end_date)} />
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Application Form</h3>
          {cohort?.application_form ? (
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={File02Icon} className="text-muted-foreground size-5" />
              </div>
              <div>
                <p className="font-medium">{cohort.application_form.name}</p>
                <p className="text-muted-foreground text-sm">{cohort.application_form.description}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No application form linked.</p>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Timeline</h3>
          <div className="space-y-4">
            <InfoItem icon={Calendar03Icon} label="Created" value={formatDate(cohort?.created_at)} />
            <InfoItem icon={Calendar03Icon} label="Last Updated" value={formatDate(cohort?.updated_at)} />
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Associated Tracks</h3>
        {cohort?.tracks && cohort.tracks.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cohort.tracks.map((track) => (
              <div key={track.id} className="hover:bg-muted/50 rounded-lg border p-4 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Route01Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-muted-foreground font-mono text-xs">{track.code}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No tracks associated with this cohort.</p>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Cohort</DialogTitle>
            <DialogDescription>Update cohort information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <Input
              label="Max Students"
              type="number"
              value={editForm.max_students}
              onChange={(e) => setEditForm({ ...editForm, max_students: parseInt(e.target.value) || 0 })}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value as CohortStatus })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Application Start"
              type="date"
              value={editForm.application_start_date}
              onChange={(e) => setEditForm({ ...editForm, application_start_date: e.target.value })}
            />
            <Input
              label="Application End"
              type="date"
              value={editForm.application_end_date}
              onChange={(e) => setEditForm({ ...editForm, application_end_date: e.target.value })}
            />
            <Input
              label="Start Date"
              type="date"
              value={editForm.start_date}
              onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={editForm.end_date}
              onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateCohort.isPending}>
              {updateCohort.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
