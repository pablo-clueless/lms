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
import type { CreateAssignmentDto, QuestionDto, QuestionType } from "@/types";
import { useCreateAssignment } from "@/lib/api/assessment";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, removeNullOrUndefined } from "@/lib";
import { useGetCourses } from "@/lib/api/course";
import { Breadcrumb, ScrollArea } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useGetClasses } from "@/lib/api/class";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/core";

const breadcrumbs = [
  { label: "Assignments", href: "/tutor/assignments" },
  { label: "Create Assignment", href: "/tutor/assignments/create" },
];

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: "ESSAY", label: "Essay" },
  { value: "SHORT_ANSWER", label: "Short Answer" },
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
  { value: "MULTIPLE_ANSWER", label: "Multiple Answer" },
  { value: "TRUE_FALSE", label: "True/False" },
];

const fileFormats = [
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "DOC" },
  { value: "docx", label: "DOCX" },
  { value: "txt", label: "TXT" },
  { value: "jpg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "zip", label: "ZIP" },
];

const createEmptyQuestion = (orderIndex: number): QuestionDto => ({
  id: crypto.randomUUID(),
  type: "ESSAY",
  text: "",
  options: [],
  correct_answers: [],
  marks: 1,
  explanation: "",
  order_index: orderIndex,
  attachment_urls: [],
});

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  description: Yup.string().required("Description is required"),
  course_id: Yup.string().required("Course is required"),
  class_id: Yup.string().required("Class is required"),
  max_marks: Yup.number().required("Max marks is required").min(1, "Max marks must be at least 1"),
  submission_deadline: Yup.string().required("Submission deadline is required"),
  allow_late_submission: Yup.boolean(),
  hard_cutoff_date: Yup.string().when("allow_late_submission", {
    is: true,
    then: (schema) => schema.required("Hard cutoff date is required when late submission is allowed"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const Page = () => {
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  const router = useRouter();

  const initialCourseId = searchParams.get("course_id") || "";
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [questions, setQuestions] = useState<QuestionDto[]>([createEmptyQuestion(0)]);
  const [selectedFileFormats, setSelectedFileFormats] = useState<string[]>([]);

  const { data: courses, isPending: isFetchingCourses } = useGetCourses({
    limit: 50,
    tutor_id: String(user?.id),
  });
  const { data: classes, isPending: isFetchingClasses } = useGetClasses({ limit: 20, tutor_id: String(user?.id) });

  const { mutate: createAssignment, isPending: isCreating } = useCreateAssignment(selectedCourseId);

  const formik = useFormik<Omit<CreateAssignmentDto, "questions" | "allowed_file_formats">>({
    initialValues: {
      title: "",
      description: "",
      course_id: initialCourseId,
      class_id: "",
      max_marks: 100,
      submission_deadline: "",
      allow_late_submission: false,
      hard_cutoff_date: "",
      max_file_size: 10,
      attachment_urls: [],
    },
    validationSchema,
    onSubmit: (values) => {
      const totalQuestionMarks = questions.reduce((sum, q) => sum + q.marks, 0);

      if (questions.length === 0) {
        toast.error("Please add at least one question");
        return;
      }

      if (totalQuestionMarks !== values.max_marks) {
        toast.error(`Total question marks (${totalQuestionMarks}) must equal max marks (${values.max_marks})`);
        return;
      }

      const hasEmptyQuestions = questions.some((q) => !q.text.trim());
      if (hasEmptyQuestions) {
        toast.error("All questions must have text");
        return;
      }

      const payload: CreateAssignmentDto = {
        ...values,
        submission_deadline: `${values.submission_deadline}:00Z`,
        ...(values.hard_cutoff_date && { hard_cutoff_date: `${values.hard_cutoff_date}:00Z` }),
        questions,
        allowed_file_formats: selectedFileFormats,
      };

      const filteredPayload = removeNullOrUndefined(payload);

      createAssignment(filteredPayload, {
        onSuccess: () => {
          toast.success("Assignment created successfully");
          router.push("/tutor/assignments");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create assignment");
        },
      });
    },
  });

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
    formik.setFieldValue("course_id", value);
  };

  const handleFileFormatToggle = (format: string) => {
    setSelectedFileFormats((prev) => (prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]));
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

  const totalQuestionMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <ScrollArea className="h-full space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Create Assignment</h3>
          <p className="text-sm font-medium text-gray-600">Create a new assignment for your students.</p>
        </div>
      </div>
      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
            <CardDescription>Enter the basic information for your assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Title"
              name="title"
              placeholder="Enter assignment title"
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
              label="Description"
              name="description"
              placeholder="Enter assignment description and instructions"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description ? formik.errors.description : undefined}
              required
            />
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                label="Max Marks"
                name="max_marks"
                type="number"
                min={1}
                placeholder="100"
                value={formik.values.max_marks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.max_marks ? formik.errors.max_marks : undefined}
                required
              />
              <Input
                label="Submission Deadline"
                name="submission_deadline"
                type="datetime-local"
                value={formik.values.submission_deadline}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.submission_deadline ? formik.errors.submission_deadline : undefined}
                required
              />
              <Input
                label="Max File Size (MB)"
                name="max_file_size"
                type="number"
                min={1}
                max={100}
                placeholder="10"
                value={formik.values.max_file_size}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Submission Settings</CardTitle>
            <CardDescription>Configure late submission and file upload settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Allow Late Submission</Label>
                <p className="text-muted-foreground text-sm">Students can submit after the deadline with a penalty</p>
              </div>
              <Switch
                checked={formik.values.allow_late_submission}
                onCheckedChange={(checked) => formik.setFieldValue("allow_late_submission", checked)}
              />
            </div>
            {formik.values.allow_late_submission && (
              <Input
                label="Hard Cutoff Date"
                name="hard_cutoff_date"
                type="datetime-local"
                helperText="No submissions will be accepted after this date"
                value={formik.values.hard_cutoff_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.hard_cutoff_date ? formik.errors.hard_cutoff_date : undefined}
                required
              />
            )}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Allowed File Formats</Label>
              <p className="text-muted-foreground text-sm">Select which file types students can upload</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {fileFormats.map((format) => (
                  <label
                    key={format.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
                      selectedFileFormats.includes(format.value)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50",
                    )}
                  >
                    <Checkbox
                      checked={selectedFileFormats.includes(format.value)}
                      onCheckedChange={() => handleFileFormatToggle(format.value)}
                    />
                    <span className="text-sm">{format.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>
                  Add questions for this assignment. Total marks: {totalQuestionMarks} / {formik.values.max_marks}
                </CardDescription>
              </div>
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
                        updateQuestion(qIndex, {
                          type: value,
                          options: value === "MULTIPLE_CHOICE" || value === "MULTIPLE_ANSWER" ? [""] : [],
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
                        Options {question.type === "MULTIPLE_ANSWER" && "(Select all correct answers)"}
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
                            disabled={question.options.length <= 1}
                            className="text-destructive hover:text-destructive size-8 p-0"
                          >
                            <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {question.type === "TRUE_FALSE" && (
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
                <Textarea
                  label="Explanation (Optional)"
                  placeholder="Provide an explanation for the correct answer"
                  value={question.explanation}
                  onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value })}
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="flex w-full items-center justify-between">
          <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
            <HugeiconsIcon icon={Add01Icon} className="size-4" data-icon="inline-start" />
            Add Question
          </Button>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !selectedCourseId}>
              {isCreating ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </div>
      </form>
    </ScrollArea>
  );
};

export default Page;
