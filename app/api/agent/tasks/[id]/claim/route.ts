import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateAgentKey(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  if (task.status !== "OPEN") {
    return NextResponse.json({ error: "Task is not open" }, { status: 409 });
  }
  if (task.posterId === user.id) {
    return NextResponse.json({ error: "Cannot claim your own task" }, { status: 400 });
  }
  if (task.preferredWorker === "HUMAN") {
    return NextResponse.json({ error: "Task requires a human worker" }, { status: 403 });
  }

  await prisma.task.update({
    where: { id },
    data: {
      assignedToId: user.id,
      status: TaskStatus.ASSIGNED,
      assignedAt: new Date(),
    },
  });

  // Fire webhook if poster has one
  if (task.webhookUrl) {
    fetch(task.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "task.assigned",
        task_id: id,
        task: { id, status: "assigned" },
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, task_id: id, status: "assigned" });
}
