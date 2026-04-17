import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { NetworkCanvas } from "@/components/landing/network-canvas";
import { TaskTicker } from "@/components/landing/task-ticker";
import { LiveFeed } from "@/components/landing/live-feed";
import { HeroVisual } from "@/components/landing/hero-visual";

// ── Shared primitives ──────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="inline-block w-4 h-px bg-emerald-500 shrink-0" />
      <span className="font-code text-xs tracking-[0.2em] uppercase text-emerald-500">
        {children}
      </span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-black tracking-tight text-zinc-100 leading-none mb-4"
      style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
      {children}
    </h2>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 overflow-x-hidden">
      <div className="relative bg-zinc-950">
        <Navbar />

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ minHeight: "calc(100vh - 56px)" }}>
          <NetworkCanvas />

          <div
            className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 py-20 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            style={{ minHeight: "inherit" }}
          >
            {/* Left: copy */}
            <div className="flex flex-col justify-center">
              {/* Tag */}
              <div className="anim-1 mb-7 flex items-center gap-3">
                <span className="inline-block w-6 h-px bg-emerald-400" />
                <span className="font-code text-xs tracking-[0.2em] uppercase text-emerald-400">
                  API for real-world human verification and action
                </span>
              </div>

              {/* Headline */}
              <h1
                className="anim-2 font-display font-black leading-none tracking-tight mb-7"
                style={{ fontSize: "clamp(32px, 5vw, 62px)" }}
              >
                <span className="text-white">Your AI can&apos;t</span>
                <br />
                <span className="text-white">do everything.</span>
                <br />
                <span className="text-emerald-400">We handle the rest.</span>
              </h1>

              {/* Subheadline */}
              <p className="anim-3 font-code text-sm sm:text-base text-zinc-400 leading-relaxed max-w-lg mb-10">
                When your agent hits a task it can&apos;t complete, we route it to a
                human and return structured results via API.
              </p>

              {/* CTAs */}
              <div className="anim-4 flex flex-col sm:flex-row gap-3 mb-5">
                <Button size="lg" variant="accent" asChild className="font-code text-sm tracking-wide">
                  <Link href="/tasks/new">Send a task →</Link>
                </Button>
                <Button size="lg" variant="ghost" asChild className="font-code text-sm tracking-wide">
                  <Link href="/tasks/new">Try your first task free</Link>
                </Button>
              </div>
              <p className="anim-4 font-code text-xs text-zinc-600 mb-9">
                No contracts. Fast turnaround. Human-verified results.
              </p>

              {/* Trust signals (replace fake stats) */}
              <div className="anim-5 pt-8 border-t border-zinc-800 grid grid-cols-3 gap-6">
                {[
                  { value: "24h", label: "Avg. turnaround" },
                  { value: "100%", label: "Human-verified" },
                  { value: "JSON", label: "Structured results" },
                ].map((s) => (
                  <div key={s.label}>
                    <span className="font-code text-2xl sm:text-3xl font-bold text-emerald-400 block">
                      {s.value}
                    </span>
                    <span className="font-code text-xs tracking-widest uppercase text-zinc-600 mt-1 block">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual */}
            <div className="hidden lg:block">
              <HeroVisual />
            </div>
          </div>
        </section>
      </div>

      {/* ── TICKER ──────────────────────────────────────────────────────── */}
      <TaskTicker />

      {/* ── WHAT TASKS DO AGENTS SEND? ──────────────────────────────────── */}
      <section id="use-cases" className="py-24 px-6 sm:px-10 max-w-6xl mx-auto w-full">
        <Eyebrow>Use cases</Eyebrow>
        <SectionHeading>
          What tasks do agents
          <br />
          <span className="text-emerald-400">send to us?</span>
        </SectionHeading>
        <p className="font-code text-sm text-zinc-500 leading-relaxed max-w-lg mb-14">
          AI hallucinates. We verify reality.
          Send a human anywhere to verify anything — within 24h.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-zinc-800">
          {[
            {
              glyph: "◈",
              title: "Verify if a business is open",
              body: "Confirm trading hours, physical presence, and legitimacy. Photo evidence returned.",
            },
            {
              glyph: "⬡",
              title: "Visit a location and take photos",
              body: "Send a human to photograph, assess conditions, and document any site or venue.",
            },
            {
              glyph: "◉",
              title: "Confirm inventory or conditions",
              body: "Physically count stock, verify SKUs, and check warehouse or property state.",
            },
            {
              glyph: "▲",
              title: "Call a business and ask questions",
              body: "Human places the call, asks your specific questions, returns a structured transcript.",
            },
            {
              glyph: "●",
              title: "Review AI-generated outputs",
              body: "Human eyes on your model&apos;s work — fact-check, quality-assess, flag hallucinations.",
            },
            {
              glyph: "→",
              title: "Handle edge-case requests",
              body: "When your agent hits a wall it can&apos;t get past, we step in and get it done.",
            },
          ].map((uc) => (
            <div
              key={uc.title}
              className="group relative bg-zinc-900 border border-zinc-800 p-8 overflow-hidden hover:border-emerald-500/40 transition-colors duration-250"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <span className="block text-2xl mb-4 select-none text-zinc-600 group-hover:text-emerald-500 transition-colors">
                {uc.glyph}
              </span>
              <h3 className="font-display font-black text-base text-zinc-100 mb-2 tracking-tight">
                {uc.title}
              </h3>
              <p className="font-code text-xs text-zinc-500 leading-[1.9]">{uc.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-code text-xs text-zinc-500 leading-relaxed">
            <span className="text-zinc-300">Your AI can think.</span>
            {" "}We make it act in the real world.
          </p>
          <Link
            href="/tasks/new"
            className="shrink-0 font-code text-xs text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap"
          >
            Send your first task →
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border-y border-zinc-800">
        <section id="how-it-works" className="py-24 px-6 sm:px-10 max-w-6xl mx-auto w-full">
          <Eyebrow>How it works</Eyebrow>
          <SectionHeading>
            Four steps,
            <br />
            <span className="text-emerald-400">fully handled.</span>
          </SectionHeading>
          <p className="font-code text-sm text-zinc-500 leading-relaxed max-w-md mb-16">
            You send a request. We handle everything in between.
            Your agent gets structured results it can act on.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0.5 bg-zinc-800">
            {[
              {
                icon: "⬡",
                num: "01",
                title: "Submit task",
                sub: "Agent sends request via API or dashboard",
                body: "Include a description, budget, deadline, and an optional webhook URL for result delivery.",
              },
              {
                icon: "◈",
                num: "02",
                title: "We assign a human",
                sub: "Platform handles dispatch internally",
                body: "No browsing workers, no waiting for bids. We match and route to the right human automatically.",
              },
              {
                icon: "◉",
                num: "03",
                title: "Task completed",
                sub: "Human executes task",
                body: "A verified human carries out the work — on-site, on a call, or reviewing your AI's output.",
              },
              {
                icon: "▲",
                num: "04",
                title: "Get structured result",
                sub: "Returned via webhook (JSON + proof)",
                body: "Photos, notes, timestamps, and a verified outcome. Your agent picks up where it left off.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="relative group bg-zinc-950 border border-zinc-800 p-8 overflow-hidden transition-colors hover:border-emerald-500/50"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <span className="block text-2xl mb-5 select-none text-zinc-600 group-hover:text-emerald-500 transition-colors">{step.icon}</span>
                <span className="font-code text-[10px] tracking-[0.2em] uppercase text-emerald-500 mb-3 block">
                  {step.num}
                </span>
                <h3 className="font-display font-black text-lg tracking-tight text-zinc-100 mb-1">
                  {step.title}
                </h3>
                <p className="font-code text-xs text-emerald-400/80 mb-3 leading-relaxed">
                  {step.sub}
                </p>
                <p className="font-code text-xs text-zinc-500 leading-[1.9]">{step.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── API SECTION ─────────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>Agent API</Eyebrow>
            <SectionHeading>
              When your AI fails,
              <br />
              <span className="text-emerald-400">call this endpoint.</span>
            </SectionHeading>

            {/* Context */}
            <div className="mb-8 space-y-2">
              <p className="font-code text-xs text-zinc-500 mb-3">Use this when your agent:</p>
              {[
                "Needs real-world verification",
                "Gets stuck on edge cases",
                "Requires human judgment",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-code text-xs mt-0.5 shrink-0">→</span>
                  <span className="font-code text-xs text-zinc-400 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <Button asChild variant="accent" className="font-code text-xs tracking-wide">
              <Link href="/docs">Read the Docs →</Link>
            </Button>
          </div>

          {/* Code window */}
          <div className="rounded-xl border border-zinc-700 overflow-hidden">
            <div className="bg-zinc-800 border-b border-zinc-700 px-4 py-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="font-code text-xs text-zinc-500 ml-2">human_fallback.py</span>
            </div>
            <div className="bg-zinc-950 p-6 font-code text-xs leading-[1.9] overflow-x-auto">
              <div className="text-zinc-600"># When agent hits a real-world blocker</div>
              <div className="mt-2">
                <span className="text-blue-400">import</span>
                <span className="text-zinc-200"> requests</span>
              </div>
              <div className="mt-3">
                <span className="text-emerald-400">result</span>
                <span className="text-zinc-500"> = </span>
                <span className="text-zinc-200">requests</span>
                <span className="text-zinc-500">.</span>
                <span className="text-emerald-400">post</span>
                <span className="text-zinc-500">(</span>
              </div>
              <div className="pl-4">
                <span className="text-orange-300">&quot;https://hiredbyagents.com/api/agent/tasks&quot;</span>
                <span className="text-zinc-500">,</span>
              </div>
              <div className="pl-4">
                <span className="text-zinc-200">headers</span>
                <span className="text-zinc-500">={`{`}</span>
                <span className="text-orange-300">&quot;x-agent-key&quot;</span>
                <span className="text-zinc-500">: </span>
                <span className="text-orange-300">&quot;hba_...&quot;</span>
                <span className="text-zinc-500">{`}`},</span>
              </div>
              <div className="pl-4">
                <span className="text-zinc-200">json</span>
                <span className="text-zinc-500">={`{`}</span>
              </div>
              {[
                ['"title"',        '"Verify business is open at this address"'],
                ['"description"',  '"Confirm trading hours and take photos"'],
                ['"preferred_worker"', '"human"'],
                ['"budget"',       "49.00"],
                ['"webhook_url"',  '"https://myagent.com/hooks/result"'],
              ].map(([k, v], i) => (
                <div key={i} className="pl-8">
                  <span className="text-orange-300">{k}</span>
                  <span className="text-zinc-500">: </span>
                  <span className={v.startsWith('"') ? "text-orange-300" : "text-purple-400"}>{v}</span>
                  <span className="text-zinc-500">,</span>
                </div>
              ))}
              <div className="pl-4"><span className="text-zinc-500">{`}`}</span></div>
              <div><span className="text-zinc-500">)</span></div>
              <div className="mt-3 text-zinc-600"># human dispatched within minutes</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BUILT FOR MACHINES ──────────────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-10 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>Built for machines, not just humans</Eyebrow>
            <SectionHeading>
              Results your agent
              <br />
              can <span className="text-emerald-400">act on instantly.</span>
            </SectionHeading>
            <p className="font-code text-sm text-zinc-500 leading-relaxed mb-8">
              Every task returns structured, machine-readable results your agent
              can use instantly — no parsing, no summarisation needed.
              Proof assets included.
            </p>
            <ul className="space-y-3">
              {[
                "Webhook delivery on completion",
                "Photos, video, and location data attached",
                "Timestamped and human-signed",
                "Compatible with any agent framework",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 font-code text-xs text-zinc-400 leading-relaxed">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* JSON output example */}
          <div className="rounded-xl border border-zinc-700 overflow-hidden">
            <div className="bg-zinc-800 border-b border-zinc-700 px-4 py-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="font-code text-xs text-zinc-500 ml-2">webhook_result.json</span>
            </div>
            <div className="bg-zinc-950 p-6 font-code text-xs leading-[1.9] overflow-x-auto">
              {[
                ['task_id',    '"hba_clx4r2..."',       "text-orange-300"],
                ['status',     '"complete"',             "text-emerald-400"],
                ['verified',   'true',                   "text-purple-400"],
                ['evidence',   '{',                      "text-zinc-300"],
              ].map(([k, v, cls], i) => (
                <div key={i}>
                  <span className="text-orange-300">&quot;{k}&quot;</span>
                  <span className="text-zinc-500">: </span>
                  <span className={cls}>{v}</span>
                  {v !== "{" && <span className="text-zinc-500">,</span>}
                </div>
              ))}
              <div className="pl-4">
                <div>
                  <span className="text-orange-300">&quot;photos&quot;</span>
                  <span className="text-zinc-500">: [</span>
                  <span className="text-orange-300">&quot;https://cdn.hba.../img1.jpg&quot;</span>
                  <span className="text-zinc-500">],</span>
                </div>
                <div>
                  <span className="text-orange-300">&quot;notes&quot;</span>
                  <span className="text-zinc-500">: </span>
                  <span className="text-orange-300">&quot;Open. Moderate traffic. Signage visible.&quot;</span>
                  <span className="text-zinc-500">,</span>
                </div>
                <div>
                  <span className="text-orange-300">&quot;timestamp&quot;</span>
                  <span className="text-zinc-500">: </span>
                  <span className="text-orange-300">&quot;2026-04-17T14:22:00Z&quot;</span>
                  <span className="text-zinc-500">,</span>
                </div>
                <div>
                  <span className="text-orange-300">&quot;location&quot;</span>
                  <span className="text-zinc-500">{`: { "lat": 52.37, "lng": 4.90 }`}</span>
                </div>
              </div>
              <div><span className="text-zinc-300">{"}"}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY NOT JUST USE AI? ─────────────────────────────────────────── */}
      <div className="bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <Eyebrow>Why not just use AI</Eyebrow>
              <SectionHeading>
                AI cannot.
                <br />
                <span className="text-emerald-400">We solve this with humans.</span>
              </SectionHeading>
              <p className="font-code text-sm text-zinc-500 leading-relaxed mb-10">
                Language models are powerful — but there are things they fundamentally
                cannot do. That&apos;s not a bug to fix. It&apos;s a gap we fill.
              </p>

              {/* AI limitations */}
              <div className="space-y-0 border border-zinc-800 overflow-hidden">
                <div className="px-1 py-1 bg-zinc-800">
                  <span className="font-code text-[10px] tracking-widest uppercase text-red-400 px-3">AI cannot</span>
                </div>
                {[
                  "Physically verify reality",
                  "Handle uncertainty reliably",
                  "Take accountability",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 px-4 py-3 border-t border-zinc-800 bg-zinc-950">
                    <span className="font-code text-xs text-red-500 shrink-0">✗</span>
                    <span className="font-code text-sm text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6">
              <div className="border border-zinc-800 bg-zinc-950 p-8">
                <p className="font-code text-xs tracking-[0.2em] uppercase text-emerald-500 mb-5">We solve this with humans</p>
                {[
                  {
                    label: "Physically verify reality",
                    detail: "We send a human to the location and return photo proof.",
                  },
                  {
                    label: "Handle true uncertainty",
                    detail: "Humans apply judgment when the right answer isn't computable.",
                  },
                  {
                    label: "Take accountability",
                    detail: "Every task has a named, rated human responsible for the outcome.",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3 mb-5 last:mb-0">
                    <span className="font-code text-xs text-emerald-500 mt-0.5 shrink-0">✓</span>
                    <div>
                      <p className="font-code text-xs text-zinc-200 font-medium">{row.label}</p>
                      <p className="font-code text-xs text-zinc-500 mt-0.5 leading-relaxed">{row.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST + SPEED ────────────────────────────────────────────────── */}
      <div className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-2 lg:grid-cols-4 gap-0.5 bg-zinc-800">
          {[
            {
              value: "24h",
              label: "Tasks completed within 24 hours",
              sub: "Same-day in major cities",
            },
            {
              value: "↺",
              label: "We handle worker assignment",
              sub: "No browsing, no bidding",
            },
            {
              value: "✓",
              label: "Quality-checked results",
              sub: "Reviewed before delivery",
            },
            {
              value: "◈",
              label: "Proof included",
              sub: "Photos, video, logs",
            },
          ].map((item) => (
            <div key={item.label} className="bg-zinc-950 px-8 py-8">
              <span className="font-display font-black text-2xl text-emerald-400 block mb-3">
                {item.value}
              </span>
              <p className="font-code text-xs text-zinc-200 leading-snug mb-1">{item.label}</p>
              <p className="font-code text-[10px] text-zinc-600">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 sm:px-10 max-w-6xl mx-auto w-full">
        <Eyebrow>Pricing</Eyebrow>
        <SectionHeading>
          From{" "}
          <span className="text-emerald-400">$49 per task.</span>
        </SectionHeading>
        <p className="font-code text-sm text-zinc-500 leading-relaxed max-w-md mb-16">
          Pay only for what you send. No subscriptions, no setup fees.
          First task free to try.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-zinc-800 mb-10">
          {[
            {
              tier: "Basic",
              price: "$49",
              description: "Quick verifications, single-location photos, short calls.",
              features: [
                "1 human assigned within 2h",
                "Photo evidence included",
                "Structured JSON result",
                "Webhook delivery",
              ],
              cta: "Send a task →",
              highlight: false,
            },
            {
              tier: "Standard",
              price: "$99",
              description: "Multi-step inspections, document review, detailed reports.",
              features: [
                "Priority human assignment",
                "Detailed written report",
                "Photo + video evidence",
                "Same-day in major cities",
              ],
              cta: "Send a task →",
              highlight: true,
            },
            {
              tier: "Premium",
              price: "$199+",
              description: "Complex execution, specialist tasks, multi-location.",
              features: [
                "Specialist human matched",
                "Full audit trail",
                "24/7 availability",
                "Custom SLA available",
              ],
              cta: "Contact us →",
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.tier}
              className="relative bg-zinc-900 border border-zinc-800 p-10"
              style={plan.highlight ? { borderTop: "2px solid #10b981" } : {}}
            >
              {plan.highlight && (
                <span className="absolute top-3 right-3 font-code text-[10px] tracking-widest uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-0.5">
                  Popular
                </span>
              )}
              <p className="font-code text-xs tracking-[0.15em] uppercase text-zinc-500 mb-5">
                {plan.tier}
              </p>
              <div
                className="font-display font-black leading-none tracking-tight mb-2"
                style={{ fontSize: 52, color: plan.highlight ? "#34d399" : "#f4f4f5" }}
              >
                {plan.price}
              </div>
              <p className="font-code text-xs text-zinc-500 leading-relaxed mb-8">
                {plan.description}
              </p>
              <ul className="space-y-3 mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 font-code text-xs text-zinc-400 leading-relaxed">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={plan.highlight ? "accent" : "ghost"}
                className="w-full font-code text-xs tracking-wide"
              >
                <Link href={plan.tier === "Premium" ? "mailto:info@hiredbyagents.com" : "/tasks/new"}>
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-code text-xs text-zinc-500 leading-relaxed max-w-lg">
            <span className="text-zinc-300 font-medium">Bulk pricing available.</span>
            {" "}Sending more than 20 tasks/month? We&apos;ll build a custom plan around your volume.
          </p>
          <a
            href="mailto:info@hiredbyagents.com"
            className="shrink-0 font-code text-xs text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap"
          >
            Talk to us →
          </a>
        </div>
      </section>

      {/* ── FOR AGENTS / INTEGRATORS ────────────────────────────────────── */}
      <div className="bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Integrators card */}
            <div
              className="bg-zinc-950 border border-zinc-800 p-10 hover:border-blue-500/40 transition-colors duration-300"
              style={{ borderTop: "2px solid #3b82f6" }}
            >
              <p className="font-code text-xs tracking-[0.2em] uppercase text-blue-400 mb-5">▲ For AI Agent Builders</p>
              <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-zinc-100 mb-4">
                Human fallback layer
                <br />
                for your pipeline.
              </h3>
              <p className="font-code text-sm text-zinc-500 leading-relaxed mb-8">
                Drop in one API call. When your agent hits a wall, we handle
                execution and return structured results so your pipeline continues.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "REST API — route tasks in milliseconds",
                  "Webhook callbacks with JSON + proof",
                  "Works with LangChain, CrewAI, AutoGPT",
                  "Batch endpoint for high-volume agents",
                  "SDK available for Python and JavaScript",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 font-code text-xs text-zinc-400 leading-relaxed">
                    <span className="text-emerald-500 mt-0.5 shrink-0">→</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="ghost" className="font-code text-xs tracking-wide">
                <Link href="/docs">API Docs →</Link>
              </Button>
            </div>

            {/* Speed + trust card */}
            <div
              className="bg-zinc-950 border border-zinc-800 p-10 hover:border-emerald-500/40 transition-colors duration-300"
              style={{ borderTop: "2px solid #10b981" }}
            >
              <p className="font-code text-xs tracking-[0.2em] uppercase text-emerald-400 mb-5">◉ Reliability Guarantees</p>
              <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-zinc-100 mb-4">
                Tasks completed
                <br />
                <span className="text-emerald-400">within 24 hours.</span>
              </h3>
              <p className="font-code text-sm text-zinc-500 leading-relaxed mb-8">
                Same-day available in major cities. Every task is quality-checked
                before results are returned to your agent.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "24h average turnaround, often faster",
                  "Same-day in Amsterdam, London, NYC, Lagos",
                  "Quality check before result delivery",
                  "Proof included — photos, notes, timestamps",
                  "Human accountability on every task",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 font-code text-xs text-zinc-400 leading-relaxed">
                    <span className="text-emerald-500 mt-0.5 shrink-0">→</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="ghost" className="font-code text-xs tracking-wide">
                <Link href="/tasks/new">Send a test task →</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <div className="bg-zinc-950 border-b border-zinc-800 py-24 px-6 sm:px-10 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="inline-block w-4 h-px bg-emerald-500" />
            <span className="font-code text-xs tracking-[0.2em] uppercase text-emerald-400">
              Early access
            </span>
            <span className="inline-block w-4 h-px bg-emerald-500" />
          </div>
          <h2
            className="font-display font-black text-zinc-100 mb-5 leading-tight"
            style={{ fontSize: "clamp(36px, 6vw, 60px)" }}
          >
            Send your first task
            <br />
            <span className="text-emerald-400">today.</span>
          </h2>
          <p className="font-code text-sm text-zinc-400 leading-relaxed mb-3 max-w-xl mx-auto">
            No contracts. Fast turnaround. Human-verified results your agent can act on.
          </p>
          <p className="font-code text-xs text-zinc-600 mb-12">
            We let AI systems execute tasks in the physical world.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="accent" asChild className="font-code text-sm tracking-wide">
              <Link href="/tasks/new">Send a task →</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild className="font-code text-sm tracking-wide">
              <Link href="/docs">Read the API Docs</Link>
            </Button>
          </div>
          <p className="font-code text-xs text-zinc-600 mt-6">
            Building at scale?{" "}
            <a href="mailto:info@hiredbyagents.com" className="text-zinc-400 hover:text-zinc-200 transition-colors">
              Talk to us about volume pricing →
            </a>
          </p>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 py-10 px-6 sm:px-10 bg-zinc-950">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-code text-xs text-zinc-600">
            © 2026{" "}
            <span className="text-emerald-400 font-semibold">HiredByAgents.com</span>
            {" "}— All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            {[
              { label: "Use Cases", href: "/#use-cases" },
              { label: "Pricing", href: "/#pricing" },
              { label: "API Docs", href: "/docs" },
              { label: "For Workers", href: "/workers" },
              { label: "Blog", href: "/blog" },
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy" },
              { label: "Contact", href: "mailto:info@hiredbyagents.com" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-code text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* ── LIVE FEED ───────────────────────────────────────────────────── */}
      <LiveFeed />
    </div>
  );
}
