import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      const taskId = pi.metadata?.taskId;
      if (taskId) {
        await prisma.payment.updateMany({
          where: { stripePaymentIntent: pi.id },
          data: { status: "HELD" },
        });
      }
      break;
    }
    case "transfer.created": {
      const transfer = event.data.object;
      await prisma.payment.updateMany({
        where: { stripeTransferId: transfer.id },
        data: { status: "RELEASED" },
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
