"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import {
  Moon01Icon,
  Notification02Icon,
  NotificationOff02Icon,
  PanelLeftIcon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useGetNotifications } from "@/lib/api/notification";
import { useGlobalStore } from "@/store/core";
import { Input } from "../ui/input";
import { cn } from "@/lib";

export const Header = () => {
  const { isCollapsed, setIsCollapsed, setTheme, theme } = useGlobalStore();

  const { data, isPending } = useGetNotifications();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const notifications = useMemo(() => {
    if (!data) return [];
    if (!data.data.length) return [];
    return data.data.slice(0, 5);
  }, [data]);

  const unread_count = useMemo(() => data?.unread_count || 0, [data]);

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
          <PopoverContent align="end" className="w-75">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Notifications</p>
            </div>
            <div>
              {!!notifications.length ? (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div className="" key={notification.id}></div>
                  ))}
                </div>
              ) : (
                <div className="grid min-h-25 place-items-center">
                  <div className="flex flex-col items-center gap-y-3">
                    <HugeiconsIcon icon={NotificationOff02Icon} className="size-4" />
                    <p className="text-xs text-gray-600">No new notifications</p>
                  </div>
                </div>
              )}
            </div>
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
