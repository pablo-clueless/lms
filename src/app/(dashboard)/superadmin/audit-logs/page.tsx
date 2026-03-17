"use client";

import { FilterIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination, Breadcrumb } from "@/components/shared";
import { useGetAuditLogs, useGetAuditLogStats } from "@/lib/api/audit-log";
import type { AuditLog, AuditLogFilter } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Audit Logs", href: "/superadmin/audit-logs" }];

const METHODS = [
  { label: "All Methods", value: "ALL" },
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "PATCH", value: "PATCH" },
  { label: "DELETE", value: "DELETE" },
];

const ACTIONS = [
  { label: "All Actions", value: "ALL" },
  { label: "Create", value: "CREATE" },
  { label: "Update", value: "UPDATE" },
  { label: "Delete", value: "DELETE" },
  { label: "Login", value: "LOGIN" },
  { label: "Logout", value: "LOGOUT" },
  { label: "View", value: "VIEW" },
];

const initialFilters: AuditLogFilter = {
  page: 1,
  per_page: 10,
  action: "",
  method: "",
  resource: "",
  ip_address: "",
};

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "bg-blue-500/10 text-blue-600";
    case "POST":
      return "bg-emerald-500/10 text-emerald-600";
    case "PUT":
    case "PATCH":
      return "bg-amber-500/10 text-amber-600";
    case "DELETE":
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-neutral-500/10 text-neutral-600";
  }
};

const getStatusColor = (status: number) => {
  if (status >= 200 && status < 300) return "text-emerald-600";
  if (status >= 400 && status < 500) return "text-amber-600";
  if (status >= 500) return "text-red-600";
  return "text-neutral-600";
};

const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "created_at",
    header: "Timestamp",
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-medium">{new Date(row.original.created_at).toLocaleDateString()}</p>
        <p className="text-muted-foreground text-xs">{new Date(row.original.created_at).toLocaleTimeString()}</p>
      </div>
    ),
  },
  {
    accessorKey: "user_name",
    header: "User",
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-medium">{row.original.user_name || "System"}</p>
        <p className="text-muted-foreground text-xs">{row.original.user_email || "—"}</p>
      </div>
    ),
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => (
      <span className={cn("rounded-md px-2 py-1 text-xs font-medium", getMethodColor(row.original.method))}>
        {row.original.method}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.action}</span>,
  },
  {
    accessorKey: "resource",
    header: "Resource",
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-medium">{row.original.resource}</p>
        <p className="text-muted-foreground max-w-48 truncate text-xs">{row.original.path}</p>
      </div>
    ),
  },
  {
    accessorKey: "status_code",
    header: "Status",
    cell: ({ row }) => (
      <span className={cn("text-sm font-medium", getStatusColor(row.original.status_code))}>
        {row.original.status_code}
      </span>
    ),
  },
  {
    accessorKey: "duration_ms",
    header: "Duration",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.duration_ms}ms</span>,
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">{row.original.ip_address || "—"}</span>
    ),
  },
];

const Page = () => {
  const [filters, setFilters] = useState(initialFilters);

  const { data, isPending, isFetching, refetch } = useGetAuditLogs(filters);
  const { data: stats } = useGetAuditLogStats();

  const handleFilterChange = <K extends keyof AuditLogFilter>(field: K, value: AuditLogFilter[K]) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field !== "page" && { page: 1 }),
    }));
  };

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Audit Logs</h3>
          <p className="text-muted-foreground text-sm">View system activity and audit trail</p>
        </div>
        <Button variant="outline" size="sm" disabled={isFetching} onClick={() => refetch()}>
          <HugeiconsIcon
            icon={RefreshIcon}
            data-icon="inline-start"
            className={cn("size-4", isFetching && "animate-spin")}
          />
          Refresh
        </Button>
      </div>
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Total Logs</p>
            <p className="text-2xl font-semibold">{stats.data.total_logs || 0}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Average Response Time</p>
            <p className="text-2xl font-semibold">{stats.data.avg_duration_ms.toFixed(2) || 0} ms</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Unique Users</p>
            <p className="text-2xl font-semibold">{stats.data.unique_users || 0}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Unique IPs</p>
            <p className="text-2xl font-semibold">{stats.data.unique_ips || 0}</p>
          </div>
        </div>
      )}
      <div className="bg-card flex flex-wrap items-center gap-4 rounded-lg border p-4">
        <HugeiconsIcon icon={FilterIcon} className="text-muted-foreground size-4" />
        <Select value={filters.method || ""} onValueChange={(value) => handleFilterChange("method", value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {METHODS.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.action || ""} onValueChange={(value) => handleFilterChange("action", value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            {ACTIONS.map((action) => (
              <SelectItem key={action.value} value={action.value}>
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Resource..."
          wrapperClassName="w-40"
          value={filters.resource || ""}
          onChange={(e) => handleFilterChange("resource", e.target.value)}
        />
        <Input
          type="text"
          placeholder="IP Address..."
          wrapperClassName="w-40"
          value={filters.ip_address || ""}
          onChange={(e) => handleFilterChange("ip_address", e.target.value)}
        />
        <Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>
          Clear Filters
        </Button>
      </div>
      <div className="space-y-4">
        <DataTable columns={columns} data={data?.data || []} />
        <Pagination
          onPageChange={(value) => handleFilterChange("page", value)}
          onPageSizeChange={(value) => handleFilterChange("per_page", value)}
          page={filters.page || 1}
          pageSize={filters.per_page || 10}
          total={data?.meta.total || 0}
        />
      </div>
    </div>
  );
};

export default Page;
