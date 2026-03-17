"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, RefreshIcon } from "@hugeicons/core-free-icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination, Breadcrumb } from "@/components/shared";
import { createExaminationColumns } from "@/config/columns";
import { useGetExaminations, useCreateExamination } from "@/lib/api/examination";
import { useGetCourses } from "@/lib/api/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PaginationParams, Examination, ExaminationType } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Examinations", href: "/admin/examinations" }];

const initialParams: PaginationParams = {
  order: "asc",
  page: 1,
  per_page: 10,
  search: "",
  status: "ALL",
};

const STATUS = [
  { label: "All", value: "ALL" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const EXAMINATION_TYPES: { label: string; value: ExaminationType }[] = [
  { label: "Test", value: "TEST" },
  { label: "Mid Term", value: "MID_TERM" },
  { label: "Final", value: "FINAL" },
  { label: "Mock", value: "MOCK" },
];

interface CreateExaminationData {
  title: string;
  instructions: string;
  course_id: string;
  exam_date: string;
  duration: number;
  max_score: number;
  pass_percentage: number;
  type: ExaminationType;
}

const initialExamination: CreateExaminationData = {
  title: "",
  instructions: "",
  course_id: "",
  exam_date: "",
  duration: 60,
  max_score: 100,
  pass_percentage: 50,
  type: "TEST",
};

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const [createOpen, setCreateOpen] = useState(false);
  const [examination, setExamination] = useState(initialExamination);

  const columns = createExaminationColumns("ADMIN");
  const { data, isFetching, isPending, refetch } = useGetExaminations(params);
  const { data: coursesData } = useGetCourses({ page: 1, per_page: 100 });
  const createExamination = useCreateExamination();

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateExamination = async () => {
    const payload: Partial<Examination> = {
      title: examination.title,
      instructions: examination.instructions,
      course_id: examination.course_id,
      exam_date: examination.exam_date,
      duration: examination.duration,
      max_score: examination.max_score,
      type: examination.type,
    };
    await createExamination.mutateAsync(payload);
    setCreateOpen(false);
    setExamination(initialExamination);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setExamination(initialExamination);
    }
    setCreateOpen(value);
  };

  const isValid =
    examination.title &&
    examination.course_id &&
    examination.exam_date &&
    examination.duration > 0 &&
    examination.max_score > 0;

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Examinations</h3>
          <p className="text-muted-foreground text-sm">Manage course examinations</p>
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
            New Examination
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
            <DialogTitle>Create New Examination</DialogTitle>
            <DialogDescription>Schedule a new examination for a course.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-medium">Examination Details</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Title"
                    value={examination.title}
                    onChange={(e) => setExamination({ ...examination, title: e.target.value })}
                    placeholder="Enter examination title"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Textarea
                    label="Description / Instructions"
                    value={examination.instructions}
                    onChange={(e) => setExamination({ ...examination, instructions: e.target.value })}
                    placeholder="Enter examination instructions or description"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium">
                    Course <span className="text-destructive">*</span>
                  </label>
                  <Select
                    onValueChange={(value) => setExamination({ ...examination, course_id: value })}
                    value={examination.course_id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {coursesData?.data?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Examination Type <span className="text-destructive">*</span>
                  </label>
                  <Select
                    onValueChange={(value) => setExamination({ ...examination, type: value as ExaminationType })}
                    value={examination.type}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAMINATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  label="Scheduled Date"
                  type="datetime-local"
                  value={examination.exam_date}
                  onChange={(e) => setExamination({ ...examination, exam_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-medium">Scoring Configuration</h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={examination.duration}
                  onChange={(e) => setExamination({ ...examination, duration: parseInt(e.target.value) || 0 })}
                  placeholder="60"
                  min={1}
                  required
                />
                <Input
                  label="Max Score"
                  type="number"
                  value={examination.max_score}
                  onChange={(e) => setExamination({ ...examination, max_score: parseInt(e.target.value) || 0 })}
                  placeholder="100"
                  min={1}
                  required
                />
                <Input
                  label="Pass Percentage (%)"
                  type="number"
                  value={examination.pass_percentage}
                  onChange={(e) => setExamination({ ...examination, pass_percentage: parseInt(e.target.value) || 0 })}
                  placeholder="50"
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateExamination} disabled={createExamination.isPending || !isValid}>
              {createExamination.isPending ? "Creating..." : "Create Examination"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
