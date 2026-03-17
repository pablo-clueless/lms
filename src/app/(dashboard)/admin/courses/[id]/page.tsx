"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Edit02Icon,
  Calendar03Icon,
  Clock01Icon,
  Book02Icon,
  UserMultipleIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

import { Breadcrumb, Loader, StatusBadge } from "@/components/shared";
import { useGetCourse, useUpdateCourse, useGetCourseModules } from "@/lib/api/course";
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
import type { CourseStatus } from "@/types";
import { formatDate } from "@/lib";

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="text-foreground text-sm font-medium">{value ?? "—"}</p>
  </div>
);

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const { data: courseData, isPending } = useGetCourse(id);
  const course = courseData?.data;
  const { data: modulesData } = useGetCourseModules(id, { page: 1, per_page: 100 });
  const updateCourse = useUpdateCourse(id);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    code: "",
    description: "",
    status: "" as CourseStatus,
    pass_threshold: 0,
    duration: 0,
  });

  const breadcrumbs = [
    { label: "Courses", href: "/admin/courses" },
    { label: "Course Details", href: `/admin/courses/${id}` },
  ];

  const openEdit = () => {
    if (course) {
      setEditForm({
        title: course.title || "",
        code: course.code || "",
        description: course.description || "",
        status: course.status,
        pass_threshold: course.pass_threshold || 70,
        duration: course.duration || 0,
      });
    }
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    await updateCourse.mutateAsync(editForm);
    setEditOpen(false);
  };

  if (isPending) return <Loader />;

  const modules = modulesData?.data || [];

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/admin/courses")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Courses
      </Button>

      {/* Course Header */}
      <div className="bg-card relative overflow-hidden rounded-xl border">
        <div className="bg-primary/10 h-32" />
        <div className="px-6 pb-6">
          <div className="-mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {course?.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="border-background size-32 rounded-xl border-4 object-cover shadow-lg"
                />
              ) : (
                <div className="border-background bg-muted flex size-32 items-center justify-center rounded-xl border-4 shadow-lg">
                  <HugeiconsIcon icon={Book02Icon} className="text-muted-foreground size-12" />
                </div>
              )}
              <div className="pb-2">
                <h2 className="text-foreground text-2xl font-semibold">{course?.title}</h2>
                <p className="text-muted-foreground font-mono text-sm">{course?.code}</p>
                <div className="mt-1">{course?.status && <StatusBadge status={course.status} />}</div>
              </div>
            </div>
            <Button variant="outline" onClick={openEdit}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit Course
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {course?.description && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="mb-2 text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground text-sm">{course.description}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Info */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Course Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={Clock01Icon} className="text-muted-foreground size-5" />
              </div>
              <Field label="Duration" value={`${course?.duration || 0} hours`} />
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-muted-foreground size-5" />
              </div>
              <Field label="Pass Threshold" value={`${course?.pass_threshold || 70}%`} />
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={Book02Icon} className="text-muted-foreground size-5" />
              </div>
              <Field label="Modules" value={modules.length} />
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={UserMultipleIcon} className="text-muted-foreground size-5" />
              </div>
              <Field label="Enrolled Students" value={course?.student_enrollments?.length || 0} />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground size-5" />
              </div>
              <Field label="Created" value={formatDate(course?.created_at)} />
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground size-5" />
              </div>
              <Field label="Last Updated" value={formatDate(course?.updated_at)} />
            </div>
          </div>
        </div>

        {/* Tutors */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Assigned Tutors</h3>
          {course?.tutor_assignments && course.tutor_assignments.length > 0 ? (
            <div className="space-y-2">
              {course.tutor_assignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm">{assignment.tutor_id}</span>
                  {assignment.is_primary && (
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">Primary</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No tutors assigned.</p>
          )}
        </div>
      </div>

      {/* Modules */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Course Modules</h3>
        {modules.length > 0 ? (
          <div className="space-y-3">
            {modules.map((module, index) => (
              <div
                key={module.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{module.title}</p>
                    <p className="text-muted-foreground text-sm">{module.duration} mins</p>
                  </div>
                </div>
                <StatusBadge status={module.is_published ? "PUBLISHED" : "DRAFT"} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No modules added yet.</p>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update course information.</DialogDescription>
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
              label="Code"
              value={editForm.code}
              onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value as CourseStatus })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Duration (hours)"
              type="number"
              value={editForm.duration}
              onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Pass Threshold (%)"
              type="number"
              value={editForm.pass_threshold}
              onChange={(e) => setEditForm({ ...editForm, pass_threshold: parseInt(e.target.value) || 70 })}
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
            <Button onClick={handleUpdate} disabled={updateCourse.isPending}>
              {updateCourse.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
