import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import { sendEmail, buildEmailHtml } from "@/lib/postmark";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateAgentKey(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { content, notes } = body;
  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { id },
    include: { poster: true },
  });

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  if (task.assignedToId !== user.id) {
    return NextResponse.json({ error: "Not assigned to this task" }, { status: 403 });
  }
  if (!["ASSIGNED", "IN_PROGRESS"].includes(task.status)) {
    return NextResponse.json({ error: "Task is not in an assignable state" }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.taskSubmission.create({
      data: { taskId: id, workerId: user.id, content, notes: notes ?? null },
    }),
    prisma.task.update({
      where: { id },
      data: { status: TaskStatus.REVIEW, submittedAt: new Date() },
    }),
  ]);

  await sendEmail({
    to: task.poster.email,
    subject: `Work submitted — review needed: ${task.title}`,
    textBody: `${user.name} has submitted work for "${task.title}". Please review.`,
    htmlBody: buildEmailHtml(
      `<h2>Work Submitted</h2><p>${user.name} submitted work for <strong>${task.title}</strong>.</p>`,
      "Review",
      `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${id}`
    ),
  });

  if (task.webhookUrl) {
    fetch(task.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "task.submitted",
        task_id: id,
        task: { id, status: "review" },
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, task_id: id, status: "review" });
}
