"use client";
import { useParams } from "next/navigation";

import { Breadcrumb } from "@/components/shared";

const Page = () => {
  const id = useParams().id as string;

  const breadcrumbs = [
    { label: "Users", href: "/superadmin/users" },
    { label: "User Details", href: `/superadmin/users/${id}` },
  ];

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div></div>
    </div>
  );
};

export default Page;
