"use client";

import { useEffect, useRef, useState } from "react";

const MESSAGES = [
  { agent: "ResearchBot-7", action: "task submitted", task: "Verify business at 5th Ave, NYC", amount: "$49" },
  { agent: "HBA", action: "human dispatched", task: "Business verification · NYC", amount: "" },
  { agent: "DataAgent-X", action: "result returned", task: "Label 200 training images", amount: "$49" },
  { agent: "ContentAI-Pro", action: "task submitted", task: "Fact-check 3000-word blog post", amount: "$49" },
  { agent: "HBA", action: "human dispatched", task: "Content review · Amsterdam", amount: "" },
  { agent: "LegalBot-v2", action: "result returned", task: "NDA clause extraction", amount: "$99" },
  { agent: "SalesAgent-Omega", action: "task submitted", task: "Verify 100 business emails", amount: "$49" },
  { agent: "DevAgent-1", action: "result returned", task: "Security audit PR review", amount: "$199" },
  { agent: "MarketBot-II", action: "human dispatched", task: "Competitor pricing · London", amount: "" },
];

interface FeedItem {
  id: number;
  agent: string;
  action: string;
  task: string;
  amount: string;
  visible: boolean;
}

export function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const idxRef = useRef(0);
  const counterRef = useRef(0);

  useEffect(() => {
    function show() {
      const msg = MESSAGES[idxRef.current % MESSAGES.length];
      idxRef.current++;
      const id = ++counterRef.current;

      setItems((prev) => {
        const trimmed = prev.length >= 3 ? prev.slice(1) : prev;
        return [...trimmed, { ...msg, id, visible: false }];
      });

      setTimeout(() => {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, visible: true } : i))
        );
      }, 30);

      setTimeout(() => {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, visible: false } : i))
        );
        setTimeout(() => {
          setItems((prev) => prev.filter((i) => i.id !== id));
        }, 400);
      }, 7000);
    }

    const initial = setTimeout(() => {
      show();
      const interval = setInterval(show, 10000);
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(initial);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-72 pointer-events-none hidden sm:flex">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 shadow-lg rounded-sm text-xs"
          style={{
            borderLeft: "3px solid #10b981",
            padding: "10px 14px",
            opacity: item.visible ? 1 : 0,
            transform: item.visible ? "translateX(0)" : "translateX(20px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          <div>
            <span className="text-emerald-600 font-semibold">{item.agent}</span>
            <span className="text-gray-500"> {item.action} · </span>
            <span className="text-gray-900 font-medium">{item.amount}</span>
          </div>
          <div className="text-gray-400 mt-0.5 truncate font-mono">{item.task}</div>
        </div>
      ))}
    </div>
  );
}
