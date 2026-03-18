"use client";

import { Moon01Icon, Notification02Icon, PanelLeftIcon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useGlobalStore, useUserStore } from "@/store/core";
import { Input } from "../ui/input";
import { cn } from "@/lib";

export const Header = () => {
  const { isCollapsed, setIsCollapsed, setTheme, theme } = useGlobalStore();
  const { tenant, user } = useUserStore();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <header className="bg-sidebar text-sidebar-foreground flex h-16 w-full items-center justify-between border-b px-6">
      <div className="flex items-center gap-x-4">
        <button className="relative grid size-8 place-items-center rounded-md border" onClick={toggleCollapsed}>
          <HugeiconsIcon
            icon={PanelLeftIcon}
            className={cn("size-4 transition-all duration-500", isCollapsed && "rotate-180")}
          />
        </button>
        {user?.role !== "SUPER_ADMIN" ? (
          <div>
            <h3 className="text-2xl font-bold">{tenant?.name}</h3>
          </div>
        ) : (
          <h3 className="text-2xl font-bold">ArcLMS</h3>
        )}
      </div>
      <div className="flex items-center gap-x-4">
        <Input type="search" placeholder="Search..." wrapperClassName="w-75" />
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative grid size-8 place-items-center rounded-md border">
              <HugeiconsIcon icon={Notification02Icon} className="size-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end"></PopoverContent>
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
