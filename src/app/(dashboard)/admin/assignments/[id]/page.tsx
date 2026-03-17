"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Edit02Icon,
  Calendar03Icon,
  Clock01Icon,
  File02Icon,
  CheckmarkCircle02Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";

import { Breadcrumb, Loader, StatusBadge, DataTable, Pagination } from "@/components/shared";
import { useGetAssignment, useUpdateAssignment, useGetAssignmentSubmissions } from "@/lib/api/assignment";
import { createAssignmentSubmissionColumns } from "@/config/columns";
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
import type { AssignmentStatus, PaginationParams } from "@/types";
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

  const { data: assignmentData, isPending } = useGetAssignment(id);
  const assignment = assignmentData?.data;
  const updateAssignment = useUpdateAssignment(id);

  const [subParams, setSubParams] = useState<PaginationParams>({ page: 1, per_page: 10 });
  const { data: submissionsData } = useGetAssignmentSubmissions(id, subParams);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    instructions: "",
    due_date: "",
    max_score: 0,
    status: "" as AssignmentStatus,
  });

  const breadcrumbs = [
    { label: "Assignments", href: "/admin/assignments" },
    { label: "Assignment Details", href: `/admin/assignments/${id}` },
  ];

  const columns = createAssignmentSubmissionColumns("ADMIN");

  const openEdit = () => {
    if (assignment) {
      setEditForm({
        title: assignment.title || "",
        description: assignment.description || "",
        instructions: assignment.instructions || "",
        due_date: assignment.due_date?.split("T")[0] || "",
        max_score: assignment.max_score || 100,
        status: assignment.status,
      });
    }
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    await updateAssignment.mutateAsync(editForm);
    setEditOpen(false);
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/admin/assignments")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Assignments
      </Button>

      {/* Assignment Header */}
      <div className="bg-card relative overflow-hidden rounded-xl border">
        <div className="bg-primary/10 h-24" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="border-background bg-primary flex size-24 items-center justify-center rounded-xl border-4 shadow-lg">
                <HugeiconsIcon icon={File02Icon} className="text-primary-foreground size-12" />
              </div>
              <div className="pb-2">
                <h2 className="text-foreground text-2xl font-semibold">{assignment?.title}</h2>
                <p className="text-muted-foreground text-sm">Max Score: {assignment?.max_score}</p>
                <div className="mt-1">{assignment?.status && <StatusBadge status={assignment.status} />}</div>
              </div>
            </div>
            <Button variant="outline" onClick={openEdit}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit Assignment
            </Button>
          </div>
        </div>
      </div>

      {/* Description & Instructions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-xl border p-6">
          <h3 className="mb-2 text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground text-sm">{assignment?.description || "No description provided."}</p>
        </div>
        <div className="bg-card rounded-xl border p-6">
          <h3 className="mb-2 text-lg font-semibold">Instructions</h3>
          <p className="text-muted-foreground text-sm">{assignment?.instructions || "No instructions provided."}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assignment Info */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Assignment Details</h3>
          <div className="space-y-4">
            <InfoItem icon={Calendar03Icon} label="Due Date" value={formatDate(assignment?.due_date)} />
            <InfoItem icon={CheckmarkCircle02Icon} label="Max Score" value={assignment?.max_score} />
          </div>
        </div>

        {/* Submissions Stats */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Submissions</h3>
          <div className="space-y-4">
            <InfoItem icon={UserMultipleIcon} label="Total Submissions" value={submissionsData?.meta?.total || 0} />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Timeline</h3>
          <div className="space-y-4">
            <InfoItem icon={Clock01Icon} label="Created" value={formatDate(assignment?.created_at)} />
            <InfoItem icon={Clock01Icon} label="Last Updated" value={formatDate(assignment?.updated_at)} />
          </div>
        </div>
      </div>

      {/* Attachments */}
      {assignment?.attachments && assignment.attachments.length > 0 && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="mb-4 text-lg font-semibold">Attachments</h3>
          <div className="flex flex-wrap gap-2">
            {assignment.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-muted/80 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
              >
                <HugeiconsIcon icon={File02Icon} className="size-4" />
                Attachment {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Submissions Table */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Student Submissions</h3>
        <div className="space-y-4">
          <DataTable columns={columns} data={submissionsData?.data || []} />
          <Pagination
            onPageChange={(page) => setSubParams((prev) => ({ ...prev, page }))}
            onPageSizeChange={(per_page) => setSubParams((prev) => ({ ...prev, per_page }))}
            page={subParams.page || 1}
            pageSize={subParams.per_page || 10}
            total={submissionsData?.meta?.total || 0}
          />
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>Update assignment information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <Input
              label="Due Date"
              type="date"
              value={editForm.due_date}
              onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
            />
            <Input
              label="Max Score"
              type="number"
              value={editForm.max_score}
              onChange={(e) => setEditForm({ ...editForm, max_score: parseInt(e.target.value) || 100 })}
            />
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value as AssignmentStatus })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
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
            <Button onClick={handleUpdate} disabled={updateAssignment.isPending}>
              {updateAssignment.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
