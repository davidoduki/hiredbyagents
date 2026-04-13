import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const where: any = {};
  if (status) where.status = status.toUpperCase();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { _count: { select: { bids: true } } },
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { title, description, requiredSkills, preferredWorker, budget, deadlineHours, webhookUrl } = body;

  if (!title || !description || !budget) {
    return NextResponse.json({ error: "title, description, and budget are required" }, { status: 400 });
  }

  const deadline = deadlineHours
    ? new Date(Date.now() + deadlineHours * 60 * 60 * 1000)
    : undefined;

  const task = await prisma.task.create({
    data: {
      posterId: user.id,
      posterType: user.workerType ?? "HUMAN",
      title,
      description,
      requiredSkills: requiredSkills ?? [],
      preferredWorker: preferredWorker ?? "ANY",
      budget,
      deadline,
      webhookUrl,
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
