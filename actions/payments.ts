"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createPaymentIntent, releasePayment, onboardWorker } from "@/lib/stripe";
import { sendPaypalPayout } from "@/lib/paypal";
import { sendUsdcPayout, requestTestnetUsdcForPlatformWallet } from "@/lib/usdc";
import { calculateFees } from "@/lib/constants";

const ADMIN_EMAIL = "davidoduki@gmail.com";

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

    const worker = task.assignedTo;
    if (!worker) return { error: "No worker assigned to this task." };

    const budgetCents = Math.round(Number(task.payment.amount) * 100);
    const platformFeeCents = Math.round(Number(task.payment.platformFee) * 100);
    const workerPayoutCents = budgetCents - platformFeeCents;
    const workerPayoutUsd = workerPayoutCents / 100;

    // Route 1: PayPal (primary — simple email, no onboarding)
    if (worker.paypalEmail) {
      const payout = await sendPaypalPayout({
        recipientEmail: worker.paypalEmail,
        amountUsd: workerPayoutUsd,
        taskId,
      });

      await prisma.payment.update({
        where: { id: task.payment.id },
        data: {
          status: "RELEASED",
          paypalBatchId: payout.batchId,
          payoutMethod: "PAYPAL",
        },
      });

      return { success: true, method: "paypal" };
    }

    // Route 2: Stripe Connect (optional, for power users with bank transfer)
    if (worker.stripeAccountId) {
      const transfer = await releasePayment(
        task.payment.stripePaymentIntent!,
        worker.stripeAccountId,
        budgetCents,
        platformFeeCents
      );

      await prisma.payment.update({
        where: { id: task.payment.id },
        data: {
          status: "RELEASED",
          stripeTransferId: transfer.id,
          payoutMethod: "STRIPE",
        },
      });

      return { success: true, method: "stripe" };
    }

    // Route 3: USDC on-chain via Circle Programmable Wallets
    if (worker.walletAddress) {
      const payout = await sendUsdcPayout({
        recipientAddress: worker.walletAddress,
        amountUsd: workerPayoutUsd,
        taskId,
      });

      await prisma.payment.update({
        where: { id: task.payment.id },
        data: {
          status: "RELEASED",
          payoutMethod: "CRYPTO",
          cryptoTxId: payout.transactionId,
        },
      });

      return { success: true, method: "crypto" };
    }

    return {
      error:
        "Worker has no payout method configured. Ask them to add a PayPal email or wallet address in their settings.",
    };
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

export async function requestTestUsdcFaucet() {
  try {
    const user = await requireUser();
    if (user.email !== ADMIN_EMAIL) return { error: "Not authorized." };
    const result = await requestTestnetUsdcForPlatformWallet();
    return { success: true, address: result.address };
  } catch (err) {
    console.error("requestTestUsdcFaucet error:", err);
    const msg = String((err as Error)?.message ?? err);
    if (msg.toLowerCase().includes("mainnet") || msg.toLowerCase().includes("production")) {
      return { error: "Faucet is only available on testnet/sandbox." };
    }
    return { error: `Faucet failed: ${msg.slice(0, 120)}` };
  }
}
