"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  UserMultiple02Icon,
  Task01Icon,
  QuizIcon,
  TestTube01Icon,
  RefreshIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  AlertCircleIcon,
  Clock01Icon,
  StarIcon,
  Calendar03Icon,
  Book02Icon,
  MessageMultiple01Icon,
} from "@hugeicons/core-free-icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetTutorDashboard } from "@/lib/api/dashboard";
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
  const { data, isFetching, isPending, refetch } = useGetTutorDashboard();

  if (isPending) return <Loader />;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="from-primary to-primary/80 relative overflow-hidden rounded-xl bg-linear-to-r p-8">
        <div className="relative z-10">
          <h3 className="text-primary-foreground text-3xl font-semibold">Welcome back, {user?.first_name}</h3>
          <p className="text-primary-foreground/70 mt-2">Here&apos;s an overview of your teaching activities today.</p>
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
        <StatCard title="Active Students" value={data?.active_students || 0} icon={UserMultiple02Icon} />
        <StatCard title="Pending Assignments" value={data?.grading_queue.pending_assignments || 0} icon={Task01Icon} />
        <StatCard title="Pending Quizzes" value={data?.grading_queue.pending_quizzes || 0} icon={QuizIcon} />
        <StatCard title="Pending Exams" value={data?.grading_queue.pending_exams || 0} icon={TestTube01Icon} />
      </div>

      {data?.grading_queue.oldest_pending_days && data.grading_queue.oldest_pending_days > 3 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-700">Grading Attention Needed</p>
            <p className="text-sm text-amber-600">
              You have submissions waiting for {data.grading_queue.oldest_pending_days} days. Consider reviewing your
              grading queue.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-lg font-semibold">Grading Queue</h5>
            <p className="text-muted-foreground text-sm">Submissions awaiting your review</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={Task01Icon} className="text-primary size-5" />
                </div>
                <div>
                  <p className="font-medium">Assignments</p>
                  <p className="text-muted-foreground text-xs">Written submissions</p>
                </div>
              </div>
              <span className="text-2xl font-semibold">{data?.grading_queue.pending_assignments || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={QuizIcon} className="text-primary size-5" />
                </div>
                <div>
                  <p className="font-medium">Quizzes</p>
                  <p className="text-muted-foreground text-xs">Auto-graded + manual review</p>
                </div>
              </div>
              <span className="text-2xl font-semibold">{data?.grading_queue.pending_quizzes || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={TestTube01Icon} className="text-primary size-5" />
                </div>
                <div>
                  <p className="font-medium">Examinations</p>
                  <p className="text-muted-foreground text-xs">Final assessments</p>
                </div>
              </div>
              <span className="text-2xl font-semibold">{data?.grading_queue.pending_exams || 0}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground text-sm">Total Pending</span>
              <span className="text-xl font-semibold">{data?.grading_queue.total || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-lg font-semibold">Discussion Activity</h5>
            <p className="text-muted-foreground text-sm">Student engagement and messages</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={MessageMultiple01Icon} className="text-primary size-5" />
                </div>
                <div>
                  <p className="font-medium">New Posts</p>
                  <p className="text-muted-foreground text-xs">From your students</p>
                </div>
              </div>
              <span className="text-2xl font-semibold">{data?.discussion_activity.new_posts || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <HugeiconsIcon icon={Clock01Icon} className="size-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">Pending Responses</p>
                  <p className="text-muted-foreground text-xs">Awaiting your reply</p>
                </div>
              </div>
              <span className="text-2xl font-semibold">{data?.discussion_activity.pending_responses || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={MessageMultiple01Icon} className="text-primary size-5" />
                </div>
                <div>
                  <p className="font-medium">Unread Messages</p>
                  <p className="text-muted-foreground text-xs">Direct messages</p>
                </div>
              </div>
              <span className="text-2xl font-semibold">{data?.discussion_activity.unread_messages || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-lg font-semibold">At-Risk Students</h5>
            <p className="text-muted-foreground text-sm">Students who may need additional support</p>
          </div>
          <div className="space-y-3">
            {data?.at_risk_students.map((student) => (
              <div
                key={student.student_id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10 font-semibold text-red-600">
                    {student.student_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{student.student_name}</p>
                    <p className="text-muted-foreground text-xs">{student.course_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{student.course_progress}%</p>
                    <p className="text-muted-foreground text-xs">Progress</p>
                  </div>
                  <div className="rounded-full bg-red-500/10 px-2 py-1">
                    <p className="text-xs font-medium text-red-600">{student.days_inactive} days inactive</p>
                  </div>
                </div>
              </div>
            ))}
            {(!data?.at_risk_students || data.at_risk_students.length === 0) && (
              <p className="text-muted-foreground py-8 text-center text-sm">No at-risk students identified</p>
            )}
          </div>
        </div>

        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-lg font-semibold">Score Distribution</h5>
            <p className="text-muted-foreground text-sm">Overall performance statistics</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground text-sm">Average Score</p>
              <p className="text-3xl font-semibold">{data?.score_distribution.average_score || 0}%</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground text-sm">Pass Rate</p>
              <p className="text-3xl font-semibold text-emerald-600">{data?.score_distribution.pass_rate || 0}%</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground text-sm">Highest Score</p>
              <p className="text-2xl font-semibold text-emerald-600">{data?.score_distribution.highest_score || 0}%</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground text-sm">Lowest Score</p>
              <p className="text-2xl font-semibold text-red-600">{data?.score_distribution.lowest_score || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-lg font-semibold">My Courses</h5>
            <p className="text-muted-foreground text-sm">Courses you&apos;re teaching</p>
          </div>
          <div className="space-y-3">
            {data?.my_courses.map((course) => (
              <div
                key={course.course_id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Book02Icon} className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{course.course_name}</p>
                    <p className="text-muted-foreground text-xs">{course.student_count} students enrolled</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{course.completion_rate}%</p>
                    <p className="text-muted-foreground text-xs">Completion</p>
                  </div>
                  {course.pending_grading > 0 && (
                    <div className="rounded-full bg-amber-500/10 px-2 py-1">
                      <p className="text-xs font-medium text-amber-600">{course.pending_grading} to grade</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {(!data?.my_courses || data.my_courses.length === 0) && (
              <p className="text-muted-foreground py-8 text-center text-sm">No courses assigned</p>
            )}
          </div>
        </div>

        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-lg font-semibold">Course Ratings</h5>
            <p className="text-muted-foreground text-sm">Student feedback on your courses</p>
          </div>
          <div className="space-y-3">
            {data?.course_ratings.map((course) => (
              <div
                key={course.course_id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={StarIcon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{course.course_name}</p>
                    <p className="text-muted-foreground text-xs">{course.total_reviews} reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon icon={StarIcon} className="text-primary size-4" />
                    <span className="text-lg font-semibold">{course.average_rating.toFixed(1)}</span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      course.recent_trend === "up"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-red-500/10 text-red-600",
                    )}
                  >
                    <HugeiconsIcon
                      icon={course.recent_trend === "up" ? ArrowUp01Icon : ArrowDown01Icon}
                      className="size-3"
                    />
                    {course.recent_trend === "up" ? "Trending up" : "Trending down"}
                  </div>
                </div>
              </div>
            ))}
            {(!data?.course_ratings || data.course_ratings.length === 0) && (
              <p className="text-muted-foreground py-8 text-center text-sm">No ratings available</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card w-full space-y-4 rounded-xl border p-6">
        <div>
          <h5 className="text-lg font-semibold">Upcoming Events</h5>
          <p className="text-muted-foreground text-sm">Deadlines and scheduled events</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.upcoming_events.map((event, index) => (
            <div key={index} className="hover:bg-muted/50 rounded-lg border p-4 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-muted-foreground text-xs">{event.course_name}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                  {event.type}
                </span>
                <span className="text-muted-foreground text-xs">{formatDate(event.due_date)}</span>
              </div>
            </div>
          ))}
          {(!data?.upcoming_events || data.upcoming_events.length === 0) && (
            <p className="text-muted-foreground col-span-full py-8 text-center text-sm">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
