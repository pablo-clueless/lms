"use client";

import { Mail01Icon, Phone, RefreshIcon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { DataTable, Breadcrumb, Loader, Pagination, TabPanel } from "@/components/shared";
import { StatusBadge } from "@/config/columns";
import { useGetCourses } from "@/lib/api/course";
import { courseColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUser } from "@/lib/api/user";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const tabs = ["overview", "courses"];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const id = useParams().id as string;

  const { handleChange, values } = useHandler({
    page: 1,
    limit: 10,
    tutor_id: id,
  });

  const { data: tutor, isFetching, isPending, refetch } = useGetUser(id);
  const { data: coursesData, isPending: coursesPending } = useGetCourses(values);

  const breadcrumbs = [
    { label: "Tutors", href: "/admin/tutors" },
    { label: tutor?.first_name || "Tutor Details", href: `/admin/tutors/${id}` },
  ];

  if (isPending) return <Loader />;

  const initials = `${tutor?.first_name?.[0] || ""}${tutor?.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={tutor?.profile_photo} alt={tutor?.first_name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-foreground text-2xl font-semibold">
              {tutor?.first_name} {tutor?.last_name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Mail01Icon} className="size-4" />
                {tutor?.email}
              </span>
              {tutor?.phone && (
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Phone} className="size-4" />
                  {tutor?.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <StatusBadge status={tutor?.status || "INACTIVE"} />
          <Button disabled={isFetching} onClick={() => refetch()} variant="outline" size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="border-b">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors",
                  currentTab === tab
                    ? "border-primary text-primary border-b-2"
                    : "text-muted-foreground hover:text-foreground",
                )}
                key={tab}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <TabPanel selected={currentTab} value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Personal Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Name</span>
                  <span>
                    {tutor?.first_name} {tutor?.middle_name} {tutor?.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{tutor?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{tutor?.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={tutor?.status || "INACTIVE"} />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Account Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="capitalize">{tutor?.role?.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                    {tutor?.last_login_at ? new Date(tutor.last_login_at).toLocaleDateString() : "Never"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{tutor?.created_at ? new Date(tutor.created_at).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
              <h4 className="font-semibold">Statistics</h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">{coursesData?.pagination?.total || 0}</p>
                  <p className="text-muted-foreground text-sm">Courses Assigned</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">0</p>
                  <p className="text-muted-foreground text-sm">Active Classes</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">0</p>
                  <p className="text-muted-foreground text-sm">Total Students</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">0</p>
                  <p className="text-muted-foreground text-sm">Assessments Created</p>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="courses">
          {coursesPending ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              <DataTable columns={courseColumns} data={coursesData?.courses || []} />
              <Pagination
                onPageChange={(page) => handleChange("page", page)}
                page={values.page}
                pageSize={values.limit}
                total={coursesData?.pagination?.total || 0}
              />
            </div>
          )}
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
