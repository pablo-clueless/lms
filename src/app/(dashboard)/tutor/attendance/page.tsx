"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Breadcrumb } from "@/components/shared";

const breadcrumbs = [{ label: "Attendance", href: "/tutor/attendance" }];

const Page = () => {
  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Attendance</h3>
          <p className="text-sm font-medium text-gray-600">Mark and track student attendance for each period</p>
        </div>
      </div>
      <div className="flex h-96 flex-col items-center justify-center rounded-lg border">
        <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
          <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-8" />
        </div>
        <h4 className="text-foreground mt-4 text-lg font-semibold">Coming Soon</h4>
        <p className="text-muted-foreground mt-1 max-w-md text-center text-sm">
          The attendance feature is currently under development. You&apos;ll be able to mark and track student
          attendance for each period.
        </p>
      </div>
    </div>
  );
};

export default Page;
