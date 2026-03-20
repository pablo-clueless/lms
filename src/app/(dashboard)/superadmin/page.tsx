"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Building06Icon,
  UserMultiple02Icon,
  MoneyBag02Icon,
  Activity01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  RefreshIcon,
  WifiConnected01Icon,
  Timer01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetSuperAdminDashboard } from "@/lib/api/dashboard";
import { cn, formatCurrency, formatNumber } from "@/lib";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/shared";
import { useUserStore } from "@/store/core";

const chartConfig = {
  count: { label: "Users", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconSvgElement;
  trend?: { value: number; isPositive: boolean };
  subtitle?: string;
}

const StatCard = ({ title, value, icon, trend, subtitle }: StatCardProps) => (
  <div className="bg-card space-y-3 rounded-xl border p-5">
    <div className="flex items-start justify-between">
      <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
        <HugeiconsIcon icon={icon} className="text-primary size-5" />
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
  const { data, isFetching, isPending, refetch } = useGetSuperAdminDashboard();

  if (isPending) return <Loader />;

  const dashboard = data?.dashboard;

  return (
    <div className="space-y-6 p-6">
      <div className="from-primary to-primary/80 relative overflow-hidden rounded-xl bg-linear-to-r p-8">
        <div className="relative z-10">
          <h3 className="text-primary-foreground text-3xl font-semibold">Welcome back, {user?.first_name}</h3>
          <p className="text-primary-foreground/70 mt-2">Let&apos;s see what&apos;s happening in your system today.</p>
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
          title="Total Tenants"
          value={dashboard?.total_tenants || 0}
          icon={Building06Icon}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Tenants"
          value={dashboard?.active_tenants || 0}
          icon={Building06Icon}
          subtitle={`${Math.round((0 / 1) * 100)}% of total`}
        />
        <StatCard
          title="Suspended Tenants"
          value={dashboard?.suspended_tenants || 0}
          icon={Building06Icon}
          subtitle="Requires attention"
        />
        <StatCard
          title="Total Users"
          value={formatNumber(dashboard?.total_users || 0)}
          icon={UserMultiple02Icon}
          trend={{ value: 8, isPositive: true }}
        />
      </div>
      {dashboard?.billing_metrics !== null && (
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Monthly Recurring Revenue"
            value={formatCurrency(0)}
            icon={MoneyBag02Icon}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard title="Total Revenue" value={formatCurrency(0)} icon={MoneyBag02Icon} />
          <StatCard title="Upcoming Renewals" value={0} icon={MoneyBag02Icon} subtitle="In the next 30 days" />
        </div>
      )}
      <div className="bg-card w-full rounded-xl border p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h5 className="text-foreground text-lg font-semibold">User Growth</h5>
            <p className="text-muted-foreground text-sm">New user registrations over time</p>
          </div>
        </div>
        <ChartContainer className="h-72 w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={dashboard?.user_growth || []}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
              }}
            />
            <YAxis domain={[0, 500]} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-foreground text-lg font-semibold">Top Tenants</h5>
              <p className="text-muted-foreground text-sm">By activity rate</p>
            </div>
          </div>
          <div className="space-y-3">
            {dashboard?.recent_tenants.map((tenant, index) => (
              <div
                key={tenant.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-foreground font-medium">{tenant.name}</h4>
                    <p className="text-muted-foreground text-xs">{tenant.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600">{tenant.school_type}</p>
                  <p className="text-muted-foreground text-xs">Activity</p>
                </div>
              </div>
            ))}
            {(!dashboard?.recent_tenants || dashboard.recent_tenants.length === 0) && (
              <p className="text-muted-foreground py-8 text-center text-sm">No tenant data available</p>
            )}
          </div>
        </div>
        <div className="bg-card w-full space-y-4 rounded-xl border p-6">
          <div>
            <h5 className="text-foreground text-lg font-semibold">Users By Role</h5>
            <p className="text-muted-foreground text-sm">Platform resource consumption</p>
          </div>
          <div className="space-y-4">
            {dashboard?.users_by_role &&
              Object.entries(dashboard.users_by_role).map(([user, count]) => (
                <div className="flex items-center justify-between" key={user}>
                  <p className="capitalize">{user.replace(/_/g, " ").toLowerCase()}</p>
                  <h5 className="capitalize">{count}</h5>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="bg-card w-full rounded-xl border p-6">
        <div className="mb-6">
          <h5 className="text-foreground text-lg font-semibold">System Health</h5>
          <p className="text-muted-foreground text-sm">Real-time system performance metrics</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-500/10">
              <HugeiconsIcon icon={Activity01Icon} className="size-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Uptime</p>
              <h4 className="text-foreground text-2xl font-semibold">
                {dashboard?.system_metrics.uptime_seconds || 0}s
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
              <HugeiconsIcon icon={Timer01Icon} className="size-6 text-blue-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Avg Response Time</p>
              <h4 className="text-foreground text-2xl font-semibold">
                {(dashboard?.system_metrics.avg_latency_ms || 0).toFixed(2)}ms
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-purple-500/10">
              <HugeiconsIcon icon={WifiConnected01Icon} className="size-6 text-purple-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Active Connections</p>
              <h4 className="text-foreground text-2xl font-semibold">
                {dashboard?.system_metrics.active_connections || 0}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-lg",
                0 > 5 ? "bg-red-500/10" : "bg-emerald-500/10",
              )}
            >
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className={cn(
                  "size-6",
                  dashboard?.system_metrics.error_rate || 0 > 5 ? "text-red-500" : "text-emerald-500",
                )}
              />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Error Rate</p>
              <h4 className="text-foreground text-2xl font-semibold">
                {(dashboard?.system_metrics.error_rate || 0).toFixed(2)}%
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
