import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { markAllNotificationsRead } from "@/actions/notifications";
import { timeAgo } from "@/lib/utils";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Notifications" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-zinc-500" />
            <h2 className="font-semibold text-zinc-100">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </h2>
          </div>
          {unreadCount > 0 && (
            <form
              action={async () => {
                "use server";
                await markAllNotificationsRead();
              }}
            >
              <Button variant="ghost" size="sm" type="submit" className="gap-1.5 text-xs">
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            </form>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center">
            <Bell className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-600">No notifications yet. Activity on your tasks will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-xl border p-4 transition-colors ${
                  n.read
                    ? "border-zinc-800 bg-zinc-900/50"
                    : "border-zinc-700 bg-zinc-900"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-emerald-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className={`text-sm font-medium ${n.read ? "text-zinc-400" : "text-zinc-100"}`}>
                        {n.title}
                      </p>
                      <span className="text-xs text-zinc-600 shrink-0">{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-0.5">{n.body}</p>
                    {n.taskId && (
                      <Link
                        href={`/tasks/${n.taskId}`}
                        className="mt-1.5 inline-block text-xs text-emerald-400 hover:underline"
                      >
                        View task →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
