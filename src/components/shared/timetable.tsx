"use client";

import { format } from "date-fns";
import { useMemo } from "react";

import type { Period } from "@/types";
import { cn } from "@/lib";

interface Props {
  periods: Period[];
}

const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const;

const dayLabels: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
};

const formatTime = (time: string) => {
  const actualTime = time.split("T")[1];
  return format(new Date().setHours(parseInt(actualTime.split(":")[0]), parseInt(actualTime.split(":")[1])), "h:mm a");
};

export const TimeTable = ({ periods }: Props) => {
  const slots = useMemo(() => {
    const slots = new Set<string>();
    periods.forEach((period) => {
      slots.add(period.start_time);
    });
    return Array.from(slots).sort();
  }, [periods]);

  const periodLookup = useMemo(() => {
    const lookup: Record<string, Record<string, Period>> = {};
    daysOfWeek.forEach((day) => {
      lookup[day] = {};
    });

    periods.forEach((period) => {
      if (lookup[period.day_of_week]) {
        lookup[period.day_of_week][period.start_time] = period;
      }
    });

    return lookup;
  }, [periods]);

  if (periods.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">No periods scheduled</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="bg-muted/50 grid grid-cols-[80px_repeat(5,1fr)] border-b">
        <div className="border-r p-3 text-center text-sm font-medium">Time</div>
        {daysOfWeek.map((day) => (
          <div key={day} className="border-r p-3 text-center text-sm font-medium last:border-r-0">
            {dayLabels[day]}
          </div>
        ))}
      </div>
      {slots.map((time, index) => (
        <div key={time} className={cn("grid grid-cols-[80px_repeat(5,1fr)]", index !== slots.length - 1 && "border-b")}>
          <div className="bg-muted/30 flex items-center justify-center border-r p-2 text-xs font-medium">
            {formatTime(time)}
          </div>
          {daysOfWeek.map((day) => {
            const period = periodLookup[day][time];
            return (
              <div
                key={`${day}-${time}`}
                className={cn("min-h-[80px] border-r p-2 last:border-r-0", period && "bg-primary/5")}
              >
                {period && (
                  <div className="flex h-full flex-col">
                    <span className="text-primary text-sm font-medium">{period.course?.name}</span>
                    <span className="text-muted-foreground text-xs">{period.course?.subject_code}</span>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">
                        {period.tutor?.first_name} {period.tutor?.last_name?.[0]}.
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {formatTime(period.start_time)} - {formatTime(period.end_time)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
