"use client";

import { RefreshIcon, Book02Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { format } from "date-fns";

import { Breadcrumb, DataTable, Loader, TabPanel, TimeTable } from "@/components/shared";
import { useGetStudentEnrollment } from "@/lib/api/enrollment";
import { studentCourseColumns } from "@/config/columns/course";
import { useGetTimetableForClass } from "@/lib/api/timetable";
import { useGetCourses } from "@/lib/api/course";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/config/columns";
import { useUserStore } from "@/store/core";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "My Class", href: "/student/class" }];

const tabs = ["overview", "courses", "timetable"];

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const;

const OverviewTab = ({
  className,
  arm,
  level,
  sessionLabel,
  enrollmentDate,
  enrollmentStatus,
}: {
  className: string;
  arm: string;
  level: string;
  sessionLabel: string;
  enrollmentDate: Date;
  enrollmentStatus: string;
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4 rounded-lg border p-6">
        <h4 className="text-lg font-semibold">Class Information</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Class Name</span>
            <span className="text-sm font-medium">{className}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Arm</span>
            <span className="text-sm font-medium">{arm}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Level</span>
            <span className="text-sm font-medium capitalize">{level.toLowerCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Session</span>
            <span className="text-sm font-medium">{sessionLabel}</span>
          </div>
        </div>
      </div>
      <div className="space-y-4 rounded-lg border p-6">
        <h4 className="text-lg font-semibold">Enrollment Details</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Status</span>
            <StatusBadge status={enrollmentStatus} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Enrollment Date</span>
            <span className="text-sm font-medium">{format(new Date(enrollmentDate), "MMMM d, yyyy")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursesTab = ({ classId }: { classId: string }) => {
  const { data, isPending } = useGetCourses({ class_id: classId, limit: 20, page: 1 });

  if (isPending) return <Loader className="min-h-100" />;

  const courses = data?.courses || [];

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-16">
        <HugeiconsIcon icon={Book02Icon} className="text-muted-foreground mb-3 size-10" />
        <p className="text-muted-foreground text-sm">No courses assigned yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable columns={studentCourseColumns} data={courses} />
    </div>
  );
};

const TimetableTab = ({ classId }: { classId: string }) => {
  const { data: timetable, isPending, isError } = useGetTimetableForClass(classId);
  const periods = useMemo(() => timetable?.periods || [], [timetable]);

  if (isPending) return <Loader className="min-h-100" />;

  if (isError || !timetable) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-16">
        <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground mb-3 size-10" />
        <p className="text-muted-foreground text-sm">Timetable not set</p>
      </div>
    );
  }

  if (periods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-16">
        <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground mb-3 size-10" />
        <p className="text-muted-foreground text-sm">No periods scheduled</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-6 gap-2">
          <div className="bg-muted rounded-lg p-3 text-center text-sm font-medium">Time</div>
          {DAYS.map((day) => (
            <div key={day} className="bg-muted rounded-lg p-3 text-center text-sm font-medium capitalize">
              {day.toLowerCase()}
            </div>
          ))}
        </div>
        <div className="mt-2 space-y-2">
          <TimeTable periods={periods} />
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const { user } = useUserStore();

  const { data, isFetching, isPending, refetch } = useGetStudentEnrollment(String(user?.id));

  if (isPending) return <Loader />;

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <HugeiconsIcon icon={Book02Icon} className="text-muted-foreground mb-3 size-12" />
        <p className="text-muted-foreground text-lg">Not enrolled in any class</p>
        <p className="text-muted-foreground mt-1 text-sm">Contact your administrator to get enrolled</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-foreground text-3xl">{data.class.name}</h3>
            <StatusBadge status={data.class.status} />
          </div>
          <p className="text-sm font-medium text-gray-600">
            {data.session.label} &bull; {data.class.arm} Arm
          </p>
        </div>
        <div className="flex items-center gap-x-4">
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
        <div className="flex items-center gap-1 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-medium capitalize transition-colors",
                currentTab === tab
                  ? "border-primary text-primary border-b-2"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setCurrentTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <TabPanel selected={currentTab} value="overview">
          <OverviewTab
            className={data.class.name}
            arm={data.class.arm}
            level={data.class.level}
            sessionLabel={data.session.label}
            enrollmentDate={data.enrollment.enrollment_date}
            enrollmentStatus={data.enrollment.status}
          />
        </TabPanel>
        <TabPanel selected={currentTab} value="courses">
          <CoursesTab classId={data.class.id} />
        </TabPanel>
        <TabPanel selected={currentTab} value="timetable">
          <TimetableTab classId={data.class.id} />
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
