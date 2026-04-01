"use client";

import { RefreshIcon, Calendar03Icon, BookOpen01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { useState } from "react";

import { DataTable, Breadcrumb, Loader, Pagination, TabPanel } from "@/components/shared";
import { StatusBadge, courseColumns } from "@/config/columns";
import { useGetSession } from "@/lib/api/session";
import { useGetCourses } from "@/lib/api/course";
import { Button } from "@/components/ui/button";
import { useGetTerm } from "@/lib/api/term";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

type Params = {
  id: string;
  termId: string;
};

const tabs = ["overview", "courses"];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const { id, termId } = useParams() as Params;

  const { handleChange, values } = useHandler({
    page: 1,
    limit: 10,
    term_id: termId,
  });

  const { data: session } = useGetSession(id);
  const { data: term, isFetching, isPending, refetch } = useGetTerm(id, termId);
  const { data: coursesData, isPending: coursesPending } = useGetCourses(values);

  const breadcrumbs = [
    { label: "Sessions", href: "/admin/sessions" },
    { label: session?.label || "Session", href: `/admin/sessions/${id}` },
    { label: `${term?.ordinal || ""} Term`, href: `/admin/sessions/${id}/terms/${termId}` },
  ];

  if (isPending) return <Loader />;

  const getTermLabel = (ordinal: string | undefined) => {
    switch (ordinal) {
      case "FIRST":
        return "First Term";
      case "SECOND":
        return "Second Term";
      case "THIRD":
        return "Third Term";
      default:
        return ordinal;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-foreground text-2xl font-semibold">{getTermLabel(term?.ordinal)}</h3>
            <StatusBadge status={term?.status || "DRAFT"} />
          </div>
          <p className="text-sm text-gray-600">
            {session?.label} &bull; {term?.start_date ? format(term?.start_date, "dd/MM/yyyy") : "--/--/yyyyy"} -{" "}
            {term?.end_date ? format(term?.end_date, "dd/MM/yyyy") : "--/--/yyyyy"}
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
              <h4 className="font-semibold">Term Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Term</span>
                  <span>{getTermLabel(term?.ordinal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session</span>
                  <span>{session?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={term?.status || "DRAFT"} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                    {term?.start_date ? format(term?.start_date, "dd/MM/yyyy") : "--/--/yyyyy"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                    {term?.end_date ? format(term?.end_date, "dd/MM/yyyy") : "--/--/yyyyy"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={BookOpen01Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{coursesData?.pagination?.total || 0}</p>
                    <p className="text-muted-foreground text-xs">Courses</p>
                  </div>
                </div>
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{term?.holidays?.length || 0}</p>
                    <p className="text-muted-foreground text-xs">Holidays</p>
                  </div>
                </div>
              </div>
            </div>

            {term?.description && (
              <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
                <h4 className="font-semibold">Description</h4>
                <p className="text-muted-foreground text-sm">{term.description}</p>
              </div>
            )}

            {term?.holidays && term.holidays.length > 0 && (
              <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
                <h4 className="font-semibold">Holidays</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {term.holidays.map((holiday, index) => (
                    <div key={index} className="bg-muted/50 flex items-center justify-between rounded-lg p-3 text-sm">
                      <span>{format(holiday.date, "dd/MM/yyyy")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="courses">
          {coursesPending ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              <DataTable columns={courseColumns("ADMIN")} data={coursesData?.courses || []} />
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
