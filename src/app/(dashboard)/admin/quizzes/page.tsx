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
import { createQuizColumns } from "@/config/columns";
import { useGetQuizzes, useCreateQuiz } from "@/lib/api/quiz";
import { useGetCourses } from "@/lib/api/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { PaginationParams, Quiz, QuizStatus } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Quizzes", href: "/admin/quizzes" }];

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
  { label: "Closed", value: "CLOSED" },
];

const QUIZ_STATUS_OPTIONS: { label: string; value: QuizStatus }[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

type CreateQuizDto = Pick<
  Quiz,
  | "title"
  | "description"
  | "instructions"
  | "module_id"
  | "duration"
  | "pass_threshold"
  | "max_attempts"
  | "shuffle_questions"
  | "shuffle_options"
  | "show_results"
  | "status"
>;

const initialQuiz: CreateQuizDto = {
  title: "",
  description: "",
  instructions: "",
  module_id: "",
  duration: 30,
  pass_threshold: 50,
  max_attempts: 1,
  shuffle_questions: false,
  shuffle_options: false,
  show_results: true,
  status: "DRAFT",
};

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const [createOpen, setCreateOpen] = useState(false);
  const [quiz, setQuiz] = useState<CreateQuizDto>(initialQuiz);

  const columns = createQuizColumns("ADMIN");
  const { data, isFetching, isPending, refetch } = useGetQuizzes(params);
  const { data: coursesData } = useGetCourses({ page: 1, per_page: 100, order: "asc" });
  const createQuiz = useCreateQuiz();

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateQuiz = async () => {
    await createQuiz.mutateAsync(quiz);
    setQuiz(initialQuiz);
    setCreateOpen(false);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setQuiz(initialQuiz);
    }
    setCreateOpen(value);
  };

  const isValid = quiz.title && quiz.duration > 0 && quiz.pass_threshold >= 0 && quiz.pass_threshold <= 100;

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Quizzes</h3>
          <p className="text-muted-foreground text-sm">Manage course quizzes</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Select onValueChange={(status) => handleParamsChange("status", status)} value={params.status}>
            <SelectTrigger className="w-37.5">
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
            New Quiz
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
            <DialogTitle>Create New Quiz</DialogTitle>
            <DialogDescription>Add a new quiz to assess student knowledge and understanding.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-medium">Quiz Information</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Quiz Title"
                    value={quiz.title}
                    onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                    placeholder="Enter quiz title"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Textarea
                    label="Description"
                    value={quiz.description}
                    onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                    placeholder="Brief description of the quiz"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Textarea
                    label="Instructions"
                    value={quiz.instructions}
                    onChange={(e) => setQuiz({ ...quiz, instructions: e.target.value })}
                    placeholder="Instructions for students taking the quiz"
                  />
                </div>
                {coursesData?.data && coursesData.data.length > 0 && (
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">Course (Optional)</label>
                    <Select
                      value={quiz.module_id || ""}
                      onValueChange={(value) => setQuiz({ ...quiz, module_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {coursesData.data.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-medium">Quiz Settings</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Time Limit (minutes)"
                  type="number"
                  value={quiz.duration || ""}
                  onChange={(e) => setQuiz({ ...quiz, duration: parseInt(e.target.value) || 0 })}
                  placeholder="30"
                  required
                />
                <Input
                  label="Pass Percentage (%)"
                  type="number"
                  value={quiz.pass_threshold || ""}
                  onChange={(e) => setQuiz({ ...quiz, pass_threshold: parseInt(e.target.value) || 0 })}
                  placeholder="50"
                  required
                />
                <Input
                  label="Max Attempts"
                  type="number"
                  value={quiz.max_attempts || ""}
                  onChange={(e) => setQuiz({ ...quiz, max_attempts: parseInt(e.target.value) || 1 })}
                  placeholder="1"
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Status</label>
                  <Select
                    value={quiz.status}
                    onValueChange={(value) => setQuiz({ ...quiz, status: value as QuizStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUIZ_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 text-sm font-medium">Quiz Options</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shuffle_questions"
                    checked={quiz.shuffle_questions}
                    onCheckedChange={(checked) => setQuiz({ ...quiz, shuffle_questions: checked === true })}
                  />
                  <label htmlFor="shuffle_questions" className="cursor-pointer text-sm font-medium">
                    Shuffle Questions
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shuffle_options"
                    checked={quiz.shuffle_options}
                    onCheckedChange={(checked) => setQuiz({ ...quiz, shuffle_options: checked === true })}
                  />
                  <label htmlFor="shuffle_options" className="cursor-pointer text-sm font-medium">
                    Shuffle Answer Options
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show_results"
                    checked={quiz.show_results}
                    onCheckedChange={(checked) => setQuiz({ ...quiz, show_results: checked === true })}
                  />
                  <label htmlFor="show_results" className="cursor-pointer text-sm font-medium">
                    Show Results to Students
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuiz} disabled={createQuiz.isPending || !isValid}>
              {createQuiz.isPending ? "Creating..." : "Create Quiz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
