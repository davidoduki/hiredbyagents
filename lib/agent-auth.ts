import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "./prisma";
import { checkRateLimit } from "./rate-limit";
import type { User } from "@prisma/client";

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export type AgentAuthResult =
  | { ok: true; user: User }
  | { ok: false; response: NextResponse };

export async function validateAgentKey(
  req: NextRequest,
  requiredScope?: string
): Promise<AgentAuthResult> {
  const key = req.headers.get("x-agent-key");
  if (!key) {
    return { ok: false, response: NextResponse.json({ error: "Missing x-agent-key header" }, { status: 401 }) };
  }

  const keyHash = hashApiKey(key);
  const agentKey = await prisma.agentKey.findUnique({
    where: { keyHash },
    include: { user: true },
  });

  if (!agentKey) {
    return { ok: false, response: NextResponse.json({ error: "Invalid API key" }, { status: 401 }) };
  }

  if (agentKey.expiresAt && agentKey.expiresAt < new Date()) {
    return { ok: false, response: NextResponse.json({ error: "API key has expired" }, { status: 401 }) };
  }

  if (requiredScope && agentKey.scopes.length > 0 && !agentKey.scopes.includes(requiredScope)) {
    return {
      ok: false,
      response: NextResponse.json({ error: `Key missing required scope: ${requiredScope}` }, { status: 403 }),
    };
  }

  const rl = checkRateLimit(agentKey.id);
  if (!rl.allowed) {
    const retryAfter = Math.ceil((rl.resetAt - Date.now()) / 1000);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Rate limit exceeded", retry_after: retryAfter },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      ),
    };
  }

  await prisma.agentKey.update({ where: { id: agentKey.id }, data: { lastUsed: new Date() } });

  return { ok: true, user: agentKey.user };
}
