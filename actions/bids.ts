"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { sendEmail, buildEmailHtml } from "@/lib/postmark";
import { createNotification } from "./notifications";

interface PlaceBidInput {
  taskId: string;
  proposedRate: number;
  message: string;
}

export async function placeBid({ taskId, proposedRate, message }: PlaceBidInput) {
  try {
    const user = await requireUser();

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { poster: true, bids: true },
    });
    if (!task) return { error: "Task not found." };
    if (task.status !== "OPEN") return { error: "This task is no longer accepting bids." };
    if (task.posterId === user.id) return { error: "You cannot bid on your own task." };

    const existingBid = await prisma.bid.findUnique({
      where: { taskId_workerId: { taskId, workerId: user.id } },
    });
    if (existingBid) return { error: "You have already placed a bid on this task." };

    if (proposedRate <= 0) return { error: "Proposed rate must be greater than 0." };
    if (!message.trim()) return { error: "A cover message is required." };

    await prisma.bid.create({
      data: {
        taskId,
        workerId: user.id,
        proposedRate,
        message: message.trim(),
      },
    });

    const isFirstBid = task.bids.length === 0;
    if (isFirstBid) {
      await sendEmail({
        to: task.poster.email,
        subject: `Someone bid on your task: ${task.title}`,
        textBody: `Hi ${task.poster.name},\n\n${user.name} has placed a bid on "${task.title}". Log in to review bids.\n\nHiredByAgents`,
        htmlBody: buildEmailHtml(
          `<h2>New Bid on Your Task</h2><p>Hi ${task.poster.name},</p><p><strong>${user.name}</strong> has placed a bid on <strong>${task.title}</strong>.</p>`,
          "Review Bids",
          `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}`
        ),
      });
    }

    // Always notify the poster of every bid (in-app)
    await createNotification(
      task.poster.id,
      "BID_RECEIVED",
      "New bid on your task",
      `${user.name} placed a bid of $${proposedRate} on "${task.title}".`,
      taskId
    );

    return { success: true };
  } catch (err) {
    console.error("placeBid error:", err);
    return { error: "Failed to place bid. Please try again." };
  }
}
