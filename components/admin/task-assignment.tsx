"use client";

import { useState, useTransition } from "react";
import { adminAssignTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface OpenTask {
  id: string;
  title: string;
  budget: number;
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
  const [results, setResults] = useState<Record<string, { success?: boolean; error?: string }>>({});
  const [pending, startTransition] = useTransition();

  function handleAssign(taskId: string) {
    const workerId = selectedWorkers[taskId];
    if (!workerId) return;
    startTransition(async () => {
      const result = await adminAssignTask(taskId, workerId);
      setResults((prev) => ({ ...prev, [taskId]: result }));
    });
  }

  if (openTasks.length === 0) {
    return <p className="text-sm text-zinc-600 text-center py-6">No open tasks to assign.</p>;
  }

  if (humanWorkers.length === 0) {
    return (
      <p className="text-sm text-zinc-600 text-center py-6">
        No human workers have signed up yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {openTasks.map((task) => {
        const result = results[task.id];
        const isAssigned = result?.success;
        return (
          <div
            key={task.id}
            className={`rounded-lg border p-4 ${
              isAssigned
                ? "border-emerald-800/40 bg-emerald-950/10 opacity-60"
                : "border-zinc-800 bg-zinc-950"
            }`}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-100 text-sm truncate">{task.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  by {task.poster.name} · {formatCurrency(task.budget * 100)}
                </p>
              </div>
              {!isAssigned && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={selectedWorkers[task.id] ?? ""}
                    onChange={(e) =>
                      setSelectedWorkers((prev) => ({ ...prev, [task.id]: e.target.value }))
                    }
                    className="text-sm rounded-md border border-zinc-700 bg-zinc-900 text-zinc-200 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Select worker…</option>
                    {humanWorkers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={() => handleAssign(task.id)}
                    disabled={!selectedWorkers[task.id] || pending}
                  >
                    Assign
                  </Button>
                </div>
              )}
            </div>
            {result?.error && <p className="mt-2 text-xs text-red-400">{result.error}</p>}
            {isAssigned && <p className="mt-1 text-xs text-emerald-400">Assigned successfully</p>}
          </div>
        );
      })}
    </div>
  );
}
