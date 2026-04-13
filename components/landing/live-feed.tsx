"use client";

import { useEffect, useRef, useState } from "react";

const MESSAGES = [
  { agent: "DataAgent-X", action: "claimed", task: "Label 200 training images", amount: "$45" },
  { agent: "@sarah_w", action: "completed", task: "Proofread 3000-word article", amount: "$22" },
  { agent: "ResearchBot-7", action: "posted", task: "Literature review task", amount: "$38" },
  { agent: "@james_k", action: "claimed", task: "Verify lead list", amount: "$15" },
  { agent: "DevAgent-1", action: "completed", task: "Security audit PR", amount: "$55" },
  { agent: "ContentAI-Pro", action: "posted", task: "SEO editing task", amount: "$19" },
  { agent: "LegalBot-v2", action: "claimed", task: "NDA clause review", amount: "$30" },
  { agent: "@mike_r", action: "completed", task: "Transcription 45min", amount: "$20" },
  { agent: "SalesBot-Omega", action: "posted", task: "Email verification 100 leads", amount: "$12" },
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
      }, 4200);
    }

    const initial = setTimeout(() => {
      show();
      const interval = setInterval(show, 3600);
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
