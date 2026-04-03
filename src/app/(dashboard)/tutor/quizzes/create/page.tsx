"use client";

import { Delete02Icon, Add01Icon, ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CreateQuizDto, QuestionDto, QuestionType } from "@/types";
import { useCreateQuiz } from "@/lib/api/assessment";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetCourses } from "@/lib/api/course";
import { Breadcrumb } from "@/components/shared";
import { useGetClasses } from "@/lib/api/class";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { removeNullOrUndefined } from "@/lib";
import { useUserStore } from "@/store/core";

const breadcrumbs = [
  { label: "Quizzes", href: "/tutor/quizzes" },
  { label: "Create Quiz", href: "/tutor/quizzes/create" },
];

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
  { value: "MULTIPLE_ANSWER", label: "Multiple Answer" },
  { value: "boolean_FALSE", label: "True/False" },
  { value: "SHORT_ANSWER", label: "Short Answer" },
];

const createEmptyQuestion = (orderIndex: number): QuestionDto => ({
  id: crypto.randomUUID(),
  type: "MULTIPLE_CHOICE",
  text: "",
  options: ["", ""],
  correct_answers: [],
  marks: 1,
  explanation: "",
  order_index: orderIndex,
  attachment_urls: [],
});

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  instructions: Yup.string().required("Instructions are required"),
  course_id: Yup.string().required("Course is required"),
  class_id: Yup.string().required("Class is required"),
  time_limit: Yup.number().required("Time limit is required").min(1, "Time limit must be at least 1 minute"),
  passing_percentage: Yup.number()
    .required("Passing percentage is required")
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100"),
  availability_start: Yup.string().required("Start date is required"),
  availability_end: Yup.string().required("End date is required"),
});

const Page = () => {
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  const router = useRouter();

  const initialCourseId = searchParams.get("course_id") || "";
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [questions, setQuestions] = useState<QuestionDto[]>([createEmptyQuestion(0)]);

  const { data: courses, isPending: isFetchingCourses } = useGetCourses({
    limit: 50,
    tutor_id: String(user?.id),
  });
  const { data: classes, isPending: isFetchingClasses } = useGetClasses({
    limit: 20,
    tutor_id: String(user?.id),
  });

  const { mutate: createQuiz, isPending: isCreating } = useCreateQuiz(selectedCourseId);

  const formik = useFormik<Omit<CreateQuizDto, "questions">>({
    initialValues: {
      title: "",
      instructions: "",
      course_id: initialCourseId,
      class_id: "",
      time_limit: 30,
      passing_percentage: 50,
      availability_start: "",
      availability_end: "",
      show_before_window: false,
      allow_retake: false,
    },
    validationSchema,
    onSubmit: (values) => {
      if (questions.length === 0) {
        toast.error("Please add at least one question");
        return;
      }

      const hasEmptyQuestions = questions.some((q) => !q.text.trim());
      if (hasEmptyQuestions) {
        toast.error("All questions must have text");
        return;
      }

      const hasQuestionsWithoutAnswers = questions.some(
        (q) =>
          (q.type === "MULTIPLE_CHOICE" || q.type === "MULTIPLE_ANSWER" || q.type === "boolean_FALSE") &&
          q.correct_answers.length === 0,
      );
      if (hasQuestionsWithoutAnswers) {
        toast.error("All multiple choice and true/false questions must have correct answers selected");
        return;
      }

      const payload: CreateQuizDto = {
        ...values,
        availability_start: `${values.availability_start}:00Z`,
        availability_end: `${values.availability_end}:00Z`,
        questions,
      };

      const filteredPayload = removeNullOrUndefined(payload);

      createQuiz(filteredPayload, {
        onSuccess: () => {
          toast.success("Quiz created successfully");
          router.push("/tutor/quizzes");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create quiz");
        },
      });
    },
  });

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
    formik.setFieldValue("course_id", value);
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion(prev.length)]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((q, i) => ({ ...q, order_index: i }));
    });
  };

  const updateQuestion = (index: number, updates: Partial<QuestionDto>) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === questions.length - 1)) {
      return;
    }
    const newIndex = direction === "up" ? index - 1 : index + 1;
    setQuestions((prev) => {
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated.map((q, i) => ({ ...q, order_index: i }));
    });
  };

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    updateQuestion(questionIndex, { options: [...question.options, ""] });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const question = questions[questionIndex];
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    updateQuestion(questionIndex, { options: newOptions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    const newCorrectAnswers = question.correct_answers.filter((ans) => ans !== question.options[optionIndex]);
    updateQuestion(questionIndex, { options: newOptions, correct_answers: newCorrectAnswers });
  };

  const toggleCorrectAnswer = (questionIndex: number, option: string) => {
    const question = questions[questionIndex];
    const isMultipleAnswer = question.type === "MULTIPLE_ANSWER";

    if (isMultipleAnswer) {
      const newCorrectAnswers = question.correct_answers.includes(option)
        ? question.correct_answers.filter((ans) => ans !== option)
        : [...question.correct_answers, option];
      updateQuestion(questionIndex, { correct_answers: newCorrectAnswers });
    } else {
      updateQuestion(questionIndex, { correct_answers: [option] });
    }
  };

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="h-full space-y-6 overflow-y-auto p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Create Quiz</h3>
          <p className="text-sm font-medium text-gray-600">Create a new quiz for your students.</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
            <CardDescription>Enter the basic information for your quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Title"
              name="title"
              placeholder="Enter quiz title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title ? formik.errors.title : undefined}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Course <span className="text-destructive">*</span>
                </Label>
                <Select value={formik.values.course_id} onValueChange={handleCourseChange} disabled={isFetchingCourses}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.courses?.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.course_id && formik.errors.course_id && (
                  <p className="text-destructive text-sm">{formik.errors.course_id}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Class <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formik.values.class_id}
                  onValueChange={(value) => formik.setFieldValue("class_id", value)}
                  disabled={isFetchingClasses}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes?.classes?.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.class_id && formik.errors.class_id && (
                  <p className="text-destructive text-sm">{formik.errors.class_id}</p>
                )}
              </div>
            </div>
            <Textarea
              label="Instructions"
              name="instructions"
              placeholder="Enter quiz instructions for students"
              value={formik.values.instructions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.instructions ? formik.errors.instructions : undefined}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Time Limit (minutes)"
                name="time_limit"
                type="number"
                min={1}
                placeholder="30"
                value={formik.values.time_limit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.time_limit ? formik.errors.time_limit : undefined}
                required
              />
              <Input
                label="Passing Percentage"
                name="passing_percentage"
                type="number"
                min={0}
                max={100}
                placeholder="50"
                value={formik.values.passing_percentage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.passing_percentage ? formik.errors.passing_percentage : undefined}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Availability Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Availability Settings</CardTitle>
            <CardDescription>Configure when the quiz is available and retake options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Availability Start"
                name="availability_start"
                type="datetime-local"
                value={formik.values.availability_start}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.availability_start ? formik.errors.availability_start : undefined}
                required
              />
              <Input
                label="Availability End"
                name="availability_end"
                type="datetime-local"
                value={formik.values.availability_end}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.availability_end ? formik.errors.availability_end : undefined}
                required
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Show Before Availability Window</Label>
                <p className="text-muted-foreground text-sm">
                  Allow students to see the quiz details before it becomes available
                </p>
              </div>
              <Switch
                checked={formik.values.show_before_window}
                onCheckedChange={(checked) => formik.setFieldValue("show_before_window", checked)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Allow Retake</Label>
                <p className="text-muted-foreground text-sm">Students can retake the quiz after completing it</p>
              </div>
              <Switch
                checked={formik.values.allow_retake}
                onCheckedChange={(checked) => formik.setFieldValue("allow_retake", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add questions for this quiz. Total marks: {totalMarks}</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                <HugeiconsIcon icon={Add01Icon} className="size-4" data-icon="inline-start" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, qIndex) => (
              <div key={question.id} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-muted flex size-8 items-center justify-center rounded-full text-sm font-medium">
                      {qIndex + 1}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={qIndex === 0}
                        onClick={() => moveQuestion(qIndex, "up")}
                        className="size-8 p-0"
                      >
                        <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={qIndex === questions.length - 1}
                        onClick={() => moveQuestion(qIndex, "down")}
                        className="size-8 p-0"
                      >
                        <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                    disabled={questions.length === 1}
                    className="text-destructive hover:text-destructive size-8 p-0"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Question Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value: QuestionType) => {
                        const needsOptions = value === "MULTIPLE_CHOICE" || value === "MULTIPLE_ANSWER";
                        updateQuestion(qIndex, {
                          type: value,
                          options: needsOptions ? (question.options.length > 0 ? question.options : ["", ""]) : [],
                          correct_answers: [],
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    label="Marks"
                    type="number"
                    min={1}
                    value={question.marks}
                    onChange={(e) => updateQuestion(qIndex, { marks: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <Textarea
                  label="Question Text"
                  placeholder="Enter your question"
                  value={question.text}
                  onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                  required
                />

                {(question.type === "MULTIPLE_CHOICE" || question.type === "MULTIPLE_ANSWER") && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Options{" "}
                        {question.type === "MULTIPLE_ANSWER"
                          ? "(Select all correct answers)"
                          : "(Select the correct answer)"}
                      </Label>
                      <Button type="button" variant="ghost" size="sm" onClick={() => addOption(qIndex)}>
                        <HugeiconsIcon icon={Add01Icon} className="size-4" data-icon="inline-start" />
                        Add Option
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <Checkbox
                            checked={question.correct_answers.includes(option)}
                            onCheckedChange={() => option && toggleCorrectAnswer(qIndex, option)}
                            disabled={!option}
                          />
                          <Input
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            wrapperClassName="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(qIndex, oIndex)}
                            disabled={question.options.length <= 2}
                            className="text-destructive hover:text-destructive size-8 p-0"
                          >
                            <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {question.type === "boolean_FALSE" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Correct Answer</Label>
                    <div className="flex gap-4">
                      <label className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          checked={question.correct_answers.includes("true")}
                          onCheckedChange={() => updateQuestion(qIndex, { correct_answers: ["true"] })}
                        />
                        <span className="text-sm">True</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          checked={question.correct_answers.includes("false")}
                          onCheckedChange={() => updateQuestion(qIndex, { correct_answers: ["false"] })}
                        />
                        <span className="text-sm">False</span>
                      </label>
                    </div>
                  </div>
                )}

                {question.type === "SHORT_ANSWER" && (
                  <Input
                    label="Expected Answer (Optional)"
                    placeholder="Enter the expected answer for auto-grading reference"
                    value={question.correct_answers[0] || ""}
                    onChange={(e) =>
                      updateQuestion(qIndex, { correct_answers: e.target.value ? [e.target.value] : [] })
                    }
                  />
                )}

                <Textarea
                  label="Explanation (Optional)"
                  placeholder="Provide an explanation shown after the quiz is submitted"
                  value={question.explanation}
                  onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || !selectedCourseId}>
            {isCreating ? "Creating..." : "Create Quiz"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
