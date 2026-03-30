"use client";

import { Quiz01Icon } from "@hugeicons/core-free-icons";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";

import { Breadcrumb } from "@/components/shared";
import { Button } from "@/components/ui/button";

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const breadcrumbs = [
    { label: "Assessments", href: "/admin/assessments" },
    { label: "Assessment Details", href: `/admin/assessments/${id}` },
  ];

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-foreground text-2xl font-semibold">Assessment Details</h3>
          <p className="text-sm text-gray-600">Assessment ID: {id}</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <HugeiconsIcon icon={Quiz01Icon} className="text-muted-foreground mx-auto mb-4 size-12" />
        <h4 className="mb-2 font-semibold">Assessment Information</h4>
        <p className="text-muted-foreground mb-4">
          Assessments (quizzes and assignments) are managed through their parent courses. Please navigate to the course
          to view and manage assessments.
        </p>
        <Button onClick={() => router.push("/admin/courses")}>Go to Courses</Button>
      </div>
    </div>
  );
};

export default Page;
