"use client";

import { RefreshIcon, BookOpen01Icon, UserGroupIcon, File01Icon, Quiz01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { StatusBadge, assignmentColumns, quizColumns, studentColumns } from "@/config/columns";
import { DataTable, Breadcrumb, Loader, TabPanel } from "@/components/shared";
import { useGetQuizzes, useGetAssignments } from "@/lib/api/assessment";
import { useGetCourse } from "@/lib/api/course";
import { Button } from "@/components/ui/button";
import { useGetClass } from "@/lib/api/class";
import { useGetUsers } from "@/lib/api/user";
import { cn } from "@/lib";

const tabs = ["overview", "quizzes", "assignments"];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const id = useParams().id as string;

  const { data: course, isFetching, isPending, refetch } = useGetCourse(id);
  const { data: classData } = useGetClass(course?.class_id || "");
  const { data: quizzesData, isPending: quizzesPending } = useGetQuizzes(id);
  const { data: assignmentsData, isPending: assignmentsPending } = useGetAssignments(id);
  const { data: studentsData, isPending: studentsPending } = useGetUsers({
    role: "STUDENT",
    class_id: course?.class_id,
  });

  const breadcrumbs = [
    { label: "Classes", href: "/admin/classes" },
    { label: course?.name || "Course Details", href: `/admin/courses/${id}` },
  ];

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-foreground text-2xl font-semibold">{course?.name}</h3>
            <StatusBadge status={course?.status || "DRAFT"} />
          </div>
          <p className="text-sm text-gray-600">{course?.subject_code}</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button disabled={isFetching} onClick={() => refetch()} variant="outline" size="sm">
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
        <div className="border-b">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors",
                  currentTab === tab
                    ? "border-primary text-primary border-b-2"
                    : "text-muted-foreground hover:text-foreground",
                )}
                key={tab}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <TabPanel selected={currentTab} value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Course Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{course?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject Code</span>
                  <span className="font-mono">{course?.subject_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class</span>
                  <span>{classData?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={course?.status || "DRAFT"} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Periods/Week</span>
                  <span>{course?.max_periods_per_week || "Not set"}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Quiz01Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{quizzesData?.data?.length || 0}</p>
                    <p className="text-muted-foreground text-xs">Quizzes</p>
                  </div>
                </div>
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={File01Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{assignmentsData?.data?.length || 0}</p>
                    <p className="text-muted-foreground text-xs">Assignments</p>
                  </div>
                </div>
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={UserGroupIcon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{studentsData?.pagination?.total || 0}</p>
                    <p className="text-muted-foreground text-xs">Students</p>
                  </div>
                </div>
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={BookOpen01Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{course?.materials?.length || 0}</p>
                    <p className="text-muted-foreground text-xs">Materials</p>
                  </div>
                </div>
              </div>
            </div>
            {course?.description && (
              <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
                <h4 className="font-semibold">Description</h4>
                <p className="text-muted-foreground text-sm">{course.description}</p>
              </div>
            )}
            {course?.custom_grade_weighting && (
              <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
                <h4 className="font-semibold">Grade Weighting</h4>
                <div className="flex gap-8">
                  <div>
                    <p className="text-primary text-2xl font-bold">
                      {course.custom_grade_weighting.continuous_assessment}%
                    </p>
                    <p className="text-muted-foreground text-sm">Continuous Assessment</p>
                  </div>
                  <div>
                    <p className="text-primary text-2xl font-bold">{course.custom_grade_weighting.examination}%</p>
                    <p className="text-muted-foreground text-sm">Examination</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabPanel>
        <TabPanel selected={currentTab} value="quizzes">
          {quizzesPending ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              {quizzesData?.data && quizzesData.data.length > 0 ? (
                <DataTable columns={quizColumns("TUTOR")} data={quizzesData.data} />
              ) : (
                <div className="rounded-lg border p-8 text-center">
                  <p className="text-muted-foreground">No quizzes created for this course yet</p>
                </div>
              )}
            </div>
          )}
        </TabPanel>
        <TabPanel selected={currentTab} value="assignments">
          {assignmentsPending ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              {assignmentsData?.data && assignmentsData.data.length > 0 ? (
                <DataTable columns={assignmentColumns("TUTOR")} data={assignmentsData.data} />
              ) : (
                <div className="rounded-lg border p-8 text-center">
                  <p className="text-muted-foreground">No assignments created for this course yet</p>
                </div>
              )}
            </div>
          )}
        </TabPanel>
        <TabPanel selected={currentTab} value="students">
          {studentsPending ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              {studentsData?.users && studentsData.users.length > 0 ? (
                <div className="">
                  <DataTable columns={studentColumns("TUTOR")} data={studentsData.users} />
                </div>
              ) : (
                <div className="rounded-lg border p-8 text-center">
                  <p className="text-muted-foreground">No students enrolled in this class</p>
                </div>
              )}
            </div>
          )}
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
