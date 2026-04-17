"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Calculator, TrendingUp, Clock, DollarSign, Bot, Users } from "lucide-react";

function BudgetCalculator() {
  const [hours, setHours] = useState(2);
  const [skill, setSkill] = useState("general");
  const [urgency, setUrgency] = useState("normal");

  const baseRates: Record<string, number> = {
    general: 18, writing: 25, research: 30, coding: 55,
    design: 40, translation: 22, legal: 80, data: 20,
  };
  const urgencyMult: Record<string, number> = { low: 0.85, normal: 1, high: 1.3, urgent: 1.6 };

  const rate = baseRates[skill] * urgencyMult[urgency];
  const gross = Math.ceil(rate * hours);
  const fee = Math.ceil(gross * 0.12);
  const workerGets = gross - fee;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4 text-emerald-400" />
        <h3 className="font-semibold text-zinc-100">Task Budget Estimator</h3>
      </div>
      <p className="text-xs text-zinc-500">Estimate a fair budget based on task type, hours, and urgency.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Skill / Category</label>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="general">General / Admin</option>
            <option value="writing">Writing / Editing</option>
            <option value="research">Research</option>
            <option value="coding">Software Development</option>
            <option value="design">Design / Creative</option>
            <option value="translation">Translation</option>
            <option value="legal">Legal / Compliance</option>
            <option value="data">Data Labeling / QA</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Estimated Hours</label>
          <input
            type="number"
            min="0.5"
            max="40"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Urgency</label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="low">Flexible (–15%)</option>
            <option value="normal">Normal</option>
            <option value="high">Within 24h (+30%)</option>
            <option value="urgent">Within 4h (+60%)</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-emerald-400">${gross}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Suggested budget</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-200">${workerGets}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Worker receives (88%)</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-500">${fee}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Platform fee (12%)</p>
        </div>
      </div>

      <p className="text-[11px] text-zinc-600">
        Rates are market estimates based on typical freelance pricing. Final amounts are agreed between poster and worker.
      </p>
    </div>
  );
}

function AgentROICalculator() {
  const [tasksPerMonth, setTasksPerMonth] = useState(20);
  const [avgTaskHours, setAvgTaskHours] = useState(1.5);
  const [humanRate, setHumanRate] = useState(35);
  const [agentCostPerTask, setAgentCostPerTask] = useState(4);

  const humanCost = tasksPerMonth * avgTaskHours * humanRate;
  const agentCost = tasksPerMonth * agentCostPerTask;
  const savings = humanCost - agentCost;
  const pct = humanCost > 0 ? Math.round((savings / humanCost) * 100) : 0;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-purple-400" />
        <h3 className="font-semibold text-zinc-100">Agent vs Human Cost Calculator</h3>
      </div>
      <p className="text-xs text-zinc-500">Compare the monthly cost of using AI agents against hiring humans for repetitive tasks.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Tasks per month</label>
          <input type="number" min="1" value={tasksPerMonth} onChange={(e) => setTasksPerMonth(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Avg. hours per task</label>
          <input type="number" min="0.1" step="0.25" value={avgTaskHours} onChange={(e) => setAvgTaskHours(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Human hourly rate ($)</label>
          <input type="number" min="5" value={humanRate} onChange={(e) => setHumanRate(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Agent cost per task ($)</label>
          <input type="number" min="0.01" step="0.5" value={agentCostPerTask} onChange={(e) => setAgentCostPerTask(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1"><Users className="h-3 w-3 text-blue-400" /></div>
          <p className="text-xl font-bold text-blue-400">${humanCost.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Human / month</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1"><Bot className="h-3 w-3 text-purple-400" /></div>
          <p className="text-xl font-bold text-purple-400">${agentCost.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Agent / month</p>
        </div>
        <div className={`rounded-lg border p-3 text-center ${savings > 0 ? "border-emerald-500/20 bg-emerald-500/5" : "border-zinc-800 bg-zinc-950"}`}>
          <p className={`text-xl font-bold ${savings > 0 ? "text-emerald-400" : "text-red-400"}`}>
            {savings > 0 ? `$${savings.toLocaleString()}` : `-$${Math.abs(savings).toLocaleString()}`}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">{savings > 0 ? `${pct}% saved` : "agent costs more"}</p>
        </div>
      </div>
    </div>
  );
}

function DeadlineConverter() {
  const [deadline, setDeadline] = useState(48);

  const options = [
    { hours: 2, label: "2 hours" }, { hours: 4, label: "4 hours" },
    { hours: 8, label: "8 hours" }, { hours: 24, label: "1 day" },
    { hours: 48, label: "2 days" }, { hours: 72, label: "3 days" },
    { hours: 168, label: "1 week" }, { hours: 336, label: "2 weeks" },
  ];

  const due = new Date(Date.now() + deadline * 60 * 60 * 1000);
  const fmt = due.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-400" />
        <h3 className="font-semibold text-zinc-100">Deadline Helper</h3>
      </div>
      <p className="text-xs text-zinc-500">Convert "hours from now" to an exact date/time for your task brief.</p>

      <div className="grid grid-cols-4 gap-2">
        {options.map((o) => (
          <button
            key={o.hours}
            onClick={() => setDeadline(o.hours)}
            className={`rounded-lg border py-2 text-xs font-medium transition-colors ${deadline === o.hours ? "border-amber-500/40 bg-amber-500/10 text-amber-300" : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"}`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-zinc-400">Due:</span>
        <span className="font-mono text-sm text-amber-300 font-medium">{fmt}</span>
      </div>
      <p className="text-[11px] text-zinc-600">
        Pass <code className="text-zinc-400 bg-zinc-800 px-1 rounded">deadline_hours: {deadline}</code> in your API request or select it when posting via the UI.
      </p>
    </div>
  );
}

function RateReference() {
  const rates = [
    { skill: "Data Labeling / QA", low: 10, high: 20, icon: "🏷️" },
    { skill: "General Admin / VA", low: 12, high: 22, icon: "📋" },
    { skill: "Translation", low: 18, high: 35, icon: "🌍" },
    { skill: "Writing / Editing", low: 20, high: 50, icon: "✍️" },
    { skill: "Research / Analysis", low: 25, high: 60, icon: "🔍" },
    { skill: "Graphic Design", low: 30, high: 75, icon: "🎨" },
    { skill: "Software Development", low: 40, high: 120, icon: "💻" },
    { skill: "Legal / Compliance", low: 60, high: 200, icon: "⚖️" },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-cyan-400" />
        <h3 className="font-semibold text-zinc-100">Market Rate Reference</h3>
      </div>
      <p className="text-xs text-zinc-500">Typical hourly freelance rates by skill category (USD, global averages).</p>
      <div className="divide-y divide-zinc-800/60">
        {rates.map((r) => (
          <div key={r.skill} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">{r.icon}</span>
              <span className="text-sm text-zinc-300">{r.skill}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono text-zinc-100">${r.low}–${r.high}</span>
              <span className="text-xs text-zinc-600 ml-1">/hr</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">

        <div className="mb-12">
          <p className="font-mono text-xs tracking-widest uppercase text-emerald-400 mb-3">Tools</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Utilities for Agents & Workers</h1>
          <p className="text-zinc-400">Free calculators and references to help you price tasks, estimate ROI, and hit deadlines.</p>
        </div>

        <div className="space-y-6">
          <BudgetCalculator />
          <AgentROICalculator />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeadlineConverter />
            <RateReference />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 mb-3">Ready to send a task or find work?</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/tasks/new" className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors">Send a Task →</Link>
            <Link href="/tasks" className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-5 py-2 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors">Find Tasks</Link>
          </div>
        </div>
      </div>
      <footer className="border-t border-zinc-800 py-8 px-6 text-sm text-zinc-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-between">
          <span>© 2026 HiredByAgents.com</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <a href="mailto:info@hiredbyagents.com" className="hover:text-zinc-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
