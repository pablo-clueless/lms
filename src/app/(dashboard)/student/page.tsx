"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  RefreshIcon,
  Book02Icon,
  Calendar03Icon,
  UserGroup02Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  GraduationScrollIcon,
} from "@hugeicons/core-free-icons";

import { useGetStudentDashboard } from "@/lib/api/dashboard";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/shared";
import { useUserStore } from "@/store/core";
import { formatDate, cn } from "@/lib";

const Page = () => {
  const { user } = useUserStore();
  const { data, isFetching, isPending, refetch } = useGetStudentDashboard();

  if (isPending) return <Loader />;

  const dashboard = data?.dashboard;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-600";
      case "SUSPENDED":
        return "bg-red-500/10 text-red-600";
      case "WITHDRAWN":
        return "bg-gray-500/10 text-gray-600";
      case "TRANSFERRED":
        return "bg-amber-500/10 text-amber-600";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="from-primary to-primary/80 relative overflow-hidden rounded-xl bg-linear-to-r p-8">
        <div className="relative z-10">
          <h3 className="text-primary-foreground text-3xl font-semibold">Welcome back, {user?.first_name}</h3>
          <p className="text-primary-foreground/70 mt-2">Keep up the great work on your learning journey!</p>
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-card space-y-3 rounded-xl border p-5">
          <div className="flex items-start justify-between">
            <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
              <HugeiconsIcon icon={Book02Icon} className="text-primary size-5" />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Courses</p>
            <h4 className="text-foreground text-3xl font-semibold">{dashboard?.total_courses || 0}</h4>
            <p className="text-muted-foreground text-xs">Enrolled courses this session</p>
          </div>
        </div>
        <div className="bg-card space-y-3 rounded-xl border p-5">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <HugeiconsIcon icon={GraduationScrollIcon} className="size-5 text-emerald-600" />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Enrollments</p>
            <h4 className="text-foreground text-3xl font-semibold">{dashboard?.total_enrollments || 0}</h4>
            <p className="text-muted-foreground text-xs">Class enrollments</p>
          </div>
        </div>
        <div className="bg-card space-y-3 rounded-xl border p-5 sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <HugeiconsIcon icon={Calendar03Icon} className="size-5 text-amber-600" />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Active Session</p>
            <h4 className="text-foreground text-xl font-semibold">{dashboard?.active_session?.label || "-"}</h4>
            <p className="text-muted-foreground text-xs">
              {dashboard?.active_session
                ? `${dashboard.active_session.start_year} - ${dashboard.active_session.end_year}`
                : "No active session"}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-card w-full space-y-4 rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-foreground text-lg font-semibold">My Courses</h5>
            <p className="text-muted-foreground text-sm">Courses you are enrolled in</p>
          </div>
          <Link href="/student/courses">
            <Button variant="outline" size="sm">
              View All
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" data-icon="inline-end" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboard?.courses?.slice(0, 6).map((course) => (
            <div
              key={course.id}
              className="hover:bg-muted/50 group flex flex-col justify-between rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={BookOpen01Icon} className="text-primary size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-foreground truncate font-medium">{course.name}</h5>
                  <p className="text-muted-foreground text-xs">{course.subject_code}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    course.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : course.status === "DRAFT"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-gray-500/10 text-gray-600",
                  )}
                >
                  {course.status.toLowerCase()}
                </span>
                <span className="text-muted-foreground text-xs">
                  {formatDate(course.created_at as unknown as string)}
                </span>
              </div>
            </div>
          ))}
          {(!dashboard?.courses || dashboard.courses.length === 0) && (
            <div className="col-span-full py-12 text-center">
              <HugeiconsIcon icon={Book02Icon} className="text-muted-foreground mx-auto size-12" />
              <p className="text-muted-foreground mt-2 text-sm">No courses enrolled yet</p>
              <Link href="/student/courses" className="mt-4 inline-block">
                <Button size="sm">Browse Courses</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="bg-card w-full space-y-4 rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-foreground text-lg font-semibold">My Enrollments</h5>
            <p className="text-muted-foreground text-sm">Your class enrollments</p>
          </div>
        </div>
        <div className="space-y-3">
          {dashboard?.enrollments?.slice(0, 5).map((enrollment) => (
            <div
              key={enrollment.id}
              className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={UserGroup02Icon} className="text-primary size-5" />
                </div>
                <div>
                  <h5 className="text-foreground font-medium">Class Enrollment</h5>
                  <p className="text-muted-foreground text-xs">
                    Enrolled on {formatDate(enrollment.enrollment_date as unknown as string)}
                  </p>
                </div>
              </div>
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", getStatusColor(enrollment.status))}>
                {enrollment.status}
              </span>
            </div>
          ))}
          {(!dashboard?.enrollments || dashboard.enrollments.length === 0) && (
            <div className="py-12 text-center">
              <HugeiconsIcon icon={UserGroup02Icon} className="text-muted-foreground mx-auto size-12" />
              <p className="text-muted-foreground mt-2 text-sm">No enrollments found</p>
            </div>
          )}
        </div>
      </div>
      {dashboard?.active_session && (
        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-foreground text-lg font-semibold">Current Session</h5>
            <p className="text-muted-foreground text-sm">Active academic session details</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">Session Label</p>
              <p className="text-foreground text-lg font-semibold">{dashboard.active_session.label}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">Academic Year</p>
              <p className="text-foreground text-lg font-semibold">
                {dashboard.active_session.start_year} - {dashboard.active_session.end_year}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">Status</p>
              <span
                className={cn(
                  "mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium",
                  dashboard.active_session.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-gray-500/10 text-gray-600",
                )}
              >
                {dashboard.active_session.status}
              </span>
            </div>
          </div>
          {dashboard.active_session.description && (
            <p className="text-muted-foreground text-sm">{dashboard.active_session.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
