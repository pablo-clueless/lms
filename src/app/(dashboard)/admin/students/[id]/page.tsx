"use client";

import { Mail01Icon, Phone, RefreshIcon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Breadcrumb, Loader, TabPanel } from "@/components/shared";
import { StatusBadge } from "@/config/columns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/lib/api/user";
import { cn } from "@/lib";

const tabs = ["overview", "enrollments", "progress"];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const id = useParams().id as string;

  const { data: student, isFetching, isPending, refetch } = useGetUser(id);

  const breadcrumbs = [
    { label: "Students", href: "/admin/students" },
    { label: student?.first_name || "Student Details", href: `/admin/students/${id}` },
  ];

  if (isPending) return <Loader />;

  const initials = `${student?.first_name?.[0] || ""}${student?.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={student?.profile_photo} alt={student?.first_name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold">
              {student?.first_name} {student?.last_name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Mail01Icon} className="size-4" />
                {student?.email}
              </span>
              {student?.phone && (
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Phone} className="size-4" />
                  {student?.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <StatusBadge status={student?.status || "INACTIVE"} />
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
                    {student?.first_name} {student?.middle_name} {student?.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{student?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{student?.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={student?.status || "INACTIVE"} />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Account Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="capitalize">{student?.role?.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                    {student?.last_login_at ? new Date(student.last_login_at).toLocaleDateString() : "Never"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{student?.created_at ? new Date(student.created_at).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
              <h4 className="font-semibold">Academic Summary</h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">0</p>
                  <p className="text-muted-foreground text-sm">Enrolled Classes</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">0</p>
                  <p className="text-muted-foreground text-sm">Active Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">0</p>
                  <p className="text-muted-foreground text-sm">Completed Assessments</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">0%</p>
                  <p className="text-muted-foreground text-sm">Attendance Rate</p>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="enrollments">
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">Enrollment history will be displayed here</p>
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="progress">
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">Academic progress and grades will be displayed here</p>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
