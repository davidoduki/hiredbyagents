import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

// ── Shared primitives ──────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
      <span className="eyebrow text-emerald-400">{children}</span>
    </div>
  );
}

function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-display font-bold text-zinc-100 leading-[1.04] ${className}`}
      style={{ fontSize: "clamp(30px, 3.4vw, 44px)" }}
    >
      {children}
    </h2>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12.5l5.2 5L20 6.5" />
    </svg>
  );
}

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5 text-emerald-400",
  "aria-hidden": true,
};

const USE_CASES = [
  {
    title: "Merchant & KYB checks",
    body: "Onboarding a merchant or vendor? We visit the address, confirm the business is real and trading, and return photo evidence for your compliance file.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 9l1.6-5h14.8L21 9" />
        <path d="M4.5 9v11h15V9" />
        <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
        <path d="M10 20v-6h4v6" />
      </svg>
    ),
  },
  {
    title: "Loan & collateral checks",
    body: "Verify a borrower's shop, stock or asset exists before you disburse. Timestamped, GPS-tagged photos on every visit.",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="2.5" y="6" width="19" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.6" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
  },
  {
    title: "Supplier & warehouse audits",
    body: "Confirm a supplier is real, count inventory, verify SKUs and conditions — before the deposit leaves your account.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 9.5L12 4l9 5.5V20H3z" />
        <rect x="7.5" y="13" width="4" height="7" />
        <rect x="13" y="13" width="3.5" height="4" />
      </svg>
    ),
  },
  {
    title: "Retail shelf audits",
    body: "Is your product on shelf, priced right, displayed right? Store-level photo reports across cities, on a schedule you set.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3.5 4h17M3.5 12h17M3.5 20h17" />
        <rect x="6" y="6.5" width="4" height="5.5" />
        <rect x="13" y="7.5" width="4.5" height="4.5" />
        <rect x="6" y="15" width="5.5" height="5" />
      </svg>
    ),
  },
  {
    title: "Property & site checks",
    body: "Photograph, assess and report on a property, site or venue before you commit to it remotely.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M4 20V7.5L12 3l8 4.5V20z" />
        <path d="M9.5 20v-6h5v6" />
        <path d="M8.5 9.5h2M13.5 9.5h2" />
      </svg>
    ),
  },
  {
    title: "Human review for AI",
    body: "Your model's outputs checked by people — verification, QA and judgment on the edge cases automation can't call.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M5.5 3.5h9l4.5 4.5v12.5h-13.5z" />
        <path d="M14 3.5V8h4.5" />
        <path d="M8.5 14.5l2.2 2.2 4.3-4.4" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    num: "01",
    title: "Submit a request",
    body: "Dashboard or REST API — what to verify, where, by when, and an optional webhook for the result.",
  },
  {
    num: "02",
    title: "We dispatch",
    body: "Our team assigns a vetted local. You never browse workers or wait on bids — that is our job.",
  },
  {
    num: "03",
    title: "On-site verification",
    body: "They visit, make the call, count the stock — documenting each answer as they go.",
  },
  {
    num: "04",
    title: "Structured proof",
    body: "JSON plus evidence lands in your dashboard or webhook. File it, or act on it automatically.",
  },
];

const COMPARISON = [
  {
    filed: "The registry says the company is active",
    verified: "We confirm it is actually trading at that address",
  },
  {
    filed: "The merchant uploaded photos of their shop",
    verified: "Our verifier takes their own — GPS-tagged, timestamped",
  },
  {
    filed: "The phone number rings out",
    verified: "A human visits, asks the questions, reports back",
  },
  {
    filed: "AI summarises stale web data",
    verified: "Ground truth collected this week, signed by a named person",
  },
];

const PLANS = [
  {
    tier: "Basic",
    price: "$49",
    unit: "/ check",
    description:
      "Single-location check: business exists, address confirmed, photo proof.",
    features: [
      "Dispatched same day where we have cover",
      "GPS-tagged photo evidence",
      "Structured JSON result",
      "Webhook delivery",
    ],
    cta: "Request a check",
    href: "/tasks/new",
    highlight: false,
  },
  {
    tier: "Standard",
    price: "$99",
    unit: "/ check",
    description:
      "Detailed on-site report: inspections, stock counts, document collection.",
    features: [
      "Priority dispatch",
      "Detailed written report",
      "Photo and video evidence",
      "Named verifier on every job",
    ],
    cta: "Request a check",
    href: "/tasks/new",
    highlight: true,
  },
  {
    tier: "Programme",
    price: "$199",
    unit: "+ / check",
    description:
      "Specialist or multi-location jobs, and recurring audit programmes.",
    features: [
      "Specialist matched to the job",
      "Full audit trail",
      "Volume pricing per check",
      "Custom SLA available",
    ],
    cta: "Talk to us",
    href: "mailto:info@hiredbyagents.com",
    highlight: false,
  },
];

const AUDIENCES = [
  "Fintech & lending",
  "Marketplaces",
  "Trade & supply chain",
  "Insurance & property",
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-zinc-950">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:px-10 sm:pb-24 sm:pt-24 lg:px-[130px] lg:pb-[120px] lg:pt-[104px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-56 left-10 h-[640px] w-[760px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(16,185,129,0.10), rgba(16,185,129,0))",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Copy */}
          <div className="lg:col-span-7">
            <div className="anim-1">
              <Eyebrow>Physical verification, on demand</Eyebrow>
            </div>

            <h1
              className="anim-2 font-display font-extrabold leading-[0.98] mb-7"
              style={{ fontSize: "clamp(40px, 5.2vw, 68px)" }}
            >
              <span className="block text-zinc-500">The database</span>
              <span className="block text-zinc-500">says it exists.</span>
              <span className="block text-zinc-100">We go and check.</span>
            </h1>

            <p className="anim-3 mb-10 max-w-[520px] text-base leading-relaxed text-zinc-400 sm:text-lg">
              We dispatch a vetted human to verify a business, address, asset or
              shelf — and return structured proof with photos, GPS and
              timestamps inside 24 hours.
            </p>

            <div className="anim-4 mb-12 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="accent" asChild>
                <Link href="/tasks/new">Request a verification</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/#pricing">See pricing</Link>
              </Button>
            </div>

            <div className="anim-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.06] pt-7">
              {["24h median turnaround", "GPS-tagged evidence", "JSON + webhook"].map(
                (item, i) => (
                  <div key={item} className="flex items-center gap-6">
                    {i > 0 && (
                      <span className="hidden h-[3px] w-[3px] rounded-full bg-zinc-700 sm:block" />
                    )}
                    <span className="font-code text-[11px] uppercase tracking-[0.13em] text-zinc-500">
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Sample result card */}
          <div className="anim-4 flex flex-col items-start gap-3 lg:col-span-5 lg:items-end">
            <span className="font-code text-[10px] uppercase tracking-[0.16em] text-zinc-600">
              Sample result
            </span>
            <div
              className="w-full rounded-2xl border border-white/[0.08] bg-[#0D0E11] p-5"
              style={{
                boxShadow:
                  "0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.045)",
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex h-[26px] items-center gap-[7px] rounded-full border border-emerald-400/25 bg-emerald-500/10 px-[11px]">
                  <span className="h-[5px] w-[5px] rounded-full bg-emerald-400" />
                  <span className="font-code text-[10px] font-bold tracking-[0.12em] text-emerald-400">
                    VERIFIED
                  </span>
                </span>
                <span className="font-code text-[11px] text-zinc-600">HBA-2291</span>
              </div>

              {/* Photo evidence slot */}
              <div className="relative mb-[18px] h-[208px] overflow-hidden rounded-[10px] border border-white/[0.05] bg-gradient-to-br from-[#1A1D22] via-[#121418] to-[#0E1013]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "26px 26px",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3F444C"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[26px] w-[26px]"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="12" cy="12" r="3.2" />
                    <path d="M8 5l1.4-2h5.2L16 5" />
                  </svg>
                  <span className="font-code text-[10px] uppercase tracking-[0.14em] text-[#4A4F57]">
                    On-site photo
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 inline-flex h-6 items-center gap-1.5 rounded-md border border-white/[0.08] bg-zinc-950/80 px-2.5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[11px] w-[11px] text-emerald-400"
                    aria-hidden="true"
                  >
                    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.4" />
                  </svg>
                  <span className="font-code text-[10px] text-zinc-400">
                    6.4531°N 3.3958°E
                  </span>
                </div>
              </div>

              <div className="mb-1.5 font-code text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                Merchant
              </div>
              <div className="mb-1 text-[17px] font-semibold text-zinc-100">
                Sample Merchant Ltd
              </div>
              <div className="mb-[18px] text-sm text-zinc-500">
                14 Marina Road, Lagos
              </div>

              <div className="flex flex-col gap-[11px] border-t border-white/[0.06] pt-4">
                {["Business trading", "Signage matches record", "Address as filed"].map(
                  (row) => (
                    <div key={row} className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">{row}</span>
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-400">
                        <Check className="h-[13px] w-[13px]" />
                        Confirmed
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="mt-4 border-t border-white/[0.06] pt-3.5 font-code text-[10.5px] text-zinc-600">
                Captured 24 Aug 2026 · 14:22 UTC · Verifier #4417
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE BAND ───────────────────────────────────────────────── */}
      <div className="border-y border-white/[0.06] bg-[#0B0C0E] px-6 py-10 sm:px-10 lg:px-[130px]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-start justify-between gap-6 lg:flex-row lg:items-center lg:gap-10">
          <span className="text-[15px] text-zinc-500 lg:whitespace-nowrap">
            Built for the teams that carry the risk
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            {AUDIENCES.map((a) => (
              <span
                key={a}
                className="inline-flex h-[34px] items-center rounded-full border border-white/[0.09] px-4 text-sm text-zinc-400"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT WE VERIFY ──────────────────────────────────────────────── */}
      <section
        id="use-cases"
        className="px-6 py-20 sm:px-10 sm:py-24 lg:px-[130px] lg:py-[120px]"
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mb-14 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end lg:gap-16">
            <div>
              <Eyebrow>What we verify</Eyebrow>
              <SectionHeading>
                Before you wire the money,
                <br />
                put eyes on it.
              </SectionHeading>
            </div>
            <p className="max-w-[340px] text-base leading-relaxed text-zinc-500 lg:mb-1.5">
              Registries go stale. Uploaded photos lie. When the decision is
              expensive, we send someone to look.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((uc) => (
              <div
                key={uc.title}
                className="surface-hover rounded-2xl border border-white/[0.07] bg-zinc-900 p-7 pb-8"
              >
                <div className="mb-[22px] flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-emerald-400/[0.18] bg-emerald-500/10">
                  {uc.icon}
                </div>
                <h3 className="font-display mb-3 text-[19px] font-bold tracking-[-0.015em] text-zinc-100">
                  {uc.title}
                </h3>
                <p className="text-[14.5px] leading-[1.68] text-zinc-500">
                  {uc.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="px-6 pb-20 sm:px-10 sm:pb-24 lg:px-[130px] lg:pb-[120px]"
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <Eyebrow>How it works</Eyebrow>
          <SectionHeading className="mb-14">
            From request to filed evidence.
          </SectionHeading>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.num} className="border-t border-white/10 pt-6">
                <div className="mb-[18px] flex items-center gap-2.5">
                  <span className="font-code text-xs font-bold text-emerald-400">
                    {step.num}
                  </span>
                  <span className="h-px grow bg-white/[0.07]" />
                </div>
                <h3 className="font-display mb-[11px] text-[19px] font-bold tracking-[-0.015em] text-zinc-100">
                  {step.title}
                </h3>
                <p className="text-[14.5px] leading-[1.68] text-zinc-500">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REQUEST / RESPONSE ──────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] bg-[#0B0C0E] px-6 py-20 sm:px-10 sm:py-24 lg:px-[130px] lg:py-[120px]">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mb-13 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end lg:gap-16">
            <div>
              <Eyebrow>Built for automation</Eyebrow>
              <SectionHeading>Verification as an API call.</SectionHeading>
            </div>
            <p className="max-w-[360px] text-base leading-relaxed text-zinc-500 lg:mb-1.5">
              Trigger a check from your onboarding, lending or audit pipeline.
              Results arrive as data — no inbox, no PDFs to re-key.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Request */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08090A]">
              <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-3.5">
                <span className="inline-flex h-[22px] items-center rounded-[5px] bg-emerald-400/[0.12] px-2 font-code text-[10px] font-bold tracking-[0.08em] text-emerald-400">
                  POST
                </span>
                <span className="font-code text-xs text-zinc-500">
                  /api/verifications
                </span>
              </div>
              <div className="overflow-x-auto px-6 py-5 font-code text-[12.5px] leading-[2.05]">
                <div className="text-zinc-600">{"{"}</div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;type&quot;</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-[#7FD8AC]">&quot;merchant_kyb&quot;</span>
                  <span className="text-zinc-600">,</span>
                </div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;business_name&quot;</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-[#7FD8AC]">&quot;Sample Merchant Ltd&quot;</span>
                  <span className="text-zinc-600">,</span>
                </div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;address&quot;</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-[#7FD8AC]">&quot;14 Marina Road, Lagos&quot;</span>
                  <span className="text-zinc-600">,</span>
                </div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;checks&quot;</span>
                  <span className="text-zinc-600">: [</span>
                  <span className="text-[#7FD8AC]">&quot;trading&quot;</span>
                  <span className="text-zinc-600">, </span>
                  <span className="text-[#7FD8AC]">&quot;signage&quot;</span>
                  <span className="text-zinc-600">],</span>
                </div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;deadline_hours&quot;</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-[#A78BFA]">24</span>
                  <span className="text-zinc-600">,</span>
                </div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;webhook_url&quot;</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-[#7FD8AC]">&quot;https://acme.co/hooks/kyb&quot;</span>
                </div>
                <div className="text-zinc-600">{"}"}</div>
              </div>
            </div>

            {/* Response */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08090A]">
              <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-3.5">
                <span className="inline-flex h-[22px] items-center rounded-[5px] bg-white/[0.06] px-2 font-code text-[10px] font-bold tracking-[0.08em] text-zinc-400">
                  WEBHOOK
                </span>
                <span className="font-code text-xs text-zinc-500">
                  verification.completed
                </span>
              </div>
              <div className="overflow-x-auto px-6 py-5 font-code text-[12.5px] leading-[2.05]">
                <div className="text-zinc-600">{"{"}</div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;id&quot;</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-[#7FD8AC]">&quot;HBA-2291&quot;</span>
                  <span className="text-zinc-600">,</span>
                </div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;verified&quot;</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-[#A78BFA]">true</span>
                  <span className="text-zinc-600">,</span>
                </div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;trading&quot;</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-[#A78BFA]">true</span>
                  <span className="text-zinc-600">,</span>
                </div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;photos&quot;</span>
                  <span className="text-zinc-600">: [</span>
                  <span className="text-[#7FD8AC]">&quot;cdn.hba.../1.jpg&quot;</span>
                  <span className="text-zinc-600">],</span>
                </div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;gps&quot;</span>
                  <span className="text-zinc-600">: {"{ "}</span>
                  <span className="text-[#E4B168]">&quot;lat&quot;</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-[#A78BFA]">6.4531</span>
                  <span className="text-zinc-600">, </span>
                  <span className="text-[#E4B168]">&quot;lng&quot;</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-[#A78BFA]">3.3958</span>
                  <span className="text-zinc-600">{" }"},</span>
                </div>
                <div className="pl-[18px]">
                  <span className="text-[#E4B168]">&quot;captured_at&quot;</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-[#7FD8AC]">&quot;2026-08-24T14:22:00Z&quot;</span>
                </div>
                <div className="text-zinc-600">{"}"}</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="ghost" asChild>
              <Link href="/docs">Read the API docs</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── ON FILE VS VERIFIED ─────────────────────────────────────────── */}
      <section className="px-6 py-20 sm:px-10 sm:py-24 lg:px-[130px] lg:py-[120px]">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 items-start gap-12 lg:grid-cols-[460px_1fr] lg:gap-[72px]">
          <div>
            <Eyebrow>Why not just trust the data</Eyebrow>
            <SectionHeading className="mb-6">
              Databases go stale.
              <br />
              We check reality.
            </SectionHeading>
            <p className="max-w-[400px] text-base leading-[1.72] text-zinc-500">
              Registry lookups, uploaded documents and AI summaries all describe
              the world as it was — or as someone claimed it was. When money is
              on the line, someone has to look.
            </p>
          </div>

          <div className="flex flex-col">
            {/* Column headers only make sense once the rows sit side by side */}
            <div className="hidden grid-cols-2 gap-8 border-b border-white/10 pb-3.5 sm:grid">
              <span className="font-code text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                On file
              </span>
              <span className="font-code text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                Verified
              </span>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.filed}
                className={`grid grid-cols-1 gap-3 py-5 sm:grid-cols-2 sm:gap-8 sm:py-[22px] ${
                  i < COMPARISON.length - 1
                    ? "border-b border-white/[0.055]"
                    : ""
                }`}
              >
                <div className="flex flex-col gap-1.5">
                  <span className="font-code text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600 sm:hidden">
                    On file
                  </span>
                  <span className="text-[15px] leading-relaxed text-zinc-600">
                    {row.filed}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-code text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400 sm:hidden">
                    Verified
                  </span>
                  <span className="text-[15px] leading-relaxed text-zinc-300">
                    {row.verified}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <div
        id="pricing"
        className="border-t border-white/[0.06] bg-[#0B0C0E] px-6 py-20 sm:px-10 sm:py-24 lg:px-[130px] lg:py-[120px]"
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mb-14 text-center">
            <div className="mb-5 flex items-center justify-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="eyebrow text-emerald-400">Pricing</span>
            </div>
            <SectionHeading className="mb-4">Pay per verification.</SectionHeading>
            <p className="mx-auto max-w-[460px] text-base leading-relaxed text-zinc-500">
              No subscriptions, no setup fees, no field team to manage. Your
              first verification is free.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.tier}
                className={`relative rounded-2xl p-8 sm:p-9 ${
                  plan.highlight
                    ? "border border-emerald-400/30 bg-[#0E1013]"
                    : "border border-white/[0.07] bg-zinc-900"
                }`}
                style={
                  plan.highlight
                    ? { boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }
                    : undefined
                }
              >
                {plan.highlight && (
                  <span className="absolute right-6 top-6 inline-flex h-6 items-center rounded-full bg-emerald-500/[0.14] px-2.5 font-code text-[10px] font-bold tracking-[0.1em] text-emerald-400">
                    COMMON
                  </span>
                )}
                <div
                  className={`font-code mb-5 text-[11px] font-bold uppercase tracking-[0.16em] ${
                    plan.highlight ? "text-emerald-400" : "text-zinc-500"
                  }`}
                >
                  {plan.tier}
                </div>
                <div className="mb-3.5 flex items-baseline gap-1.5">
                  <span className="font-display text-[46px] font-extrabold leading-none text-zinc-100">
                    {plan.price}
                  </span>
                  <span className="text-sm text-zinc-600">{plan.unit}</span>
                </div>
                <p className="mb-7 min-h-[48px] text-[14.5px] leading-[1.65] text-zinc-500">
                  {plan.description}
                </p>
                <div className="mb-8 flex flex-col gap-3.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <Check className="mt-[3px] h-[15px] w-[15px] shrink-0 text-emerald-400" />
                      <span
                        className={`text-[14.5px] leading-[1.55] ${
                          plan.highlight ? "text-zinc-300" : "text-zinc-400"
                        }`}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  asChild
                  variant={plan.highlight ? "accent" : "ghost"}
                  className="w-full"
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/[0.07] bg-zinc-900 px-7 py-5 sm:flex-row sm:items-center">
            <p className="max-w-[560px] text-sm leading-relaxed text-zinc-500">
              <span className="font-medium text-zinc-300">
                Verifying at volume?
              </span>{" "}
              Onboarding merchants or auditing stores at 20+ checks a month? We
              will build custom per-verification pricing around your pipeline.
            </p>
            <a
              href="mailto:info@hiredbyagents.com"
              className="shrink-0 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
            >
              Talk to us →
            </a>
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-t border-white/[0.06] px-6 py-24 text-center sm:px-10 lg:px-[130px] lg:py-[132px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-72 left-1/2 h-[560px] w-[900px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(closest-side, rgba(16,185,129,0.11), rgba(16,185,129,0))",
          }}
        />
        <div className="relative mx-auto max-w-[840px]">
          <h2
            className="font-display mb-6 font-extrabold leading-[1.02] text-zinc-100"
            style={{ fontSize: "clamp(34px, 4.5vw, 56px)" }}
          >
            Your first verification
            <br />
            is on us.
          </h2>
          <p className="mb-10 text-[17px] leading-relaxed text-zinc-500">
            No contracts. 24-hour turnaround. Proof you can put in a file, from a
            named person on the ground.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="accent" asChild>
              <Link href="/tasks/new">Request a verification</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/docs">Read the API docs</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 pb-12 pt-16 sm:px-10 lg:px-[130px]">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="grid grid-cols-2 gap-10 border-b border-white/[0.06] pb-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div className="col-span-2 lg:col-span-1">
              <div className="font-code mb-3.5 text-sm font-bold tracking-tight text-white">
                hired<span className="text-emerald-400">by</span>agents
                <span className="text-emerald-400">.com</span>
              </div>
              <p className="max-w-[260px] text-sm leading-relaxed text-zinc-600">
                On-demand physical verification, with structured proof.
              </p>
            </div>
            {[
              {
                heading: "Product",
                links: [
                  { label: "What we verify", href: "/#use-cases" },
                  { label: "How it works", href: "/#how-it-works" },
                  { label: "Pricing", href: "/#pricing" },
                ],
              },
              {
                heading: "Developers",
                links: [
                  { label: "API docs", href: "/docs" },
                  { label: "Tools", href: "/tools" },
                  { label: "FAQ", href: "/faq" },
                ],
              },
              {
                heading: "Company",
                links: [
                  { label: "Work with us", href: "/workers" },
                  { label: "Blog", href: "/blog" },
                  { label: "Contact", href: "mailto:info@hiredbyagents.com" },
                ],
              },
            ].map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <span className="font-code mb-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-700">
                  {col.heading}
                </span>
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start justify-between gap-4 pt-7 sm:flex-row sm:items-center">
            <span className="text-[13px] text-zinc-700">
              © 2026 HiredByAgents.com
            </span>
            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-[13px] text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-[13px] text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
