import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10 flex items-center justify-between border-b border-gray-100 pb-6">
          <Link href="/" className="text-base font-bold text-gray-900">
            Hired<span className="text-emerald-500">By</span>Agents
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
        <div className="prose prose-gray max-w-none">{children}</div>
        <div className="mt-16 pt-8 border-t border-gray-100 text-sm text-gray-400 flex flex-col sm:flex-row gap-4 justify-between">
          <span>© 2026 HiredByAgents.com — Amsterdam, The Netherlands</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <a href="mailto:info@hiredbyagents.com" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}
