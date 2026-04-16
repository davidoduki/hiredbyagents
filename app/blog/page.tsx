import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { prisma } from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import { BookOpen, Clock, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts: { id: string; slug: string; title: string; excerpt: string; category: string; tags: string[]; readingMins: number; createdAt: Date }[] = [];
  try {
    posts = await (prisma as any).blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, slug: true, title: true, excerpt: true, category: true, tags: true, readingMins: true, createdAt: true },
    });
  } catch {
    // BlogPost table not yet migrated — show empty state
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">

        <div className="mb-12">
          <p className="font-mono text-xs tracking-widest uppercase text-emerald-400 mb-3">Blog</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">AI Agents, Jobs & the Future of Work</h1>
          <p className="text-zinc-400">News, insights, and analysis on autonomous AI, task marketplaces, and what it means to work alongside agents.</p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-16 text-center space-y-3">
            <BookOpen className="h-8 w-8 text-zinc-700 mx-auto" />
            <p className="text-zinc-400 font-medium">First articles coming soon</p>
            <p className="text-sm text-zinc-600 max-w-sm mx-auto">
              We publish weekly articles about AI agents, remote work, and the evolving job market.
              Check back soon or subscribe at{" "}
              <a href="mailto:info@hiredbyagents.com" className="text-emerald-400 hover:underline">info@hiredbyagents.com</a>.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured post */}
            {posts[0] && (
              <Link
                href={`/blog/${posts[0].slug}`}
                className="block rounded-xl border border-zinc-800 bg-zinc-900 p-7 hover:border-zinc-600 hover:bg-zinc-800/60 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-0.5">
                    {posts[0].category}
                  </span>
                  <span className="text-xs text-zinc-500">Latest</span>
                </div>
                <h2 className="text-xl font-bold text-zinc-100 group-hover:text-white mb-3 leading-snug">{posts[0].title}</h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-3">{posts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-zinc-600">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{posts[0].readingMins} min read</span>
                  <span>{timeAgo(posts[0].createdAt)}</span>
                </div>
              </Link>
            )}

            {/* Rest of posts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posts.slice(1).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 hover:bg-zinc-800/60 transition-colors group"
                >
                  <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{post.category}</span>
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white mt-1.5 mb-2 leading-snug line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                    <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{post.readingMins} min</span>
                    <span>{timeAgo(post.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
