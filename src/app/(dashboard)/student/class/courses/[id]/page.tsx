"use client";

import { useParams } from "next/navigation";

import { Breadcrumb, Loader } from "@/components/shared";
import { useGetCourse } from "@/lib/api/course";

const Page = () => {
  const id = useParams().id as string;

  const { data, isPending } = useGetCourse(id);

  const breadcrumbs = [
    { label: "My Class", href: "/student/class" },
    { label: "My Courses", href: "/student/class/courses", disabled: true },
    { label: data?.name || "Course Details", href: `/student/class/courses/${id}` },
  ];

  if (isPending && !data) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">{data?.name}</h3>
          <p className="text-sm font-medium text-gray-600"></p>
        </div>
      </div>
      <div className=""></div>
    </div>
  );
};

export default Page;
