import { cn } from "@/lib";

type StatusVariant = "success" | "warning" | "error" | "info" | "default";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  default: "bg-neutral-100 text-neutral-700",
};

export function getStatusVariant(status: string): StatusVariant {
  const statusLower = status.toLowerCase();

  if (
    [
      "active",
      "published",
      "completed",
      "approved",
      "success",
      "delivered",
      "present",
      "passed",
      "enrolled",
      "graded",
    ].includes(statusLower)
  ) {
    return "success";
  }

  if (
    ["pending", "draft", "in_progress", "reviewing", "scheduled", "upcoming", "not_started", "late"].includes(
      statusLower,
    )
  ) {
    return "warning";
  }

  if (
    [
      "inactive",
      "suspended",
      "failed",
      "rejected",
      "expired",
      "cancelled",
      "bounced",
      "absent",
      "dropped",
      "closed",
      "archived",
    ].includes(statusLower)
  ) {
    return "error";
  }

  if (["info", "reminder", "open", "submitted", "on_leave"].includes(statusLower)) {
    return "info";
  }

  return "default";
}

export function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant ?? getStatusVariant(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantStyles[resolvedVariant],
        className,
      )}
    >
      {formatStatus(status)}
    </span>
  );
}
