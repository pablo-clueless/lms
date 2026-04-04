"use client";

import { RefreshIcon, Quiz01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Breadcrumb, Loader, Pagination } from "@/components/shared";
import { useGetStudentEnrollment } from "@/lib/api/enrollment";
import { useGetQuizzes } from "@/lib/api/assessment";
import { useGetCourses } from "@/lib/api/course";
import { Button } from "@/components/ui/button";
import { quizColumns } from "@/config/columns";
import { useUserStore } from "@/store/core";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Quizzes", href: "/student/quizzes" }];

const initialParams = {
  limit: 10,
  page: 1,
};

const Page = () => {
  const [courseId, setCourseId] = useState("");
  const { user } = useUserStore();
  const { data: enrollment, isPending: isFetchingEnrollment } = useGetStudentEnrollment(String(user?.id));

  const { data: coursesData, isPending: isFetchingCourses } = useGetCourses({
    class_id: enrollment?.class.id,
    limit: 20,
    page: 1,
  });
  const { handleChange, values } = useHandler(initialParams);
  const { data, isFetching, isPending, refetch } = useGetQuizzes(courseId, values);

  const courses = useMemo(() => coursesData?.courses || [], [coursesData]);

  if (isFetchingEnrollment || isFetchingCourses) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="w-fit space-y-1">
        <h3 className="text-foreground text-3xl">Quizzes</h3>
        <p className="text-sm font-medium text-gray-600">View and take your quizzes here.</p>
      </div>
      <div className="flex w-full items-center justify-between">
        <Select onValueChange={setCourseId} value={courseId}>
          <SelectTrigger className="w-75">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-x-4">
          <Button disabled={isFetching || !courseId} onClick={() => refetch()} variant="outline" size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {!courseId ? (
          <div className="flex h-150 flex-col items-center justify-center rounded-lg border">
            <div className="flex flex-col items-center gap-y-5">
              <HugeiconsIcon className="text-foreground size-10" icon={Quiz01Icon} />
              <p className="text-muted-foreground">Select a course to view quizzes</p>
            </div>
          </div>
        ) : isPending ? (
          <Loader className="min-h-150" />
        ) : (
          <>
            <DataTable columns={quizColumns("STUDENT")} data={data?.data || []} />
            {data?.pagination && (
              <Pagination
                onPageChange={(page) => handleChange("page", page)}
                page={values.page}
                pageSize={values.limit}
                total={data.pagination.total_pages}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
