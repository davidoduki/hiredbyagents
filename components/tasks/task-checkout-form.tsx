"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    key: "BASIC" as const,
    label: "Basic",
    price: "$49",
    description: "Quick verifications, single-location photos, short calls.",
    features: [
      "Human assigned within 2 hours",
      "Photo evidence included",
      "Structured JSON result",
      "Webhook delivery",
    ],
  },
  {
    key: "STANDARD" as const,
    label: "Standard",
    price: "$99",
    description: "Multi-step inspections, document review, detailed reports.",
    features: [
      "Priority human assignment",
      "Detailed written report",
      "Photo + video evidence",
      "Same-day in major cities",
    ],
    popular: true,
  },
  {
    key: "PREMIUM" as const,
    label: "Premium",
    price: "$199",
    description: "Complex execution, specialist tasks, multi-location.",
    features: [
      "Specialist human matched",
      "Full audit trail",
      "24/7 availability",
      "Custom SLA available",
    ],
  },
];

const DEADLINE_OPTIONS = [
  { label: "24 hours", value: "24" },
  { label: "48 hours", value: "48" },
  { label: "72 hours", value: "72" },
  { label: "1 week", value: "168" },
  { label: "No deadline", value: "" },
];

export function TaskCheckoutForm() {
  const [tier, setTier] = React.useState<"BASIC" | "STANDARD" | "PREMIUM">("STANDARD");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const selectedTier = TIERS.find((t) => t.key === tier)!;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/checkout/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          title: data.get("title") as string,
          description: data.get("description") as string,
          deadlineHours: data.get("deadlineHours") || undefined,
          webhookUrl: (data.get("webhookUrl") as string) || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = json.url;
    } catch {
      setError("Failed to start checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ── Tier selector ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-zinc-200">Choose a tier</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TIERS.map((t) => {
            const selected = tier === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTier(t.key)}
                className={cn(
                  "relative text-left rounded-xl border p-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500",
                  selected
                    ? "border-emerald-500 bg-emerald-500/5"
                    : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
                )}
              >
                {t.popular && (
                  <span className="absolute top-3 right-3 font-mono text-[10px] tracking-widest uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5">
                    Popular
                  </span>
                )}
                {selected && (
                  <span className="absolute top-3 left-3 text-emerald-400">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <div
                  className={cn(
                    "font-mono text-3xl font-bold mb-1 mt-3",
                    selected ? "text-emerald-400" : "text-zinc-100"
                  )}
                >
                  {t.price}
                </div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  {t.label}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-3">{t.description}</p>
                <ul className="space-y-1.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-zinc-500">
                      <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Task details ───────────────────────────────────────────────── */}
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="title">Task Title *</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Verify this business is open and trading at the listed address"
            required
            maxLength={120}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">What needs to be done? *</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Describe the task in detail — location, what to check or verify, what proof you need returned, any specific instructions for the human..."
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="deadlineHours">Deadline</Label>
          <select
            id="deadlineHours"
            name="deadlineHours"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {DEADLINE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Advanced / developer options ───────────────────────────────── */}
      <div className="border-t border-zinc-800 pt-5">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          Developer options (webhook URL)
        </button>
        {showAdvanced && (
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              name="webhookUrl"
              type="url"
              placeholder="https://myagent.com/hooks/task-done"
            />
            <p className="text-xs text-zinc-600">
              Receive a POST callback with the structured result when the task is complete.
            </p>
          </div>
        )}
      </div>

      {/* ── Error ──────────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ── Submit ─────────────────────────────────────────────────────── */}
      <Button
        type="submit"
        disabled={loading}
        variant="accent"
        size="lg"
        className="w-full font-mono text-sm tracking-wide"
      >
        {loading ? "Preparing checkout…" : `Pay ${selectedTier.price} & Send Task →`}
      </Button>

      <p className="text-center text-xs text-zinc-600">
        Secure checkout via Stripe · No subscription · Pay per task · Refundable if unassigned
      </p>
    </form>
  );
}
