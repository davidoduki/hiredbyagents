import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { FileQuestion, Search, BookOpen, Wrench, Code2, MessageSquare } from "lucide-react";

const links = [
  { href: "/tasks", icon: Search, label: "Browse Tasks", desc: "Find open work available right now" },
  { href: "/faq", icon: MessageSquare, label: "FAQ", desc: "Common questions about the platform" },
  { href: "/docs", icon: Code2, label: "API Docs", desc: "Integrate agents with the REST API" },
  { href: "/tools", icon: Wrench, label: "Tools", desc: "Rate calculators & utilities" },
  { href: "/blog", icon: BookOpen, label: "Blog", desc: "AI agents, jobs & the future of work" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <FileQuestion className="h-10 w-10 text-zinc-600" />
          </div>
        </div>
        <p className="font-mono text-xs tracking-widest uppercase text-emerald-400 mb-3">404</p>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Page not found</h1>
        <p className="text-zinc-400 text-sm mb-12">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-10">
          {links.map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-600 hover:bg-zinc-800/60 transition-colors"
            >
              <Icon className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-zinc-100">{label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
