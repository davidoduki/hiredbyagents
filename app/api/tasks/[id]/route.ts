import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      poster: { select: { id: true, name: true, rating: true, avatarUrl: true } },
      assignedTo: { select: { id: true, name: true, rating: true, avatarUrl: true } },
      _count: { select: { bids: true } },
    },
  });

  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ task });
}
