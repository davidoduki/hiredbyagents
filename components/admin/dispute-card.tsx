"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { resolveDispute, sendDisputeMessage } from "@/actions/tasks";
import { timeAgo } from "@/lib/utils";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface DisputeMessage {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: Date;
  sender: { id: string; name: string };
}

interface DisputeTask {
  id: string;
  title: string;
  disputeReason: string | null;
  updatedAt: Date;
  poster: { id: string; name: string; email: string };
  assignedTo: { id: string; name: string; email: string } | null;
  disputeMessages: DisputeMessage[];
}

interface AdminDisputeCardProps {
  task: DisputeTask;
}

export function AdminDisputeCard({ task }: AdminDisputeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await sendDisputeMessage(task.id, replyText);
      if (result?.error) {
        setError(result.error);
      } else {
        setReplyText("");
        router.refresh();
      }
    });
  }

  function handleResolve(resolution: "IN_PROGRESS" | "COMPLETE") {
    setError(null);
    startTransition(async () => {
      const result = await resolveDispute(task.id, resolution);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-lg border border-red-900/30 bg-zinc-950 p-4">
      {/* Header row */}
      <div className="flex items-start gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Link
              href={`/tasks/${task.id}`}
              className="font-medium text-zinc-100 hover:text-emerald-400 text-sm truncate flex items-center gap-1"
            >
              {task.title}
              <ExternalLink className="h-3 w-3 shrink-0 text-zinc-600" />
            </Link>
          </div>
          <div className="text-xs text-zinc-500">
            Poster: {task.poster.name} · Worker: {task.assignedTo?.name ?? "unassigned"}
          </div>
          <div className="text-xs text-zinc-600 mt-0.5">{timeAgo(task.updatedAt)}</div>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Dispute reason */}
          {task.disputeReason && (
            <div className="rounded border-l-2 border-red-500/40 pl-3 py-1">
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide mb-0.5">Reason</p>
              <p className="text-sm text-zinc-300">{task.disputeReason}</p>
            </div>
          )}

          {/* Message thread */}
          {task.disputeMessages.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">Messages</p>
              {task.disputeMessages.map((msg) => (
                <div key={msg.id} className={`rounded-lg px-3 py-2 text-sm ${
                  msg.isAdmin
                    ? "bg-amber-900/20 border border-amber-700/20 text-amber-200"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                }`}>
                  <span className="text-[10px] font-medium text-zinc-500 block mb-0.5">
                    {msg.isAdmin ? "You (Support)" : msg.sender.name} · {timeAgo(msg.createdAt)}
                  </span>
                  {msg.message}
                </div>
              ))}
            </div>
          )}

          {/* Reply form */}
          <form onSubmit={handleSend} className="space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply to both parties…"
              rows={3}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                type="submit"
                disabled={isPending || !replyText.trim()}
              >
                {isPending ? "Sending…" : "Send Message"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                disabled={isPending}
                onClick={() => handleResolve("IN_PROGRESS")}
                className="text-emerald-400 hover:text-emerald-300"
              >
                Resolve → Back to Work
              </Button>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                disabled={isPending}
                onClick={() => handleResolve("COMPLETE")}
                className="text-blue-400 hover:text-blue-300"
              >
                Resolve → Mark Complete
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
