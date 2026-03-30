"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight01Icon,
  Moon01Icon,
  Notification02Icon,
  NotificationOff02Icon,
  PanelLeftIcon,
  Sun01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

import { NOTIFICATION_COLORS, NOTIFICATION_ICONS } from "@/config/notification";
import { useGetNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from "@/lib/api/notification";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, formatRelativeTime, getBasePathByRole } from "@/lib";
import { useGlobalStore, useUserStore } from "@/store/core";
import { Input } from "../ui/input";

export const Header = () => {
  const { isCollapsed, setIsCollapsed, setTheme, theme } = useGlobalStore();
  const { user } = useUserStore();

  const { data, isPending } = useGetNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();

  const basePath = user?.role ? getBasePathByRole(user.role) : "";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(id);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const notifications = useMemo(() => {
    if (!data) return [];
    if (!data.data.length) return [];
    return data.data.slice(0, 3);
  }, [data]);

  const unread_count = useMemo(() => data?.unread_count || 0, [data]);
  const hasUnread = unread_count > 0;

  return (
    <header className="bg-sidebar text-sidebar-foreground flex h-16 w-full items-center justify-between border-b px-6">
      <div className="flex items-center gap-x-4">
        <button className="relative grid size-8 place-items-center rounded-md border" onClick={toggleCollapsed}>
          <HugeiconsIcon
            icon={PanelLeftIcon}
            className={cn("size-4 transition-all duration-500", isCollapsed && "rotate-180")}
          />
        </button>
        <h3 className="text-foreground text-2xl font-bold">ArcLMS</h3>
      </div>
      <div className="flex items-center gap-x-4">
        <Input type="search" placeholder="Search..." wrapperClassName="w-75" />
        <Popover>
          <PopoverTrigger asChild disabled={isPending}>
            <button className="relative grid size-8 place-items-center rounded-md border">
              {unread_count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-red-500 text-[10px] text-white">
                  {unread_count > 9 ? "9+" : unread_count}
                </span>
              )}
              <HugeiconsIcon icon={Notification02Icon} className="size-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b p-3">
              <p className="text-sm font-medium">Notifications</p>
              {hasUnread && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAll}
                  className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium disabled:opacity-50"
                >
                  <HugeiconsIcon icon={Tick02Icon} className="size-3" />
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {!!notifications.length ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      className={cn(
                        "hover:bg-muted/50 flex cursor-pointer items-start gap-x-3 p-3 transition-colors",
                        !notification.is_read && "bg-primary/5",
                      )}
                      key={notification.id}
                      onClick={() => handleMarkAsRead(notification.id, notification.is_read)}
                    >
                      <div
                        className={cn(
                          "mt-0.5 grid size-8 shrink-0 place-items-center rounded-md",
                          NOTIFICATION_COLORS[notification.priority],
                        )}
                      >
                        <HugeiconsIcon className="size-4" icon={NOTIFICATION_ICONS[notification.event_type]} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h6
                            className={cn("text-foreground truncate text-xs", !notification.is_read && "font-semibold")}
                          >
                            {notification.title}
                          </h6>
                          {!notification.is_read && <span className="bg-primary mt-1 size-2 shrink-0 rounded-full" />}
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-[11px]">{notification.body}</p>
                        <p className="text-muted-foreground mt-1 text-[10px]">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid min-h-32 place-items-center p-4">
                  <div className="flex flex-col items-center gap-y-2">
                    <HugeiconsIcon icon={NotificationOff02Icon} className="text-muted-foreground size-8" />
                    <p className="text-muted-foreground text-xs">No new notifications</p>
                  </div>
                </div>
              )}
            </div>
            {basePath && (
              <div className="border-t p-2">
                <Link
                  href={`${basePath}/notifications`}
                  className="hover:bg-muted flex w-full items-center justify-center gap-1 rounded-md py-2 text-xs font-medium transition-colors"
                >
                  View all notifications
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                </Link>
              </div>
            )}
          </PopoverContent>
        </Popover>
        <button className="grid size-8 place-items-center rounded-md border" onClick={toggleTheme}>
          {theme === "dark" ? (
            <HugeiconsIcon icon={Sun01Icon} className="size-4" />
          ) : (
            <HugeiconsIcon icon={Moon01Icon} className="size-4" />
          )}
        </button>
      </div>
    </header>
  );
};
