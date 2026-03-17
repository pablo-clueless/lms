"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, RefreshIcon } from "@hugeicons/core-free-icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination, Breadcrumb, CreateSessionDialog } from "@/components/shared";
import { createSessionColumns } from "@/config/columns";
import { useGetSessions, useCreateSession } from "@/lib/api/progress";
import { useGetCourses } from "@/lib/api/course";
import { useGetCohorts } from "@/lib/api/cohort";
import { useGetUsers } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import type { PaginationParams, Session } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Sessions", href: "/admin/sessions" }];

const initialParams: PaginationParams = {
  order: "asc",
  page: 1,
  per_page: 10,
  search: "",
  status: "ALL",
};

const STATUS = [
  { label: "All", value: "ALL" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const [createOpen, setCreateOpen] = useState(false);

  const columns = createSessionColumns("ADMIN");
  const { data, isFetching, isPending, refetch } = useGetSessions(params);
  const createSession = useCreateSession();

  // Fetch courses, cohorts, and tutors for the create dialog
  const { data: coursesData } = useGetCourses({ page: 1, per_page: 100 });
  const { data: cohortsData } = useGetCohorts({ page: 1, per_page: 100 });
  const { data: usersData } = useGetUsers({ page: 1, per_page: 100, role: "TUTOR" });

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSession = async (session: Partial<Session>) => {
    await createSession.mutateAsync(session);
    setCreateOpen(false);
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Sessions</h3>
          <p className="text-muted-foreground text-sm">Manage learning sessions and classes</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Select onValueChange={(status) => handleParamsChange("status", status)} value={params.status}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" disabled={isFetching} onClick={() => refetch()} size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" className="size-4" />
            New Session
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <DataTable columns={columns} data={data?.data || []} />
        <Pagination
          onPageChange={(value) => handleParamsChange("page", value)}
          onPageSizeChange={(value) => handleParamsChange("per_page", value)}
          page={params.page || 1}
          pageSize={params.per_page || 10}
          total={data?.meta.total || 0}
        />
      </div>
      <CreateSessionDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateSession}
        isPending={createSession.isPending}
        courses={coursesData?.data || []}
        tutors={usersData?.data || []}
        cohorts={cohortsData?.data || []}
      />
    </div>
  );
};

export default Page;
