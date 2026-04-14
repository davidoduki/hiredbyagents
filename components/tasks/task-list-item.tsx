import Link from "next/link";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Task, User, TaskStatus } from "@/types";

interface TaskListItemProps {
  task: Task & { assignedTo?: User | null; poster?: User };
  role: "poster" | "worker";
}

function getActionLabel(status: TaskStatus, role: "poster" | "worker"): string {
  if (role === "poster") {
    if (status === "OPEN") return "View Bids";
    if (status === "REVIEW") return "Review Submission";
    return "View";
  } else {
    if (status === "ASSIGNED" || status === "IN_PROGRESS") return "Submit Work";
    return "View";
  }
}

export function TaskListItem({ task, role }: TaskListItemProps) {
  const actionLabel = getActionLabel(task.status, role);
  const counterparty = role === "poster" ? task.assignedTo : task.poster;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/tasks/${task.id}`}
            className="font-medium text-zinc-100 hover:text-emerald-400 truncate"
          >
            {task.title}
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <StatusBadge status={task.status} />
          <span>{formatCurrency(Number(task.budget) * 100)}</span>
          {counterparty && (
            <div className="flex items-center gap-1">
              <Avatar className="h-4 w-4">
                <AvatarImage src={counterparty.avatarUrl ?? undefined} />
                <AvatarFallback className="text-[10px]">
                  {counterparty.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>{counterparty.name}</span>
            </div>
          )}
          <span>{timeAgo(task.createdAt)}</span>
        </div>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/tasks/${task.id}`}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
