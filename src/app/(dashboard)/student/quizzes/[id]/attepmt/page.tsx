"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { useAssessment, useInterval, useProctoring } from "@/hooks";
import { Loader, QuestionCard } from "@/components/shared";
import { useGetQuiz } from "@/lib/api/assessment";

type Screen = "assessment" | "instruction" | "submission";

const MAX_INFRACTIONS = 3;

const Page = () => {
  const id = useParams().id as string;
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id") as string;

  const { data, isPending } = useGetQuiz(course_id, id);
  const { getAnswer, handleAnswer, handleSubmit } = useAssessment({ id, course_id, type: "quiz" });
  const { numberOfInfractions } = useProctoring({
    hasSubmitted: false,
    onSubmit: handleSubmit,
    maxInfractions: MAX_INFRACTIONS,
  });

  const [screen, setScreen] = useState<Screen>("instruction");
  const [timeLeft, setTimeLeft] = useState(data?.time_limit || 0);

  useInterval(() => {
    if (timeLeft > 0) {
      setTimeLeft((prev) => prev - 1);
    } else {
      setScreen("submission");
    }
  }, 1000);

  const questions = useMemo(() => data?.questions || [], [data]);

  if (isPending && !data) return <Loader />;

  if (screen === "instruction") {
    return (
      <div className="space-y-6 p-6">
        <div className="flex w-full items-center justify-between">
          <div className="w-fit space-y-1">
            <h3 className="text-foreground text-3xl">{data?.title}</h3>
            <p className="text-sm font-medium text-gray-600"></p>
          </div>
          <div className="flex items-center gap-x-4"></div>
        </div>
        <div className="space-y-4">
          <div className="rounded-md border p-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <p className="text-sm">{data?.title}</p>
          <p className="text-sm"></p>
          <p className="text-sm"></p>
        </div>
        <div className="flex items-center gap-x-4">
          <p className="text-sm">Time Limit: {data?.time_limit}</p>
          <p className="text-sm">Total Marks: {data?.total_marks}</p>
          <p className="text-sm">
            Violations: {numberOfInfractions}/{MAX_INFRACTIONS}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {questions.map((question) => {
          const answer = getAnswer(question);
          return <QuestionCard answer={answer} key={question.id} onAnswer={handleAnswer} question={question} />;
        })}
      </div>
    </div>
  );
};

export default Page;
