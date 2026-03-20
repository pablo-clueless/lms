"use client";

import { useParams } from "next/navigation";

import { Breadcrumb, Loader } from "@/components/shared";
import { useGetSession } from "@/lib/api/session";

const Page = () => {
  const id = useParams().id as string;

  const breadcrumbs = [
    { label: "Sessions", href: "/admin/sessions" },
    { label: "Session Details", href: `/admin/sessions/${id}` },
  ];

  const { data, isPending } = useGetSession(id);

  if (isPending) return <Loader isFullScreen />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-3xl">Sessions</h3>
          <p className="text-sm font-medium text-gray-600"></p>
        </div>
        <div className="flex items-center gap-x-4"></div>
      </div>
      <div className="w-full space-y-4"></div>
    </div>
  );
};

export default Page;
