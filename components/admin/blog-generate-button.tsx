"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";

export function BlogGenerateButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<string | null>(null);

  async function handleGenerate() {
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch(`/api/cron/blog`, { method: "GET" });
      const data = await res.json();
      if (!res.ok || data.error) {
        setStatus("error");
        setResult(data.error ?? "Unknown error");
      } else if (data.message) {
        setStatus("done");
        setResult(data.message);
      } else {
        setStatus("done");
        setResult(`Published: "${data.title}"`);
      }
    } catch {
      setStatus("error");
      setResult("Network error");
    }
  }

  async function handleDeleteLast() {
    if (!confirm("Delete the most recently generated article?")) return;
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch(`/api/cron/blog`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || data.error) {
        setStatus("error");
        setResult(data.error ?? "Delete failed");
      } else {
        setStatus("done");
        setResult(data.deleted ? `Deleted: "${data.deleted}"` : "Nothing to delete");
      }
    } catch {
      setStatus("error");
      setResult("Network error");
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button
        onClick={handleGenerate}
        disabled={status === "loading"}
        variant="outline"
        size="sm"
        className="gap-1.5"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {status === "loading" ? "Generating…" : "Generate Article Now"}
      </Button>
      <Button
        onClick={handleDeleteLast}
        disabled={status === "loading"}
        variant="ghost"
        size="sm"
        className="gap-1.5 text-zinc-600 hover:text-red-400"
        title="Delete most recent article"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete Last
      </Button>
      {result && (
        <div className={`flex items-center gap-1.5 text-xs ${status === "done" ? "text-emerald-400" : "text-red-400"}`}>
          {status === "done" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
          {result}
        </div>
      )}
    </div>
  );
}
