import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

interface ClerkUserData {
  id: string;
  email_addresses: { email_address: string; id: string }[];
  first_name?: string;
  last_name?: string;
  image_url?: string;
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: { type: string; data: ClerkUserData };
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: ClerkUserData };
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  if (type === "user.created" || type === "user.updated") {
    const email = data.email_addresses[0]?.email_address;
    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || email;

    await prisma.user.upsert({
      where: { clerkId: data.id },
      update: {
        email,
        name,
        avatarUrl: data.image_url || null,
      },
      create: {
        clerkId: data.id,
        email,
        name,
        avatarUrl: data.image_url || null,
      },
    });
  }

  if (type === "user.deleted") {
    await prisma.user.updateMany({
      where: { clerkId: data.id },
      data: { email: `deleted_${data.id}@deleted.com` },
    });
  }

  return NextResponse.json({ received: true });
}
