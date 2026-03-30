"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { UserMultiple02Icon, Book02Icon, RefreshIcon, Calendar03Icon, GridViewIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { useGetTutorDashboard } from "@/lib/api/dashboard";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/shared";
import { useUserStore } from "@/store/core";
import { StatusBadge } from "@/config/columns";
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

const Page = () => {
  const { user } = useUserStore();
  const { data, isFetching, isPending, refetch } = useGetTutorDashboard();

  if (isPending) return <Loader />;

  const dashboard = data?.dashboard;

  return (
    <div className="space-y-6 p-6">
      <div className="from-primary to-primary/80 relative overflow-hidden rounded-xl bg-linear-to-r p-8">
        <div className="relative z-10">
          <h3 className="text-primary-foreground text-3xl font-semibold">Welcome back, {user?.first_name}</h3>
          <p className="text-primary-foreground/70 mt-2">Here&apos;s an overview of your teaching activities.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-white/10 dark:bg-black/50" />
        <div className="absolute -top-5 -right-5 size-20 rounded-full bg-white/10 dark:bg-black/50" />
      </div>

      <div className="flex items-center justify-end">
        <Button disabled={isFetching} onClick={() => refetch()} variant="outline" size="sm">
          <HugeiconsIcon
            icon={RefreshIcon}
            data-icon="inline-start"
            className={cn("size-4", isFetching && "animate-spin")}
          />
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Courses" value={dashboard?.total_courses || 0} icon={Book02Icon} />
        <StatCard title="Total Students" value={dashboard?.total_students || 0} icon={UserMultiple02Icon} />
        <StatCard
          title="Active Session"
          value={dashboard?.active_session?.label || "None"}
          icon={Calendar03Icon}
          subtitle={
            dashboard?.active_session
              ? `${dashboard.active_session.start_year}/${dashboard.active_session.end_year}`
              : undefined
          }
        />
      </div>

      {dashboard?.active_session && (
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-foreground text-lg font-semibold">Current Session</h5>
              <p className="text-muted-foreground text-sm">Academic year details</p>
            </div>
            <StatusBadge status={dashboard.active_session.status} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground text-sm">Session Label</p>
              <p className="text-foreground font-medium">{dashboard.active_session.label}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Academic Year</p>
              <p className="text-foreground font-medium">
                {dashboard.active_session.start_year}/{dashboard.active_session.end_year}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Description</p>
              <p className="text-foreground font-medium">{dashboard.active_session.description || "No description"}</p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-card w-full space-y-4 rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-foreground text-lg font-semibold">My Courses</h5>
            <p className="text-muted-foreground text-sm">Courses you&apos;re teaching this session</p>
          </div>
          <Link href="/tutor/courses">
            <Button variant="outline" size="sm">
              <HugeiconsIcon icon={GridViewIcon} data-icon="inline-start" className="size-4" />
              View All
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {dashboard?.courses?.map((course) => (
            <Link
              key={course.id}
              href={`/tutor/courses/${course.id}`}
              className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={Book02Icon} className="size-5" />
                </div>
                <div>
                  <h4 className="text-foreground font-medium">{course.name}</h4>
                  <p className="text-muted-foreground text-xs">{course.subject_code}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={course.status} />
              </div>
            </Link>
          ))}
          {(!dashboard?.courses || dashboard.courses.length === 0) && (
            <div className="py-8 text-center">
              <HugeiconsIcon icon={Book02Icon} className="text-muted-foreground mx-auto size-12" />
              <p className="text-muted-foreground mt-2 text-sm">No courses assigned yet</p>
              <p className="text-muted-foreground text-xs">Contact your administrator to get assigned to courses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
