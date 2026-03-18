"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";

import { Breadcrumb, Loader } from "@/components/shared";
import { useGetApplicant } from "@/lib/api/applicant";
import { Button } from "@/components/ui/button";

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const { data, isPending } = useGetApplicant(id);
  console.log({ data });

  const breadcrumbs = [
    { label: "Applications", href: "/admin/applications" },
    { label: "Applications", href: `/admin/applications${id}` },
  ];

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/admin/application-forms")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Forms
      </Button>
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl font-semibold">Application</h3>
          <p className="text-muted-foreground text-sm"></p>
        </div>
      </div>
    </div>
  );
};

export default Page;
