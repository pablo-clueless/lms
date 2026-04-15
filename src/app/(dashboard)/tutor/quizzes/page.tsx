"use client";

import { RefreshIcon, Add01Icon, Task01Icon } from "@hugeicons/core-free-icons";
import { useState, useMemo, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import Link from "next/link";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetQuizzes, usePublishQuiz } from "@/lib/api/assessment";
import { DataTable, Breadcrumb, Loader } from "@/components/shared";
import { useGetCourses } from "@/lib/api/course";
import { Button } from "@/components/ui/button";
import { quizColumns } from "@/config/columns";
import { useUserStore } from "@/store/core";
import type { Quiz } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Quizzes", href: "/tutor/quizzes" }];

const Page = () => {
  const { user } = useUserStore();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const { data: coursesData, isPending: coursesPending } = useGetCourses({ tutor_id: user?.id });
  const { data: quizzesData, isFetching, isPending, refetch } = useGetQuizzes(selectedCourse);
  const { mutate: publishQuiz } = usePublishQuiz(selectedCourse, publishingId || "");

  const handlePublish = useCallback(
    (quiz: Quiz) => {
      setPublishingId(quiz.id);
      publishQuiz(
        { course_id: selectedCourse, id: quiz.id },
        {
          onSuccess: () => {
            toast.success("Quiz published successfully");
            refetch();
            setPublishingId(null);
          },
          onError: (error) => {
            toast.error(error.message || "Failed to publish quiz");
            setPublishingId(null);
          },
        },
      );
    },
    [publishQuiz, refetch, selectedCourse],
  );

  const columns = useMemo(() => quizColumns("TUTOR", { onPublish: handlePublish }), [handlePublish]);

  if (coursesPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Quizzes</h3>
          <p className="text-sm font-medium text-gray-600">Create and manage quizzes for your courses</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button asChild size="sm">
            <Link href={selectedCourse ? `/tutor/quizzes/create?course_id=${selectedCourse}` : "/tutor/quizzes/create"}>
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" className="size-4" />
              Create Quiz
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
              <p className="text-muted-foreground">Select a course to view quizzes</p>
            </div>
          </div>
        ) : isPending ? (
          <Loader className="min-h-150" />
        ) : (
          <DataTable columns={columns} data={quizzesData?.data || []} />
        )}
      </div>
    </div>
  );
};

export default Page;
