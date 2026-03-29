"use client";

import { RefreshIcon, Calendar03Icon, Globe02Icon, ComputerIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { format } from "date-fns";

import { Breadcrumb, Loader } from "@/components/shared";
import { useGetAuditLog } from "@/lib/api/audit";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/config/columns";
import { cn, fromSnakeCase } from "@/lib";

const Page = () => {
  const id = useParams().id as string;

  const { data, isFetching, isPending, refetch } = useGetAuditLog(id);

  const breadcrumbs = [
    { label: "Audit Logs", href: "/superadmin/audit-logs" },
    { label: "Log Details", href: `/superadmin/audit-logs/${id}` },
  ];

  if (isPending && !data) return <Loader />;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd/MM/yyyy HH:mm:ss");
  };

  const renderJsonData = (data: Record<string, unknown> | undefined) => {
    if (!data || Object.keys(data).length === 0) return null;
    return <pre className="overflow-auto rounded-md bg-gray-50 p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-gray-100">
            <HugeiconsIcon icon={UserIcon} className="size-7 text-gray-600" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold">{fromSnakeCase(data?.action)}</h3>
              {data?.is_sensitive && (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                  Sensitive
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
                {formatDate(data?.timestamp)}
              </span>
              <span className="capitalize">{data?.resource_type?.toLowerCase()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <StatusBadge status={data?.actor_role || "UNKNOWN"} />
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
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-4">
          <h4 className="font-semibold">Action Information</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Action</span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium">{fromSnakeCase(data?.action)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resource Type</span>
              <span className="capitalize">{data?.resource_type?.toLowerCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resource ID</span>
              <span className="font-mono text-xs">{data?.resource_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timestamp</span>
              <span>{formatDate(data?.timestamp)}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4 rounded-lg border p-4">
          <h4 className="font-semibold">Actor & Request Information</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actor Role</span>
              <StatusBadge status={data?.actor_role || "UNKNOWN"} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actor User ID</span>
              <span className="font-mono text-xs">{data?.actor_user_id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <HugeiconsIcon icon={Globe02Icon} className="size-3" />
                IP Address
              </span>
              <span className="font-mono text-xs">{data?.ip_address}</span>
            </div>
            {data?.user_agent && (
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground flex items-center gap-1">
                  <HugeiconsIcon icon={ComputerIcon} className="size-3" />
                  User Agent
                </span>
                <span className="max-w-[200px] truncate text-right text-xs" title={data.user_agent}>
                  {data.user_agent}
                </span>
              </div>
            )}
            {data?.tenant_id && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tenant ID</span>
                <span className="font-mono text-xs">{data.tenant_id}</span>
              </div>
            )}
          </div>
        </div>
        {data?.changes && Object.keys(data.changes).length > 0 && (
          <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
            <h4 className="font-semibold">Changes</h4>
            {renderJsonData(data.changes)}
          </div>
        )}
        {data?.before_state && Object.keys(data.before_state).length > 0 && (
          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="font-semibold">Before State</h4>
            {renderJsonData(data.before_state)}
          </div>
        )}
        {data?.after_state && Object.keys(data.after_state).length > 0 && (
          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="font-semibold">After State</h4>
            {renderJsonData(data.after_state)}
          </div>
        )}
        {data?.metadata && Object.keys(data.metadata).length > 0 && (
          <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
            <h4 className="font-semibold">Additional Metadata</h4>
            {renderJsonData(data.metadata)}
          </div>
        )}
        <div className="space-y-4 rounded-lg border bg-gray-50 p-4 md:col-span-2">
          <h4 className="text-muted-foreground font-semibold">Record Information</h4>
          <div className="flex gap-8 text-sm">
            <div>
              <span className="text-muted-foreground">Log ID: </span>
              <span className="font-mono text-xs">{data?.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Created At: </span>
              <span>{formatDate(data?.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
