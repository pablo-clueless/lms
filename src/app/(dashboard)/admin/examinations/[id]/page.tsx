"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Edit02Icon,
  Calendar03Icon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  UserMultipleIcon,
  Award01Icon,
} from "@hugeicons/core-free-icons";

import { Breadcrumb, Loader, StatusBadge, DataTable, Pagination } from "@/components/shared";
import { useGetExamination, useUpdateExamination, useGetExaminationResults } from "@/lib/api/examination";
import { createExaminationResultColumns } from "@/config/columns";
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
import type { ExaminationStatus, ExaminationType, PaginationParams } from "@/types";
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

  const { data: examinationData, isPending } = useGetExamination(id);
  const examination = examinationData?.data;
  const updateExamination = useUpdateExamination(id);

  const [resultParams, setResultParams] = useState<PaginationParams>({ page: 1, per_page: 10 });
  const { data: resultsData } = useGetExaminationResults(id, resultParams);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    type: "" as ExaminationType,
    exam_date: "",
    duration: 0,
    max_score: 0,
    status: "" as ExaminationStatus,
    instructions: "",
  });

  const breadcrumbs = [
    { label: "Examinations", href: "/admin/examinations" },
    { label: "Examination Details", href: `/admin/examinations/${id}` },
  ];

  const columns = createExaminationResultColumns("ADMIN");

  const openEdit = () => {
    if (examination) {
      setEditForm({
        title: examination.title || "",
        type: examination.type,
        exam_date: examination.exam_date?.split("T")[0] || "",
        duration: examination.duration || 60,
        max_score: examination.max_score || 100,
        status: examination.status,
        instructions: examination.instructions || "",
      });
    }
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    await updateExamination.mutateAsync(editForm);
    setEditOpen(false);
  };

  if (isPending) return <Loader />;

  const typeLabels: Record<ExaminationType, string> = {
    TEST: "Test",
    MID_TERM: "Mid-Term",
    FINAL: "Final",
    MOCK: "Mock",
  };

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/admin/examinations")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Examinations
      </Button>

      {/* Examination Header */}
      <div className="bg-card relative overflow-hidden rounded-xl border">
        <div className="bg-primary/10 h-24" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="border-background bg-primary flex size-24 items-center justify-center rounded-xl border-4 shadow-lg">
                <HugeiconsIcon icon={Award01Icon} className="text-primary-foreground size-12" />
              </div>
              <div className="pb-2">
                <h2 className="text-foreground text-2xl font-semibold">{examination?.title}</h2>
                <p className="text-muted-foreground text-sm">{examination?.type && typeLabels[examination.type]}</p>
                <div className="mt-1">{examination?.status && <StatusBadge status={examination.status} />}</div>
              </div>
            </div>
            <Button variant="outline" onClick={openEdit}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit Examination
            </Button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {examination?.instructions && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="mb-2 text-lg font-semibold">Instructions</h3>
          <p className="text-muted-foreground text-sm whitespace-pre-wrap">{examination.instructions}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Examination Info */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Examination Details</h3>
          <div className="space-y-4">
            <InfoItem icon={Calendar03Icon} label="Exam Date" value={formatDate(examination?.exam_date)} />
            <InfoItem icon={Clock01Icon} label="Duration" value={`${examination?.duration || 0} minutes`} />
            <InfoItem icon={CheckmarkCircle02Icon} label="Max Score" value={examination?.max_score} />
          </div>
        </div>

        {/* Results Stats */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Results</h3>
          <div className="space-y-4">
            <InfoItem icon={UserMultipleIcon} label="Total Results" value={resultsData?.meta?.total || 0} />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Timeline</h3>
          <div className="space-y-4">
            <InfoItem icon={Clock01Icon} label="Created" value={formatDate(examination?.created_at)} />
            <InfoItem icon={Clock01Icon} label="Last Updated" value={formatDate(examination?.updated_at)} />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Examination Results</h3>
        <div className="space-y-4">
          <DataTable columns={columns} data={resultsData?.data || []} />
          <Pagination
            onPageChange={(page) => setResultParams((prev) => ({ ...prev, page }))}
            onPageSizeChange={(per_page) => setResultParams((prev) => ({ ...prev, per_page }))}
            page={resultParams.page || 1}
            pageSize={resultParams.per_page || 10}
            total={resultsData?.meta?.total || 0}
          />
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Examination</DialogTitle>
            <DialogDescription>Update examination information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={editForm.type}
                onValueChange={(value) => setEditForm({ ...editForm, type: value as ExaminationType })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEST">Test</SelectItem>
                  <SelectItem value="MID_TERM">Mid-Term</SelectItem>
                  <SelectItem value="FINAL">Final</SelectItem>
                  <SelectItem value="MOCK">Mock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value as ExaminationStatus })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Exam Date"
              type="date"
              value={editForm.exam_date}
              onChange={(e) => setEditForm({ ...editForm, exam_date: e.target.value })}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={editForm.duration}
              onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) || 60 })}
            />
            <Input
              label="Max Score"
              type="number"
              value={editForm.max_score}
              onChange={(e) => setEditForm({ ...editForm, max_score: parseInt(e.target.value) || 100 })}
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Instructions"
                value={editForm.instructions}
                onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateExamination.isPending}>
              {updateExamination.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
