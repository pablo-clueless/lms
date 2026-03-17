"use client";

import { Add01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination, Breadcrumb, CreateTutorDialog } from "@/components/shared";
import type { PaginationParams, CreateUserDto } from "@/types";
import { useGetUsers, useCreateUser } from "@/lib/api/user";
import { createTutorColumns } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Tutors", href: "/admin/tutors" }];

const initialParams: PaginationParams = {
  order: "asc",
  page: 1,
  per_page: 10,
  role: "TUTOR",
  search: "",
  status: "ALL",
};

const STATUS = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const [createOpen, setCreateOpen] = useState(false);

  const columns = createTutorColumns("ADMIN");
  const { data, isFetching, isPending, refetch } = useGetUsers(params);
  const createUser = useCreateUser();

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateTutor = async (tutor: CreateUserDto) => {
    await createUser.mutateAsync(tutor);
    setCreateOpen(false);
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Tutors</h3>
          <p className="text-muted-foreground text-sm">Manage course instructors and tutors</p>
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
            Add Tutor
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
      <CreateTutorDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateTutor}
        isPending={createUser.isPending}
      />
    </div>
  );
};

export default Page;
