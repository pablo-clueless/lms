"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import { useState } from "react";

import { Breadcrumb, EmptyData, Loader, QuestionCard, ScrollArea } from "@/components/shared";
import { useGetAssignment, useSubmitAssignment } from "@/lib/api/assessment";
import type { AnswerDto, Question, SubmitAssignmentDto } from "@/types";
import { Button } from "@/components/ui/button";

const Page = () => {
  const id = useParams().id as string;
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id") as string;

  const [answers, setAnswers] = useState<AnswerDto[]>([]);

  const initialValues: SubmitAssignmentDto = {
    answers: answers,
    answer_text: "",
    file_urls: [],
  };

  const { data, isPending } = useGetAssignment(course_id, id);
  const {} = useSubmitAssignment(course_id, id);

  const { handleSubmit } = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const breadcrumbs = [
    { label: "Assignments", href: "/student/assignments" },
    { label: data?.title || "Assignment Details", href: `/student/assignments/${id}` },
  ];

  const handleAnswer = (question: Question, answer: AnswerDto) => {
    setAnswers((prev) => {
      const exists = prev.some((a) => a.question_id === question.id);
      return exists ? prev.map((a) => (a.question_id === question.id ? answer : a)) : [...prev, answer];
    });
  };

  if (isPending && !data) return <Loader />;

  if (!data) return <EmptyData title="Assignment not found" />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">{data.title}</h3>
          <p className="text-sm font-medium text-gray-600">View and submit your assignments here.</p>
        </div>
        <div className="flex items-center gap-x-4"></div>
      </div>
      <div className="space-y-4">
        <div className=""></div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <ScrollArea className="space-y-2">
            {data.questions.map((question) => {
              const answer = answers.find((answer) => answer.question_id === question.id);
              return <QuestionCard answer={answer} key={question.id} onAnswer={handleAnswer} question={question} />;
            })}
          </ScrollArea>
          <div className="flex items-center justify-end">
            <Button>Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
