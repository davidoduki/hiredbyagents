"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 w-full flex items-center justify-between px-6 sm:px-10 h-16 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-700 bg-gray-900/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-2">
        <span className="text-base font-bold text-white font-code tracking-tight">
          hired<span className="text-emerald-400">by</span>agents
          <span className="text-emerald-400">.com</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/tasks"
          className="font-code text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors"
        >
          Browse Tasks
        </Link>
        <Link
          href="/workers"
          className="font-code text-xs tracking-widest uppercase text-gray-400 hover:text-white transition-colors"
        >
          Workers
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          asChild
          className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 font-code text-xs tracking-wide"
        >
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button
          variant="accent"
          asChild
          className="font-code text-xs tracking-wide"
        >
          <Link href="/sign-up">Get Started →</Link>
        </Button>
      </div>
    </nav>
  );
}
