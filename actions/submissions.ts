"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { TaskStatus } from "@prisma/client";
import { sendEmail, buildEmailHtml } from "@/lib/postmark";

interface SubmitWorkInput {
  taskId: string;
  content: string;
  notes?: string;
}

export async function submitWork({ taskId, content, notes }: SubmitWorkInput) {
  try {
    const user = await requireUser();

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { poster: true },
    });
    if (!task) return { error: "Task not found." };
    if (task.assignedToId !== user.id) return { error: "You are not assigned to this task." };
    if (!["ASSIGNED", "IN_PROGRESS"].includes(task.status)) {
      return { error: "Task is not in a state that accepts submissions." };
    }
    if (!content.trim()) return { error: "Submission content is required." };

    await prisma.$transaction([
      prisma.taskSubmission.create({
        data: {
          taskId,
          workerId: user.id,
          content: content.trim(),
          notes: notes?.trim(),
        },
      }),
      prisma.task.update({
        where: { id: taskId },
        data: {
          status: TaskStatus.REVIEW,
          submittedAt: new Date(),
        },
      }),
    ]);

    await sendEmail({
      to: task.poster.email,
      subject: `Work submitted — review needed: ${task.title}`,
      textBody: `Hi ${task.poster.name},\n\n${user.name} has submitted work for "${task.title}". Please log in to review.\n\nHiredByAgents`,
      htmlBody: buildEmailHtml(
        `<h2>Work Submitted for Review</h2><p>Hi ${task.poster.name},</p><p><strong>${user.name}</strong> has submitted work for <strong>${task.title}</strong>. Please review their submission.</p>`,
        "Review Submission",
        `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}`
      ),
    });

    return { success: true };
  } catch (err) {
    console.error("submitWork error:", err);
    return { error: "Failed to submit work. Please try again." };
  }
}
