"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { openDispute } from "@/actions/tasks";
import { useRouter } from "next/navigation";

interface DisputeFormProps {
  taskId: string;
}

export function DisputeForm({ taskId }: DisputeFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await openDispute(taskId, reason);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  if (!expanded) {
    return (
      <Button
        variant="destructive"
        size="sm"
        className="w-full"
        onClick={() => setExpanded(true)}
      >
        Open Dispute
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs font-medium text-zinc-400 mb-1 block">
          Describe the issue
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain what went wrong and what outcome you're seeking..."
          rows={4}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
          required
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          type="submit"
          disabled={isPending || !reason.trim()}
          className="flex-1"
        >
          {isPending ? "Submitting…" : "Submit Dispute"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => { setExpanded(false); setReason(""); setError(null); }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
