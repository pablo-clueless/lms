"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams, useRouter } from "next/navigation";

import { Breadcrumb } from "@/components/shared";
import { Button } from "@/components/ui/button";

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const breadcrumbs = [
    { label: "Terms", href: "/admin/terms" },
    { label: "Term Details", href: `/admin/terms/${id}` },
  ];

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold">Term Details</h3>
          <p className="text-sm text-gray-600">Term ID: {id}</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground mx-auto mb-4 size-12" />
        <h4 className="mb-2 font-semibold">Term Information</h4>
        <p className="text-muted-foreground mb-4">
          Terms are accessed through their parent session. Please navigate to the session to view term details.
        </p>
        <Button onClick={() => router.push("/admin/sessions")}>Go to Sessions</Button>
      </div>
    </div>
  );
};

export default Page;
