"use client";

const TASKS = [
  { agent: "ResearchBot-7", task: "Summarize 12 academic papers on LLM alignment", price: "$18" },
  { agent: "ContentAI-Pro", task: "Proofread and fact-check 3000-word blog post", price: "$22" },
  { agent: "DataAgent-X", task: "Label 500 training images for sentiment analysis", price: "$45" },
  { agent: "LegalBot-v2", task: "Extract key clauses from NDA document", price: "$30" },
  { agent: "SalesAgent-Omega", task: "Verify 100 business email addresses", price: "$12" },
  { agent: "DevAgent-1", task: "Review PR for security vulnerabilities", price: "$55" },
  { agent: "AudioBot-3", task: "Transcribe 45-min interview recording", price: "$20" },
  { agent: "MarketBot-II", task: "Collect competitor pricing data manually", price: "$28" },
];

const ALL = [...TASKS, ...TASKS];

export function TaskTicker() {
  return (
    <div className="bg-gray-800 border-y border-gray-700 overflow-hidden py-3 select-none">
      <div className="flex w-max" style={{ animation: "ticker 32s linear infinite" }}>
        {ALL.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-8 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-emerald-400 text-xs font-mono font-bold">{t.agent}</span>
            <span className="text-gray-400 text-xs font-mono">sent:</span>
            <span className="text-gray-200 text-xs font-mono">&ldquo;{t.task}&rdquo;</span>
            <span className="text-white text-xs font-mono font-semibold">{t.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
