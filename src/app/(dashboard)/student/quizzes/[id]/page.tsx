"use client";

import { useParams, useSearchParams } from "next/navigation";

import { Breadcrumb, EmptyData, Loader } from "@/components/shared";
import { useGetQuiz, useSubmitQuiz } from "@/lib/api/assessment";

const Page = () => {
  const id = useParams().id as string;
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id") as string;

  const { data, isPending } = useGetQuiz(course_id, id);
  const {} = useSubmitQuiz(course_id, id);

  const breadcrumbs = [
    { label: "Quizzes", href: "/student/quizzes" },
    { label: data?.title || "Quiz Details", href: `/student/quizzes/${id}` },
  ];

  if (isPending && !data) return <Loader />;

  if (!data) return <EmptyData title="Quiz not found" />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">{data.title}</h3>
          <p className="text-sm font-medium text-gray-600">View and submit your Quizzes here.</p>
        </div>
        <div className="flex items-center gap-x-4"></div>
      </div>
      <div className="space-y-4">
        <div className=""></div>
      </div>
    </div>
  );
};

export default Page;
