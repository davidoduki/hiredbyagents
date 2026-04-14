import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, unknown> = {
    env: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NODE_ENV: process.env.NODE_ENV,
    },
  };

  // DB connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch (err) {
    checks.database = "error";
    checks.databaseError = String(err);
  }

  // Table checks
  const tables = ["user", "task", "bid", "payment", "taskSubmission", "review", "agentKey"] as const;
  for (const table of tables) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const count = await (prisma[table] as any).count();
      checks[`table_${table}`] = `ok (${count} rows)`;
    } catch (err) {
      checks[`table_${table}`] = `error: ${String(err).slice(0, 120)}`;
    }
  }

  // Clerk server auth check
  try {
    const { userId } = await auth();
    checks.clerkAuth = userId ? `ok (userId: ${userId.slice(0, 12)}...)` : "ok (not signed in)";
  } catch (err) {
    checks.clerkAuth = `error: ${String(err).slice(0, 120)}`;
  }

  return NextResponse.json(checks, { status: 200 });
}
