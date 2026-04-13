import { TaskStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps: { status: TaskStatus; label: string }[] = [
  { status: "OPEN", label: "Posted" },
  { status: "ASSIGNED", label: "Assigned" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "REVIEW", label: "Under Review" },
  { status: "COMPLETE", label: "Complete" },
];

const statusOrder: Record<string, number> = {
  OPEN: 0,
  ASSIGNED: 1,
  IN_PROGRESS: 2,
  REVIEW: 3,
  COMPLETE: 4,
  DISPUTED: 3,
  CANCELLED: 1,
};

interface TaskStatusTimelineProps {
  status: TaskStatus;
}

export function TaskStatusTimeline({ status }: TaskStatusTimelineProps) {
  const currentIndex = statusOrder[status] ?? 0;

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.status} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  isComplete && "border-emerald-500 bg-emerald-500 text-white",
                  isCurrent && "border-gray-900 bg-gray-900 text-white",
                  !isComplete && !isCurrent && "border-gray-200 bg-white text-gray-400"
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "mt-1 text-xs whitespace-nowrap",
                  isCurrent ? "font-semibold text-gray-900" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-1 mb-4",
                  index < currentIndex ? "bg-emerald-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
