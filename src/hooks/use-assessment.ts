"use client";

import { useState } from "react";

import type { AnswerDto, ExaminationAnswer, Question, SubmitAssignmentDto, SubmitQuizDto } from "@/types";
import { useSubmitAssignment, useSubmitQuiz } from "@/lib/api/assessment";
import type { SubmitExaminationDto } from "@/lib/api/examination";
import { useSubmitExamination } from "@/lib/api/examination";

type AssessmentType = "quiz" | "assignment" | "exam";

interface UseAssessmentOptions {
  type: AssessmentType;
  course_id?: string;
  id: string;
}

export const useAssessment = ({ type, course_id, id }: UseAssessmentOptions) => {
  const [answers, setAnswers] = useState<AnswerDto[]>([]);

  const submitQuiz = useSubmitQuiz(course_id ?? "", id);
  const submitAssignment = useSubmitAssignment(course_id ?? "", id);
  const submitExam = useSubmitExamination();

  const handleAnswer = (question: Question, answer: AnswerDto) => {
    setAnswers((prev) => {
      const exists = prev.some((a) => a.question_id === question.id);
      return exists ? prev.map((a) => (a.question_id === question.id ? answer : a)) : [...prev, answer];
    });
  };

  const getAnswer = (question: Question) => answers.find((a) => a.question_id === question.id);

  const handleSubmit = () => {
    if (type === "quiz") {
      const body: SubmitQuizDto = { answers };
      submitQuiz.mutate({ course_id: course_id!, id, body });
    } else if (type === "assignment") {
      const body: SubmitAssignmentDto = { answers, answer_text: "", file_urls: [] };
      submitAssignment.mutate({ course_id: course_id!, id, body });
    } else if (type === "exam") {
      const examAnswers: ExaminationAnswer[] = answers.map((answer) => ({ ...answer, submitted_at: new Date() }));
      const body: SubmitExaminationDto = { answers: examAnswers };
      submitExam.mutate({ id, body });
    }
  };

  const isPending = submitQuiz.isPending || submitAssignment.isPending || submitExam.isPending;

  return { answers, handleAnswer, getAnswer, handleSubmit, isPending };
};
