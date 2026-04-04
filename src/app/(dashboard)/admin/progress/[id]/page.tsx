"use client";

import { RefreshIcon, ChartLineData01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Breadcrumb, Loader, TabPanel } from "@/components/shared";
import { useGetProgress, useComputeGradesForCourse } from "@/lib/api/progress";
import { useGetCourse } from "@/lib/api/course";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/config/columns";
import { useGetUser } from "@/lib/api/user";
import { cn } from "@/lib";

const tabs = ["overview", "scores", "attendance"];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const id = useParams().id as string;

  const { data: progress, isFetching, isPending, refetch } = useGetProgress(id);
  const { data: student } = useGetUser(progress?.student_id || "");
  const { data: course } = useGetCourse(progress?.course_id || "");
  const { mutate: computeGrades, isPending: isComputing } = useComputeGradesForCourse();

  const breadcrumbs = [
    { label: "Progress", href: "/admin/progress" },
    { label: student?.first_name || "Progress Details", href: `/admin/progress/${id}` },
  ];

  if (isPending) return <Loader />;

  const handleComputeGrades = () => {
    if (!progress?.course_id) return;
    computeGrades(progress.course_id, {
      onSuccess: () => {
        toast.success("Grades computed successfully");
        refetch();
      },
      onError: () => {
        toast.error("Failed to compute grades");
      },
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-green-600";
      case "B":
        return "text-blue-600";
      case "C":
        return "text-yellow-600";
      case "D":
        return "text-orange-600";
      case "F":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-foreground text-2xl font-semibold">
              {student?.first_name} {student?.last_name}
            </h3>
            <StatusBadge status={progress?.status || "IN_PROGRESS"} />
            {progress?.is_flagged && (
              <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                <HugeiconsIcon icon={AlertCircleIcon} className="size-3" />
                Flagged
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {course?.name} &bull; Progress ID: {id}
          </p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button onClick={handleComputeGrades} disabled={isComputing} size="sm" variant="outline">
            <HugeiconsIcon icon={ChartLineData01Icon} className="mr-2 size-4" />
            {isComputing ? "Computing..." : "Compute Grades"}
          </Button>
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
              <h4 className="font-semibold">Progress Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student</span>
                  <span>
                    {student?.first_name} {student?.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course</span>
                  <span>{course?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={progress?.status || "IN_PROGRESS"} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class Position</span>
                  <span>{progress?.class_position || "Not ranked"}</span>
                </div>
              </div>
            </div>

            {progress?.grade && (
              <div className="space-y-4 rounded-lg border p-4">
                <h4 className="font-semibold">Grade Summary</h4>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className={cn("text-4xl font-bold", getGradeColor(progress.grade.letter_grade))}>
                      {progress.grade.letter_grade}
                    </p>
                    <p className="text-muted-foreground text-sm">Letter Grade</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">CA Score</span>
                      <span className="font-medium">{progress.grade.continuous_assessment}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exam Score</span>
                      <span className="font-medium">{progress.grade.examination}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-medium">{progress.grade.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Percentage</span>
                      <span className="font-medium">{progress.grade.percentage}%</span>
                    </div>
                  </div>
                </div>
                {progress.grade.remark && (
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium">Remark:</span> {progress.grade.remark}
                  </p>
                )}
              </div>
            )}

            {progress?.tutor_remarks && (
              <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
                <h4 className="font-semibold">Tutor Remarks</h4>
                <p className="text-muted-foreground text-sm">{progress.tutor_remarks}</p>
              </div>
            )}

            {progress?.flag_reason && (
              <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4 md:col-span-2">
                <h4 className="flex items-center gap-2 font-semibold text-red-700">
                  <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
                  Flag Reason
                </h4>
                <p className="text-sm text-red-600">{progress.flag_reason}</p>
              </div>
            )}
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="scores">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Quiz Scores</h4>
              {progress?.quiz_scores && progress.quiz_scores.length > 0 ? (
                <div className="space-y-2">
                  {progress.quiz_scores.map((score, index) => (
                    <div key={index} className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                      <span className="text-sm">Quiz {index + 1}</span>
                      <span className="font-medium">{score}</span>
                    </div>
                  ))}
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <span className="font-medium">Average</span>
                    <span className="text-primary font-bold">
                      {(progress.quiz_scores.reduce((a, b) => a + b, 0) / progress.quiz_scores.length).toFixed(1)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No quiz scores recorded</p>
              )}
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Assignment Scores</h4>
              {progress?.assignment_scores && progress.assignment_scores.length > 0 ? (
                <div className="space-y-2">
                  {progress.assignment_scores.map((score, index) => (
                    <div key={index} className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                      <span className="text-sm">Assignment {index + 1}</span>
                      <span className="font-medium">{score}</span>
                    </div>
                  ))}
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <span className="font-medium">Average</span>
                    <span className="text-primary font-bold">
                      {(
                        progress.assignment_scores.reduce((a, b) => a + b, 0) / progress.assignment_scores.length
                      ).toFixed(1)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No assignment scores recorded</p>
              )}
            </div>

            <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
              <h4 className="font-semibold">Examination Score</h4>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
                  <span className="text-primary text-2xl font-bold">{progress?.examination_score ?? "N/A"}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {progress?.examination_score !== undefined
                    ? "Examination has been graded"
                    : "Examination not yet graded"}
                </p>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="attendance">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Attendance Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Periods</span>
                  <span className="font-medium">{progress?.attendance?.total_periods || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Periods Attended</span>
                  <span className="font-medium text-green-600">{progress?.attendance?.periods_attended || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Periods Absent</span>
                  <span className="font-medium text-red-600">{progress?.attendance?.periods_absent || 0}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Attendance Rate</h4>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24">
                  <svg className="h-24 w-24 -rotate-90 transform">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(progress?.attendance?.percentage || 0) * 2.51} 251`}
                      className="text-primary"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                    {progress?.attendance?.percentage || 0}%
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    {(progress?.attendance?.percentage || 0) >= 75
                      ? "Good attendance record"
                      : "Attendance needs improvement"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
