"use client";

import { useParams } from "next/navigation";

import { Breadcrumb, Loader } from "@/components/shared";
import { useGetTerm } from "@/lib/api/term";

type Params = {
  id: string;
  termId: string;
};

const Page = () => {
  const { id, termId } = useParams() as Params;

  const breadcrumbs = [
    { label: "Sessions", href: "/admin/sessions" },
    { label: "Session Details", href: `/admin/sessions/${id}` },
    { label: "Session Details", href: `/admin/sessions/${id}/terms/${termId}` },
  ];

  const { data, isPending } = useGetTerm(id, termId);
  console.log({ data });

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-3xl">{data?.ordinal}</h3>
          <p className="text-sm font-medium text-gray-600">View and manage session information</p>
        </div>
        <div className="flex items-center gap-x-4"></div>
      </div>
      <div className="w-full space-y-4"></div>
    </div>
  );
};

export default Page;
