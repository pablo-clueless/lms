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
import { createAssignmentColumns } from "@/config/columns";
import { useGetAssignments, useCreateAssignment } from "@/lib/api/assignment";
import { useGetCourses } from "@/lib/api/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Assignment, PaginationParams } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Assignments", href: "/admin/assignments" }];

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
  { label: "Published", value: "PUBLISHED" },
  { label: "Closed", value: "CLOSED" },
];

interface CreateAssignmentData {
  title: string;
  description: string;
  course_id: string;
  due_date: string;
  max_score: number;
}

const initialAssignment: CreateAssignmentData = {
  title: "",
  description: "",
  course_id: "",
  due_date: "",
  max_score: 100,
};

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignment, setAssignment] = useState<CreateAssignmentData>(initialAssignment);

  const columns = createAssignmentColumns("ADMIN");
  const { data, isFetching, isPending, refetch } = useGetAssignments(params);
  const { data: coursesData } = useGetCourses({ page: 1, per_page: 100, order: "asc", search: "", status: "" });
  const createAssignment = useCreateAssignment();

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAssignment = async () => {
    await createAssignment.mutateAsync(assignment as Partial<Assignment>);
    setCreateOpen(false);
    setAssignment(initialAssignment);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setAssignment(initialAssignment);
    }
    setCreateOpen(value);
  };

  const isValid = assignment.title && assignment.course_id && assignment.due_date && assignment.max_score > 0;

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Assignments</h3>
          <p className="text-muted-foreground text-sm">Manage course assignments</p>
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
            New Assignment
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
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>Add a new assignment to a course.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Title"
                  value={assignment.title}
                  onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
                  placeholder="Enter assignment title"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  value={assignment.description}
                  onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
                  placeholder="Enter assignment description"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Course <span className="text-red-500">*</span>
                </label>
                <Select
                  value={assignment.course_id}
                  onValueChange={(value) => setAssignment({ ...assignment, course_id: value })}
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
              <Input
                label="Due Date"
                type="datetime-local"
                value={assignment.due_date}
                onChange={(e) => setAssignment({ ...assignment, due_date: e.target.value })}
                required
              />
              <Input
                label="Max Score"
                type="number"
                value={assignment.max_score.toString()}
                onChange={(e) => setAssignment({ ...assignment, max_score: parseInt(e.target.value) || 0 })}
                placeholder="100"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAssignment} disabled={createAssignment.isPending || !isValid}>
              {createAssignment.isPending ? "Creating..." : "Create Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
