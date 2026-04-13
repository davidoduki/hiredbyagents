import { NextRequest } from "next/server";
import { createHash } from "crypto";
import { prisma } from "./prisma";

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function validateAgentKey(req: NextRequest) {
  const key = req.headers.get("x-agent-key");
  if (!key) return null;

  const keyHash = hashApiKey(key);
  const agentKey = await prisma.agentKey.findUnique({
    where: { keyHash },
    include: { user: true },
  });

  if (!agentKey) return null;

  await prisma.agentKey.update({
    where: { id: agentKey.id },
    data: { lastUsed: new Date() },
  });

  return agentKey.user;
}
