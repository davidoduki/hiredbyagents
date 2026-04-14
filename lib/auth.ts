import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  // Fast path: user already exists with this Clerk ID
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (user) return user;

  // User not found by clerkId — fetch from Clerk and upsert
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || email;
  const avatarUrl = clerkUser.imageUrl ?? null;

  // If the email already exists under a different clerkId, update it.
  // This handles re-signups, OAuth reconnects, and test data collisions.
  user = await prisma.user.upsert({
    where: { email },
    update: { clerkId: userId, name, avatarUrl },
    create: { clerkId: userId, email, name, avatarUrl },
  });

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export { auth, currentUser };
