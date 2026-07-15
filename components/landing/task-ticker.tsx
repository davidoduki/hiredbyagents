"use client";

const TASKS = [
  { task: "Merchant KYB site visit", place: "Lagos", price: "$49" },
  { task: "Collateral check — vehicle & shop stock", place: "Nairobi", price: "$99" },
  { task: "Supplier warehouse audit", place: "Guangzhou", price: "$199" },
  { task: "Retail shelf audit — 12 stores", place: "London", price: "$99/store" },
  { task: "Business address verification", place: "NYC", price: "$49" },
  { task: "Property condition report", place: "Amsterdam", price: "$99" },
  { task: "Vendor onboarding verification", place: "Accra", price: "$49" },
  { task: "Inventory count & SKU check", place: "Dubai", price: "$99" },
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
            <span className="text-gray-200 text-xs font-mono">{t.task}</span>
            <span className="text-emerald-400 text-xs font-mono">· {t.place}</span>
            <span className="text-white text-xs font-mono font-semibold">from {t.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
