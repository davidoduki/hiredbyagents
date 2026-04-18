"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";
import { Check, ChevronDown, ChevronUp, Copy, CheckCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ── Constants ────────────────────────────────────────────────────────────────

const TIER_DISPLAY = [
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

const CATEGORIES = [
  "Physical Verification",
  "Data Collection",
  "Research & Analysis",
  "Purchase & Transaction",
  "Communication",
  "Content Creation",
  "Technical Support",
  "Administrative",
  "Other",
];

const DEADLINE_OPTIONS = [
  { label: "24 hours", value: "24" },
  { label: "48 hours", value: "48" },
  { label: "72 hours", value: "72" },
  { label: "1 week", value: "168" },
  { label: "No deadline", value: "" },
];

// ── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  tier: "BASIC" | "STANDARD" | "PREMIUM";
  title: string;
  description: string;
  category: string;
  location: string;
  expectedOutput: string;
  referenceMaterials: string;
  acceptanceCriteria: string;
  deadlineHours: string;
  webhookUrl: string;
}

interface Props {
  stripePublishableKey: string;
  paypalClientId: string;
}

// ── Stripe sub-form ──────────────────────────────────────────────────────────

function StripeCheckoutForm({ taskId }: { taskId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/tasks/${taskId}`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setLoading(false);
      return;
    }

    router.push(`/tasks/${taskId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={!stripe || loading}
        variant="accent"
        size="lg"
        className="w-full font-mono text-sm tracking-wide"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Processing…
          </span>
        ) : (
          "Confirm Payment →"
        )}
      </Button>
    </form>
  );
}

// ── USDC address display ─────────────────────────────────────────────────────

function UsdcPaymentPanel({
  walletAddress,
  amountUsdc,
  network,
  taskId,
}: {
  walletAddress: string;
  amountUsdc: number;
  network: string;
  taskId: string;
}) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-zinc-700 bg-zinc-800/60 p-5 space-y-4">
        <div>
          <p className="text-xs text-zinc-400 mb-1 font-mono uppercase tracking-widest">Network</p>
          <p className="text-sm font-semibold text-zinc-100">{network}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-1 font-mono uppercase tracking-widest">Amount</p>
          <p className="text-2xl font-mono font-bold text-emerald-400">{amountUsdc} USDC</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-1 font-mono uppercase tracking-widest">Deposit Address</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-zinc-100 font-mono break-all">
              {walletAddress}
            </code>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition-colors"
            >
              {copied ? <CheckCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-400">
        Send exactly <strong>{amountUsdc} USDC</strong> on the <strong>{network}</strong> network to the address above.
        Your task will be activated within 30 minutes of on-chain confirmation.
      </div>
      <Button
        type="button"
        onClick={() => router.push(`/tasks/${taskId}`)}
        variant="accent"
        size="lg"
        className="w-full font-mono text-sm tracking-wide"
      >
        I&apos;ve sent the payment →
      </Button>
    </div>
  );
}

// ── Main form ────────────────────────────────────────────────────────────────

export function TaskCheckoutForm({ stripePublishableKey, paypalClientId }: Props) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    tier: "STANDARD",
    title: "",
    description: "",
    category: "",
    location: "",
    expectedOutput: "",
    referenceMaterials: "",
    acceptanceCriteria: "",
    deadlineHours: "24",
    webhookUrl: "",
  });
  const [payMethod, setPayMethod] = React.useState<"card" | "paypal" | "usdc">("card");

  // Stripe state
  const [stripeData, setStripeData] = React.useState<{ taskId: string; clientSecret: string } | null>(null);
  const [stripeLoading, setStripeLoading] = React.useState(false);
  const [stripeError, setStripeError] = React.useState<string | null>(null);

  // PayPal state
  const [paypalTaskId, setPaypalTaskId] = React.useState<string | null>(null);

  // USDC state
  const [usdcData, setUsdcData] = React.useState<{
    taskId: string; walletAddress: string; amountUsdc: number; network: string;
  } | null>(null);
  const [usdcLoading, setUsdcLoading] = React.useState(false);
  const [usdcError, setUsdcError] = React.useState<string | null>(null);

  const router = useRouter();
  const stripePromise = React.useMemo(
    () => loadStripe(stripePublishableKey),
    [stripePublishableKey],
  );

  const selectedTier = TIER_DISPLAY.find((t) => t.key === formData.tier)!;

  function set(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function validateStep1(): boolean {
    return formData.title.trim().length > 0 && formData.description.trim().length > 0;
  }

  async function initStripe() {
    if (stripeData) return; // already created
    setStripeLoading(true);
    setStripeError(null);
    try {
      const res = await fetch("/api/checkout/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) { setStripeError(json.error ?? "Failed to initialise payment."); return; }
      setStripeData({ taskId: json.taskId, clientSecret: json.clientSecret });
    } catch {
      setStripeError("Failed to connect. Please try again.");
    } finally {
      setStripeLoading(false);
    }
  }

  async function initUsdc() {
    if (usdcData) return;
    setUsdcLoading(true);
    setUsdcError(null);
    try {
      const res = await fetch("/api/checkout/task/usdc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) { setUsdcError(json.error ?? "USDC unavailable."); return; }
      setUsdcData(json);
    } catch {
      setUsdcError("Failed to connect. Please try again.");
    } finally {
      setUsdcLoading(false);
    }
  }

  function handleTabChange(tab: "card" | "paypal" | "usdc") {
    setPayMethod(tab);
    if (tab === "card") initStripe();
    if (tab === "usdc") initUsdc();
  }

  // ── Step 1 ─────────────────────────────────────────────────────────────────

  if (step === 1) {
    return (
      <div className="space-y-8">
        {/* Tier selector */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-zinc-200">Choose a tier</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TIER_DISPLAY.map((t) => {
              const selected = formData.tier === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => set("tier", t.key)}
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
                  <div className={cn("font-mono text-3xl font-bold mb-1 mt-3", selected ? "text-emerald-400" : "text-zinc-100")}>
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

        {/* Core task fields */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Verify this business is open and trading at the listed address"
              maxLength={120}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">What needs to be done? *</Label>
            <Textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the task in detail — what to check, verify, collect, or execute. Be as specific as possible."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="City, address, or coordinates"
              />
              <p className="text-xs text-zinc-600">Where the human needs to go / where the task takes place.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expectedOutput">Expected Output</Label>
            <Textarea
              id="expectedOutput"
              rows={3}
              value={formData.expectedOutput}
              onChange={(e) => set("expectedOutput", e.target.value)}
              placeholder="e.g. JSON with fields: isOpen, photoUrl, staffCount. Or: a completed PDF form. Or: a phone call transcript."
            />
            <p className="text-xs text-zinc-600">Describe the exact format or deliverable you expect back.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="acceptanceCriteria">Acceptance Criteria</Label>
            <Textarea
              id="acceptanceCriteria"
              rows={3}
              value={formData.acceptanceCriteria}
              onChange={(e) => set("acceptanceCriteria", e.target.value)}
              placeholder="e.g. Photo must show the storefront sign clearly. Report must include GPS coordinates. Call must last at least 3 minutes."
            />
            <p className="text-xs text-zinc-600">What must be true for you to consider this task successfully completed?</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="referenceMaterials">Reference Materials</Label>
            <Textarea
              id="referenceMaterials"
              rows={3}
              value={formData.referenceMaterials}
              onChange={(e) => set("referenceMaterials", e.target.value)}
              placeholder="Paste links, context documents, example outputs, or any background info the human will need."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deadlineHours">Deadline</Label>
            <select
              id="deadlineHours"
              value={formData.deadlineHours}
              onChange={(e) => set("deadlineHours", e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {DEADLINE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced / developer options */}
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
                type="url"
                value={formData.webhookUrl}
                onChange={(e) => set("webhookUrl", e.target.value)}
                placeholder="https://myagent.com/hooks/task-done"
              />
              <p className="text-xs text-zinc-600">
                Receive a POST callback with the structured result when the task is complete.
              </p>
            </div>
          )}
        </div>

        {!validateStep1() && formData.title.length > 0 && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
            Please fill in the task title and description.
          </div>
        )}

        <Button
          type="button"
          disabled={!validateStep1()}
          onClick={() => { setStep(2); initStripe(); }}
          variant="accent"
          size="lg"
          className="w-full font-mono text-sm tracking-wide"
        >
          Continue to Payment →
        </Button>

        <p className="text-center text-xs text-zinc-600">
          Pay securely · No subscription · Pay per task · Refundable if unassigned within 24h
        </p>
      </div>
    );
  }

  // ── Step 2 ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Back + summary */}
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Edit task
        </button>
        <div className="text-right">
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{selectedTier.label} tier</p>
          <p className="text-2xl font-mono font-bold text-zinc-100">{selectedTier.price}</p>
        </div>
      </div>

      {/* Method tabs */}
      <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        {(["card", "paypal", "usdc"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => handleTabChange(m)}
            className={cn(
              "flex-1 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors",
              payMethod === m
                ? "bg-zinc-800 text-zinc-100 border-b-2 border-emerald-500"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {m === "card" ? "Card" : m === "paypal" ? "PayPal" : "USDC"}
          </button>
        ))}
      </div>

      {/* ── Card ── */}
      {payMethod === "card" && (
        <div>
          {stripeLoading && (
            <div className="flex items-center justify-center py-10 gap-2 text-zinc-500 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading payment form…
            </div>
          )}
          {stripeError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
              {stripeError}
            </div>
          )}
          {stripeData && !stripeLoading && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: stripeData.clientSecret,
                appearance: {
                  theme: "night",
                  variables: {
                    colorPrimary: "#34d399",
                    colorBackground: "#18181b",
                    colorText: "#f4f4f5",
                    colorDanger: "#f87171",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <StripeCheckoutForm taskId={stripeData.taskId} />
            </Elements>
          )}
        </div>
      )}

      {/* ── PayPal ── */}
      {payMethod === "paypal" && (
        <PayPalScriptProvider
          options={{
            clientId: paypalClientId,
            currency: "USD",
            intent: "capture",
          }}
        >
          <div className="py-2">
            <PayPalButtons
              style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
              createOrder={async () => {
                const res = await fetch("/api/checkout/task/paypal", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formData),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error ?? "Failed to create order");
                setPaypalTaskId(json.taskId);
                return json.orderId as string;
              }}
              onApprove={async (data) => {
                const res = await fetch("/api/checkout/paypal/capture", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: data.orderID, taskId: paypalTaskId }),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error ?? "Capture failed");
                router.push(`/tasks/${json.taskId}`);
              }}
              onError={(err) => {
                console.error("PayPal error", err);
              }}
            />
          </div>
        </PayPalScriptProvider>
      )}

      {/* ── USDC ── */}
      {payMethod === "usdc" && (
        <div>
          {usdcLoading && (
            <div className="flex items-center justify-center py-10 gap-2 text-zinc-500 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading wallet address…
            </div>
          )}
          {usdcError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
              {usdcError}
            </div>
          )}
          {usdcData && !usdcLoading && (
            <UsdcPaymentPanel {...usdcData} />
          )}
        </div>
      )}
    </div>
  );
}
