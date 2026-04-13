"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { stripe, createPaymentIntent, releasePayment, onboardWorker } from "@/lib/stripe";
import { calculateFees } from "@/lib/constants";

export async function fundTaskEscrow(taskId: string) {
  try {
    const user = await requireUser();

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignedTo: true, payment: true },
    });
    if (!task) return { error: "Task not found." };
    if (task.posterId !== user.id) return { error: "Not authorized." };
    if (!task.assignedToId) return { error: "Task must be assigned before funding." };
    if (task.payment) return { error: "Task already has an escrow payment." };

    const budgetCents = Math.round(Number(task.budget) * 100);
    const { platformFee, workerPayout } = calculateFees(budgetCents);

    const paymentIntent = await createPaymentIntent(budgetCents, taskId);

    await prisma.payment.create({
      data: {
        taskId,
        payerId: user.id,
        payeeId: task.assignedToId,
        amount: task.budget,
        platformFee: platformFee / 100,
        stripePaymentIntent: paymentIntent.id,
        status: "HELD",
      },
    });

    return { clientSecret: paymentIntent.client_secret, platformFee, workerPayout };
  } catch (err) {
    console.error("fundTaskEscrow error:", err);
    return { error: "Failed to create escrow payment." };
  }
}

export async function releaseTaskPayment(taskId: string) {
  try {
    const user = await requireUser();

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { payment: true, assignedTo: true },
    });
    if (!task) return { error: "Task not found." };
    if (task.posterId !== user.id) return { error: "Not authorized." };
    if (!task.payment) return { error: "No payment found for this task." };
    if (task.payment.status !== "HELD") return { error: "Payment is not held." };
    if (!task.assignedTo?.stripeAccountId) return { error: "Worker has no connected Stripe account." };

    const budgetCents = Math.round(Number(task.payment.amount) * 100);
    const platformFeeCents = Math.round(Number(task.payment.platformFee) * 100);

    const transfer = await releasePayment(
      task.payment.stripePaymentIntent!,
      task.assignedTo.stripeAccountId,
      budgetCents,
      platformFeeCents
    );

    await prisma.payment.update({
      where: { id: task.payment.id },
      data: {
        status: "RELEASED",
        stripeTransferId: transfer.id,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("releaseTaskPayment error:", err);
    return { error: "Failed to release payment." };
  }
}

export async function connectStripe() {
  try {
    const user = await requireUser();
    const { accountId, url } = await onboardWorker(user.id, user.email);

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeAccountId: accountId },
    });

    return { url };
  } catch (err) {
    console.error("connectStripe error:", err);
    return { error: "Failed to start Stripe onboarding." };
  }
}
