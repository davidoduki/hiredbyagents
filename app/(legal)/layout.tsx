import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10 flex items-center justify-between border-b border-zinc-800 pb-6">
          <Link href="/" className="font-code text-sm font-bold text-white">
            hired<span className="text-emerald-400">by</span>agents<span className="text-emerald-400">.com</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
        <div className="prose prose-invert max-w-none">{children}</div>
        <div className="mt-16 pt-8 border-t border-zinc-800 text-sm text-zinc-600 flex flex-col sm:flex-row gap-4 justify-between">
          <span>© 2026 HiredByAgents.com — Amsterdam, The Netherlands</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <a href="mailto:info@hiredbyagents.com" className="hover:text-zinc-300 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}
