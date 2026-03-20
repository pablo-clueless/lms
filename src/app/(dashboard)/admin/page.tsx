"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Cell, Pie, PieChart } from "recharts";
import {
  UserMultiple02Icon,
  TeacherIcon,
  Book02Icon,
  Calendar03Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  RefreshIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  AlertCircleIcon,
  UserAdd01Icon,
  Task01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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

interface ActionCardProps {
  title: string;
  value: number;
  icon: IconSvgElement;
  color: string;
}

const ActionCard = ({ title, value, icon, color }: ActionCardProps) => (
  <div className="flex items-center gap-4 rounded-lg border p-4">
    <div className={cn("flex size-12 items-center justify-center rounded-lg", `${color}/10`)}>
      <HugeiconsIcon icon={icon} className={cn("size-6", color)} />
    </div>
    <div>
      <p className="text-muted-foreground text-sm">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

const completionChartConfig = {
  started: { label: "In Progress", color: "hsl(var(--primary))" },
  completed: { label: "Completed", color: "hsl(142 76% 36%)" },
} satisfies ChartConfig;

const Page = () => {
  const { user } = useUserStore();
  const { data, isFetching, isPending, refetch } = useGetAdminDashboard();

  if (isPending) return <Loader isFullScreen />;

  const dashboard = data?.admin;

  const enrollmentPercentage = dashboard
    ? Math.round((dashboard.enrollment.active_students / dashboard.enrollment.total_seats) * 100)
    : 0;

  const completionData = dashboard
    ? [
        { name: "Completed", value: dashboard.course_completion.total_completed, fill: "hsl(142 76% 36%)" },
        {
          name: "In Progress",
          value: dashboard.course_completion.total_started - dashboard.course_completion.total_completed,
          fill: "hsl(var(--primary))",
        },
      ]
    : [];

  return (
    <div className="space-y-6 p-6">
      <div className="from-primary to-primary/80 relative overflow-hidden rounded-xl bg-linear-to-r p-8">
        <div className="relative z-10">
          <h3 className="text-primary-foreground text-3xl font-semibold">Welcome back, {user?.first_name}</h3>
          <p className="text-primary-foreground/70 mt-2">
            Here&apos;s what&apos;s happening with your learning platform today.
          </p>
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
        <StatCard
          title="Total Students"
          value={dashboard?.total_students || 0}
          icon={UserMultiple02Icon}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Tutors"
          value={dashboard?.total_tutors || 0}
          icon={TeacherIcon}
          iconBgColor="bg-purple-500/10"
          iconColor="text-purple-500"
        />
        <StatCard
          title="Total Courses"
          value={dashboard?.total_courses || 0}
          icon={Book02Icon}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Active Terms"
          value={dashboard?.active_terms || 0}
          icon={Calendar03Icon}
          iconBgColor="bg-amber-500/10"
          iconColor="text-amber-500"
        />
      </div>

      <div className="bg-card w-full rounded-xl border p-6">
        <div className="mb-4">
          <h5 className="text-lg font-semibold">Pending Actions</h5>
          <p className="text-muted-foreground text-sm">Items requiring your attention</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            title="Unassigned Students"
            value={dashboard?.pending_actions.unassigned_students || 0}
            icon={UserAdd01Icon}
            color="text-amber-500"
          />
          <ActionCard
            title="Pending Approvals"
            value={dashboard?.pending_actions.pending_approvals || 0}
            icon={Clock01Icon}
            color="text-blue-500"
          />
          <ActionCard
            title="Pending Applications"
            value={dashboard?.pending_actions.pending_applications || 0}
            icon={Task01Icon}
            color="text-purple-500"
          />
          <ActionCard
            title="Ungraded Submissions"
            value={dashboard?.pending_actions.ungraded_submissions || 0}
            icon={AlertCircleIcon}
            color="text-red-500"
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
                <span>Seat Utilization</span>
                <span className="font-medium">
                  {dashboard?.enrollment.active_students || 0} / {dashboard?.enrollment.total_seats || 0} seats
                </span>
              </div>
              <div className="bg-muted h-3 overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full transition-all",
                    enrollmentPercentage > 90
                      ? "bg-red-500"
                      : enrollmentPercentage > 70
                        ? "bg-amber-500"
                        : "bg-primary",
                  )}
                  style={{ width: `${enrollmentPercentage}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                {dashboard?.enrollment.seats_remaining || 0} seats remaining
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10">
                    <HugeiconsIcon icon={ArrowUp01Icon} className="size-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">New This Month</p>
                    <p className="text-xl font-semibold">{dashboard?.enrollment.new_this_month || 0}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-red-500/10">
                    <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Churned This Month</p>
                    <p className="text-xl font-semibold">{dashboard?.enrollment.churned_this_month || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-lg font-semibold">Course Completion</h5>
            <p className="text-muted-foreground text-sm">Overall course progress</p>
          </div>
          <div className="flex items-center gap-6">
            <ChartContainer config={completionChartConfig} className="size-40">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={completionData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70}>
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-emerald-500" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="font-semibold">{dashboard?.course_completion.total_completed || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary size-3 rounded-full" />
                  <span className="text-sm">In Progress</span>
                </div>
                <span className="font-semibold">
                  {(dashboard?.course_completion.total_started || 0) -
                    (dashboard?.course_completion.total_completed || 0)}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Completion Rate</span>
                  <span className="text-lg font-semibold text-emerald-500">
                    {dashboard?.course_completion.completion_rate || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Avg. Time to Complete</span>
                  <span className="font-medium">
                    {dashboard?.course_completion.avg_time_to_complete_days || 0} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-semibold">Tutor Performance</h5>
              <p className="text-muted-foreground text-sm">Performance metrics by tutor</p>
            </div>
          </div>
          <div className="space-y-3">
            {dashboard?.tutor_performance.map((tutor) => (
              <div
                key={tutor.tutor_id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full font-semibold">
                    {tutor.tutor_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{tutor.tutor_name}</p>
                    <p className="text-muted-foreground text-xs">{tutor.student_count} students</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <HugeiconsIcon icon={StarIcon} className="size-3 text-amber-500" />
                      <span className="text-sm font-medium">{tutor.avg_course_rating.toFixed(1)}</span>
                    </div>
                    <p className="text-muted-foreground text-xs">Rating</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{tutor.avg_grading_time_days}d</p>
                    <p className="text-muted-foreground text-xs">Avg. grading</p>
                  </div>
                  {tutor.pending_grading > 0 && (
                    <div className="rounded-full bg-amber-500/10 px-2 py-1">
                      <p className="text-xs font-medium text-amber-600">{tutor.pending_grading} pending</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {(!dashboard?.tutor_performance || dashboard.tutor_performance.length === 0) && (
              <p className="text-muted-foreground py-8 text-center text-sm">No tutor data available</p>
            )}
          </div>
        </div>

        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-semibold">Popular Courses</h5>
              <p className="text-muted-foreground text-sm">Most enrolled courses</p>
            </div>
          </div>
          <div className="space-y-3">
            {dashboard?.popular_courses.map((course, index) => (
              <div
                key={course.course_id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{course.course_name}</p>
                    <p className="text-muted-foreground text-xs">{course.enroll_count} enrolled</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{course.view_count}</p>
                    <p className="text-muted-foreground text-xs">Views</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3 text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-600">{course.completion_rate}%</span>
                    </div>
                    <p className="text-muted-foreground text-xs">Completion</p>
                  </div>
                </div>
              </div>
            ))}
            {(!dashboard?.popular_courses || dashboard.popular_courses.length === 0) && (
              <p className="text-muted-foreground py-8 text-center text-sm">No course data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
