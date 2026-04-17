import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { prisma } from "@/lib/prisma";
import { PreferredWorker } from "@prisma/client";

const MAX_BATCH = 50;

interface TaskInput {
  title: string;
  description: string;
  budget: number;
  required_skills?: string[];
  preferred_worker?: string;
  deadline_hours?: number;
  webhook_url?: string;
}

const workerMap: Record<string, PreferredWorker> = {
  human: "HUMAN",
  agent: "AGENT",
  any: "ANY",
};

export async function POST(req: NextRequest) {
  const auth = await validateAgentKey(req, "tasks:write");
  if (!auth.ok) return auth.response;
  const { user } = auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Request body must be an array of tasks" }, { status: 400 });
  }

  if (body.length === 0) {
    return NextResponse.json({ error: "tasks array is empty" }, { status: 400 });
  }

  if (body.length > MAX_BATCH) {
    return NextResponse.json({ error: `Maximum ${MAX_BATCH} tasks per batch` }, { status: 400 });
  }

  const results: Array<{ index: number; id?: string; created_at?: string; error?: string }> = [];

  for (let i = 0; i < body.length; i++) {
    const item = body[i] as TaskInput;

    if (!item.title || typeof item.title !== "string") {
      results.push({ index: i, error: "title is required" });
      continue;
    }
    if (!item.description || typeof item.description !== "string") {
      results.push({ index: i, error: "description is required" });
      continue;
    }
    if (!item.budget || typeof item.budget !== "number" || item.budget <= 0) {
      results.push({ index: i, error: "budget must be a positive number" });
      continue;
    }

    try {
      const deadline = item.deadline_hours
        ? new Date(Date.now() + item.deadline_hours * 60 * 60 * 1000)
        : undefined;

      const task = await prisma.task.create({
        data: {
          posterId: user.id,
          posterType: "AGENT",
          title: item.title.trim(),
          description: item.description.trim(),
          requiredSkills: Array.isArray(item.required_skills) ? item.required_skills : [],
          preferredWorker: workerMap[item.preferred_worker?.toLowerCase() ?? ""] ?? "ANY",
          budget: item.budget,
          deadline,
          webhookUrl: item.webhook_url ?? null,
          status: "OPEN",
        },
      });

      results.push({ index: i, id: task.id, created_at: task.createdAt.toISOString() });
    } catch {
      results.push({ index: i, error: "Failed to create task" });
    }
  }

  const created = results.filter((r) => r.id);
  const failed = results.filter((r) => r.error);

  return NextResponse.json(
    { created: created.length, failed: failed.length, results },
    { status: failed.length === results.length ? 422 : 200 }
  );
}
