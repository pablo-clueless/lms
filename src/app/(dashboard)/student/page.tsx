"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  RefreshIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Calendar03Icon,
  Book02Icon,
  Medal01Icon,
  Mortarboard01Icon,
  Fire03Icon,
  Target01Icon,
  PlayIcon,
  Download01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetStudentDashboard } from "@/lib/api/dashboard";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/shared";
import { useUserStore } from "@/store/core";
import { cn } from "@/lib";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconSvgElement;
  trend?: { value: number; isPositive: boolean };
  subtitle?: string;
  iconBgColor?: string;
  iconColor?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}: StatCardProps) => (
  <div className="bg-card space-y-3 rounded-xl border p-5">
    <div className="flex items-start justify-between">
      <div className={cn("flex size-10 items-center justify-center rounded-lg", iconBgColor)}>
        <HugeiconsIcon icon={icon} className={cn("size-5", iconColor)} />
      </div>
      {trend && (
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            trend.isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600",
          )}
        >
          <HugeiconsIcon icon={trend.isPositive ? ArrowUp01Icon : ArrowDown01Icon} className="size-3" />
          {trend.value}%
        </div>
      )}
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
  const { data, isFetching, isPending, refetch } = useGetStudentDashboard();

  if (isPending) return <Loader isFullScreen />;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-500/10";
      case "medium":
        return "text-amber-600 bg-amber-500/10";
      default:
        return "text-primary bg-primary/10";
    }
  };

  const getDaysLeftColor = (days: number) => {
    if (days <= 1) return "text-red-600";
    if (days <= 3) return "text-amber-600";
    return "text-emerald-600";
  };

  const getGradeColor = (grade: string) => {
    if (["A", "A+", "A-"].includes(grade)) return "text-emerald-600 bg-emerald-500/10";
    if (["B", "B+", "B-"].includes(grade)) return "text-primary bg-primary/10";
    if (["C", "C+", "C-"].includes(grade)) return "text-amber-600 bg-amber-500/10";
    return "text-red-600 bg-red-500/10";
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Select defaultValue="30d">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
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
        <StatCard title="Overall Progress" value={`${data?.overall_progress || 0}%`} icon={Target01Icon} />
        <StatCard title="Average Score" value={`${data?.average_score || 0}%`} icon={Medal01Icon} />
        <StatCard
          title="Current Streak"
          value={`${data?.learning_stats.current_streak_days || 0} days`}
          icon={Fire03Icon}
          subtitle={`Best: ${data?.learning_stats.longest_streak_days || 0} days`}
        />
        <StatCard title="Your Rank" value={`#${data?.rank || "-"}`} icon={Mortarboard01Icon} />
      </div>

      {data?.continue_learning && (
        <div className="bg-card rounded-xl border p-6">
          <div className="mb-4">
            <h5 className="text-lg font-semibold">Continue Learning</h5>
            <p className="text-muted-foreground text-sm">Pick up where you left off</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex size-16 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={PlayIcon} className="text-primary size-8" />
              </div>
              <div>
                <p className="text-lg font-semibold">{data.continue_learning.course_name}</p>
                <p className="text-muted-foreground text-sm">{data.continue_learning.module_name}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="bg-muted h-2 w-48 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${data.continue_learning.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{data.continue_learning.progress}%</span>
                </div>
              </div>
            </div>
            <Button>
              <HugeiconsIcon icon={PlayIcon} className="size-4" data-icon="inline-start" />
              Continue
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-lg font-semibold">Learning Stats</h5>
            <p className="text-muted-foreground text-sm">Your learning activity</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground text-sm">Total Hours</p>
              <p className="text-3xl font-semibold">{data?.learning_stats.total_hours || 0}</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground text-sm">This Week</p>
              <p className="text-3xl font-semibold">{data?.learning_stats.this_week_hours || 0}h</p>
              {data?.learning_stats.this_week_hours !== undefined &&
                data?.learning_stats.last_week_hours !== undefined && (
                  <div
                    className={cn(
                      "mt-1 flex items-center justify-center gap-1 text-xs font-medium",
                      data.learning_stats.this_week_hours >= data.learning_stats.last_week_hours
                        ? "text-emerald-600"
                        : "text-red-600",
                    )}
                  >
                    <HugeiconsIcon
                      icon={
                        data.learning_stats.this_week_hours >= data.learning_stats.last_week_hours
                          ? ArrowUp01Icon
                          : ArrowDown01Icon
                      }
                      className="size-3"
                    />
                    vs last week
                  </div>
                )}
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground text-sm">Avg Daily</p>
              <p className="text-3xl font-semibold">{data?.learning_stats.avg_daily_minutes || 0}m</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground text-sm">Best Streak</p>
              <p className="text-3xl font-semibold">{data?.learning_stats.longest_streak_days || 0}</p>
              <p className="text-muted-foreground text-xs">days</p>
            </div>
          </div>
        </div>

        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-semibold">Upcoming Deadlines</h5>
              <p className="text-muted-foreground text-sm">Don&apos;t miss these dates</p>
            </div>
            {data?.unread_notifications && data.unread_notifications > 0 && (
              <div className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                {data.unread_notifications} new
              </div>
            )}
          </div>
          <div className="space-y-3">
            {data?.upcoming_deadlines.slice(0, 4).map((deadline, index) => (
              <div
                key={index}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg",
                      getPriorityColor(deadline.priority),
                    )}
                  >
                    <HugeiconsIcon
                      icon={deadline.priority === "high" ? AlertCircleIcon : Calendar03Icon}
                      className="size-5"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{deadline.title}</p>
                    <p className="text-muted-foreground text-xs">{deadline.course_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                    {deadline.type}
                  </span>
                  <div className="text-right">
                    <p className={cn("text-sm font-semibold", getDaysLeftColor(deadline.days_left))}>
                      {deadline.days_left === 0
                        ? "Due today"
                        : deadline.days_left === 1
                          ? "Due tomorrow"
                          : `${deadline.days_left} days left`}
                    </p>
                    <p className="text-muted-foreground text-xs">{formatDate(deadline.due_date)}</p>
                  </div>
                </div>
              </div>
            ))}
            {(!data?.upcoming_deadlines || data.upcoming_deadlines.length === 0) && (
              <p className="text-muted-foreground py-8 text-center text-sm">No upcoming deadlines</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card w-full space-y-4 rounded-xl border p-6">
        <div>
          <h5 className="text-lg font-semibold">Course Progress</h5>
          <p className="text-muted-foreground text-sm">Your enrolled courses</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.course_progress.map((course) => (
            <div key={course.course_id} className="hover:bg-muted/50 rounded-lg border p-4 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Book02Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{course.course_name}</p>
                    <p className="text-muted-foreground text-xs">
                      {course.completed_modules}/{course.total_modules} modules
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className={cn("h-full transition-all", course.progress === 100 ? "bg-emerald-500" : "bg-primary")}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-medium",
                      course.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {course.status}
                  </span>
                  <span className="text-muted-foreground">Last: {formatDate(course.last_accessed_at)}</span>
                </div>
              </div>
            </div>
          ))}
          {(!data?.course_progress || data.course_progress.length === 0) && (
            <p className="text-muted-foreground col-span-full py-8 text-center text-sm">No courses enrolled</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-lg font-semibold">Recent Grades</h5>
            <p className="text-muted-foreground text-sm">Your latest assessment results</p>
          </div>
          <div className="space-y-3">
            {data?.recent_grades.slice(0, 5).map((grade, index) => (
              <div
                key={index}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn("flex size-10 items-center justify-center rounded-lg", getGradeColor(grade.grade))}
                  >
                    <span className="text-lg font-bold">{grade.grade}</span>
                  </div>
                  <div>
                    <p className="font-medium">{grade.title}</p>
                    <p className="text-muted-foreground text-xs">{grade.course_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {grade.score}/{grade.max_score}
                  </p>
                  <p className="text-muted-foreground text-xs">{formatDate(grade.graded_at)}</p>
                </div>
              </div>
            ))}
            {(!data?.recent_grades || data.recent_grades.length === 0) && (
              <p className="text-muted-foreground py-8 text-center text-sm">No grades available yet</p>
            )}
          </div>
        </div>

        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-semibold">Certificates</h5>
              <p className="text-muted-foreground text-sm">Your achievements</p>
            </div>
            {data?.certificates.total !== undefined && data.certificates.total > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1">
                <HugeiconsIcon icon={Medal01Icon} className="size-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-600">{data.certificates.total} earned</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {data?.certificates.recent.map((cert) => (
              <div
                key={cert.certificate_id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Mortarboard01Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{cert.course_name}</p>
                    <p className="text-muted-foreground text-xs">Issued {formatDate(cert.issued_at)}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <HugeiconsIcon icon={Download01Icon} className="size-4" data-icon="inline-start" />
                  Download
                </Button>
              </div>
            ))}
            {(!data?.certificates.recent || data.certificates.recent.length === 0) && (
              <div className="py-8 text-center">
                <HugeiconsIcon icon={Medal01Icon} className="text-muted-foreground mx-auto size-12" />
                <p className="text-muted-foreground mt-2 text-sm">Complete courses to earn certificates</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
