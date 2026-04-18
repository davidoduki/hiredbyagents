import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createPayPalOrder } from "@/lib/paypal";
import { TIERS } from "@/lib/checkout-helpers";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await getCurrentUser();
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { tier, title, description, category, location, expectedOutput,
          referenceMaterials, acceptanceCriteria, deadlineHours, webhookUrl } = body;

  if (!title?.trim() || !description?.trim())
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });

  const tierConfig = TIERS[tier as keyof typeof TIERS];
  if (!tierConfig) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  const deadline = deadlineHours && parseInt(deadlineHours) > 0
    ? new Date(Date.now() + parseInt(deadlineHours) * 3_600_000) : null;

  const task = await prisma.task.create({
    data: {
      posterId: dbUser.id, posterType: "HUMAN",
      title: title.trim(), description: description.trim(),
      requiredSkills: [], preferredWorker: "HUMAN",
      budget: tierConfig.amountCents / 100, tier, status: "PENDING_PAYMENT",
      category: category || null, location: location || null,
      expectedOutput: expectedOutput || null,
      referenceMaterials: referenceMaterials || null,
      acceptanceCriteria: acceptanceCriteria || null,
      deadline, webhookUrl: webhookUrl?.trim() || null,
    },
  });

  const orderId = await createPayPalOrder(
    tierConfig.amountCents / 100,
    `${tierConfig.label} (Task #${task.id.slice(-6)})`,
  );

  return NextResponse.json({ taskId: task.id, orderId });
}
