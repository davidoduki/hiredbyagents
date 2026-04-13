"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { PreferredWorker, TaskStatus } from "@prisma/client";
import { sendEmail, buildEmailHtml } from "@/lib/postmark";

interface CreateTaskInput {
  title: string;
  description: string;
  requiredSkills: string[];
  preferredWorker: string;
  budget: number;
  deadlineHours?: number;
  webhookUrl?: string;
}

export async function createTask(input: CreateTaskInput) {
  try {
    const user = await requireUser();

    if (!input.title?.trim()) return { error: "Title is required." };
    if (!input.description?.trim()) return { error: "Description is required." };
    if (!input.budget || input.budget <= 0) return { error: "Budget must be greater than 0." };

    const deadline = input.deadlineHours
      ? new Date(Date.now() + input.deadlineHours * 60 * 60 * 1000)
      : undefined;

    const task = await prisma.task.create({
      data: {
        posterId: user.id,
        posterType: user.workerType ?? "HUMAN",
        title: input.title.trim(),
        description: input.description.trim(),
        requiredSkills: input.requiredSkills,
        preferredWorker: (input.preferredWorker as PreferredWorker) ?? "ANY",
        budget: input.budget,
        deadline,
        webhookUrl: input.webhookUrl,
      },
    });

    return { taskId: task.id };
  } catch (err) {
    console.error("createTask error:", err);
    return { error: "Failed to create task. Please try again." };
  }
}

export async function updateTask(
  taskId: string,
  input: Partial<CreateTaskInput>
) {
  try {
    const user = await requireUser();

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return { error: "Task not found." };
    if (task.posterId !== user.id) return { error: "Not authorized." };
    if (task.status !== "OPEN") return { error: "Only open tasks can be edited." };

    const deadline =
      input.deadlineHours !== undefined
        ? new Date(Date.now() + input.deadlineHours * 60 * 60 * 1000)
        : undefined;

    await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(input.title && { title: input.title.trim() }),
        ...(input.description && { description: input.description.trim() }),
        ...(input.requiredSkills && { requiredSkills: input.requiredSkills }),
        ...(input.preferredWorker && { preferredWorker: input.preferredWorker as PreferredWorker }),
        ...(input.budget && { budget: input.budget }),
        ...(deadline && { deadline }),
      },
    });

    return { success: true };
  } catch (err) {
    console.error("updateTask error:", err);
    return { error: "Failed to update task." };
  }
}

export async function assignTask(taskId: string, workerId: string) {
  try {
    const user = await requireUser();

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { poster: true },
    });
    if (!task) return { error: "Task not found." };
    if (task.posterId !== user.id) return { error: "Not authorized." };
    if (task.status !== "OPEN") return { error: "Task is not open for assignment." };

    const worker = await prisma.user.findUnique({ where: { id: workerId } });
    if (!worker) return { error: "Worker not found." };

    await prisma.task.update({
      where: { id: taskId },
      data: {
        assignedToId: workerId,
        status: TaskStatus.ASSIGNED,
        assignedAt: new Date(),
      },
    });

    await sendEmail({
      to: worker.email,
      subject: `You've been assigned: ${task.title}`,
      textBody: `Hi ${worker.name},\n\nYou've been assigned to "${task.title}". Log in to view the task and get started.\n\nHiredByAgents`,
      htmlBody: buildEmailHtml(
        `<h2>You've been assigned a task</h2><p>Hi ${worker.name},</p><p>You've been assigned to <strong>${task.title}</strong>. Log in to view the task and get started.</p>`,
        "View Task",
        `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}`
      ),
    });

    return { success: true };
  } catch (err) {
    console.error("assignTask error:", err);
    return { error: "Failed to assign task." };
  }
}

export async function approveSubmission(taskId: string, submissionId: string) {
  try {
    const user = await requireUser();

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignedTo: true },
    });
    if (!task) return { error: "Task not found." };
    if (task.posterId !== user.id) return { error: "Not authorized." };
    if (task.status !== TaskStatus.REVIEW) return { error: "Task is not in review." };

    await prisma.$transaction([
      prisma.taskSubmission.update({
        where: { id: submissionId },
        data: { status: "APPROVED" },
      }),
      prisma.task.update({
        where: { id: taskId },
        data: {
          status: TaskStatus.COMPLETE,
          completedAt: new Date(),
        },
      }),
    ]);

    if (task.assignedTo) {
      await sendEmail({
        to: task.assignedTo.email,
        subject: "Work approved! Payment is on its way.",
        textBody: `Hi ${task.assignedTo.name},\n\nYour work on "${task.title}" has been approved! Payment is being processed.\n\nHiredByAgents`,
        htmlBody: buildEmailHtml(
          `<h2>Work Approved!</h2><p>Hi ${task.assignedTo.name},</p><p>Your work on <strong>${task.title}</strong> has been approved! Payment is being processed.</p>`,
          "View Task",
          `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}`
        ),
      });
    }

    return { success: true };
  } catch (err) {
    console.error("approveSubmission error:", err);
    return { error: "Failed to approve submission." };
  }
}

export async function rejectSubmission(
  taskId: string,
  submissionId: string,
  feedback: string
) {
  try {
    const user = await requireUser();

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignedTo: true },
    });
    if (!task) return { error: "Task not found." };
    if (task.posterId !== user.id) return { error: "Not authorized." };

    await prisma.$transaction([
      prisma.taskSubmission.update({
        where: { id: submissionId },
        data: { status: "REJECTED", feedback },
      }),
      prisma.task.update({
        where: { id: taskId },
        data: { status: TaskStatus.IN_PROGRESS },
      }),
    ]);

    if (task.assignedTo) {
      await sendEmail({
        to: task.assignedTo.email,
        subject: `Feedback on your submission: ${task.title}`,
        textBody: `Hi ${task.assignedTo.name},\n\nThe poster has reviewed your submission on "${task.title}" and provided feedback:\n\n"${feedback}"\n\nHiredByAgents`,
        htmlBody: buildEmailHtml(
          `<h2>Submission Feedback</h2><p>Hi ${task.assignedTo.name},</p><p>The poster has reviewed your work on <strong>${task.title}</strong>:</p><blockquote style="border-left:3px solid #e5e7eb;padding-left:12px;color:#6b7280;">${feedback}</blockquote>`,
          "View Task",
          `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}`
        ),
      });
    }

    return { success: true };
  } catch (err) {
    console.error("rejectSubmission error:", err);
    return { error: "Failed to reject submission." };
  }
}

export async function openDispute(taskId: string) {
  try {
    const user = await requireUser();

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { poster: true, assignedTo: true },
    });
    if (!task) return { error: "Task not found." };

    const isInvolved = task.posterId === user.id || task.assignedToId === user.id;
    if (!isInvolved) return { error: "Not authorized." };

    await prisma.task.update({
      where: { id: taskId },
      data: { status: TaskStatus.DISPUTED },
    });

    const emailTargets = [task.poster, task.assignedTo].filter(Boolean) as { email: string; name: string }[];
    for (const target of emailTargets) {
      await sendEmail({
        to: target.email,
        subject: `A dispute has been opened for: ${task.title}`,
        textBody: `A dispute has been opened for the task "${task.title}". Our team will review and reach out shortly.\n\nHiredByAgents`,
        htmlBody: buildEmailHtml(
          `<h2>Dispute Opened</h2><p>A dispute has been opened for <strong>${task.title}</strong>. Our team will review and reach out shortly.</p>`,
          "View Task",
          `${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}`
        ),
      });
    }

    return { success: true };
  } catch (err) {
    console.error("openDispute error:", err);
    return { error: "Failed to open dispute." };
  }
}
