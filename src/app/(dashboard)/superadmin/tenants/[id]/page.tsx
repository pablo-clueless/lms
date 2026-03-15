"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";

import { Breadcrumb, Loader, StatusBadge } from "@/components/shared";
import { useGetTenant } from "@/lib/api/tenant";
import { Button } from "@/components/ui/button";

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-xs text-neutral-500">{label}</p>
    <p className="text-sm font-medium">{value || "—"}</p>
  </div>
);

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const { data, isFetching } = useGetTenant(id);

  const breadcrumbs = [
    { label: "Tenants", href: "/superadmin/tenants" },
    { label: "Tenant Details", href: `/superadmin/tenants/${id}` },
  ];

  if (isFetching) return <Loader />;

  const tenant = data?.data;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/superadmin/tenants")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
        Back
      </Button>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-3xl">{tenant?.name}</h3>
          <p className="text-sm text-neutral-600">{tenant?.description}</p>
        </div>
        {tenant?.status && <StatusBadge status={tenant.status} />}
      </div>
      <div className="space-y-6 rounded-lg border p-6">
        <h4 className="font-semibold">General Information</h4>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <Field label="Slug" value={tenant?.slug} />
          <Field label="Email" value={tenant?.email} />
          <Field label="Phone" value={tenant?.phone} />
          <Field label="Website" value={tenant?.website} />
          <Field label="Address" value={tenant?.address} />
          <Field label="City" value={tenant?.city} />
          <Field label="State" value={tenant?.state} />
          <Field label="Country" value={tenant?.country} />
        </div>
      </div>
      <div className="space-y-6 rounded-lg border p-6">
        <h4 className="font-semibold">Settings</h4>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <Field label="Max Students" value={tenant?.settings?.max_students} />
          <Field label="Max Courses" value={tenant?.settings?.max_courses} />
          <Field label="Max Tutors" value={tenant?.settings?.max_tutors} />
          <Field label="Timezone" value={tenant?.settings?.default_timezone} />
          <Field label="Self Registration" value={tenant?.settings?.allow_self_registration ? "Enabled" : "Disabled"} />
        </div>
      </div>
    </div>
  );
};

export default Page;
