import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const RSS_FEEDS = [
  "https://techcrunch.com/category/artificial-intelligence/feed/",
  "https://venturebeat.com/category/ai/feed/",
  "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
  "https://feeds.feedburner.com/oreilly/radar",
];

interface RSSItem {
  title: string;
  description: string;
  link: string;
}

async function fetchRSSItems(feedUrl: string): Promise<RSSItem[]> {
  try {
    const res = await fetch(feedUrl, {
      headers: { "User-Agent": "HiredByAgents-BlogBot/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items: RSSItem[] = [];

    // Extract <item> blocks
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(xml)) !== null && items.length < 8) {
      const block = itemMatch[1];

      const titleMatch = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
      const descMatch = block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
      const linkMatch = block.match(/<link>([^<]+)<\/link>/) || block.match(/<link\s[^>]*href="([^"]+)"/);

      const title = titleMatch?.[1]?.trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      const description = descMatch?.[1]?.trim().replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").slice(0, 300);
      const link = linkMatch?.[1]?.trim();

      if (title && title.length > 20 && link) {
        items.push({ title, description: description ?? "", link });
      }
    }
    return items;
  } catch {
    return [];
  }
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function estimateReadingTime(text: string): number {
  return Math.max(3, Math.round(text.split(/\s+/).length / 200));
}

function extractTags(content: string, title: string): string[] {
  const tagMap: Record<string, string[]> = {
    "ai agents": ["ai-agents", "automation"],
    "autonomous": ["autonomous-ai", "ai-agents"],
    "llm": ["llm", "language-models"],
    "gpt": ["chatgpt", "llm"],
    "langchain": ["langchain", "ai-tools"],
    "freelance": ["freelancing", "future-of-work"],
    "remote work": ["remote-work", "future-of-work"],
    "automation": ["automation", "future-of-work"],
    "job": ["jobs", "employment"],
    "workforce": ["workforce", "future-of-work"],
    "task": ["task-management", "productivity"],
  };

  const lower = (content + " " + title).toLowerCase();
  const found = new Set<string>();
  for (const [keyword, tags] of Object.entries(tagMap)) {
    if (lower.includes(keyword)) tags.forEach((t) => found.add(t));
  }
  return Array.from(found).slice(0, 6);
}

export async function GET(req: NextRequest) {
  // Verify cron secret — call with ?secret=YOUR_CRON_SECRET or x-cron-secret header
  const secret = req.nextUrl.searchParams.get("secret") || req.headers.get("x-cron-secret");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 503 });
  }

  // Fetch news headlines from all feeds
  const allItems: RSSItem[] = [];
  await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const items = await fetchRSSItems(feed);
      allItems.push(...items);
    })
  );

  if (allItems.length === 0) {
    return NextResponse.json({ error: "No news items fetched" }, { status: 503 });
  }

  // Get slugs of recently published posts to avoid duplicates
  const recentPosts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { title: true },
  });
  const recentTitles = recentPosts.map((p) => p.title.toLowerCase());

  // Pick headlines we haven't covered — filter to AI/work related
  const relevant = allItems.filter((item) => {
    const t = item.title.toLowerCase();
    const isRelevant = /agent|ai|gpt|llm|automat|work|job|employ|task|labor|freelanc|robot|model|openai|anthropic|claude/.test(t);
    const isNew = !recentTitles.some((rt) => rt.includes(t.slice(0, 40)));
    return isRelevant && isNew;
  });

  if (relevant.length === 0) {
    return NextResponse.json({ message: "No new relevant news items found", fetched: allItems.length });
  }

  // Take up to 5 headlines for context
  const headlines = relevant.slice(0, 5);
  const headlineText = headlines.map((h, i) => `${i + 1}. "${h.title}" — ${h.description}`).join("\n");
  const sources = headlines.map((h) => h.link);

  // Generate article with Claude
  const client = new Anthropic();
  const prompt = `You are writing a blog article for HiredByAgents.com in the voice and style of Nick Foulkes — the British cultural journalist and author known for his work in The Wall Street Journal, Harper's Bazaar, and Esquire. His hallmarks: elegant, leisurely sentences that meander pleasurably before arriving somewhere sharp; a light, dry wit deployed without fanfare; unexpected cultural and historical digressions (a Victorian inventor, a line from Proust, a half-remembered film) that illuminate rather than decorate; concrete sensory detail over abstraction; no moralising, no cheerleading — only wry, informed observation.

Apply this voice to a technology-and-work subject drawn from these recent news headlines:

${headlineText}

Write a single original, cohesive article of exactly 800 words (±30 words). The article must:
- Have a punchy, SEO-friendly title under 70 characters
- Open with a scene, paradox, or historical aside — not a news summary
- Use 4–6 sections with ## headings (section titles may be wry or literary)
- Address what the AI agent economy means for people who work, hire, and get paid — without being breathless or alarmist
- Close with a quietly forward-looking observation, not a call to action
- Rewrite all information from the source headlines in original prose — no direct quotes, no plagiarism
- Do NOT mention HiredByAgents in the body (a CTA will be appended separately)

Return ONLY valid JSON — no markdown fences, no commentary before or after:
{
  "title": "...",
  "excerpt": "One or two sentence summary, under 160 characters, for the meta description.",
  "category": "AI & Work",
  "content": "Full 800-word article body. Use ## for section headings. Separate all paragraphs and headings with a blank line (\\n\\n). No HTML tags."
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = message.content[0].type === "text" ? message.content[0].text : "";

  let parsed: { title: string; excerpt: string; category: string; content: string };
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json({ error: "Failed to parse Claude response", raw: rawText.slice(0, 200) }, { status: 500 });
  }

  const { title, excerpt, category, content } = parsed;
  if (!title || !content) {
    return NextResponse.json({ error: "Incomplete article data" }, { status: 500 });
  }

  // Build unique slug
  let slug = slugify(title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt: excerpt || content.slice(0, 155),
      content,
      category: category || "AI & Work",
      tags: extractTags(content, title),
      sourceUrls: sources,
      readingMins: estimateReadingTime(content),
      published: true,
    },
  });

  revalidatePath("/blog");

  return NextResponse.json({ success: true, slug: post.slug, title: post.title });
}

// DELETE — remove the most recently generated post (admin cleanup)
export async function DELETE(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret") || req.headers.get("x-cron-secret");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const latest = await prisma.blogPost.findFirst({ orderBy: { createdAt: "desc" } });
  if (!latest) return NextResponse.json({ deleted: null });

  await prisma.blogPost.delete({ where: { id: latest.id } });
  revalidatePath("/blog");

  return NextResponse.json({ deleted: latest.title });
}
