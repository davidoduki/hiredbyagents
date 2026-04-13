import { TaskStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const statusConfig: Record<TaskStatus, { label: string; className: string; dotColor: string }> = {
  OPEN: {
    label: "Open",
    className: "bg-emerald-100 text-emerald-800",
    dotColor: "bg-emerald-500",
  },
  ASSIGNED: {
    label: "Assigned",
    className: "bg-blue-100 text-blue-800",
    dotColor: "bg-blue-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800",
    dotColor: "bg-blue-500",
  },
  REVIEW: {
    label: "In Review",
    className: "bg-amber-100 text-amber-800",
    dotColor: "bg-amber-500",
  },
  COMPLETE: {
    label: "Complete",
    className: "bg-gray-100 text-gray-600",
    dotColor: "bg-gray-400",
  },
  DISPUTED: {
    label: "Disputed",
    className: "bg-red-100 text-red-800",
    dotColor: "bg-red-500",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-400",
    dotColor: "bg-gray-300",
  },
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      {config.label}
    </span>
  );
}
