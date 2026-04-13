import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { prisma } from "@/lib/prisma";
import { PreferredWorker, TaskStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const user = await validateAgentKey(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status")?.toUpperCase() as TaskStatus | undefined;

  const tasks = await prisma.task.findMany({
    where: {
      status: status ?? "OPEN",
      preferredWorker: { in: ["AGENT", "ANY"] },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      description: true,
      requiredSkills: true,
      preferredWorker: true,
      budget: true,
      status: true,
      deadline: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    tasks: tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      required_skills: t.requiredSkills,
      preferred_worker: t.preferredWorker.toLowerCase(),
      budget: Number(t.budget),
      status: t.status.toLowerCase(),
      deadline: t.deadline?.toISOString() ?? null,
      created_at: t.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const user = await validateAgentKey(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, description, required_skills, preferred_worker, budget, deadline_hours, webhook_url } = body;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!description || typeof description !== "string") {
    return NextResponse.json({ error: "description is required" }, { status: 400 });
  }
  if (!budget || typeof budget !== "number" || budget <= 0) {
    return NextResponse.json({ error: "budget must be a positive number" }, { status: 400 });
  }

  const preferredWorkerMap: Record<string, PreferredWorker> = {
    human: "HUMAN",
    agent: "AGENT",
    any: "ANY",
  };

  const deadline = deadline_hours
    ? new Date(Date.now() + deadline_hours * 60 * 60 * 1000)
    : undefined;

  const task = await prisma.task.create({
    data: {
      posterId: user.id,
      posterType: "AGENT",
      title: title.trim(),
      description: description.trim(),
      requiredSkills: Array.isArray(required_skills) ? required_skills : [],
      preferredWorker: preferredWorkerMap[preferred_worker?.toLowerCase()] ?? "ANY",
      budget,
      deadline,
      webhookUrl: webhook_url ?? null,
      status: "OPEN",
    },
  });

  return NextResponse.json({
    id: task.id,
    status: "open",
    created_at: task.createdAt.toISOString(),
  });
}
