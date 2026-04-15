"use client";

import { useParams, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  RefreshIcon,
  UserGroupIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Calendar01Icon,
  File01Icon,
  Time01Icon,
} from "@hugeicons/core-free-icons";

import { DataTable, Breadcrumb, Loader, TabPanel, Pagination } from "@/components/shared";
import { useGetQuiz, useGetQuizSubmissions, usePublishQuiz } from "@/lib/api/assessment";
import { StatusBadge, DateTimeCell, quizSubmissionColumns } from "@/config/columns";
import type { Pagination as PaginationType, QuizSubmission } from "@/types";
import { Button } from "@/components/ui/button";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const tabs = ["overview", "submissions"];

const initialParams = {
  limit: 10,
  page: 1,
};

const questionTypeLabels: Record<string, string> = {
  ESSAY: "Essay",
  SHORT_ANSWER: "Short Answer",
  MULTIPLE_CHOICE: "Multiple Choice",
  MULTIPLE_ANSWER: "Multiple Answer",
  TRUE_FALSE: "True/False",
};

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const { handleChange, values } = useHandler(initialParams);

  const id = useParams().id as string;
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id") as string;

  const breadcrumbs = [
    { label: "Quizzes", href: "/tutor/quizzes" },
    { label: "Quiz Details", href: `/tutor/quizzes/${id}?course_id=${course_id}` },
  ];

  const { data, isPending, isFetching, refetch } = useGetQuiz(course_id, id);
  const { data: submissionsData, isPending: isFetchingSubmissions } = useGetQuizSubmissions(course_id, id, values);
  const { mutate: publishQuiz, isPending: isPublishing } = usePublishQuiz(course_id, id);

  const handlePublish = () => {
    publishQuiz(
      { course_id, id },
      {
        onSuccess: () => {
          toast.success("Quiz published successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to publish quiz");
        },
      },
    );
  };

  const submissions = (submissionsData as { data: QuizSubmission[]; pagination: PaginationType } | undefined)?.data;
  const pagination = (submissionsData as { data: QuizSubmission[]; pagination: PaginationType } | undefined)
    ?.pagination;

  if (isPending && !data) return <Loader />;

  if (!data)
    return (
      <div className="h-full space-y-6 overflow-y-auto p-6">
        <Breadcrumb items={breadcrumbs} />
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Quiz not found</p>
        </div>
      </div>
    );

  const submittedCount = submissions?.filter((s) => s.status === "SUBMITTED" || s.status === "GRADED").length || 0;
  const gradedCount = submissions?.filter((s) => s.status === "GRADED").length || 0;
  const totalQuestions = data.questions?.length || 0;

  return (
    <div className="h-full space-y-6 overflow-y-auto p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-foreground text-2xl font-semibold">{data.title}</h3>
            <StatusBadge status={data.status} />
          </div>
          <p className="text-muted-foreground text-sm">
            Total Marks: {data.total_marks} | Time Limit: {data.time_limit} mins
          </p>
        </div>
        <div className="flex items-center gap-x-4">
          {data.status === "DRAFT" && (
            <Button size="sm" onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish Quiz"}
            </Button>
          )}
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
                type="button"
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
              <h4 className="font-semibold">Quiz Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title</span>
                  <span className="font-medium">{data.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Marks</span>
                  <span>{data.total_marks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Limit</span>
                  <span>{data.time_limit} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={data.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passing Percentage</span>
                  <span>{data.passing_percentage ?? "N/A"}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Allow Retake</span>
                  <span className={data.allow_retake ? "text-green-600" : "text-red-600"}>
                    {data.allow_retake ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Show Before Window</span>
                  <span className={data.show_before_window ? "text-green-600" : "text-red-600"}>
                    {data.show_before_window ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={File01Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{totalQuestions}</p>
                    <p className="text-muted-foreground text-xs">Questions</p>
                  </div>
                </div>
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={UserGroupIcon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{submittedCount}</p>
                    <p className="text-muted-foreground text-xs">Submitted</p>
                  </div>
                </div>
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{gradedCount}</p>
                    <p className="text-muted-foreground text-xs">Graded</p>
                  </div>
                </div>
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Time01Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{data.time_limit}</p>
                    <p className="text-muted-foreground text-xs">Minutes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
              <h4 className="font-semibold">Availability Window</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <HugeiconsIcon icon={Calendar01Icon} className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Available From</p>
                    <p className="font-medium">
                      <DateTimeCell date={data.availability_start} />
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                    <HugeiconsIcon icon={Calendar01Icon} className="size-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Available Until</p>
                    <p className="font-medium">
                      <DateTimeCell date={data.availability_end} />
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-muted/50 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Clock01Icon} className="text-muted-foreground size-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Created At</p>
                    <p className="font-medium">
                      <DateTimeCell date={data.created_at} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {data.instructions && (
              <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
                <h4 className="font-semibold">Instructions</h4>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap first-letter:capitalize">
                  {data.instructions}
                </p>
              </div>
            )}
            {data.questions && data.questions.length > 0 && (
              <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
                <h4 className="font-semibold">Questions ({data.questions.length})</h4>
                <div className="space-y-3">
                  {data.questions.map((question, index) => (
                    <div key={question.id} className="bg-muted/30 rounded-lg p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="bg-muted rounded px-2 py-0.5 text-xs">
                            {questionTypeLabels[question.type] || question.type}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-sm">{question.marks} marks</span>
                      </div>
                      <p className="text-sm first-letter:capitalize">{question.text}</p>
                      {question.options && question.options.length > 0 && (
                        <div className="mt-2 space-y-1 pl-8">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="text-muted-foreground flex items-center gap-2 text-sm">
                              <span className="bg-muted flex h-5 w-5 items-center justify-center rounded text-xs">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span className={question.correct_answers?.includes(option) ? "text-green-600" : ""}>
                                {option}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {question.explanation && (
                        <div className="bg-muted/50 mt-3 rounded p-2">
                          <p className="text-muted-foreground text-xs">
                            <span className="font-medium">Explanation:</span> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabPanel>
        <TabPanel selected={currentTab} value="submissions">
          {isFetchingSubmissions ? (
            <Loader className="min-h-100" />
          ) : (
            <div className="space-y-4">
              <DataTable columns={quizSubmissionColumns} data={submissions || []} />
              <Pagination
                onPageChange={(page) => handleChange("page", page)}
                page={values.page}
                pageSize={values.limit}
                total={pagination?.total_pages || 0}
              />
            </div>
          )}
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
