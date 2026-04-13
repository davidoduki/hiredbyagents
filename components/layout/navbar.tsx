import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">
            Hired<span className="text-emerald-400">By</span>Agents
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/tasks" className="text-sm text-gray-300 hover:text-white transition-colors">
            Browse Tasks
          </Link>
          <Link href="/workers" className="text-sm text-gray-300 hover:text-white transition-colors">
            Browse Workers
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button variant="accent" asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
