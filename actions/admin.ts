"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";

const SUPER_EMAIL = "davidoduki@gmail.com";

function isSuperUser(user: { email: string; adminRole: string }) {
  return user.email === SUPER_EMAIL || user.adminRole === "SUPER";
}

export async function grantAdminRole(targetUserId: string, role: "MODERATOR" | "SUPER") {
  try {
    const user = await requireUser();
    if (!isSuperUser(user)) return { error: "Not authorized." };

    const target = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) return { error: "User not found." };
    if (target.email === SUPER_EMAIL) return { error: "Cannot modify the super admin." };

    await prisma.user.update({ where: { id: targetUserId }, data: { adminRole: role } });

    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(target.clerkId, {
      publicMetadata: { adminRole: role },
    });

    return { success: true };
  } catch (err) {
    console.error("grantAdminRole error:", err);
    return { error: "Failed to grant role." };
  }
}

export async function revokeAdminRole(targetUserId: string) {
  try {
    const user = await requireUser();
    if (!isSuperUser(user)) return { error: "Not authorized." };

    const target = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) return { error: "User not found." };
    if (target.email === SUPER_EMAIL) return { error: "Cannot modify the super admin." };

    await prisma.user.update({ where: { id: targetUserId }, data: { adminRole: "NONE" } });

    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(target.clerkId, {
      publicMetadata: { adminRole: null },
    });

    return { success: true };
  } catch (err) {
    console.error("revokeAdminRole error:", err);
    return { error: "Failed to revoke role." };
  }
}

export async function searchUsersByEmail(query: string) {
  try {
    const user = await requireUser();
    if (!isSuperUser(user)) return { error: "Not authorized." };
    if (!query.trim()) return { users: [] };

    const users = await prisma.user.findMany({
      where: { email: { contains: query.trim(), mode: "insensitive" } },
      select: { id: true, name: true, email: true, adminRole: true, createdAt: true },
      take: 10,
    });

    return { users };
  } catch (err) {
    console.error("searchUsersByEmail error:", err);
    return { error: "Search failed." };
  }
}

export async function listCurrentAdmins() {
  try {
    const user = await requireUser();
    if (!isSuperUser(user)) return { error: "Not authorized." };

    const admins = await prisma.user.findMany({
      where: { adminRole: { not: "NONE" } },
      select: { id: true, name: true, email: true, adminRole: true },
      orderBy: { adminRole: "desc" },
    });

    return { admins };
  } catch (err) {
    console.error("listCurrentAdmins error:", err);
    return { error: "Failed to load admins." };
  }
}
