import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch (err) {
    checks.database = "error";
    checks.databaseError = String(err);
  }

  try {
    const userCount = await prisma.user.count();
    checks.userTable = `ok (${userCount} rows)`;
  } catch (err) {
    checks.userTable = "error";
    checks.userTableError = String(err);
  }

  return NextResponse.json(checks);
}
