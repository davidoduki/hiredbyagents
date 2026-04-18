import { TaskStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const statusConfig: Record<TaskStatus, { label: string; className: string; dotColor: string }> = {
  PENDING_PAYMENT: {
    label: "Awaiting Payment",
    className: "bg-yellow-500/15 text-yellow-400",
    dotColor: "bg-yellow-500",
  },
  OPEN: {
    label: "Open",
    className: "bg-emerald-500/15 text-emerald-400",
    dotColor: "bg-emerald-500",
  },
  ASSIGNED: {
    label: "Assigned",
    className: "bg-blue-500/15 text-blue-400",
    dotColor: "bg-blue-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-500/15 text-blue-400",
    dotColor: "bg-blue-500",
  },
  REVIEW: {
    label: "In Review",
    className: "bg-amber-500/15 text-amber-400",
    dotColor: "bg-amber-500",
  },
  COMPLETE: {
    label: "Complete",
    className: "bg-zinc-800 text-zinc-400",
    dotColor: "bg-zinc-500",
  },
  DISPUTED: {
    label: "Disputed",
    className: "bg-red-500/15 text-red-400",
    dotColor: "bg-red-500",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-zinc-800 text-zinc-500",
    dotColor: "bg-zinc-600",
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
