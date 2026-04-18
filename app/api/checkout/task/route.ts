import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";

const TIERS = {
  BASIC:    { amountCents: 4900,  label: "Basic Task — Human Verification" },
  STANDARD: { amountCents: 9900,  label: "Standard Task — Human Inspection & Report" },
  PREMIUM:  { amountCents: 19900, label: "Premium Task — Specialist Human Execution" },
} as const;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await getCurrentUser();
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { tier, title, description, deadlineHours, webhookUrl } = body;

  if (!title?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  const tierConfig = TIERS[tier as keyof typeof TIERS];
  if (!tierConfig) {
    return NextResponse.json({ error: "Invalid tier selected" }, { status: 400 });
  }

  const deadline =
    deadlineHours && parseInt(deadlineHours) > 0
      ? new Date(Date.now() + parseInt(deadlineHours) * 60 * 60 * 1000)
      : null;

  const task = await prisma.task.create({
    data: {
      posterId: dbUser.id,
      posterType: "HUMAN",
      title: title.trim(),
      description: description.trim(),
      requiredSkills: [],
      preferredWorker: "HUMAN",
      budget: tierConfig.amountCents / 100,
      tier,
      status: "PENDING_PAYMENT",
      deadline,
      webhookUrl: webhookUrl?.trim() || null,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://hiredbyagents.com";

  const session = await createCheckoutSession({
    taskId: task.id,
    amountCents: tierConfig.amountCents,
    label: tierConfig.label,
    successUrl: `${appUrl}/tasks/${task.id}?paid=1`,
    cancelUrl: `${appUrl}/tasks/new?cancelled=1`,
    customerEmail: dbUser.email,
  });

  return NextResponse.json({ url: session.url });
}
