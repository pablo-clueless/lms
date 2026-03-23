"use client";

import { RefreshIcon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Breadcrumb, Loader, TabPanel, TimeTable } from "@/components/shared";
import { useGetTimetable, usePublishTimetable } from "@/lib/api/timetable";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/config/columns";
import { useGetClass } from "@/lib/api/class";
import { useGetTerm } from "@/lib/api/term";
import { cn } from "@/lib";

const tabs = ["overview", "schedule"];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const id = useParams().id as string;

  const { data: timetable, isFetching, isPending, refetch } = useGetTimetable(id);
  const { data: classData } = useGetClass(timetable?.class.id || "");
  const { data: term } = useGetTerm(timetable?.term.session_id || "", timetable?.term.id || "");
  const { mutate: publishTimetable, isPending: isPublishing } = usePublishTimetable();

  const breadcrumbs = [
    { label: "Timetables", href: "/admin/timetables" },
    { label: classData?.name || "Timetable Details", href: `/admin/timetables/${id}` },
  ];

  if (isPending) return <Loader />;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePublish = () => {
    publishTimetable(id, {
      onSuccess: () => {
        toast.success("Timetable published successfully");
        refetch();
      },
      onError: () => {
        toast.error("Failed to publish timetable");
      },
    });
  };

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold">{classData?.name || "Timetable"}</h3>
            <StatusBadge status={timetable?.status || "DRAFT"} />
          </div>
          <p className="text-sm text-gray-600">
            Version {timetable?.generation_version || 1} &bull; Generated {formatDate(timetable?.generated_at)}
          </p>
        </div>
        <div className="flex items-center gap-x-4">
          {timetable?.status === "DRAFT" && (
            <Button onClick={handlePublish} disabled={isPublishing} size="sm">
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          )}
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
              <h4 className="font-semibold">Timetable Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class</span>
                  <span>{classData?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Term</span>
                  <span>{term?.ordinal || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={timetable?.status || "DRAFT"} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span>{timetable?.generation_version || 1}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Timeline</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Generated At</span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                    {formatDate(timetable?.generated_at)}
                  </span>
                </div>
                {timetable?.published_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published At</span>
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                      {formatDate(timetable.published_at)}
                    </span>
                  </div>
                )}
                {timetable?.archived_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Archived At</span>
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                      {formatDate(timetable.archived_at)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created At</span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                    {formatDate(timetable?.created_at)}
                  </span>
                </div>
              </div>
            </div>
            {timetable?.notes && (
              <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
                <h4 className="font-semibold">Notes</h4>
                <p className="text-muted-foreground text-sm">{timetable.notes}</p>
              </div>
            )}
            <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
              <h4 className="font-semibold">Actions</h4>
              <div className="flex flex-wrap gap-2">
                {timetable?.status === "DRAFT" && (
                  <Button onClick={handlePublish} disabled={isPublishing}>
                    {isPublishing ? "Publishing..." : "Publish Timetable"}
                  </Button>
                )}
                <Button variant="outline">Download PDF</Button>
                <Button variant="outline">Share with Students</Button>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel selected={currentTab} value="schedule">
          {!timetable?.periods.length ? (
            <div className="rounded-lg border p-8 text-center">
              <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground mx-auto mb-4 size-12" />
              <h4 className="mb-2 font-semibold">Schedule View</h4>
              <p className="text-muted-foreground">
                The detailed schedule view will be displayed here once periods are configured.
              </p>
            </div>
          ) : (
            <TimeTable periods={timetable?.periods} />
          )}
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
