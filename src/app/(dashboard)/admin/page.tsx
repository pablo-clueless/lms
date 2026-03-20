"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  UserMultiple02Icon,
  TeacherIcon,
  Book02Icon,
  Calendar03Icon,
  RefreshIcon,
  UserIcon,
  School01Icon,
  CheckmarkCircle02Icon,
  UserGroupIcon,
  GridIcon,
} from "@hugeicons/core-free-icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAdminDashboard } from "@/lib/api/dashboard";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/shared";
import { useUserStore } from "@/store/core";
import { cn } from "@/lib";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconSvgElement;
  subtitle?: string;
  iconBgColor?: string;
  iconColor?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  subtitle,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}: StatCardProps) => (
  <div className="bg-card space-y-3 rounded-xl border p-5">
    <div className="flex items-start justify-between">
      <div className={cn("flex size-10 items-center justify-center rounded-lg", iconBgColor)}>
        <HugeiconsIcon icon={icon} className={cn("size-5", iconColor)} />
      </div>
    </div>
    <div>
      <p className="text-muted-foreground text-sm">{title}</p>
      <h4 className="text-foreground text-3xl font-semibold">{value}</h4>
      {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
    </div>
  </div>
);

interface RoleCardProps {
  role: string;
  count: number;
  icon: IconSvgElement;
  color: string;
}

const RoleCard = ({ role, count, icon, color }: RoleCardProps) => (
  <div className="flex items-center gap-4 rounded-lg border p-4">
    <div className={cn("flex size-12 items-center justify-center rounded-lg", `${color}/10`)}>
      <HugeiconsIcon icon={icon} className={cn("size-6", color)} />
    </div>
    <div>
      <p className="text-muted-foreground text-sm">{role}</p>
      <h4 className="text-2xl font-semibold">{count}</h4>
    </div>
  </div>
);

const Page = () => {
  const { user } = useUserStore();
  const { data, isFetching, isPending, refetch } = useGetAdminDashboard();

  if (isPending) return <Loader isFullScreen />;

  const dashboard = data?.dashboard;
  const tenantInfo = dashboard?.tenant_info;
  const activeSession = dashboard?.active_session;

  const enrollmentRate = dashboard
    ? Math.round((dashboard.active_enrollments / Math.max(dashboard.total_enrollments, 1)) * 100)
    : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="from-primary to-primary/80 relative overflow-hidden rounded-xl bg-linear-to-r p-8">
        <div className="relative z-10">
          <h3 className="text-primary-foreground text-3xl font-semibold">Welcome back, {user?.first_name}</h3>
          <p className="text-primary-foreground/70 mt-2">Here&apos;s what&apos;s happening with your school today.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-white/10 dark:bg-black/50" />
        <div className="absolute -top-5 -right-5 size-20 rounded-full bg-white/10 dark:bg-black/50" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Select defaultValue="current">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Session</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button disabled={isFetching} onClick={() => refetch()} variant="outline" size="sm">
          <HugeiconsIcon
            icon={RefreshIcon}
            data-icon="inline-start"
            className={cn("size-4", isFetching && "animate-spin")}
          />
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={dashboard?.total_users || 0}
          icon={UserMultiple02Icon}
          subtitle="All registered users"
        />
        <StatCard
          title="Total Classes"
          value={dashboard?.total_classes || 0}
          icon={UserGroupIcon}
          iconBgColor="bg-purple-500/10"
          iconColor="text-purple-500"
          subtitle="Active class groups"
        />
        <StatCard
          title="Total Courses"
          value={dashboard?.total_courses || 0}
          icon={Book02Icon}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-500"
          subtitle="Available courses"
        />
        <StatCard
          title="Total Sessions"
          value={dashboard?.total_sessions || 0}
          icon={Calendar03Icon}
          iconBgColor="bg-amber-500/10"
          iconColor="text-amber-500"
          subtitle="Academic sessions"
        />
      </div>
      <div className="bg-card w-full rounded-xl border p-6">
        <div className="mb-4">
          <h5 className="text-lg font-semibold">Users by Role</h5>
          <p className="text-muted-foreground text-sm">Breakdown of users in your institution</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <RoleCard
            role="Administrators"
            count={dashboard?.users_by_role?.ADMIN || 0}
            icon={UserIcon}
            color="text-amber-500"
          />
          <RoleCard
            role="Tutors"
            count={dashboard?.users_by_role?.TUTOR || 0}
            icon={TeacherIcon}
            color="text-purple-500"
          />
          <RoleCard
            role="Students"
            count={dashboard?.users_by_role?.STUDENT || 0}
            icon={UserMultiple02Icon}
            color="text-blue-500"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-lg font-semibold">Enrollment Overview</h5>
            <p className="text-muted-foreground text-sm">Student enrollment statistics</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Active Enrollments</span>
                <span className="font-medium">
                  {dashboard?.active_enrollments || 0} / {dashboard?.total_enrollments || 0} total
                </span>
              </div>
              <div className="bg-muted h-3 overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full transition-all",
                    enrollmentRate > 90 ? "bg-emerald-500" : enrollmentRate > 50 ? "bg-primary" : "bg-amber-500",
                  )}
                  style={{ width: `${enrollmentRate}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs">{enrollmentRate}% of enrollments are currently active</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Active</p>
                    <p className="text-xl font-semibold">{dashboard?.active_enrollments || 0}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/10">
                    <HugeiconsIcon icon={GridIcon} className="size-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Total</p>
                    <p className="text-xl font-semibold">{dashboard?.total_enrollments || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-lg font-semibold">Active Session</h5>
            <p className="text-muted-foreground text-sm">Current academic session details</p>
          </div>
          {activeSession ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 flex size-14 items-center justify-center rounded-xl">
                  <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-7" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{activeSession.label}</h4>
                  <p className="text-muted-foreground text-sm">
                    {activeSession.start_year} - {activeSession.end_year}
                  </p>
                </div>
              </div>
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Status</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      activeSession.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : activeSession.status === "DRAFT"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-gray-500/10 text-gray-600",
                    )}
                  >
                    {activeSession.status}
                  </span>
                </div>
                {activeSession.description && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-muted-foreground text-sm">Description</span>
                    <span className="text-right text-sm">{activeSession.description}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted mb-3 flex size-12 items-center justify-center rounded-full">
                <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground size-6" />
              </div>
              <p className="text-muted-foreground text-sm">No active session</p>
              <p className="text-muted-foreground text-xs">Create a new session to get started</p>
            </div>
          )}
        </div>
      </div>

      {tenantInfo && (
        <div className="bg-card w-full rounded-xl border p-6">
          <div className="mb-4">
            <h5 className="text-lg font-semibold">School Information</h5>
            <p className="text-muted-foreground text-sm">Your institution details</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={School01Icon} className="text-primary size-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">School Name</p>
                <h4 className="font-medium">{tenantInfo.name}</h4>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                <HugeiconsIcon icon={GridIcon} className="size-5 text-purple-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">School Type</p>
                <h4 className="font-medium capitalize">{tenantInfo.school_type?.toLowerCase() || "N/A"}</h4>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg",
                  tenantInfo.status === "ACTIVE"
                    ? "bg-emerald-500/10"
                    : tenantInfo.status === "SUSPENDED"
                      ? "bg-red-500/10"
                      : "bg-gray-500/10",
                )}
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className={cn(
                    "size-5",
                    tenantInfo.status === "ACTIVE"
                      ? "text-emerald-500"
                      : tenantInfo.status === "SUSPENDED"
                        ? "text-red-500"
                        : "text-gray-500",
                  )}
                />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <h4 className="font-medium">{tenantInfo.status}</h4>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                <HugeiconsIcon icon={UserIcon} className="size-5 text-blue-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Contact Email</p>
                <h4 className="truncate font-medium">{tenantInfo.contact_email || "N/A"}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
