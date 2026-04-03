"use client";

import { RefreshIcon, Add01Icon, Task01Icon } from "@hugeicons/core-free-icons";
import { useCallback, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import Link from "next/link";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAssignments, usePublishAssignment } from "@/lib/api/assessment";
import { DataTable, Breadcrumb, Loader } from "@/components/shared";
import { assignmentColumns } from "@/config/columns";
import { useGetCourses } from "@/lib/api/course";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/core";
import type { Assignment } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Assignments", href: "/tutor/assignments" }];

const Page = () => {
  const { user } = useUserStore();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const { data: coursesData, isPending: coursesPending } = useGetCourses({ tutor_id: user?.id });
  const { data: assignmentsData, isFetching, isPending, refetch } = useGetAssignments(selectedCourse);

  const { mutate: publishAssignment } = usePublishAssignment(selectedCourse, publishingId || "");

  const handlePublish = useCallback(
    (quiz: Assignment) => {
      setPublishingId(quiz.id);
      publishAssignment(undefined, {
        onSuccess: () => {
          toast.success("Assignment published successfully");
          refetch();
          setPublishingId(null);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to publish quiz");
          setPublishingId(null);
        },
      });
    },
    [publishAssignment, refetch],
  );

  const columns = useMemo(() => assignmentColumns("TUTOR", { onPublish: handlePublish }), [handlePublish]);

  if (coursesPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Assignments</h3>
          <p className="text-sm font-medium text-gray-600">
            Create assignments, review submissions, and provide feedback
          </p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button asChild size="sm">
            <Link
              href={
                selectedCourse ? `/tutor/assignments/create?course_id=${selectedCourse}` : "/tutor/assignments/create"
              }
            >
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" className="size-4" />
              Create Assignment
            </Link>
          </Button>
          <Button disabled={isFetching || !selectedCourse} onClick={() => refetch()} variant="outline" size="sm">
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
        <div className="flex items-center gap-4">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {coursesData?.courses?.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!selectedCourse ? (
          <div className="flex h-150 flex-col items-center justify-center rounded-lg border">
            <div className="flex flex-col items-center gap-y-5">
              <HugeiconsIcon className="text-foreground size-10" icon={Task01Icon} />
              <p className="text-muted-foreground">Select a course to view assignments</p>
            </div>
          </div>
        ) : isPending ? (
          <Loader className="min-h-150" />
        ) : (
          <DataTable columns={columns} data={assignmentsData?.data || []} />
        )}
      </div>
    </div>
  );
};

export default Page;
