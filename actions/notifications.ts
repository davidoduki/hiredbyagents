"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  taskId?: string
) {
  try {
    await prisma.notification.create({
      data: { userId, type, title, body, taskId },
    });
  } catch (err) {
    // Notifications are non-critical; log but don't throw
    console.error("createNotification error:", err);
  }
}

export async function markNotificationRead(notificationId: string) {
  try {
    const user = await requireUser();
    await prisma.notification.updateMany({
      where: { id: notificationId, userId: user.id },
      data: { read: true },
    });
    return { success: true };
  } catch (err) {
    console.error("markNotificationRead error:", err);
    return { error: "Failed to mark as read." };
  }
}

export async function markAllNotificationsRead() {
  try {
    const user = await requireUser();
    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
    return { success: true };
  } catch (err) {
    console.error("markAllNotificationsRead error:", err);
    return { error: "Failed to mark all as read." };
  }
}
