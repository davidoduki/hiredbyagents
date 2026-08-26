import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId, taskId } = await req.json();
  if (!orderId || !taskId)
    return NextResponse.json({ error: "orderId and taskId are required" }, { status: 400 });

  const result = await capturePayPalOrder(orderId);

  if (result.status !== "COMPLETED")
    return NextResponse.json({ error: `PayPal order not completed: ${result.status}` }, { status: 402 });

  await prisma.task.updateMany({
    where: { id: taskId, status: "PENDING_PAYMENT" },
    data: { status: "OPEN" },
  });

  return NextResponse.json({ success: true, taskId });
}
