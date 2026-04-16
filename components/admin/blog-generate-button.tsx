"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export function BlogGenerateButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<string | null>(null);

  async function handleGenerate() {
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch(
        `/api/cron/blog?secret=${process.env.NEXT_PUBLIC_CRON_SECRET ?? ""}`,
        { method: "GET" }
      );
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
    } catch (e) {
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
      {result && (
        <div className={`flex items-center gap-1.5 text-xs ${status === "done" ? "text-emerald-400" : "text-red-400"}`}>
          {status === "done" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
          {result}
        </div>
      )}
    </div>
  );
}
