"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { sendDisputeMessage } from "@/actions/tasks";
import { useRouter } from "next/navigation";

interface DisputeMessageFormProps {
  taskId: string;
}

export function DisputeMessageForm({ taskId }: DisputeMessageFormProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await sendDisputeMessage(taskId, message);
      if (result?.error) {
        setError(result.error);
      } else {
        setMessage("");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Send a message to the other party or admin…"
        rows={3}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 resize-none"
        required
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <Button
        size="sm"
        type="submit"
        disabled={isPending || !message.trim()}
        className="w-full"
      >
        {isPending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
