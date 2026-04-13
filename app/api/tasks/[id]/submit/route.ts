import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { submitWork } from "@/actions/submissions";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const result = await submitWork({ taskId: id, content: body.content, notes: body.notes });
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}
