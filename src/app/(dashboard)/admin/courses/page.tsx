"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, RefreshIcon } from "@hugeicons/core-free-icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination, Breadcrumb } from "@/components/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createCourseColumns } from "@/config/columns";
import { useGetCourses, useCreateCourse } from "@/lib/api/course";
import { useGetTracks } from "@/lib/api/cohort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Course, PaginationParams } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Courses", href: "/admin/courses" }];

const initialParams: PaginationParams = {
  order: "asc",
  page: 1,
  per_page: 10,
  search: "",
  status: "",
};

const STATUS = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

interface CreateCourseDto {
  title: string;
  code: string;
  description: string;
  track_id: string;
  pass_threshold: number;
  duration: number;
}

const initialCourse: CreateCourseDto = {
  title: "",
  code: "",
  description: "",
  track_id: "",
  pass_threshold: 50,
  duration: 0,
};

const generateCode = (title: string) => {
  return title
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 10);
};

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (course: CreateCourseDto) => Promise<void>;
  isPending: boolean;
}

const CreateCourseDialog = ({ open, onOpenChange, onSubmit, isPending }: CreateCourseDialogProps) => {
  const [course, setCourse] = useState(initialCourse);
  const { data: tracksData, isPending: isTracksPending } = useGetTracks({ page: 1, per_page: 100 });

  const handleTitleChange = (title: string) => {
    setCourse((prev) => ({
      ...prev,
      title,
      code: generateCode(title),
    }));
  };

  const handleSubmit = async () => {
    await onSubmit(course);
    setCourse(initialCourse);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setCourse(initialCourse);
    }
    onOpenChange(value);
  };

  const isValid = course.title && course.code && course.track_id && course.pass_threshold > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>Add a new course to the curriculum.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-medium">Course Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Course Title"
                  value={course.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter course title"
                  required
                />
              </div>
              <Input
                label="Course Code"
                value={course.code}
                onChange={(e) => setCourse({ ...course, code: e.target.value })}
                placeholder="e.g., CS101"
                helperText="URL-friendly identifier (auto-generated)"
                required
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Track <span className="text-destructive">*</span>
                </label>
                <Select
                  onValueChange={(track_id) => setCourse({ ...course, track_id })}
                  value={course.track_id}
                  disabled={isTracksPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isTracksPending ? "Loading tracks..." : "Select a track"} />
                  </SelectTrigger>
                  <SelectContent>
                    {tracksData?.data?.map((track) => (
                      <SelectItem key={track.id} value={track.id}>
                        {track.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                label="Pass Threshold (%)"
                type="number"
                value={course.pass_threshold}
                onChange={(e) => setCourse({ ...course, pass_threshold: Number(e.target.value) })}
                placeholder="50"
                min={0}
                max={100}
                required
              />
              <Input
                label="Duration (hours)"
                type="number"
                value={course.duration}
                onChange={(e) => setCourse({ ...course, duration: Number(e.target.value) })}
                placeholder="0"
                min={0}
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  placeholder="Brief description of the course"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !isValid}>
            {isPending ? "Creating..." : "Create Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const [createOpen, setCreateOpen] = useState(false);

  const columns = createCourseColumns("ADMIN");
  const { data, isFetching, isPending, refetch } = useGetCourses(params);
  const createCourse = useCreateCourse();

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateCourse = async (course: CreateCourseDto) => {
    await createCourse.mutateAsync(course as Partial<Course>);
    setCreateOpen(false);
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Courses</h3>
          <p className="text-muted-foreground text-sm">Manage your courses and curriculum</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Select onValueChange={(status) => handleParamsChange("status", status)} value={params.status}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
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
            New Course
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
      <CreateCourseDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateCourse}
        isPending={createCourse.isPending}
      />
    </div>
  );
};

export default Page;
