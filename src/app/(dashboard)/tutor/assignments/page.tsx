"use client";

import { RefreshIcon, Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import Link from "next/link";

import { DataTable, Breadcrumb, Loader } from "@/components/shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAssignments } from "@/lib/api/assessment";
import { useGetCourses } from "@/lib/api/course";
import { assignmentColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/core";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Assignments", href: "/tutor/assignments" }];

const Page = () => {
  const { user } = useUserStore();
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const { data: coursesData, isPending: coursesPending } = useGetCourses({ tutor_id: user?.id });
  const { data: assignmentsData, isFetching, isPending, refetch } = useGetAssignments(selectedCourse);

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
          {selectedCourse && (
            <Link href={`/tutor/assignments/create?course_id=${selectedCourse}`}>
              <Button size="sm">
                <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" className="size-4" />
                Create Assignment
              </Button>
            </Link>
          )}
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
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border">
            <p className="text-muted-foreground">Select a course to view assignments</p>
          </div>
        ) : isPending ? (
          <Loader />
        ) : (
          <DataTable columns={assignmentColumns} data={assignmentsData?.data || []} />
        )}
      </div>
    </div>
  );
};

export default Page;
