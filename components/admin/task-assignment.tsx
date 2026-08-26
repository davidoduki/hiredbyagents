"use client";

import { useState, useTransition } from "react";
import { adminAssignTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { formatCurrency, timeAgo } from "@/lib/utils";

interface OpenTask {
  id: string;
  title: string;
  budget: number;
  createdAt: string;
  poster: { name: string };
}

interface HumanWorker {
  id: string;
  name: string;
  email: string;
}

interface Props {
  openTasks: OpenTask[];
  humanWorkers: HumanWorker[];
}

export function AdminTaskAssignment({ openTasks, humanWorkers }: Props) {
  const [selectedWorkers, setSelectedWorkers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<
    Record<string, { success?: boolean; error?: string; workerName?: string }>
  >({});
  const [pending, startTransition] = useTransition();

  function handleAssign(taskId: string) {
    const workerId = selectedWorkers[taskId];
    if (!workerId) return;
    const workerName = humanWorkers.find((w) => w.id === workerId)?.name;
    startTransition(async () => {
      const result = await adminAssignTask(taskId, workerId);
      setResults((prev) => ({ ...prev, [taskId]: { ...result, workerName } }));
    });
  }

  if (openTasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.10] p-10 text-center text-sm text-zinc-600">
        Nothing waiting to be dispatched.
      </div>
    );
  }

  if (humanWorkers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.10] p-10 text-center text-sm text-zinc-600">
        {openTasks.length} request{openTasks.length !== 1 ? "s" : ""} waiting, but no
        human verifiers have signed up yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900">
      {/* Header — hidden on small screens, where each row stacks */}
      <div className="hidden gap-4 border-b border-white/[0.06] bg-white/[0.015] px-5 py-3 lg:grid lg:grid-cols-[1fr_120px_240px_120px]">
        <span className="eyebrow text-zinc-600">Request</span>
        <span className="eyebrow text-zinc-600">Budget</span>
        <span className="eyebrow text-zinc-600">Assign verifier</span>
        <span />
      </div>

      {openTasks.map((task, i) => {
        const result = results[task.id];
        const isAssigned = result?.success;
        return (
          <div
            key={task.id}
            className={`grid grid-cols-1 items-center gap-4 px-5 py-4 lg:grid-cols-[1fr_120px_240px_120px] ${
              i < openTasks.length - 1 ? "border-b border-white/[0.05]" : ""
            } ${isAssigned ? "opacity-60" : ""}`}
          >
            <div className="min-w-0">
              <div className="truncate text-[14.5px] font-semibold text-zinc-100">
                {task.title}
              </div>
              <div className="mt-0.5 text-[12.5px] text-zinc-600">
                by {task.poster.name} · {timeAgo(new Date(task.createdAt))}
              </div>
            </div>

            <span className="font-code text-sm text-zinc-300">
              {formatCurrency(task.budget * 100)}
            </span>

            {isAssigned ? (
              <div className="text-[13px] text-emerald-400 lg:col-span-2">
                Assigned to {result?.workerName ?? "verifier"}
              </div>
            ) : (
              <>
                <select
                  value={selectedWorkers[task.id] ?? ""}
                  onChange={(e) =>
                    setSelectedWorkers((prev) => ({
                      ...prev,
                      [task.id]: e.target.value,
                    }))
                  }
                  className="h-[38px] w-full rounded-lg border border-white/[0.12] bg-[#0E1013] px-3 text-[13.5px] text-zinc-300 transition-colors hover:border-white/[0.2] focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  <option value="">Select verifier…</option>
                  {humanWorkers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  variant="accent"
                  className="h-[38px] min-h-0 w-full"
                  onClick={() => handleAssign(task.id)}
                  disabled={!selectedWorkers[task.id] || pending}
                >
                  Assign
                </Button>
              </>
            )}

            {result?.error && (
              <p className="text-xs text-red-400 lg:col-span-4">{result.error}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
