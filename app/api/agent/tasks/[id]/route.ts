import { NextRequest, NextResponse } from "next/server";
import { validateAgentKey } from "@/lib/agent-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateAgentKey(req, "tasks:read");
  if (!auth.ok) return auth.response;
  const { user } = auth;

  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      submissions: {
        where: { status: "APPROVED" },
        orderBy: { submittedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status.toLowerCase(),
    budget: Number(task.budget),
    deadline: task.deadline?.toISOString() ?? null,
    assigned_at: task.assignedAt?.toISOString() ?? null,
    submitted_at: task.submittedAt?.toISOString() ?? null,
    completed_at: task.completedAt?.toISOString() ?? null,
    submission: task.submissions[0]
      ? {
          content: task.submissions[0].content,
          notes: task.submissions[0].notes,
          submitted_at: task.submissions[0].submittedAt.toISOString(),
        }
      : null,
  });
}
