"use client";

import { RefreshIcon, UserGroupIcon, BookOpen01Icon, Calendar03Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { DataTable, Breadcrumb, Loader, Pagination, TabPanel, TimeTable } from "@/components/shared";
import { StatusBadge, courseColumns, studentColumns } from "@/config/columns";
import { useGetTimetableForClass } from "@/lib/api/timetable";
import { useGetCourses } from "@/lib/api/course";
import { Button } from "@/components/ui/button";
import { useGetClass } from "@/lib/api/class";
import { useGetUsers } from "@/lib/api/user";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const tabs = ["overview", "students", "courses", "timetable"];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const id = useParams().id as string;

  const { handleChange: handleCourseChange, values: courseValues } = useHandler({
    page: 1,
    limit: 10,
    class_id: id,
  });

  const { handleChange: handleStudentChange, values: studentValues } = useHandler({
    page: 1,
    limit: 10,
    role: "STUDENT",
    class_id: id,
  });

  const { data: classData, isFetching, isPending, refetch } = useGetClass(id);
  const { data: coursesData, isPending: coursesPending } = useGetCourses(courseValues);
  const { data: studentsData, isPending: studentsPending } = useGetUsers(studentValues);
  const { data: timetableData, isPending: timetablePending } = useGetTimetableForClass(id);

  const breadcrumbs = [
    { label: "Classes", href: "/tutor/classes" },
    { label: classData?.name || "Class Details", href: `/tutor/classes/${id}` },
  ];

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-foreground text-2xl font-semibold">{classData?.name}</h3>
            <StatusBadge status={classData?.status || "INACTIVE"} />
          </div>
          <p className="text-sm text-gray-600">{classData?.description || "No description provided"}</p>
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
                type="button"
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
              <h4 className="text-foreground font-semibold">Class Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="text-foreground">{classData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Arm</span>
                  <span className="text-foreground">{classData?.arm || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="text-foreground capitalize">{classData?.level?.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="text-foreground">{classData?.capacity || "Unlimited"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={classData?.status || "INACTIVE"} />
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="text-foreground font-semibold">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={UserGroupIcon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-foreground text-xl font-bold">{studentsData?.pagination?.total || 0}</p>
                    <p className="text-muted-foreground text-xs">Students</p>
                  </div>
                </div>
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={BookOpen01Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-foreground text-xl font-bold">{coursesData?.pagination?.total || 0}</p>
                    <p className="text-muted-foreground text-xs">Courses</p>
                  </div>
                </div>
              </div>
            </div>
            {classData?.description && (
              <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
                <h4 className="text-foreground font-semibold">Description</h4>
                <p className="text-muted-foreground text-sm">{classData.description}</p>
              </div>
            )}
          </div>
        </TabPanel>
        <TabPanel selected={currentTab} value="students">
          {studentsPending ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              <DataTable columns={studentColumns("TUTOR")} data={studentsData?.users || []} />
              <Pagination
                onPageChange={(page) => handleStudentChange("page", page)}
                page={studentValues.page}
                pageSize={studentValues.limit}
                total={studentsData?.pagination?.total || 0}
              />
            </div>
          )}
        </TabPanel>
        <TabPanel selected={currentTab} value="courses">
          {coursesPending ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              <DataTable columns={courseColumns} data={coursesData?.courses || []} />
              <Pagination
                onPageChange={(page) => handleCourseChange("page", page)}
                page={courseValues.page}
                pageSize={courseValues.limit}
                total={coursesData?.pagination?.total || 0}
              />
            </div>
          )}
        </TabPanel>
        <TabPanel selected={currentTab} value="timetable">
          {timetablePending ? (
            <Loader />
          ) : timetableData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-5" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Term {timetableData.term?.ordinal}</p>
                      <p className="text-muted-foreground text-xs">
                        {timetableData.term?.start_date
                          ? format(new Date(timetableData.term.start_date), "MMM d, yyyy")
                          : "N/A"}{" "}
                        -{" "}
                        {timetableData.term?.end_date
                          ? format(new Date(timetableData.term.end_date), "MMM d, yyyy")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <HugeiconsIcon icon={Clock01Icon} className="text-primary size-5" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{timetableData.periods?.length || 0} Periods</p>
                      <p className="text-muted-foreground text-xs">Scheduled this term</p>
                    </div>
                  </div>
                </div>
                <StatusBadge status={timetableData.status} />
              </div>
              <TimeTable periods={timetableData.periods || []} />
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border">
              <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground size-12" />
              <p className="text-muted-foreground mt-2">No timetable available</p>
              <p className="text-muted-foreground text-xs">A timetable has not been generated for this class yet</p>
            </div>
          )}
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
