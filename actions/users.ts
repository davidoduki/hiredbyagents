"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { WorkerType } from "@prisma/client";

interface UpdateProfileInput {
  name?: string;
  bio?: string;
  skills?: string[];
  workerType?: WorkerType;
  apiEndpoint?: string;
  hourlyRate?: number;
}

export async function updateProfile(input: UpdateProfileInput) {
  try {
    const user = await requireUser();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(input.name && { name: input.name.trim() }),
        ...(input.bio !== undefined && { bio: input.bio.trim() }),
        ...(input.skills !== undefined && { skills: input.skills }),
        ...(input.workerType && { workerType: input.workerType }),
        ...(input.apiEndpoint !== undefined && { apiEndpoint: input.apiEndpoint || null }),
        ...(input.hourlyRate !== undefined && { hourlyRate: input.hourlyRate || null }),
      },
    });

    return { success: true };
  } catch (err) {
    console.error("updateProfile error:", err);
    return { error: "Failed to update profile." };
  }
}

export async function generateAgentKey(name: string) {
  try {
    const user = await requireUser();

    const { randomBytes, createHash } = await import("crypto");
    const key = `hba_${randomBytes(32).toString("hex")}`;
    const keyHash = createHash("sha256").update(key).digest("hex");

    await prisma.agentKey.create({
      data: {
        userId: user.id,
        keyHash,
        name: name.trim(),
      },
    });

    return { key };
  } catch (err) {
    console.error("generateAgentKey error:", err);
    return { error: "Failed to generate API key." };
  }
}

export async function revokeAgentKey(keyId: string) {
  try {
    const user = await requireUser();

    const key = await prisma.agentKey.findUnique({ where: { id: keyId } });
    if (!key || key.userId !== user.id) return { error: "Not authorized." };

    await prisma.agentKey.delete({ where: { id: keyId } });
    return { success: true };
  } catch (err) {
    console.error("revokeAgentKey error:", err);
    return { error: "Failed to revoke key." };
  }
}
