"use client";

import { useParams } from "next/navigation";

import { Breadcrumb, DataTable, Loader } from "@/components/shared";
import { CreateTerm } from "@/components/admin/create-term";
import { useGetSession } from "@/lib/api/session";
import { termColumns } from "@/config/columns";
import { useGetTerms } from "@/lib/api/term";

const Page = () => {
  const id = useParams().id as string;

  const breadcrumbs = [
    { label: "Sessions", href: "/admin/sessions" },
    { label: "Session Details", href: `/admin/sessions/${id}` },
  ];

  const { data: session, isPending } = useGetSession(id);
  const { data: terms } = useGetTerms(id);

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-3xl">{session?.label}</h3>
          <p className="text-sm font-medium text-gray-600">View and manage session information</p>
        </div>
        <div className="flex items-center gap-x-4">
          <CreateTerm sessionId={id} />
        </div>
      </div>
      <div className="w-full space-y-4">
        <DataTable columns={termColumns} data={terms?.terms || []} />
      </div>
    </div>
  );
};

export default Page;
