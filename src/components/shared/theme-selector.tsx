"use client";

import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useGlobalStore } from "@/store/core";
import { cn } from "@/lib";

export const ThemeSelector = () => {
  const { setTheme, theme } = useGlobalStore();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <button
      className="bg-background text-foreground group fixed right-5 bottom-5 grid size-8 place-items-center rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow sm:size-12"
      onClick={toggleTheme}
    >
      <HugeiconsIcon
        className={cn(
          "absolute inset-0 top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 sm:size-8",
          theme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0",
        )}
        icon={Sun01Icon}
      />
      <HugeiconsIcon
        className={cn(
          "absolute inset-0 top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 sm:size-8",
          theme === "light" ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0",
        )}
        icon={Moon01Icon}
      />
    </button>
  );
};
