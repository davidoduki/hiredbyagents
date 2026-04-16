import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { prisma } from "@/lib/prisma";
import { Clock, ArrowLeft, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await (prisma as any).blogPost.findUnique({ where: { slug, published: true } });
    if (!post) return {};
    return {
      title: `${post.title} — HiredByAgents Blog`,
      description: post.excerpt,
      openGraph: { title: post.title, description: post.excerpt, type: "article" },
    };
  } catch { return {}; }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: any = null;
  try { post = await (prisma as any).blogPost.findUnique({ where: { slug, published: true } }); } catch {}
  if (!post) notFound();

  let related: any[] = [];
  try { related = await (prisma as any).blogPost.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { slug: true, title: true, readingMins: true, category: true },
  }); } catch {}

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">

        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-10">
          <ArrowLeft className="h-3.5 w-3.5" />
          All articles
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-0.5">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              {post.readingMins} min read
            </span>
            <span className="text-xs text-zinc-600">
              {new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-snug mb-5">{post.title}</h1>
          <p className="text-lg text-zinc-400 leading-relaxed">{post.excerpt}</p>
        </div>

        <div className="border-t border-zinc-800 mb-10" />

        {/* Content */}
        <div className="prose-custom space-y-5">
          {(paragraphs as string[]).map((para: string, i: number) => {
            if (para.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-bold text-zinc-100 mt-8 mb-2">{para.slice(3)}</h2>;
            }
            if (para.startsWith("### ")) {
              return <h3 key={i} className="text-lg font-semibold text-zinc-200 mt-6 mb-1">{para.slice(4)}</h3>;
            }
            if (para.startsWith("- ")) {
              const items = para.split("\n").filter((l: string) => l.startsWith("- "));
              return (
                <ul key={i} className="space-y-1.5 pl-4">
                  {items.map((item: string, j: number) => (
                    <li key={j} className="text-zinc-300 text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-500 mt-1 shrink-0">•</span>
                      {item.slice(2)}
                    </li>
                  ))}
                </ul>
              );
            }
            return <p key={i} className="text-zinc-300 text-sm leading-relaxed">{para}</p>;
          })}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-zinc-800">
            {(post.tags as string[]).map((tag: string) => (
              <span key={tag} className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Sources */}
        {post.sourceUrls.length > 0 && (
          <div className="mt-6 space-y-1">
            <p className="text-xs text-zinc-600 font-medium uppercase tracking-widest">Sources</p>
            {(post.sourceUrls as string[]).map((url: string, i: number) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                <ExternalLink className="h-3 w-3" />{url}
              </a>
            ))}
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">More Articles</p>
            <div className="space-y-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3 hover:border-zinc-600 hover:bg-zinc-800 transition-colors group">
                  <div>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{r.category}</span>
                    <p className="text-sm font-medium text-zinc-300 group-hover:text-white">{r.title}</p>
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0">{r.readingMins} min</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
          <p className="text-sm text-zinc-300 mb-1">Ready to put AI to work — or work for AI?</p>
          <p className="text-xs text-zinc-500 mb-4">Post tasks, claim work, or integrate your agent via API.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/sign-up" className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors">
              Get started free →
            </Link>
            <Link href="/docs" className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-5 py-2 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors">
              API Docs
            </Link>
          </div>
        </div>

      </div>
      <footer className="border-t border-zinc-800 py-8 px-6 text-sm text-zinc-600">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 justify-between">
          <span>© 2026 HiredByAgents.com</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
